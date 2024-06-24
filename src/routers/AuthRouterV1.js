const express = require("express");
const authRouter = new express.Router();
const userAuth = require("../controllers/Authorization");
const upload = require("../middleware/imageUpload");
const { auth } = require('../middleware/index');

authRouter.post("/signup",userAuth.registration);
authRouter.post("/login",userAuth.loginUser);
authRouter.post('/uploadProfileImage', auth, upload.single('profileImage'), userAuth.uploadProfileImage);
authRouter.post('/addPost', auth, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 10 }]), userAuth.addPost);

module.exports = authRouter;