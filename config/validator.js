const { check, validationResult } = require("express-validator");

const userSignUpValidationRules = () => {
  return [
    check("username", "Name is required").not().isEmpty(),
    check("email", "Invalid email").not().isEmpty().isEmail(),
    check("password", "Please enter a password with 4 or more characters")
      .not()
      .isEmpty()
      .isLength({ min: 4 }),
  ];
};

module.exports = userSignUpValidationRules;