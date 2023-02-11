import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonContent,
  IonIcon,
  IonCard,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonModal,
  useIonAlert,
  IonRow,
  IonImg,
  IonThumbnail,
} from "@ionic/react";
import { closeCircleOutline, closeCircleSharp } from "ionicons/icons";
import { useState } from "react";
import { useParams } from "react-router";
import { api_origin, toImageUrl } from "../../api";
import useFetch from "../../hooks/useFetch";
import useGet from "../../hooks/useGet";
import { routes } from "../../Routes";
import "./MyShopProductPic.css";

interface ShopProduct {
  products_id: number;
  products_image: string;
  products_intro: string;
  shop_id: number;
}

type GetShopProducts = {
  error?: string;
  products?: ShopProduct[];
};

const MyShopProducts: React.FC = () => {
  // const [addImg, setAddImg] = useState([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  // const shop_id = params.id;
  const [presentAlert] = useIonAlert();

  const { upload, fetchJSON } = useFetch();

  const shopProducts = useGet<GetShopProducts>({
    name: "shop products",
    pathname: "/shops/products",
    shouldAutoReload: true,
    defaultValue: {},
  });

  async function delPic(id: number) {
    await presentAlert("是否要刪除圖片？", [
      { text: "返回", role: "cancel" },
      {
        text: "確定",
        handler: async () => {
          let json = await fetchJSON("DELETE", "/products/" + id, {});
          if (json.error) return;
          shopProducts.reload();
        },
      },
    ]);
  }

  async function picUpload(event: any) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    let json = await upload("POST", `/shops/products`, formData);

    if (json.error) return;

    setIsOpen(false);
    shopProducts.reload();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={routes.tab.MyShop}></IonBackButton>
            <IonTitle>返回</IonTitle>
          </IonButtons>
          <IonTitle>作品集</IonTitle>
          <IonButtons slot="primary">
            <IonButton
              onClick={() => {
                setIsOpen(true);
              }}
            >
              新增
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            {shopProducts.render((json) =>
              json.products?.map((pic) => (
                <IonCol size="5" key={pic.products_id}>
                  <IonCard className="box">
                    <div>
                      <IonButtons
                        slot="end"
                        className="close-btn"
                        onClick={() => {
                          delPic(pic.products_id);
                        }}
                      >
                        <IonIcon icon={closeCircleSharp}></IonIcon>
                      </IonButtons>
                    </div>
                    <img
                      className="myProduct"
                      src={toImageUrl(pic.products_image)}
                    ></img>
                    <IonCardTitle>{pic!.products_intro}</IonCardTitle>
                  </IonCard>
                </IonCol>
              ))
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="secondary">
              <IonButton slot="start" onClick={() => setIsOpen(false)}>
                返回
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <form className="sub" onSubmit={(event) => picUpload(event)}>
            <div>
              {/* <label> */}
              {/* Profile Picture: */}
              <input type="file" name="image" />
              {/* </label> */}
              <input type="text" name="intro" placeholder="圖片介紹" />
            </div>
            <div>
              <input type="submit" value="Submit" className="greensubmit" />
            </div>
          </form>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};
export default MyShopProducts;
