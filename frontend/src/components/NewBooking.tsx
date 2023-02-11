import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useState } from "react";
import { fetchNonGetData } from "../api";
import { useUserID } from "../redux/selector";
import "./NewBooking.css";

type NewbookingProps = {
  data?: any;
};

function NewBooking(props: {
  id: number;
  plan_name: string;
  booker?: number;
  package_id?: number;
}) {
  const [presentAlert] = useIonAlert();
  const userID = useUserID();
  let { id, booker, plan_name, package_id } = props;
  if (!booker && userID) {
    booker = userID;
  }
  const [newBookingModal, setNewBookingModal] = useState<boolean>(false);
  const [dateTime, setDateTime] = useState<any>();
  const nowTime = new Date().toISOString();

  function checkLogin() {
    if (!userID) {
      return presentAlert({
        header: "FAILED",
        message: "PLEASE LOGIN FIRST",
        buttons: ["OK"],
      });
    }
    return setNewBookingModal(true);
  }
  async function submitBooking() {
    let result = await fetchNonGetData("/newbooking", "POST", {
      plan_id: id,
      package_id,
      booker,
      schedule: dateTime,
    });
    if (result.message) {
      setNewBookingModal(false);
      return presentAlert({
        header: "Success",
        message: result.message,
        buttons: ["OK"],
      });
    }
    if (result.error) {
      return presentAlert({
        header: "FAILED",
        message: result.error,
        buttons: ["OK"],
      });
    }
    return;
  }
  function beforeSubmitBooking() {
    if (Number(new Date(dateTime)) - Number(new Date(nowTime)) <= 0) {
      return presentAlert({
        header: "FAILED",
        message: "Invalid Booking Schedule",
        buttons: ["OK"],
      });
    }
    return submitBooking();
  }
  return (
    <>
      <IonButton size="small" expand="block" onClick={checkLogin} class="fill">
        預約
      </IonButton>
      <IonModal
        id="booking-modal"
        isOpen={newBookingModal}
        trigger="open-modal"
      >
        <IonContent>
          <IonToolbar>
            <IonTitle>預約</IonTitle>
          </IonToolbar>
          <IonContent>
            <IonItem>{plan_name}</IonItem>
            <IonDatetime
              id="datetime"
              color="primary"
              presentation="date-time"
              //   locale="en_US"
              min={nowTime}
              //   hourCycle="h12"
              preferWheel={true}
              onIonChange={(e) => setDateTime(e.target.value)}
            ></IonDatetime>
            <IonButton onClick={() => setNewBookingModal(false)}>
              取消
            </IonButton>
            <IonButton onClick={beforeSubmitBooking}>確認預約</IonButton>
            {/* <IonDatetimeButton datetime="datetime"></IonDatetimeButton> */}
          </IonContent>
        </IonContent>
      </IonModal>
      {/* <IonModal keepContentsMounted={true}></IonModal> */}
    </>
  );
}

export default NewBooking;
