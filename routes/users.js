import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const userRouter = express.Router();
//adding multer configuration
let upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join("uploads");
      req.dir = dir;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      const fileName =
        file.fieldname + "-" + Date.now() + path.extname(file.originalname);
      req.filePath = path.join(req.dir, fileName);
      cb(null, fileName);
    },
  }),
});

//=================================
//             User
//=================================

userRouter.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    profilePicture: req.user.profilePicture,
  });
});

userRouter.post("/register", upload.single("image"), (req, res) => {
  console.log(req.filePath);
  const user = new User({ ...req.body, profilePicture: req.filePath });

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

userRouter.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

userRouter.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

// userRouter.get('/', async (req, res, next) => {
//   try {
//     const users = await User();
//     res.send(users);
//     console.log(users, 'users here');
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

export default userRouter;
