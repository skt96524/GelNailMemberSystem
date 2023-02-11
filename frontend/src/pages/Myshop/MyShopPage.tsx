import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCol,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonSlides,
  IonSlide,
  IonCard,
  IonCardSubtitle,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
  useIonAlert,
} from "@ionic/react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api_origin, fetchData, fetchNonGetData } from "../../api";
import NewBooking from "../../components/NewBooking";
import ProductDetail from "../../components/Product/ProductDetail";
import ProductList from "../../components/Product/ProductList";
import ShopPlanDetail from "../../components/ShopPlanDetail";
import { useIdentity, useUserID } from "../../redux/selector";
import "./MyShopPage.css";

type statusEnum = "apply" | "active" | "inactive";

interface MyShopPlanType {
  id: number;
  plan_name: string;
  intro: string;
  image: string;
  price: number;
  types: string;
}

interface MyShopPageProps {
  id: number;
  owner: number;
  name: string;
  area: string;
  address: string;
  open_time: string;
  close_time: string;
  intro: string;
  image: string;
  shop_status: statusEnum;
  shop_tel: number;
  shop_intro_photos?: { id: number; images: string; shop_id: number }[];
  shop_plan?: MyShopPlanType[];
}
type ProductDetailProps = {
  id: number;
  intro: string;
  shop_id: number;
  images: string;
  like_qty: string;
};

const MyShopPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const userID = useUserID();
  const identity = useIdentity();
  const [presentAlert] = useIonAlert();
  const [planType, setPlanType] = useState<string | undefined>("limit");
  const [limitPlan, setLimitPlan] = useState<MyShopPlanType[]>([]);
  const [packagePlan, setPackagePlan] = useState<MyShopPlanType[]>([]);
  const [productDetail, setProductDetail] = useState<ProductDetailProps>();
  const [productModal, setProductModal] = useState<boolean>(false);
  const [shopinfo, setShopInfo] = useState<MyShopPageProps | null>(null);
  const slideOpts = {
    initialSlide: 1,
    speed: 400,
  };
  function productOpenModal(product: ProductDetailProps) {
    setProductDetail(product);
    setProductModal(true);
  }

  useEffect(() => {
    (async () => {
      let details = await fetchData("/shopinfo?id=" + params.id);
      setShopInfo(details.result);
      setLimitPlan(
        details.result.shop_plan!.filter((plan: any) => plan.types == "limit")
      );
      setPackagePlan(
        details.result.shop_plan!.filter((plan: any) => plan.types == "package")
      );
    })();
  }, [params.id]);

  async function updateShopStatus(status: string, id: string) {
    let result = await fetchNonGetData("/updateshopstatus", "POST", {
      status,
      id,
    });

    presentAlert({ message: result.message, buttons: ["OK"] });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref={
                shopinfo?.owner == userID ? "/tab/myshop" : "/tab/shop"
              }
            ></IonBackButton>
            <IonTitle>Back</IonTitle>
          </IonButtons>
          <IonTitle>商店</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <>
          {!shopinfo ? null : (
            <>
              <IonSlides
                pager={shopinfo.shop_intro_photos ? true : false}
                options={slideOpts}
              >
                {shopinfo.shop_intro_photos
                  ? shopinfo.shop_intro_photos.map((introPhoto) => (
                      <IonSlide>
                        <img
                          src={`${api_origin}/uploads/${introPhoto.images}`}
                        ></img>
                      </IonSlide>
                    ))
                  : null}
                <IonSlide>
                  <img src={`${api_origin}/uploads/${shopinfo.image}`}></img>
                </IonSlide>
              </IonSlides>

              <IonGrid class="ion-padding">
                {shopinfo.shop_status == "active" ? null : (
                  <IonRow>
                    <IonCol offset="8" offset-md="2">
                      <IonCardSubtitle>
                        status:{shopinfo.shop_status}
                      </IonCardSubtitle>
                    </IonCol>
                  </IonRow>
                )}
                {identity != "admin" ? null : (
                  <IonRow>
                    <IonCol offset="8" offset-md="2">
                      <IonButton
                        onClick={() => updateShopStatus("active", params.id)}
                      >
                        Active
                      </IonButton>
                      <IonButton
                        onClick={() => updateShopStatus("inactive", params.id)}
                      >
                        Inactive
                      </IonButton>
                    </IonCol>
                  </IonRow>
                )}
                <IonRow>
                  <IonCol size="4">
                    <IonLabel>店名:</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>{shopinfo.name}</IonLabel>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="4">
                    <IonLabel>地區:</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>{shopinfo.area}</IonLabel>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="4">
                    <IonLabel>地址:</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>{shopinfo.address}</IonLabel>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="4">
                    <IonLabel>電話:</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>{shopinfo.shop_tel}</IonLabel>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="4">
                    <IonLabel>開放時間:</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>{shopinfo.open_time}</IonLabel>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="4">
                    <IonLabel>關門時間:</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>{shopinfo.close_time}</IonLabel>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="4">
                    <IonLabel>店鋪介紹:</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>{shopinfo.intro}</IonLabel>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonSegment
                value={planType}
                onIonChange={(e) => {
                  setPlanType(e.detail.value);
                }}
              >
                <IonSegmentButton value="limit">
                  <IonLabel>優惠</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="package">
                  <IonLabel>套票</IonLabel>
                </IonSegmentButton>
              </IonSegment>
              {/* <div> */}
              <div className="scroll">
                <>
                  <IonGrid>
                    <IonRow>
                      {planType == "limit" && limitPlan.length > 0 ? (
                        limitPlan.map((plan, idx) => (
                          <>
                            <IonCol size="6">
                              <IonCard key={idx} className="scrollPlan">
                                <IonCardHeader>
                                  <IonCardTitle>{plan.plan_name}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>{plan.intro}</IonCardContent>
                                <IonRow>
                                  <IonCol
                                    offset="6"
                                    offset-md="4"
                                    offset-lg="2"
                                  >
                                    <IonCardTitle>${plan.price}</IonCardTitle>
                                  </IonCol>
                                </IonRow>
                                <NewBooking
                                  id={plan.id}
                                  plan_name={plan.plan_name}
                                />

                                <ShopPlanDetail id={plan.id} idx={idx} />
                              </IonCard>
                            </IonCol>
                          </>
                        ))
                      ) : planType == "limit" ? (
                        <>no product</>
                      ) : null}
                    </IonRow>
                  </IonGrid>
                </>
                {planType == "package" && packagePlan.length > 0 ? (
                  packagePlan.map((plan, idx) => (
                    <>
                      <IonCol size="6">
                        <IonCard key={idx} className="scrollPlan">
                          <IonCardHeader>
                            <IonCardTitle>{plan.plan_name}</IonCardTitle>
                          </IonCardHeader>
                          <IonCardContent>{plan.intro}</IonCardContent>
                          <IonRow>
                            <IonCol offset="6" offset-md="4" offset-lg="2">
                              <IonCardTitle>${plan.price}</IonCardTitle>
                            </IonCol>
                          </IonRow>
                          <ShopPlanDetail id={plan.id} idx={idx} />
                        </IonCard>
                      </IonCol>
                    </>
                  ))
                ) : planType == "package" ? (
                  <>未有產品</>
                ) : null}
              </div>
              {/* </div> */}
            </>
          )}
        </>
        <div key={1}>
          <ProductList
            productOpenModal={productOpenModal}
            shop_id={+params.id}
          />
        </div>
      </IonContent>
      <ProductDetail
        productModal={productModal}
        setProductModal={setProductModal}
        productDetail={productDetail}
      />
    </IonPage>
  );
};

export default MyShopPage;
