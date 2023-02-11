import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSegment,
  IonLabel,
  IonSegmentButton,
} from "@ionic/react";
import { useState } from "react";

import MyInvalidPackage from "../components/MyPackage/MyInvalidPackage";
import MyValidPackage from "../components/MyPackage/MyValidPackage";

let pages = { MyValidPackage, MyInvalidPackage };
type PageName = keyof typeof pages;

const MyPackage: React.FC = () => {
  let [page, setPage] = useState<PageName>("MyValidPackage");

  let Page = pages[page];

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="#"></IonBackButton>
          </IonButtons>
          <IonTitle>我的套票</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonSegment
          value={page}
          onIonChange={(e) =>
            setPage((e.detail.value as PageName) || "MyValidPackage")
          }
        >
          <IonSegmentButton
            value="MyValidPackage"
            // onClick={() => setPage(() => <valid />)}
          >
            <IonLabel>有效</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton
            value="MyInvalidPackage"
            // onClick={() => setPage(() => <invalid />)}
          >
            <IonLabel>無效</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <Page />
      </IonContent>
    </>
  );
};

export default MyPackage;
