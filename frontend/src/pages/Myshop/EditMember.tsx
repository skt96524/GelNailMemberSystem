import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonAvatar,
  IonCol,
  IonLabel,
  IonItem,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api_origin, fetchData } from "../../api";
import NewBooking from "../../components/NewBooking";
import ShopPlanDetail from "../../components/ShopPlanDetail";
import useGet from "../../hooks/useGet";
import useSegments from "../../hooks/useSegments";
import { routes } from "../../Routes";
import "./EditMember.css";

interface MemberInfoType {
  id: number;
  name: string;
  tel: number;
  email: string;
  icon: string;
}

interface MemberPlanType {
  is_valid: boolean;
  package_id: number;
  due_time: Date;
  plan_id: number;
  package_qty: number;
  plan_name: string;
  name: string;
  id: number;
  due_period: number;
  address: string;
  intro: string;
  image: string;
  remain: string;
  price: number;
}

interface GetMemberDetailsPayload {
  error?: string;
  memberInfo?: MemberInfoType;
  plans?: MemberPlanType[];
}

interface LimitPlanType {
  id: number;
  plan_name: string;
  intro: string;
  image: string;
  price: number;
  types: string;
}

const EditMember: React.FC = () => {
  const [limitPlan, setLimitPlan] = useState<LimitPlanType[]>([]);
  const params = useParams<{ id: string }>();
  const member_id = params.id;

  const segments = useSegments(["有效", "過期"]);

  const memberDetails = useGet<GetMemberDetailsPayload>({
    name: "member details",
    pathname: `/members/${member_id}`,
    defaultValue: {},
  });

  useEffect(() => {
    (async () => {
      let result = await fetchData("/my-shop/plans");
      if (result.planList) {
        setLimitPlan(
          result.planList.filter((plan: any) => plan.types == "limit")
        );
      }
    })();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={routes.member.list}></IonBackButton>
            <IonTitle>返回</IonTitle>
          </IonButtons>
          <IonTitle>會員資料</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {memberDetails.render(({ memberInfo: userData, plans }) =>
          !userData || !plans ? (
            "missing data from server"
          ) : (
            <>
              <IonRow class="ion-justify-content-center">
                <IonAvatar class="memberProfilePic">
                  <img src={`${api_origin}/uploads/${userData.icon}`}></img>
                </IonAvatar>
              </IonRow>

              <IonCol class="ion-padding">
                <IonLabel>Name</IonLabel>
              </IonCol>

              <IonItem>
                <IonLabel>{userData.name}</IonLabel>
              </IonItem>

              <IonCol class="ion-padding">
                <IonLabel>Tel</IonLabel>
              </IonCol>
              <IonItem>
                <IonLabel>{userData.tel}</IonLabel>
              </IonItem>

              <IonCol class="ion-padding">
                <IonLabel>Email</IonLabel>
              </IonCol>
              <IonItem>
                <IonLabel>{userData.email}</IonLabel>
              </IonItem>

              {segments.render()}

              <IonGrid>
                <IonRow>
                  {plans
                    .filter(
                      (plan) => plan.is_valid == (segments.segment == "有效")
                    )
                    .map((memberPlan, idx) => (
                      <IonCol size="6" key={memberPlan.id}>
                        <IonCard>
                          <img
                            width="300"
                            height="150"
                            src={`${api_origin}/${memberPlan.image}`}
                          ></img>

                          <IonCardHeader>
                            <IonCardTitle>{memberPlan.plan_name}</IonCardTitle>
                          </IonCardHeader>

                          <IonCardContent>
                            <IonText
                              color={memberPlan.is_valid ? "dark" : "danger"}
                            >
                              失效日:
                              {memberPlan.due_time.toString().substring(0, 10)}
                            </IonText>
                            <div>剩餘次數：{memberPlan.remain}</div>
                            <div> 價錢：${memberPlan.price}</div>
                          </IonCardContent>
                          {memberPlan.is_valid ? (
                            <NewBooking
                              id={memberPlan.plan_id}
                              plan_name={memberPlan.plan_name}
                              package_id={memberPlan.package_id}
                              booker={+member_id}
                            />
                          ) : null}
                          <ShopPlanDetail id={memberPlan.plan_id} idx={idx} />
                        </IonCard>
                      </IonCol>
                    ))}
                </IonRow>
              </IonGrid>
            </>
          )
        )}
        <IonLabel className="ion-padding" color="dark">
          為客戶安排優惠預約
        </IonLabel>
        <div className="scroll">
          {limitPlan.map((plan, idx) => (
            <>
              <IonCard key={idx} className="scrollPlan">
                <IonCardHeader>
                  <IonCardTitle>{plan.plan_name}</IonCardTitle>
                </IonCardHeader>
                <NewBooking
                  id={plan.id}
                  plan_name={plan.plan_name}
                  booker={+member_id}
                />
                <ShopPlanDetail id={plan.id} idx={idx} />
              </IonCard>
            </>
          ))}
        </div>
      </IonContent>

      {/* <IonButton expand="full" >加入套票</IonButton> */}
    </IonPage>
  );
};

export default EditMember;
