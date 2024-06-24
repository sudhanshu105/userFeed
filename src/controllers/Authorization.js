const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/UserAuth");
const upload = require("../middleware/imageUpload")

exports.registration = async (req, res) => {
  try {
    const { email, password} = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", status: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already exists", status: false });
    }

    const randomUserName = email.split("@")[0]; // Generate username from email

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    req.body.userName = randomUserName;

    const newUser = new User(req.body);
    const user = await newUser.save();

    const payload = {
      user: {
        id: user._id,
      },
    };
    const userToken = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ status: true, userToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    const userToken = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).json({ status: true, userToken });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password -createdDate -__v');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      status: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }

}

exports.updateUser = async (req, res) => {
  try {
    const _id = req.user.id;
    const updates = req.body;
    // console.log(_id);
    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(_id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    res.json({
      message: "User updated successfully",
      status: true,
      data: updatedUser,
    });
  } catch (error) {

    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      res.send({
        message: `Successfully deleted user ${req.user.email}`,
        status: true,
      });
    } else {
      res.send({ message: "User is not found", status: false });
    }
  } catch (error) {
    res.send({ message: "500 Internal Error", status: false });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileImageUrl = req.file.location;

    const user = await User.findByIdAndUpdate(userId, { profileImage: profileImageUrl }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile image uploaded successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.addPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;
    const files = req.files;

    if (!text || (!files.images && !files.videos)) {
      return res.status(400).json({ message: "Text and at least one image or video are required" });
    }

    const imageUrls = files.images ? files.images.map(file => file.location) : [];
    const videoUrls = files.videos ? files.videos.map(file => file.location) : [];

    const post = {
      text,
      images: imageUrls,
      videos: videoUrls
    };

    const user = await User.findByIdAndUpdate(userId, { $push: { Posts: post } }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Post added successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
