const fs = require("fs");

const _local_storage = __dirname + "/../resources/files/";

function deleteLocalFile(url){
    fs.unlink(url, err =>{
        if(err){
            throw "Could not delete file";
        }else{
            return "File deleted successfully";
        }
    });
}

function getLocalUploadDir() {
    return _local_storage;
}

module.exports.deleteLocalFile = deleteLocalFile;
module.exports.getLocalUploadDir = getLocalUploadDir;