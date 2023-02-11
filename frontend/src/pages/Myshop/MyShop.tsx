import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  useIonAlert,
} from "@ionic/react";
import { addCircle } from "ionicons/icons";
import { useEffect, useState } from "react";
import { fetchData } from "../../api";

import { routes } from "../../Routes";

const MyShop: React.FC = () => {
  const [presentAlert] = useIonAlert();
  const [shopId, setShopId] = useState<number>();

  useEffect(() => {
    (async () => {
      let shopID = await fetchData("/myshopid");
      if (shopID.result) {
        setShopId(shopID.result);
      }
      if (shopID.error) {
        presentAlert({
          header: "Failed",
          message: shopID.error,
          buttons: ["OK"],
        });
      }
    })();
  }, []);
  const pages = [
    {
      name: "商店頁面",
      href: shopId ? routes.myShop.home(shopId) : "#",
    },
    { name: "產品資訊", href: routes.myShop.plans },
    { name: "作品集", href: routes.myShop.products },
    { name: "會員資料", href: routes.member.list },
    // { name: "更改商店資料", href: "/editshopinfo" },
    { name: "查看預約流程", href: "/myshopbooking" },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>我的商店</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonList>
          {pages.map((page) => (
            <IonItem key={page.name} href={page.href}>
              <IonLabel>{page.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        {/* <IonCol class="ion-justify-content-center" size="6">
          {pages.map((page) => (
            <IonButton key={page.href} routerLink={page.href}>
              {page.name}
            </IonButton>
          ))}
        </IonCol> */}
      </IonContent>
    </IonPage>
  );
};

export default MyShop;
