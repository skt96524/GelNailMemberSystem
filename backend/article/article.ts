import express from "express";
import { knex } from "../knex";
import ArticleController from "./article.controller";
import ArticleService from "./article.service";
// import {}

export const articleRoute = express.Router();
const articleService = new ArticleService(knex);
const articleController = new ArticleController(articleService);

articleRoute.post("/contextImg", articleController.uploadContextImg);
articleRoute.post("/newArticle", articleController.newArticle);
articleRoute.get("/articleList", articleController.getArticleList);
articleRoute.get("/ArticleDetail/:id", articleController.getArticleDetail);
articleRoute.get("/usersArticles/:id", articleController.getUsersArticles);
articleRoute.get("/performanceArticle/:id", articleController.getPerformance);
articleRoute.post("/likeArticle", articleController.addLikeArticle);
articleRoute.delete("/likeArticle", articleController.removeLikeArticle);
articleRoute.post("/collectArticle", articleController.addArticleCollection);
articleRoute.delete(
  "/collectArticle",
  articleController.removeArticleCollection
);
articleRoute.post("/addViews/:id", articleController.addViews);
