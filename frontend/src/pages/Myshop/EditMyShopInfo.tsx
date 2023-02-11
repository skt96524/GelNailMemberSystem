import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
} from "@ionic/react";

const EditMyShopInfo: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="MyShopPlan"></IonBackButton>
            <IonTitle>Back Button</IonTitle>
          </IonButtons>
          <IonTitle>更改商店資料</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen></IonContent>
    </IonPage>
  );
};

export default EditMyShopInfo;
