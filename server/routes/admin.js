const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

//check if loggedin

const authMiddleWare = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
};

//Routes Get admin
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with Nodejs, Express and MongoDB",
    };
    res.render("admin/adminindex", { locals, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

//Routes post register
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashedpassword = await bcrypt.hash(password, 10);
//     try {
//       const user = await User.create({ username, password: hashedpassword });
//       res.status(200).json({ message: "User Created", user });
//     } catch (error) {
//       if (error.code === 11000) {
//         res.status(409).json({ message: "User already registered" });
//       }
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

//Routes post login
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "invalid credentials" });
      }
      const token = jwt.sign({ userId: user._id }, jwtSecret);
      res.cookie("token", token, { httpOnly: true });

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(err);
  }
});

//Routes get Admin dashboard
router.get("/dashboard", authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with Nodejs, Express and MongoDB",
    };
    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (err) {
    console.log(err);
  }
});

//routes get admin create new post
router.get("/add-post", authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with Nodejs, Express and MongoDB",
    };
    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (err) {
    console.log(err);
  }
});

//routes post admin create new post
router.post("/add-post", authMiddleWare, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.Title,
      body: req.body.body,
    });
    await Post.create(newPost);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

//routes get admin edit/delete post
router.get("/edit-post/:id", authMiddleWare, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//routes put admin edit/delete post
router.put("/edit-post/:id", authMiddleWare, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.Title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect(`/dashboard`);
  } catch (err) {
    console.log(err);
  }
});

//routes delete admin delete post
router.delete("/delete-post/:id", authMiddleWare, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect(`/dashboard`);
  } catch (err) {
    console.log(err);
  }
});

//routes get logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin");
});

// //Routes post register
// router.post("/admin",async (req, res)=>{
//     try{
//         const {username, password} = req.body;
//         res.json({message: req.body});
//     }catch(err){
//         console.log(err);
//     }
// });
module.exports = router;
