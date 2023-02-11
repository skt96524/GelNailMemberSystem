import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
  useIonRouter,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { api_origin } from "../api";
import ArticleList from "../components/ArticleList";
import ProductDetail from "../components/Product/ProductDetail";
import ProductList from "../components/Product/ProductList";
import useGet from "../hooks/useGet";
import useToast from "../hooks/useToast";
import "./Main.css";

export const ALL = "推薦";

type ProductDetailProps = {
  id: number;
  intro: string;
  shop_id: number;
  images: string;
  like_qty: string;
};
type productListPayload = {
  error?: string;
  products?: ProductDetailProps[];
};
function Main() {
  const [searchType, setSearchType] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  // const [refresh, setRefresh] = useState<boolean>(props.refresh);
  const [type, setType] = useState<string>(ALL);
  const [productDetail, setProductDetail] = useState<ProductDetailProps>();
  const [productModal, setProductModal] = useState<boolean>(false);
  let toast = useToast();
  const hotProductList = useGet<productListPayload>({
    name: "hot-products",
    pathname: "/productsList",
    query: { productType: "精品作品" },
    defaultValue: {},
  });
  const newProductList = useGet<productListPayload>({
    name: "hot-products",
    pathname: "/productsList",
    query: { productType: "最新作品" },
    defaultValue: {},
  });
  // (props.refresh);

  useEffect(() => {
    if (window.location.hash != "#" + type) {
      window.location.hash = type;
    }
  }, [type]);

  useEffect(() => {
    function onChange(event: HashChangeEvent) {
      let newType = decodeURIComponent(new URL(event.newURL).hash).replace(
        "#",
        ""
      );
      if (newType !== type) {
        setType(newType);
      }
    }
    window.addEventListener("hashchange", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
    };
  }, [type]);

  useEffect(() => {}, [searchText, type]);
  function searchCheck(value: string) {
    if (!searchType) {
      return toast.showError("請先選擇要搜索的類別");
    }
    setSearchText(value);
  }

  function productOpenModal(product: ProductDetailProps) {
    setProductDetail(product);
    setProductModal(true);
  }

  // useEffect(() => {
  //   if (refresh) {
  //     setType(ALL);
  //     setSearchType("");
  //     setSearchText("");
  //     setRefresh(false);
  //   }
  // }, [refresh]);

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      setType(ALL);
      setSearchType("");
      setSearchText("");
      // Any calls to load data go here
      event.detail.complete();
    }, 1000);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">
            <img className="logo2" src="/gelnaillogo2.svg"></img>
          </IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSelect
            placeholder="類別"
            slot="start"
            interface="popover"
            value={searchType}
            onIonChange={(e) => {
              setSearchType(e.detail.value);
            }}
          >
            <IonSelectOption value="article">文章</IonSelectOption>
            <IonSelectOption value="product">作品</IonSelectOption>
          </IonSelect>
          <IonSearchbar
            placeholder="搜尋"
            showCancelButton="focus"
            // slot="end"
            // animated={true}
            value={searchText}
            onIonChange={(e) => searchCheck(e.detail.value || "")}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonSegment
          mode="ios"
          value={type}
          onIonChange={(e) => setType(e.detail.value || type)}
        >
          {/* <IonSegmentButton value="推薦">推薦</IonSegmentButton> */}
          <IonSegmentButton value="最新作品">最新作品</IonSegmentButton>
          <IonSegmentButton value="精品作品">精品作品</IonSegmentButton>
          <IonSegmentButton value="最新文章">最新文章</IonSegmentButton>
          <IonSegmentButton value="精品文章">精品文章</IonSegmentButton>
          <IonSegmentButton value="人氣文章">人氣文章</IonSegmentButton>
        </IonSegment>
        {type == ALL && !searchText ? (
          <>
            <IonCard className="margin-top-bottom">
              <IonCardHeader>
                <IonCardTitle>精品作品</IonCardTitle>
              </IonCardHeader>
              <div className="scroll">
                {hotProductList.render((json) =>
                  json.products?.map((product) => (
                    <IonThumbnail
                      key={product.id}
                      onClick={() => {
                        productOpenModal(product);
                      }}
                    >
                      <img
                        src={`${api_origin}/uploads/${product.images}`}
                        className="scrollProduct"
                      ></img>
                    </IonThumbnail>
                  ))
                )}
              </div>
            </IonCard>
            <IonCard className="margin-top-bottom">
              <IonCardHeader>
                <IonCardTitle>最新作品</IonCardTitle>
              </IonCardHeader>
              <div className="scroll">
                {newProductList.render((json) =>
                  json.products?.map((product) => (
                    <IonThumbnail
                      key={product.id}
                      onClick={() => {
                        productOpenModal(product);
                      }}
                    >
                      <img
                        src={`${api_origin}/uploads/${product.images}`}
                        className="scrollProduct"
                      ></img>
                    </IonThumbnail>
                  ))
                )}
              </div>
            </IonCard>
          </>
        ) : null}
        <div className="ion-padding" scrollbar-y-auto>
          {(type == ALL && !searchText) ||
          (type == "最新文章" && !searchText) ||
          (type == "精品文章" && !searchText) ||
          (type == "人氣文章" && !searchText) ? (
            <>
              <IonLabel className="mainTitle">
                {type == ALL ? "最新文章" : type}
              </IonLabel>
              <ArticleList type={type == ALL ? "最新文章" : type} />
            </>
          ) : null}
          {(type == "精品作品" && !searchText) ||
          (type == "最新作品" && !searchText) ? (
            <>
              <IonLabel className="mainTitle">{type}</IonLabel>
              <ProductList type={type} productOpenModal={productOpenModal} />
            </>
          ) : null}
          {searchType == "article" && searchText ? (
            <ArticleList searchText={searchText} />
          ) : null}

          <ProductDetail
            productModal={productModal}
            setProductModal={setProductModal}
            productDetail={productDetail}
          />
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Main;
