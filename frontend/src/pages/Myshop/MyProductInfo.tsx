import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonLabel,
  IonSegment,
} from "@ionic/react";

type ShopPlanTypes = "單次" | "套票";

type ShopPlanStatus = "生效" | "失效";

interface MyShopProductInfo {
  shop_id: number;
  shop_plan_id: number;
  shop_plan_image: string;
  shop_plan_name: string;
  shop_plan_price: number;
  shop_plan_intro: string;
  shop_plan_cancel_period: number | null;
  shop_plan_types: ShopPlanTypes;
  shop_plan_buy_period: string;
  shop_plan_due_period: string;
  shop_plan_package_qty: number | null;
  shop_plan_status: ShopPlanStatus;
}

const MyShopProductInfo: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="MyShopPlan"></IonBackButton>
            <IonTitle>Back Button</IonTitle>
          </IonButtons>
          <IonTitle>產品資訊</IonTitle>
          <IonSegment value="buttons">
            <IonLabel>上架</IonLabel>
          </IonSegment>
          <IonSegment value="segment">
            <IonLabel>下架</IonLabel>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
    </IonPage>
  );
};

export default MyShopProductInfo;
