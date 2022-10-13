const dotenv = require("dotenv");
dotenv.config();

const uuid = require("uuid");
const { deleteLocalFile } = require("../util/file.local")
const uploadFile = require("../middleware/localUpload");
const { uploadFileToS3, deleteFileFromS3 } = require("../middleware/file.s3");
const db = require("../models");
const File = db.file;
const User = db.user;

const shouldUseS3 = process.env.NODE_ENV && process.env.NODE_ENV == "production";

const  getFileUpdateTimestamp = (item) => {
    return Math.floor(
        new Date(item.updatedAt).getTime()/1000);
}

const getPublicFileMetadata = (item) => {
    console.log(item);
    return {
        id: item.id,
        name: item.name,
        url: item.url,
        updateTimestamp: getFileUpdateTimestamp(item),
        ownerFirstName: item.user.first_name,
        ownerLastName: item.user.last_name
    };
}

// Return list of files.
exports.getFilesForAdmin = (req, res) => {
    File.findAll({
        include: User
    }).then(
        result => { res.status(200).send(result.map(getPublicFileMetadata));}
    ).catch(
        err => res.status(404).send({error: "Failed to retrieve files."})
    );
};

// Return list of files.
exports.getFiles = (req, res) => {
    File.findAll({
        where: { userId: req.userId },
        include: User
    }).then(
        result => {res.status(200).send(result.map(getPublicFileMetadata));}
    ).catch(
        err => res.status(404).send({error: "Failed to retrieve files." + err})
    );
};

// download files
exports.downloadFile = (req, res) => {
    const fileId = req.params.id;
    // Get the id
    // Return url
    res.status(200).send("File downloaded successfully.");
};

// Create a new file.
// A duplicate file is also treated a new file.
exports.createFile = async (req, res) => {
    const fileId = uuid.v4();
    req.fileId = fileId;

    try {
        // Upload the file
        if(shouldUseS3){
            console.log("Uploading a file to S3.");
            await uploadFileToS3(req, res);
        }else{
            console.log("Uploading a file locally.");
            await uploadFile(req, res);
        }
        
    
        if (req.file == undefined) {
          return res.status(400).send({ error: "Please upload a file!" });
        }

        // Update the DB
        File.create({
            id: fileId,
            name: req.file.originalname,
            url: req.file.path,
            userId: req.userId
        }).then(res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        }));
        } catch (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return res.status(500).send({ error: "File size cannot be larger than 10MB!" });
            }
            
            res.status(500).send({error: `Could not upload the file: ${err}`});
      }
};

// Updates an existing file.
// If the file doesn't exist then creates a new file.
exports.updateFile = async (req, res) => {
    const fileId = req.params.id;
    req.fileId = fileId;

    // Ensure file exists
    try{
        await File.findOne({
            where: { id: fileId }
        }).then(result => {if(result == null){
            throw "File doesn't exist";
        }});
    }catch(err){
        return res.status(404).send({error: err});
    }

    // Update file.
    try {
        // Upload the file
        if(shouldUseS3){
            console.log("Uploading a file to S3.");
            await uploadFileToS3(req, res);
        }else{
            console.log("Uploading a file locally.");
            await uploadFile(req, res);
        }
    
        if (req.file == undefined) {
          return res.status(400).send({ error: "Please upload a file!" });
        }

        // Update the DB
        File.update(
            { url: req.file.path },{where: {id: fileId}}
        ).then(res.status(200).send({
            message: "Updated the file successfully: " + req.file.originalname,
        }));
      } catch (err) {
        console.log(err);
    
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.status(500).send({
            message: "File size cannot be larger than 10MB!",
          });
        }
    
        res.status(500).send({
          message: `Could not upload the file: ${err}`,
        });
      }
};

// Deletes the file.
exports.deleteFile = (req, res) => {
    const fileId = req.params.id;
    File.findOne({
        where: { id: fileId }
    }).then(
        result => {
            if(result == null){
                throw "File doesn't exist.";
            }
            const fileUrl = result.url;
            if(shouldUseS3){
                console.log("deleting file from S3.");
                return deleteFileFromS3(fileUrl);
            }else{
                console.log("deleting local file.");
                deleteLocalFile(fileUrl);
            }
    }).then(
        result => File.destroy({where: {id: fileId}})
    ).then(
        result => res.status(200).send("File deleted successfully.")
    ).catch(
        error => {
            res.status(404).send({ error: "Failed to delete file. Err: "  + error });
        }
    );
};