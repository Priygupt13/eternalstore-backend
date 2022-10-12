const { verifySignUp, verifySignIn } = require("../middleware");
const controller = require("../controllers/auth.controller");
const opt_controller = require("../controllers/options.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.options("/api/auth/signup", opt_controller.handleOptionReq);
  app.post(
    "/api/auth/signup",
    verifySignUp.signupValidationRules(),
    [
      verifySignUp.checkSignupValidation,
      verifySignUp.checkEmailExisted,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.options("/api/auth/signin", opt_controller.handleOptionReq);
  app.post(
    "/api/auth/signin",
    verifySignIn.signInValidationRules(), 
    [
      verifySignIn.checkSignInValidation
    ],
    controller.signIn
    );
};