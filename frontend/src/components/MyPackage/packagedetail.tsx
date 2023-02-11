import {
  IonContent,
  IonHeader,
  IonList,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonModal,
  IonButtons,
} from "@ionic/react";
import useGet from "../../hooks/useGet";
import { GetMyPackagePayload } from "./model";
import { dhm } from "../../utilts";
import { api_origin } from "../../api";

export default function PackageDetailModal(props: {
  isOpen: boolean;
  data: any;
  close: () => void;
}) {
  const myValidPackage = useGet<GetMyPackagePayload>({
    name: " myValidPackage",
    pathname: "/myValidPackage",
    defaultValue: {},
  });

  return (
    <>
      {myValidPackage.render((json) => (
        <IonModal isOpen={props.isOpen}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>套票詳情</IonTitle>
              <IonButtons slot="end" onClick={props.close}>
                X
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <>
                {/* <IonItem lines="none">
                <IonLabel>套票編號： {props.id}</IonLabel>
              </IonItem> */}
                <IonItem lines="none">
                  <IonLabel>產品名稱：{props.data.plan_name}</IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    <img
                      src={`${api_origin}/uploads/${props.data.shop_plan_image}`}
                    />
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>價錢：${props.data.price} </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <p>簡介：{props.data.intro} </p>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    改期通知：{dhm(props.data.due_period)}天前
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    購買日期：
                    {new Date(props.data.buy_time as any).toLocaleString()}
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    生效到期至：
                    {new Date(props.data.due_time as any).toLocaleString()}
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    使用次數： {props.data.remain}/{props.data.package_qty}
                  </IonLabel>
                </IonItem>
              </>
            </IonList>
          </IonContent>
        </IonModal>
      ))}
    </>
  );
}
