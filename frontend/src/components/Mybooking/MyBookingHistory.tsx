import {
  IonItem,
  IonCardSubtitle,
  IonCardTitle,
  IonRow,
  IonCol,
} from "@ionic/react";
import useGet from "../../hooks/useGet";
// import { useNavigate } from "react-router-dom";
import changeToChi from "../../utilts";

function MyBookingHistory() {
  // let navigate = useNavigate();
  type GetMyBookingHistoryPayload = {
    error?: string;
    myBookingHistory?: {
      id?: number;
      plan_name?: string;
      shop_plan_intro: string;
      shop_plan_image: string;
      shop_name?: string;
      address?: string;
      schedule: string;
      price?: number;
      booking_status: string;
      apply_time?: string;
      confirm_time?: EpochTimeStamp;
      reject_time?: EpochTimeStamp;
      cancel_time?: EpochTimeStamp;
      finish_time?: EpochTimeStamp;
    }[];
  };

  const myBookingsHistory = useGet<GetMyBookingHistoryPayload>({
    name: "getMyBookingHistory",
    pathname: "/myBookingHistory",
    defaultValue: {},
  });

  return (
    <>
      {myBookingsHistory.render((json) => (
        <>
          {/* {<div>length:{json.myBookingsTbc?.length}</div>} */}
          {json.myBookingHistory ? (
            json.myBookingHistory.length > 0 ? (
              json.myBookingHistory!.map((myBookingHistory) => (
                <IonItem
                  className=" booking d-flex "
                  routerLink={`/booking/${myBookingHistory.id}`}
                  // onClick={() =>
                  //   navigate(`/MyBookingDetailPage/${myBookingCancel.id}`)
                  // }
                >
                  <div>
                    <IonCardSubtitle>
                      <div>{myBookingHistory.shop_name}</div>
                    </IonCardSubtitle>
                    <IonCardSubtitle>
                      {new Date(myBookingHistory.schedule).toLocaleString()}
                    </IonCardSubtitle>

                    <IonCardTitle>{myBookingHistory.plan_name}</IonCardTitle>
                    <IonCardTitle>${myBookingHistory.price}</IonCardTitle>
                    <IonCardSubtitle className="d-flex">
                      <IonRow>
                        <IonCol>{myBookingHistory.address}</IonCol>
                        <IonCol size="auto">
                          {changeToChi(myBookingHistory.booking_status)}
                        </IonCol>
                      </IonRow>
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

export default MyBookingHistory;
