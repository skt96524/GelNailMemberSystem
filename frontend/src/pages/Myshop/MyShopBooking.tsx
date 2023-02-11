import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonDatetime,
  IonList,
  IonCard,
  IonCardSubtitle,
  IonRow,
  IonCol,
  IonItem,
} from "@ionic/react";
import { chevronUpOutline, menuOutline } from "ionicons/icons";
import { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import UpdateBooking from "../../components/UpdateBooking";

import useGet from "../../hooks/useGet";
import { routes } from "../../Routes";
import changeToChi from "../../utilts";
import { BookingDetail } from "../Booking";

const MyShopBooking: React.FC = () => {
  const history = useHistory();
  const [openCalendar, setOpenCalendar] = useState<boolean>(true);
  let defaultDate =
    new Date().getFullYear() +
    "-" +
    (new Date().getMonth() + 1) +
    "-" +
    new Date().getDate();
  const [dateValue, setDateValue] = useState<string>(defaultDate);
  // const [bookingData, setBookingData] = useState<BookingType[]>();
  // const userID = useUserID();
  type getMyBookingDetailPayload = {
    error?: string;
    bookingDetail?: BookingDetail[];
  };
  const bookingData = useGet<getMyBookingDetailPayload>({
    name: "ShopBooking",
    pathname: "/shopbooking",
    query: { dateValue: dateValue },
    defaultValue: {},
  });

  function dateChange(calendarValue: any) {
    let date = new Date(calendarValue);
    let dateValue =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    setDateValue(dateValue);
    // setDateValue(dateValue);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton href={routes.tab.MyShop}>Back</IonButton>
            <IonTitle>Back Button</IonTitle>
          </IonButtons>
          <IonTitle>商店預約</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setOpenCalendar(!openCalendar)}>
              <IonIcon
                icon={openCalendar ? chevronUpOutline : menuOutline}
              ></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {openCalendar ? (
          <IonDatetime
            size="cover"
            presentation="date"
            onIonChange={(e) => dateChange(e.detail.value)}
          ></IonDatetime>
        ) : null}

        <IonList>
          {bookingData.render((json) =>
            json.bookingDetail
              ? json.bookingDetail.map((booking) => (
                  <IonCard key={booking.booking_id}>
                    <IonRow>
                      <IonCol
                        size="5"
                        onClick={() =>
                          history.push(`/booking/${booking.booking_id}`)
                        }
                      >
                        <IonCardSubtitle>
                          {new Date(booking.schedule).toLocaleString()}
                        </IonCardSubtitle>

                        <IonCardSubtitle>{booking.plan_name}</IonCardSubtitle>
                      </IonCol>
                      <IonCol size="2">
                        {changeToChi(booking.booking_status)}
                      </IonCol>
                      <IonCol size="5">
                        <UpdateBooking
                          bookingDetail={booking}
                          reload={bookingData.reload}
                        />
                      </IonCol>
                    </IonRow>
                    {/* <IonCardTitle>
                      {booking.types == "limit" ? "單次" : "套票"}
                      </IonCardTitle>
                      <IonCardTitle>${booking.price}</IonCardTitle>
                      <IonCardSubtitle className="d-flex">
                      <IonRow>
                      <IonCol size="auto"></IonCol>
                      </IonRow>
                    </IonCardSubtitle> */}
                  </IonCard>
                ))
              : null
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MyShopBooking;
