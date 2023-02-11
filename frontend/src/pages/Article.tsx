import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCardContent,
  IonCardSubtitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { eye, heart } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api_origin, fetchData, fetchNonGetData } from "../api";
import parse from "html-react-parser";
import { useUserID } from "../redux/selector";
import useLikeCollection from "../hooks/useLikeCollect";
import { routes } from "../Routes";

type articleDetailProps = {
  author_id: number;
  author: string;
  title: string;
  main_img: string;
  html_content: string;
  views: number;
  created_at: string;
  like_qty: number;
};

function Article() {
  const params = useParams<{ id: string }>();
  const users_id = useUserID();
  const likeCollectArticle = useLikeCollection("Article", users_id, params.id);
  const { liked, likeCode, collectCode, alertFunction } = likeCollectArticle;
  if (!params.id) {
    alertFunction("FAILED", "NO ARTICLE FOUND");
  }

  const [articleDetail, setArticleDetail] = useState<articleDetailProps>();

  useEffect(() => {
    (async () => {
      let data = await fetchData(`/ArticleDetail/${params.id}`);
      setArticleDetail(data);
    })();
  }, [liked, params]);

  useEffect(() => {
    (async () => {
      await fetchNonGetData(`/addViews/${params.id}`, "POST", {});
    })();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton href={routes.tab.Main}>Back</IonButton>
          </IonButtons>
          <IonTitle>文章詳情</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {articleDetail ? (
          <>
            <IonImg
              src={`${api_origin}/uploads/${articleDetail.main_img}`}
            ></IonImg>
            <IonRow class="ion-justify-content-end ion-align-items-center">
              {collectCode}
              {likeCode}
              {articleDetail.like_qty}
              <IonIcon color="primary" size={"large"} icon={eye}></IonIcon>
              {articleDetail.views | 0}
            </IonRow>
            <div>
              <div>
                <div className="ion-padding">
                  <IonLabel color="warning">
                    <h1>{articleDetail.title}</h1>
                  </IonLabel>
                  <div className="d-flex ion-justify-content-between flex1">
                    <IonLabel color="medium">
                      <h3>
                        {articleDetail.author} -
                        {new Date(articleDetail.created_at)
                          .toDateString()
                          .slice(3)}
                      </h3>
                    </IonLabel>
                  </div>
                </div>
              </div>
              <div className="ion-margin-top ion-padding">
                <IonLabel>{parse(articleDetail.html_content)}</IonLabel>
              </div>
            </div>
          </>
        ) : null}
      </IonContent>
    </IonPage>
  );
}

export default Article;
