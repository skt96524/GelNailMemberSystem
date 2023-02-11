import { Request, Response } from "express";
// import { JWTPayload } from "../jwt";
import ArticleService from "./article.service";
import { contextImgForm } from "../utils/formidable";
import { getJWTPayload } from "../jwt";
import { int, object, optional, string } from "cast.ts";

export default class ArticleController {
  constructor(private articleService: ArticleService) {}
  uploadContextImg = async (req: Request, res: Response) => {
    //@ts-ignore
    contextImgForm.parse(req, async (err, fields, file) => {
      try {
        if (!file) return;

        let name: string;
        let size: number;
        if (file.image && Array.isArray(file.image)) {
          name = String(file.image[0]);
          size = Number(file.image[0].size);
        } else {
          name = file.image.newFilename;
          size = Number(file.image.size);
        }
        let url = "https://gelnailbackend.hardy06.me/uploads/context" + name;
        return res.json({ url, name, size });
      } catch (err) {
        res.json(err);
      }
    });
  };

  getArticle = async (req: Request, res: Response) => {
    try {
      await this.articleService.getArticle();
    } catch (err) {
      res.json(err);
    }
  };

  getArticleList = async (req: Request, res: Response) => {
    // let productType = req.query.productType || "";
    // let offset = req.query.offset || "";
    // let searchText = req.query.searchText || "";
    try {
      let { query } = object({
        query: object({
          articleType: optional(string({ trim: true })),
          offset: optional(int({ min: 0 })),
          searchText: optional(string({ trim: true })),
          users_id: optional(string({ trim: true })),
        }),
      }).parse(req);
      // let jwt = getJWTPayload(req);
      let articleList = await this.articleService.getArticleList(query);
      return res.status(200).json(articleList);
    } catch (err) {
      return res.json(err);
    }
  };

  getUsersArticles = async (req: Request, res: Response) => {
    let users_id: string = String(req.params.id);

    if (!users_id) {
      return res.json({ error: "error", message: "no articles" });
    }

    try {
      let usersArticles = await this.articleService.getUsersArticles(users_id);
      res.json(usersArticles);
      return;
    } catch (err) {
      res.json(err);
      return;
    }
  };

  getArticleDetail = async (req: Request, res: Response) => {
    let id = req.params.id;
    try {
      let result = await this.articleService.getArticleDetail(id);
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  };

  addViews = async (req: Request, res: Response) => {
    let article_id = req.params.id;
    // let { views } = req.body;
    try {
      await this.articleService.addViews(article_id);
      res.json({});
    } catch (error) {
      res.json({});
    }
  };
  newArticle = async (req: Request, res: Response) => {
    try {
      // let jwt = getJWTPayload(req);
      let { users_id, title, main_img, html_content } = req.body;
      // if (!jwt.id || jwt.id != user_id) {
      //   return res.status(401).json({ error: "Unauthorized" });
      // }
      let result = await this.articleService.newArticle({
        users_id,
        title,
        main_img,
        html_content,
      });
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  };

  getPerformance = async (req: Request, res: Response) => {
    let jwt = getJWTPayload(req);
    let users_id = jwt.id;
    let article_id = req.params.id;
    try {
      let result = await this.articleService.getPerformance(
        users_id,
        article_id
      );
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  };
  addLikeArticle = async (req: Request, res: Response) => {
    let jwt = getJWTPayload(req);
    let { users_id, id } = req.body;
    let article_id = id;
    if (!jwt.id || jwt.id != users_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      await this.articleService.addLikeArticle(users_id, article_id);
      return res.status(200).json({ success: "Liked" });
    } catch (err) {
      return res.status(500).json(err);
    }
  };
  removeLikeArticle = async (req: Request, res: Response) => {
    let jwt = getJWTPayload(req);
    let { users_id, id } = req.body;
    let article_id = id;
    if (!jwt.id || jwt.id != users_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      await this.articleService.removeLikeArticle(users_id, article_id);
      return res.status(200).json({ success: "unLiked" });
    } catch (err) {
      return res.status(500).json(err);
    }
  };
  addArticleCollection = async (req: Request, res: Response) => {
    let jwt = getJWTPayload(req);
    let { users_id, id } = req.body;
    let article_id = id;

    if (!jwt.id || jwt.id != users_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      await this.articleService.addArticleCollection(users_id, article_id);
      return res.status(200).json({ success: "Liked" });
    } catch (err) {
      return res.status(500).json(err);
    }
  };
  removeArticleCollection = async (req: Request, res: Response) => {
    let jwt = getJWTPayload(req);
    let { users_id, id } = req.body;
    let article_id = id;

    if (!jwt.id || jwt.id != users_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      await this.articleService.removeArticleCollection(users_id, article_id);
      return res.status(200).json({ success: "unLiked" });
    } catch (err) {
      return res.status(500).json(err);
    }
  };
}
