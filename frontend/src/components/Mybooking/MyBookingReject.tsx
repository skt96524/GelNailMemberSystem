import { IonItem, IonCardSubtitle, IonCardTitle } from "@ionic/react";
import useGet from "../../hooks/useGet";

function MyBookingReject() {
  type GetMyBookingRejectPayload = {
    error?: string;
    myBookingReject?: {
      id?: number;
      plan_name?: string;
      shop_plan_intro: string;
      shop_plan_image: string;
      shop_name?: string;
      address?: string;
      schedule?: EpochTimeStamp;
      price?: number;
      booking_status?: string;
      apply_time?: string;
      confirm_time?: EpochTimeStamp;
      reject_time?: EpochTimeStamp;
      cancel_time?: EpochTimeStamp;
      finish_time?: EpochTimeStamp;
    }[];
  };

  const myBookingsReject = useGet<GetMyBookingRejectPayload>({
    name: " getMyBookingReject",
    pathname: "/mybookingReject",
    defaultValue: {},
  });

  return (
    <>
      {myBookingsReject.render((json) => (
        <>
          {/* {<div>length:{json.myBookingsTbc?.length}</div>} */}
          {json.myBookingReject ? (
            json.myBookingReject.length > 0 ? (
              json.myBookingReject!.map((myBookingReject) => (
                <IonItem
                  className=" booking d-flex "
                  routerLink={`/booking/${myBookingReject.id}`}
                >
                  <div>
                    <IonCardSubtitle className="d-flex">
                      <div>{myBookingReject.shop_name}</div>
                      <div>{myBookingReject.schedule}</div>
                    </IonCardSubtitle>
                    <IonCardTitle>{myBookingReject.plan_name}</IonCardTitle>
                    <IonCardTitle>{myBookingReject.price}</IonCardTitle>
                    <IonCardSubtitle className="d-flex">
                      <IonCardSubtitle className="d-flex">
                        <div>{myBookingReject.address}</div>
                        <div>遭拒絕</div>
                      </IonCardSubtitle>
                    </IonCardSubtitle>
                  </div>
                </IonItem>
              ))
            ) : (
              <div>MoLa</div>
            )
          ) : (
            <div>no info</div>
          )}
        </>
      ))}
    </>
  );
}

export default MyBookingReject;
