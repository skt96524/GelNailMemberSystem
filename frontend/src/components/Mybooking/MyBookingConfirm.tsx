import {
  IonItem,
  IonCardSubtitle,
  IonCardTitle,
  IonRow,
  IonCol,
} from "@ionic/react";
import useGet from "../../hooks/useGet";

function MyBookingConfirm() {
  type GetMyBookingConfirmPayload = {
    error?: string;
    myBookingConfirm?: {
      id?: number;
      plan_name?: string;
      shop_plan_intro: string;
      shop_plan_image: string;
      shop_name: string;
      address?: string;
      schedule: string;
      price?: number;
      booking_status?: string;
      apply_time?: string;
      confirm_time?: EpochTimeStamp;
      reject_time?: EpochTimeStamp;
      cancel_time?: EpochTimeStamp;
      finish_time?: EpochTimeStamp;
    }[];
  };

  const myBookingsConfirm = useGet<GetMyBookingConfirmPayload>({
    name: " getMyBookingConfirm",
    pathname: "/mybookingConfirm",
    defaultValue: {},
  });

  return (
    <>
      {myBookingsConfirm.render((json) => (
        <>
          {/* {<div>length:{json.myBookingsTbc?.length}</div>} */}
          {json.myBookingConfirm ? (
            json.myBookingConfirm.length > 0 ? (
              json.myBookingConfirm.map((myBookingConfirm) => (
                <IonItem
                  className=" booking d-flex "
                  routerLink={`/booking/${myBookingConfirm.id}`}
                >
                  <div>
                    <IonCardSubtitle>
                      {myBookingConfirm!.shop_name}
                    </IonCardSubtitle>
                    <IonCardSubtitle>
                      {new Date(myBookingConfirm.schedule).toLocaleString()}
                    </IonCardSubtitle>

                    <IonCardTitle>{myBookingConfirm.plan_name}</IonCardTitle>

                    <IonCardTitle>${myBookingConfirm.price}</IonCardTitle>

                    <IonCardSubtitle className="d-flex">
                      <IonRow>
                        <IonCol>{myBookingConfirm.address}</IonCol>
                        <IonCol size="auto">未確認</IonCol>
                      </IonRow>
                    </IonCardSubtitle>
                  </div>
                </IonItem>
              ))
            ) : (
              <div>沒有預約</div>
            )
          ) : (
            <div>沒有預約</div>
          )}
        </>
      ))}
    </>
  );
}

export default MyBookingConfirm;
