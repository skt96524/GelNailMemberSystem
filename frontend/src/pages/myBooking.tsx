import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonSegmentButton,
} from "@ionic/react";
import "./Main.css";
import { useState } from "react";
import MyBookingTbc from "../components/Mybooking/MyBookingTbc";
import MyBookingConfirm from "../components/Mybooking/MyBookingConfirm";
import MyBookingHistory from "../components/Mybooking/MyBookingHistory";

let pages = {
  MyBookingTbc,
  MyBookingConfirm,
  MyBookingHistory,
};

type PageName = keyof typeof pages;

const Mybooking: React.FC = () => {
  let [page, setPage] = useState<PageName>("MyBookingTbc");

  let Page = pages[page];

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="#"></IonBackButton>
          </IonButtons>
          <IonTitle>我的預約</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonSegment
          value={page}
          onIonChange={(e) =>
            setPage((e.detail.value as PageName) || "MyBookingTbc")
          }
          // style={{ overflowX: "auto" }}
        >
          {/* <div style={{ display: "flex", overflowX: "auto" }}> */}
          <IonSegmentButton value="MyBookingTbc">
            <IonLabel>未確認</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="MyBookingConfirm">
            <IonLabel>已確認</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="MyBookingHistory">
            <IonLabel>過往預約</IonLabel>
          </IonSegmentButton>
          {/* </div> */}
        </IonSegment>

        <Page />
      </IonContent>
    </>
  );
};

export default Mybooking;
