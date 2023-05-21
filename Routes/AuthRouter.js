const signIn = require("../Controller/Auth/signin");
const signUp = require("../Controller/Auth/signup");
const validation = require("../middleWare/validation");
const { signupValidator, signinValidator } = require("../utils/userValidation");


const router=require("express").Router()

router.post("/signup",validation(signupValidator),signUp);
router.post("/signin",validation(signinValidator),signIn)

module.exports=router;