import { IonButton, IonContent, useIonAlert } from "@ionic/react";
import { useState } from "react";
import { fetchNonGetData } from "../api";
import { useUserID } from "../redux/selector";

type BookingDetail = {
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

function UpdateBooking(props: {
  bookingDetail: BookingDetail;
  reload?: () => void;
}) {
  const userID = useUserID();
  const [presentAlert] = useIonAlert();
  const [bookingStatus, setBookingStatus] = useState<string>(
    props.bookingDetail.booking_status
  );

  let { bookingDetail, reload } = props;

  function checkCancelButton() {
    if (bookingStatus != "apply" && bookingStatus != "confirm") {
      return false;
    }
    if (bookingStatus != "apply" && bookingStatus != "confirm") {
      return false;
    }
    if (bookingStatus == "apply" && bookingDetail.shop_owner == userID) {
      return false;
    }
    if (
      Number(new Date(bookingDetail.schedule)) - bookingDetail.cancel_period <
        Date.now() &&
      bookingDetail.shop_owner != userID
    ) {
      return false;
    }
    return true;
  }

  function checkFinishButton() {
    if (bookingStatus != "confirm" || bookingDetail.shop_owner != userID) {
      return false;
    }
    return true;
  }

  function checkConfirmButton() {
    if (bookingStatus != "apply" || bookingDetail.shop_owner != userID) {
      return false;
    }

    return true;
  }

  async function updateBookingStatus(action: string) {
    let result = await fetchNonGetData("/updatebookingstatus", "POST", {
      action: action,
      booking_id: bookingDetail.booking_id,
    });
    if (result.message) {
      setBookingStatus(action);
      if (reload) {
        reload();
      }

      presentAlert({
        header: "Success",
        message: result.message,
        buttons: ["OK"],
      });
    }

    if (result.error) {
      presentAlert({
        header: "Failed",
        message: result.error,
        buttons: ["OK"],
      });
    }
  }

  function confirmBeforeUpdate(action: string) {
    presentAlert({
      message: `Please confirm to continue to ${action} the booking: ${new Date(
        bookingDetail.schedule
      ).toLocaleString()}`,
      buttons: [
        {
          text: "CONFIRM",
          role: "confirm",
          handler: () => updateBookingStatus(action),
        },
        { text: "CANCEL", role: "cancel" },
      ],
    });
  }
  return (
    <IonContent>
      {checkFinishButton() ? (
        <IonButton onClick={() => confirmBeforeUpdate("finish")}>
          完成
        </IonButton>
      ) : null}
      {checkCancelButton() ? (
        <IonButton onClick={() => confirmBeforeUpdate("cancel")}>
          取消
        </IonButton>
      ) : null}
      {checkConfirmButton() ? (
        <>
          <IonButton onClick={() => confirmBeforeUpdate("confirm")}>
            接受
          </IonButton>
          <IonButton onClick={() => confirmBeforeUpdate("reject")}>
            拒絕
          </IonButton>
        </>
      ) : null}
    </IonContent>
  );
}

export default UpdateBooking;
