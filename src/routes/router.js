const express = require("express");
const router = express.Router();
const {createCourse, listCourse, eachCourse, updateCourse, deleteCourse} =  require("../controllers/course");
const { createCategory, listCategory, eachCategory, updateCategory, deleteCategory } = require("../controllers/category.js");

const auth = require("../auth/main.auth.js");
const { createEnrollments, listEnrollments, eachEnrollments, deleteEnrollments } = require("../controllers/enrollments.js");
const { login } = require("../controllers/authController.js");

// categoria
router.post("/category/create", auth.admin,  createCategory);
router.get("/category/all", listCategory);
router.get("/category/each/:category_id", eachCategory);
router.put("/category/update/:category_id", auth.admin, updateCategory);
router.delete("/category/delete/:category_id", auth.admin, deleteCategory);

// Course Crud
router.post("/course/create/:category_id", auth.admin,  createCourse);
router.get("/course/all", listCourse);
router.get("/course/each/:course_id", eachCourse);
router.put("/course/update/:course_id", auth.admin, updateCourse);
router.delete("/course/delete/:course_id", auth.admin, deleteCourse);

// Inscrever-se
router.post("/subscribe/create/:course_id",  createEnrollments);
router.get("/subscribe/all/:course_id", listEnrollments);
router.get("/subscribe/each/:subscribe_id", eachEnrollments);
router.delete("/subscribe/delete/:subscribe_id", auth.admin, deleteEnrollments);

// auth
router.post("/auth/login",  login);





module.exports = router;

