import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonButton,
  useIonAlert,
  IonCol,
  IonRow,
  IonPage,
} from "@ionic/react";
import "./Main.css";
import { useParams } from "react-router";
import useGet from "../hooks/useGet";
import { useIdentity, useUserID } from "../redux/selector";
import { fetchNonGetData } from "../api";
import UpdateBooking from "../components/UpdateBooking";
import { useState } from "react";
import changeToChi from "../utilts";

export type BookingDetail = {
  booking_id: number;
  shop_id: number;
  shop_name: string;
  shop_owner: number;
  shop_tel: number;
  users_id: number;
  users_nick_name: string;
  phone_number: number;
  plan_name: string;
  shop_plan_intro: string;
  types: string;
  price: number;
  booking_status: string;
  schedule: string;
  address: string;
  cancel_period: number;
};

export type getMyBookingDetailPayload = {
  error?: string;
  bookingDetail?: BookingDetail;
};

const Booking: React.FC = () => {
  const params = useParams<{ id: string }>();
  const userID = useUserID();
  const identity = useIdentity();
  const bookingDetail = useGet<getMyBookingDetailPayload>({
    name: "BookingDetail " + params.id,
    pathname: "/bookingDetail/" + params.id,
    defaultValue: {},
  });

  function checkOwnerButton(owner: number) {
    if (owner == userID) {
      return true;
    }
    return false;
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref={
                identity == "shop_owner" ? "/myshopbooking" : "/mybooking"
              }
            ></IonBackButton>
          </IonButtons>
          <IonTitle>預約詳情</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {bookingDetail.render((json) =>
          json.bookingDetail ? (
            <>
              <IonItem>產品名稱：{json.bookingDetail.plan_name}</IonItem>
              <IonItem routerLink={`/shop/${json.bookingDetail.shop_id}`}>
                店舖名稱：{json.bookingDetail.shop_name}
              </IonItem>
              <IonItem>價錢：{json.bookingDetail.price}</IonItem>
              <IonItem>
                預約狀態：{changeToChi(json.bookingDetail.booking_status)}
              </IonItem>
              <IonItem>
                時間：{new Date(json.bookingDetail.schedule).toLocaleString()}
              </IonItem>
              <IonItem>店舖電話：{json.bookingDetail.shop_tel}</IonItem>
              <IonItem>店舖地址：{json.bookingDetail.address}</IonItem>
              {/* <IonItem>狀態：{json.bookingDetail.booking_status}</IonItem> */}
              <IonItem>
                取消期限：
                {new Date(
                  Number(json.bookingDetail.schedule) -
                    json.bookingDetail.cancel_period
                ).toLocaleString()}
              </IonItem>
              {checkOwnerButton(json.bookingDetail.shop_owner) ? (
                <IonButton
                  expand="block"
                  href={`/my-members/${json.bookingDetail.users_id}`}
                >
                  查看會員
                </IonButton>
              ) : null}

              <IonCol>
                <UpdateBooking
                  reload={bookingDetail.reload}
                  bookingDetail={json.bookingDetail}
                />
              </IonCol>
            </>
          ) : null
        )}
      </IonContent>
    </IonPage>
  );
};

export default Booking;
