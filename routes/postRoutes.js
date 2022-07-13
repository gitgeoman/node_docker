const express = require("express");

const postController = require("../controllers/postController.js");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

//localhost:3000/:id
router
  .route("/")
  .get(postController.getAllPosts)
  .post(protect, postController.createPost); // when user is logged the next from middleware will call the sec func from this braces

router
  .route("/:id")
  .get(protect, postController.getOnePost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);
