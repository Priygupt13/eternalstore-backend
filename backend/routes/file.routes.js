const { authJwt } = require("../middleware");
const controller = require("../controllers/file.controller");
const opt_controller = require("../controllers/options.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.options("/api/file/admin/list", opt_controller.handleOptionReq);
  app.get("/api/file/admin/list", [authJwt.verifyToken, authJwt.isAdmin], controller.getFilesForAdmin);

  app.options("/api/file/list", opt_controller.handleOptionReq);
  app.get("/api/file/list", [authJwt.verifyToken], controller.getFiles);

  app.options("/api/file/:id", opt_controller.handleOptionReq);
  app.get("/api/file/:id", [authJwt.verifyToken], controller.downloadFile);

  app.options("/api/file/create", opt_controller.handleOptionReq);
  app.post("/api/file/create", [authJwt.verifyToken], controller.createFile);

  app.options("/api/file/update/:id", opt_controller.handleOptionReq);
  app.post("/api/file/update/:id", [authJwt.verifyToken], controller.updateFile);
  
  app.options("/api/file/:id", opt_controller.handleOptionReq);
  app.delete("/api/file/:id", [authJwt.verifyToken], controller.deleteFile);
};