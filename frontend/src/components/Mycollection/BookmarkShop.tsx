import "./MyCollection.css";
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  UseIonToastResult,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonCol,
  IonCard,
} from "@ionic/react";
import useGet from "../../hooks/useGet";
import { api_origin } from "../../api";

function BookmarkShop() {
  type GetBookmarkShopPayload = {
    error?: string;
    shops?: {
      id?: number;
      name?: string;
      image?: string;
      intro?: string;
    }[];
  };

  const shops = useGet<GetBookmarkShopPayload>({
    name: "getMyBookMarkShop",
    pathname: "/bookmarkShop",
    defaultValue: {},
  });
  return (
    <>
      {shops.render((json) => (
        <>
          {json.shops?.map((shop) => (
            <>
              <IonItem
                className=" allBookmarkShop d-flex"
                href={`/shop/${shop.id}`}
              >
                <img
                  className="shopImg "
                  src={`${api_origin}/${shop.image}`}
                  slot="start"
                />
                <div>
                  <IonCardTitle>{shop.name}</IonCardTitle>
                </div>
              </IonItem>
            </>
          ))}
        </>
      ))}
    </>
  );
}

export default BookmarkShop;
