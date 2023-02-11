import { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  UseIonToastResult,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonCol,
  IonCard,
  IonCardHeader,
  IonGrid,
  IonRow,
} from "@ionic/react";
import useGet from "../../hooks/useGet";
import { api_origin } from "../../api";

function BookmarkArticle() {
  type GetBookmarkArticlePayload = {
    error?: string;
    articles?: {
      id?: number;
      title?: string;
      main_img?: string;
      views?: number;
      created_at?: string;
      nick_name?: string;
    }[];
  };

  const articles = useGet<GetBookmarkArticlePayload>({
    name: "getMyBookMarkArticle",
    pathname: "/bookmarkArticle",
    defaultValue: {},
  });

  return (
    <>
      <IonGrid>
        <IonRow>
          {articles.render((json) => (
            <>
              {json.articles?.map((article) => (
                <IonCol size="6">
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

                // <IonItem
                //   className=" bookmarkArticle d-flex"
                //   href={`/article/${article.id}`}
                // >
                //   <img src={article.main_img} slot="start" />
                //   <div>
                //     <IonCardSubtitle className="d-flex">
                //       <div>{article.nick_name}</div>
                //       <div>{article.created_at}</div>
                //     </IonCardSubtitle>
                //     <IonCardTitle>{article.title}</IonCardTitle>
                //     <IonCardSubtitle className="d-flex">
                //       <IonIcon icon={heart}> </IonIcon>
                //       <div>{article.views} </div>
                //     </IonCardSubtitle>
                //   </div>
                // </IonItem>
              ))}
            </>
          ))}
        </IonRow>
      </IonGrid>
    </>
  );
}

export default BookmarkArticle;
