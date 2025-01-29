const express = require("express");
const { fetchArticles } = require("../controllers/articleController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.post("/fetch-articles", fetchArticles);

module.exports = router;
