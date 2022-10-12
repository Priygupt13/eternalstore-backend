const { body, validationResult } = require('express-validator')

signInValidationRules = () => {
  return [
    body('email', 'a valid email is required').exists().isEmail(),
    body('password').exists(),
  ];
}

checkSignInValidation = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(400).send({ error: errors.array() });
    return;
  }
  next();
}

const verifySignIn = {
  signInValidationRules: signInValidationRules,
  checkSignInValidation: checkSignInValidation
};

module.exports = verifySignIn;