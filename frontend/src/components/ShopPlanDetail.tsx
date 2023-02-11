import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useEffect, useState } from "react";

import { api_origin, fetchData } from "../api";

interface ShopPlanDetailProps {
  shop_id: number;
  shop_plan_id: number;
  shop_plan_image: string;
  shop_plan_name: string;
  shop_plan_price: number;
  shop_plan_intro: string;
  shop_plan_cancel_period: number | null;
  shop_plan_types: string;
  shop_plan_buy_period: string;
  shop_plan_due_period: string;
  shop_plan_package_qty: number | null;
  shop_plan_status: string;
  cancelPeriod: number;
  duePeriod: number;
}

// type Detail = {
//     rows: ShopPlanDetailProps

// }
function ShopPlanDetail(props: { id: number; idx: number }) {
  const [shopPlanDetail, setShopPlanDetail] =
    useState<ShopPlanDetailProps | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      let shopPlanArray = await fetchData("/shopPlanDetail?id=" + props.id);

      setShopPlanDetail(shopPlanArray.result);
    })();
  }, [props.id]);

  return (
    <>
      <IonButton
        class="fill"
        size="small"
        expand="block"
        onClick={() => setIsOpen(true)}
      >
        {shopPlanDetail?.shop_plan_types == "limit" ? "優惠" : "套票"}詳情
      </IonButton>
      <IonModal isOpen={isOpen}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              {shopPlanDetail?.shop_plan_types == "limit" ? "優惠" : "套票"}詳情
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>關閉</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {!shopPlanDetail ? null : (
            <IonList>
              <>
                <IonItem lines="none">
                  {" "}
                  <IonLabel>
                    產品名稱：{shopPlanDetail!.shop_plan_name}{" "}
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  {" "}
                  <IonLabel>
                    <img
                      src={`${api_origin}/${shopPlanDetail!.shop_plan_image}`}
                    />{" "}
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  {" "}
                  <IonLabel>價錢：{shopPlanDetail!.shop_plan_price} </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  {" "}
                  <p>簡介：{shopPlanDetail!.shop_plan_intro} </p>{" "}
                </IonItem>
                <IonItem lines="none">
                  {" "}
                  <IonLabel>
                    改期通知：{shopPlanDetail!.cancelPeriod}天前{" "}
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  {" "}
                  <IonLabel>
                    產品類別：
                    {shopPlanDetail.shop_plan_types == "limit"
                      ? "優惠"
                      : "套票"}{" "}
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  {" "}
                  <IonLabel>
                    購買日期： {shopPlanDetail!.shop_plan_buy_period}前{" "}
                  </IonLabel>
                </IonItem>
                {shopPlanDetail!.shop_plan_types != "limit" ? (
                  <>
                    <IonItem lines="none">
                      {" "}
                      <IonLabel>
                        生效到期至： {shopPlanDetail!.duePeriod}天{" "}
                      </IonLabel>
                    </IonItem>

                    <IonItem lines="none">
                      {" "}
                      <IonLabel>
                        產品數量： {shopPlanDetail!.shop_plan_package_qty}{" "}
                      </IonLabel>
                    </IonItem>
                  </>
                ) : null}
                <IonItem lines="none">
                  {" "}
                  <IonLabel>
                    {" "}
                    產品狀態：
                    {shopPlanDetail!.shop_plan_status == "active"
                      ? "有效"
                      : "已下架"}{" "}
                  </IonLabel>
                </IonItem>
              </>
            </IonList>
          )}
        </IonContent>
      </IonModal>
    </>
  );
}

export default ShopPlanDetail;
