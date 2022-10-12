const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const { body, validationResult } = require('express-validator')

signupValidationRules = () => {
  return [
    body('firstname', 'first name is required').exists(),
    body('lastname', 'last name is required').exists(),
    body('email', 'a valid email is required').exists().isEmail(),
    body('password', 'password should have at least 8 characters').exists().isLength({min: 8}),
  ];
}

checkSignupValidation = (req, res, next) => {
  console.log("Verifying signup params.");
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(400).send({ error: errors.array() });
    return;
  }
  next();
}

checkEmailExisted = (req, res, next) => {
    console.log("Verifying if user email exist.");
    // Username
    User.findOne({
      where: { email: req.body.email }
    }).then( user => {
        if (user) {
          res.status(400).send({ error: "Failed! Email is already in use!" });
          return;
        }
        next();
    });
};

checkRolesExisted = (req, res, next) => {
  console.log("Verifying if user roles exist.");
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          error: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
  checkEmailExisted: checkEmailExisted,
  checkRolesExisted: checkRolesExisted,
  signupValidationRules: signupValidationRules,
  checkSignupValidation: checkSignupValidation
};

module.exports = verifySignUp;