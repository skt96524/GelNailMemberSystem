import { Knex } from "knex";
import { HttpError } from "../http.error";

export default class ArticleService {
  constructor(public knex: Knex) {}

  async getArticle() {
    this.knex();
    return;
  }

  async getUsersArticles(users_id: string) {
    try {
      let usersArticles = await this.knex
        .select(
          "article.id",
          "title",
          "main_img",
          "views",
          "article_status",
          "created_at"
        )
        .from("article")
        .where("users_id", users_id)
        .andWhere("article_status", "active");

      if (!usersArticles) throw new HttpError(404, "Articles not found");

      return { usersArticles };
    } catch (error) {
      throw new HttpError(503, "error");
    }
  }
  async getArticleList(filter: {
    articleType?: string;
    offset?: number;
    searchText?: string;
    users_id?: string;
  }) {
    let query = this.knex("article")
      .select("article.id as id", "title", "main_img")
      .leftJoin("like", "article_id", "=", "article.id")
      .count("article_id as like_qty")
      .groupBy("article.id", "like.id")
      .where("article_status", "=", "active");

    if (filter.users_id) {
      query = query
        .andWhere("article.users_id", "=", filter.users_id)
        .orderBy("article.created_at", "desc");
    }
    if (filter.articleType) {
      if (filter.articleType == "精品文章") {
        query = query.orderBy("like_qty", "desc");
      }
      if (filter.articleType == "人氣文章") {
        query = query.orderBy("views", "desc");
      }
      if (filter.articleType == "最新文章") {
        query = query.orderBy("article.created_at", "desc");
      }
    }
    if (filter.offset) {
      query = query.offset(filter.offset);
    }
    if (filter.searchText) {
      query = query
        .whereILike("title", "%" + filter.searchText + "%")
        .orWhereILike("html_content", "%" + filter.searchText + "%");
    }
    let articleList = await query.limit(16);

    return { articleList };
  }

  async getArticleDetail(id: number | string) {
    try {
      let articleAndUser = await this.knex("article")
        .select(
          "users.id as author_id",
          "users.nick_name as author",
          "title",
          "main_img",
          "html_content",
          "views",
          "article.created_at"
        )
        .leftJoin("users", "users.id", "=", "article.users_id")
        .where("article.id", "=", id)
        .andWhere("article_status", "=", "active")
        .leftJoin("like", "article_id", "=", "article.id")
        .count("like.id as like_qty")
        .groupBy(
          "users.id",
          "article.title",
          "article.main_img",
          "article.html_content",
          "article.views",
          "article.created_at"
        )
        .first();

      return articleAndUser;
    } catch (error) {
      return error;
    }
  }
  async addViews(article_id: number | string) {
    try {
      await this.knex("article")
        .increment("views", 1)
        .where("id", "=", article_id);
      return;
    } catch (error) {
      return error;
    }
  }
  async newArticle(data: any) {
    let { users_id, title, main_img, html_content } = data;
    try {
      let article_id = await this.knex("article")
        .insert({
          users_id,
          title,
          main_img,
          html_content,
          views: 0,
        })
        .returning("id");
      return article_id[0];
    } catch (error) {
      return error;
    }
  }
  async getPerformance(users_id: number, article_id: number | string) {
    try {
      let liked = await this.knex("like")
        .select("id as like_id")
        .where("users_id", "=", users_id)
        .andWhere("article_id", "=", article_id)
        .first();

      let collected = await this.knex("collection")
        .select("id as collection_id")
        .where("collection_owner_id", "=", users_id)
        .andWhere("article_id", "=", article_id)
        .first();

      let result = { ...liked, ...collected };
      return result;
    } catch (error) {
      return error;
    }
  }

  async addLikeArticle(users_id: number, article_id: number | string) {
    try {
      await this.knex("like").insert({ users_id, article_id });
      return;
    } catch (error) {
      return error;
    }
  }

  async removeLikeArticle(users_id: number, article_id: number | string) {
    try {
      await this.knex("like")
        .delete()
        .where("users_id", "=", users_id)
        .andWhere("article_id", "=", article_id);
      return;
    } catch (error) {
      return error;
    }
  }
  async addArticleCollection(users_id: number, article_id: number | string) {
    try {
      await this.knex("collection").insert({
        collection_owner_id: users_id,
        article_id,
      });
      return;
    } catch (error) {
      return error;
    }
  }

  async removeArticleCollection(users_id: number, article_id: number | string) {
    try {
      await this.knex("collection")
        .delete()
        .where("collection_owner_id", "=", users_id)
        .andWhere("article_id", "=", article_id);
      return;
    } catch (error) {
      return error;
    }
  }
}
