import {
  IonInfiniteScrollCustomEvent,
  RefresherEventDetail,
} from "@ionic/core";
import {
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useGet from "../hooks/useGet";
import "./Notification.css";

type NotificationListProps = {
  id: number;
  link: string;
  content: string;
};
type notificationListPayload = {
  error?: string;
  notificationList?: NotificationListProps[];
};

function Notification() {
  const [hasLoadMore, setHasLoadMore] = useState(false);

  const notificationList = useGet<notificationListPayload>({
    name: "notification",
    pathname: "/notification",
    defaultValue: {},
    shouldAutoReload: (json) => {
      return !hasLoadMore;
    },
  });
  async function loadMore(ev: IonInfiniteScrollCustomEvent<void>) {
    const offset = notificationList.state.payload.notificationList?.length || 0;

    let json = await notificationList.loadMore(offset);
    if (json.error) {
    }
    if (json.notificationList) {
      notificationList.setState((state) => ({
        ...state,
        payload: {
          notificationList: [
            ...(state.payload.notificationList || []),
            ...json.notificationList,
          ],
        },
      }));
      setHasLoadMore(true);
    }
    ev.target.complete();
  }
  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      notificationList.reload();
      // Any calls to load data go here
      event.detail.complete();
    }, 1000);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">通知</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {notificationList.render((json) => (
          <>
            <IonGrid>
              <IonRow>
                {json.notificationList?.map((notification, idx) => (
                  <IonCol key={idx} size="12">
                    <Link to={notification.link}>
                      <IonCard className="no-margin notification">
                        {notification.content}
                      </IonCard>
                    </Link>
                  </IonCol>
                ))}
                <IonInfiniteScroll onIonInfinite={loadMore}>
                  <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>
              </IonRow>
            </IonGrid>
          </>
        ))}
      </IonContent>
    </IonPage>
  );
}

export default Notification;
