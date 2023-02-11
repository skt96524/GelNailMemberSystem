import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { useState } from "react";
import BookmarkArticle from "../components/Mycollection/BookmarkArticle";
import BookmarkShop from "../components/Mycollection/BookmarkShop";
import BookmarkNail from "../components/Mycollection/BookmarkNail";

let pages = { BookmarkArticle, BookmarkShop, BookmarkNail };
type PageName = keyof typeof pages;

export default function MyCollection() {
  let [page, setPage] = useState<PageName>("BookmarkArticle");

  let Page = pages[page];

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="#"></IonBackButton>
          </IonButtons>
          <IonTitle>我的收藏</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonSegment
          value={page}
          onIonChange={(e) =>
            setPage((e.detail.value as PageName) || "BookmarkArticle")
          }
        >
          <IonSegmentButton
            value="BookmarkArticle"
            // onClick={() => setPage(() => <BookmarkArticle />)}
          >
            <IonLabel>文章</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton
            value="BookmarkShop"
            // onClick={() => setPage(() => <BookmarkShop />)}
          >
            <IonLabel>店舖</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton
            value="BookmarkNail"
            // onClick={() => setPage(() => <BookmarkNail />)}
          >
            <IonLabel>作品</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <Page />
      </IonContent>
    </>
  );
}
