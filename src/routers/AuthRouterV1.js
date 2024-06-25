const express = require("express");
const authRouter = new express.Router();
const userAuth = require("../controllers/Authorization");
const upload = require("../middleware/imageUpload");
const { auth } = require('../middleware/index');

authRouter.post("/signup",userAuth.registration);
authRouter.post("/login",userAuth.loginUser);
authRouter.post('/uploadProfileImage', auth, upload.single('profileImage'), userAuth.uploadProfileImage); // upload profile Picture
authRouter.post('/addPost', auth, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 10 }]), userAuth.addPost); // adding a new post
authRouter.get("/posts", auth, userAuth.getUserPosts); // get the posts created by the loggedIn/current user
authRouter.get("/getAllPosts", userAuth.getAllPosts); // fetch all the posts created by all the users combined
authRouter.post("/addVehicle", auth, upload.array('images', 10), userAuth.addMyVehicle);  //add a new vehicle to user profile

module.exports = authRouter;