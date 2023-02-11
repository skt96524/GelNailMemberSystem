import { IonInfiniteScrollCustomEvent } from "@ionic/core";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRow,
} from "@ionic/react";
import { useState } from "react";
import { api_origin } from "../api";
// import { Link, NavLink, useHistory } from "react-router-dom";
import useGet from "../hooks/useGet";
import "./ArticleList.css";

type ArticleListProps = {
  id: number;
  title: string;
  main_img: string;
  like_qty: string;
};
type articleListPayload = {
  error?: string;
  articleList?: ArticleListProps[];
};
function ArticleList(props: {
  searchText?: string;
  type?: string;
  users_id?: string;
}) {
  const [hasLoadMore, setHasLoadMore] = useState(false);

  let query = {};
  if (props.users_id) {
    query = { ...query, users_id: props.users_id };
  }
  if (props.searchText) {
    query = { ...query, searchText: props.searchText };
  }
  if (props.type) {
    query = { ...query, articleType: props.type };
  }
  const articleList = useGet<articleListPayload>({
    name: "articleList",
    pathname: "/articleList",
    query: query,
    defaultValue: {},
    shouldAutoReload: (json) => {
      return !hasLoadMore;
    },
  });

  async function loadMore(ev: IonInfiniteScrollCustomEvent<void>) {
    const offset = articleList.state.payload.articleList?.length || 0;

    let json = await articleList.loadMore(offset);
    if (json.error) {
    }
    if (json.articleList) {
      articleList.setState((state) => ({
        ...state,
        payload: {
          articleList: [
            ...(state.payload.articleList || []),
            ...json.articleList,
          ],
        },
      }));
      setHasLoadMore(true);
    }
    ev.target.complete();
  }
  return (
    <>
      {articleList.render((json) => (
        <>
          <IonGrid>
            <IonRow>
              {json.articleList?.map((article) => (
                <IonCol size="6" key={article.id}>
                  <IonCard
                    className="no-margin"
                    href={`/article/${article.id}`}
                  >
                    <img
                      src={`${api_origin}/uploads/${article.main_img}`}
                    ></img>
                    <IonCardHeader className="no-padding">
                      <IonCardTitle className="article-title">
                        {article.title}
                      </IonCardTitle>
                    </IonCardHeader>
                  </IonCard>
                </IonCol>
              ))}
              <IonInfiniteScroll onIonInfinite={loadMore}>
                <IonInfiniteScrollContent></IonInfiniteScrollContent>
              </IonInfiniteScroll>
            </IonRow>
          </IonGrid>
        </>
      ))}
    </>
  );
}

export default ArticleList;
