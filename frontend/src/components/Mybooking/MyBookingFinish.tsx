import { IonItem, IonCardSubtitle, IonCardTitle } from "@ionic/react";
import useGet from "../../hooks/useGet";

function MyBookingFinish() {
  type GetMyBookingFinishPayload = {
    error?: string;
    myBookingFinish?: {
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

  const myBookingsFinish = useGet<GetMyBookingFinishPayload>({
    name: " getMyBookingFinish",
    pathname: "/mybookingFinish",
    defaultValue: {},
  });

  return (
    <>
      {myBookingsFinish.render((json) => (
        <>
          {/* {<div>length:{json.myBookingsTbc?.length}</div>} */}
          {json.myBookingFinish ? (
            json.myBookingFinish.length > 0 ? (
              json.myBookingFinish!.map((myBookingFinish) => (
                <IonItem
                  className=" booking d-flex "
                  routerLink={`/booking/${myBookingFinish.id}`}
                >
                  <div>
                    <IonCardSubtitle className="d-flex">
                      <div>{myBookingFinish.shop_name}</div>
                      <div>{myBookingFinish.schedule}</div>
                    </IonCardSubtitle>
                    <IonCardTitle>{myBookingFinish.plan_name}</IonCardTitle>
                    <IonCardTitle>{myBookingFinish.price}</IonCardTitle>
                    <IonCardSubtitle className="d-flex">
                      <IonCardSubtitle className="d-flex">
                        <div>{myBookingFinish.address}</div>
                        <div>已完成</div>
                      </IonCardSubtitle>
                    </IonCardSubtitle>
                  </div>
                </IonItem>
              ))
            ) : (
              <div>no info</div>
            )
          ) : (
            <div>HAHA</div>
          )}
        </>
      ))}
    </>
  );
}

export default MyBookingFinish;
