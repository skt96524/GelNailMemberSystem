import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
} from "@ionic/react";
import "./Main.css";
import { cogOutline } from "ionicons/icons";
import { SeeInfo } from "../components/UserInfo/SeeInfo";
import { EditInfo } from "../components/UserInfo/EditInfo";

const UpdateUserInfo: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="#"></IonBackButton>
          </IonButtons>
          <IonTitle>個人資料</IonTitle>
          <IonButtons slot="end">編輯</IonButtons>
          <IonButtons slot="end">完成</IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <SeeInfo />
        <EditInfo />
        <IonItem>更改密碼</IonItem>
      </IonContent>
    </IonPage>
  );
};

export default UpdateUserInfo;
