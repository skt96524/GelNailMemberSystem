import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCol,
  IonLabel,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  useIonAlert,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";

import { useState } from "react";

import { api_origin } from "../../api";
import EditShopPlan from "../../components/EditShopPlan";

import ShopPlanDetail from "../../components/ShopPlanDetail";
import useFetch from "../../hooks/useFetch";
import useGet from "../../hooks/useGet";
import { routes } from "../../Routes";

type TypeEnum = "單次" | "套票";
// type PlanEnum = "有效" | "無效";
type PlanEnum = "active" | "inactive";

interface MyShopPlanType {
  id: number;
  plan_name: string;
  intro: string;
  image: string;
  shop_id: number;
  price: number;
  types: TypeEnum;
  buy_period: Date;
  due_period: number;
  package_qty: number;
  plan_status: PlanEnum;
}

interface GetMyShopPlanListPayload {
  error?: string;
  planList?: MyShopPlanType[];
}

const MyShopPlan: React.FC = () => {
  const [presentAlert] = useIonAlert();

  const { fetchJSON } = useFetch();

  const [tab, setTab] = useState("上架");

  const planList = useGet<GetMyShopPlanListPayload>({
    name: "my plan list",
    pathname: "/my-shop/plans",
    defaultValue: {},
  });

  async function notActive(id: number) {
    await presentAlert("是否要將產品下架？", [
      { text: "返回", role: "cancel" },
      {
        text: "確定",
        handler: async () => {
          let json = await fetchJSON("POST", `/inactive`, { id: id });
          if (json.error) return;
          planList.reload();
        },
      },
    ]);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={routes.tab.MyShop}></IonBackButton>
          </IonButtons>
          <IonTitle>產品資訊</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonSegment
          value={tab}
          onIonChange={(e) => setTab(e.detail.value || tab)}
        >
          {["上架", "下架"].map((tab) => (
            <IonSegmentButton value={tab}>
              <IonLabel>{tab}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>

        {planList.render((json) => (
          <IonGrid>
            <IonRow>
              {json.planList
                ?.filter(
                  (plan) =>
                    plan.plan_status == (tab == "上架" ? "active" : "inactive")
                )
                .map((plan, idx) => (
                  <IonCol key={plan.id} size="6">
                    <IonCard>
                      <img
                        width="300"
                        height="150"
                        style={{ objectFit: "cover" }}
                        src={`${api_origin}/uploads/${plan.image}`}
                      ></img>

                      <IonCardHeader>
                        <IonCardTitle>{plan.plan_name}</IonCardTitle>
                      </IonCardHeader>

                      <IonCardContent>
                        {plan.plan_status == "active" ? (
                          <span>
                            下架日:{plan.buy_period.toString().substring(0, 10)}
                          </span>
                        ) : null}
                        <div> 價錢：${plan.price}</div>
                      </IonCardContent>

                      <ShopPlanDetail id={plan.id} idx={idx} />
                      <IonButton
                        class="fill"
                        hidden={plan.plan_status !== "active"}
                        size="small"
                        expand="block"
                        onClick={() => notActive(plan.id)}
                      >
                        下架
                      </IonButton>
                    </IonCard>
                  </IonCol>
                ))}
            </IonRow>
          </IonGrid>
        ))}
      </IonContent>
      <EditShopPlan />
    </IonPage>
  );
};

export default MyShopPlan;
