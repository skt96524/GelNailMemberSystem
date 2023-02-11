import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonLabel,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
  IonCardSubtitle,
} from "@ionic/react";
import { heart } from "ionicons/icons";
import { api_origin } from "../../api";
import useLikeCollection from "../../hooks/useLikeCollect";
import { useUserID } from "../../redux/selector";

type ProductDetailProps = {
  data?: any;
};

type ProductDetail = {
  id: number;
  intro: string;
  shop_id: number;
  images: string;
  like_qty: string;
};

function ProductDetail(props: {
  productModal: boolean;
  setProductModal: React.Dispatch<React.SetStateAction<boolean>>;
  productDetail: ProductDetail | undefined;
}) {
  const { productModal, setProductModal, productDetail } = props;
  const users_id = useUserID();

  const likeCollectProduct = useLikeCollection(
    "Product",
    users_id,
    String(productDetail?.id),
    updateLikedQty
  );

  const { liked, likeCode, collectCode, alertFunction } = likeCollectProduct;

  function updateLikedQty(num: number) {
    if (productDetail) {
      productDetail.like_qty = String(+productDetail.like_qty + num);
    }
  }
  return (
    <IonModal
      id="example-modal"
      isOpen={productModal}
      onDidDismiss={() => setProductModal(false)}
    >
      {!productDetail ? null : (
        <IonContent>
          <IonImg
            src={`${api_origin}/uploads/${productDetail?.images}`}
          ></IonImg>
          <IonGrid>
            <IonRow class="ion-justify-content-between">
              {likeCode}
              {collectCode}
            </IonRow>
            <IonRow>
              <IonCardSubtitle>{productDetail?.like_qty}人讚好</IonCardSubtitle>
            </IonRow>
            <IonLabel color="medium"></IonLabel>
            <IonLabel>{productDetail?.intro}</IonLabel>
            <IonRow class="ion-justify-content-end">
              <IonCol size="auto">
                <IonButton
                  id="example-modal"
                  onClick={() => setProductModal(false)}
                >
                  Close
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      )}
    </IonModal>
  );
}

export default ProductDetail;
