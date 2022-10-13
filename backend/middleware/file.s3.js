const dotenv = require("dotenv");
dotenv.config();

const multer = require("multer");
const util = require('util');
const AWS = require("aws-sdk");

const AwsAccessKeyId = process.env.AWS_S3_ACCESS_ID || "";
const AwsSecretAccessKey = process.env.AWS_S3_ACCESS_SECRET || "";
const S3Region = process.env.AWS_S3_REGION || "";
const S3Bucket = process.env.AWS_S3_BUCKET || "";
const S3UploadAcl = "public-read";
const S3FileDomain = "https://d150rngp844rqs.cloudfront.net/";
const maxFileSize = 10 * 1024 * 1024;

function constructRelativeFilePath(req){
    return req.userId + "/" + req.file.originalname;
}

async function uploadFileToS3(req, res){
    const storage = multer.memoryStorage();
    const uploadToStorage = multer({
        storage: storage,
        limits: {fileSize: maxFileSize}}
    ).single("file");
    var uploadToStoragePromise = util.promisify(uploadToStorage);

    try{
        await uploadToStoragePromise(req, res);
    }catch(err){
        console.error("multer error" + err);
        throw err;
    }
    

        // Upload to S3
        var fileMetaInfo = {
            Bucket: S3Bucket,
            Key: constructRelativeFilePath(req),
            Body: req.file.buffer,
            ContentType: "multipart/form-data",
            ACL: S3UploadAcl
        };

        let s3Bucket = new AWS.S3({
            accessKeyId: AwsAccessKeyId,
            secretAccessKey: AwsSecretAccessKey,
            region: S3Region
        });

        try{
            const data = await s3Bucket.upload(fileMetaInfo).promise();
            console.log(data);
            
            const fileUrl = S3FileDomain + constructRelativeFilePath(req);
            req.file.path = fileUrl;
        }catch(err){
            console.error("Upload to S3 error" + err);
            throw err;
        }
}

async function deleteFileFromS3(fileUrl){
    const fileName = fileUrl.replace(S3FileDomain, "");
    console.log("Deleting file: " + fileName);
    var fileMetaInfo = {
        Bucket: S3Bucket,
        Key: fileName
    };

    let s3Bucket = new AWS.S3({
        accessKeyId: AwsAccessKeyId,
        secretAccessKey: AwsSecretAccessKey,
        region: S3Region
    });
    try{
        const data = await s3Bucket.deleteObject(fileMetaInfo).promise();
    }catch(err){
        console.error("Delete from S3 failed with error: " + err);
        throw err;
    }

}

module.exports.uploadFileToS3 = uploadFileToS3;
module.exports.deleteFileFromS3 = deleteFileFromS3;