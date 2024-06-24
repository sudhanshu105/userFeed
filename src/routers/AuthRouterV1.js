const express = require("express");
const authRouter = new express.Router();
const userAuth = require("../controllers/Authorization");
const upload = require("../middleware/imageUpload");
const { auth } = require('../middleware/index');

authRouter.post("/signup",userAuth.registration);
authRouter.post("/login",userAuth.loginUser);
authRouter.post('/uploadProfileImage', auth, upload.single('profileImage'), userAuth.uploadProfileImage);

module.exports = authRouter;