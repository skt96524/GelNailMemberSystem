import {
  IonItem,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonRow,
} from "@ionic/react";
import useGet from "../../hooks/useGet";

function MyBookingTbc() {
  type GetMyBookingTbcPayload = {
    error?: string;
    myBookingTbc?: {
      id?: number;
      plan_name?: string;
      shop_plan_intro: string;
      shop_plan_image: string;
      shop_name?: string;
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

  const myBookingsTbc = useGet<GetMyBookingTbcPayload>({
    name: " getMyBookingTbc",
    pathname: "/mybookingTbc",
    defaultValue: {},
  });

  return (
    <>
      {myBookingsTbc.render((json) => (
        <>
          {/* {<div>length:{json.myBookingsTbc?.length}</div>} */}
          {json.myBookingTbc ? (
            json.myBookingTbc.length > 0 ? (
              json.myBookingTbc!.map((myBookingTbc) => (
                <IonItem
                  className=" booking d-flex "
                  routerLink={`/booking/${myBookingTbc.id}`}
                >
                  <div>
                    <IonCardSubtitle>
                      <div>{myBookingTbc.shop_name}</div>
                    </IonCardSubtitle>
                    <IonCardSubtitle>
                      {new Date(myBookingTbc.schedule).toLocaleString()}
                    </IonCardSubtitle>
                    <IonCardTitle>{myBookingTbc.plan_name}</IonCardTitle>
                    <IonCardTitle>${myBookingTbc.price}</IonCardTitle>
                    <IonCardSubtitle className="d-flex">
                      <IonRow>
                        <IonCol>{myBookingTbc.address}</IonCol>
                        <IonCol size="auto">已確認</IonCol>
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

export default MyBookingTbc;
