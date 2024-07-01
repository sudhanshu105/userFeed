const mongoose = require("mongoose");

const user = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  profileImage: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password:{
    type:String,
    required:true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  fullName: {
    type: String
  },
  dob:{
    type: String
  }
  MyVehicles: [{
    Name: {
      type: String,
      required: true
    },
    Images: [{
      type: String
    }]
  }],
  Posts: [{
    text: {
      type: String,
      required: true
    },
    images: [{
      type: String
    }],
    videos: [{
      type: String
    }],
    isLiked: {
      type: Boolean,
      default: false,
    },
    isSaved: {
      type: Boolean,
      required: false
    },
    comments: [{
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      text: {
        type: String,
        required: true
      }
    }]
  }],
  savedPost: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  likedPost: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
}, { timestamps: true });

const User = new mongoose.model("User", user);
module.exports = User;
