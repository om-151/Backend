const express = require('express')
const router = express.Router()
const authControllers = require('../controller/auth-controller')
const { signupSchema, loginSchema } = require("../validators/auth-validator");
const validate = require("../middleware/validate-middleware");

router.route("/").get(authControllers.home)

router.route("/register").post(validate(signupSchema), authControllers.register)

router.route("/login").post(validate(loginSchema), authControllers.login)

router.route("/products").get(authControllers.products)

router.route("/google-welcome-email").post(authControllers.sendGoogleWelcomeEmail);

module.exports = router