import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonLabel,
  IonModal,
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
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { api_origin } from "../api";
import ShopList from "../components/ShopList";
import useGet from "../hooks/useGet";
import useToast from "../hooks/useToast";
import "./Shop.css";

type ShopDetailProps = {
  id: number;
  name: string;
  image: string;
  address: string;
};
type shopListPayload = {
  error?: string;
  shopList?: ShopDetailProps[];
};
function Shop() {
  const [area, setArea] = useState<string>("地區");
  const [searchText, setSearchText] = useState<string>("");
  const [type, setType] = useState<string>("main");
  let toast = useToast();
  const bestShopList = useGet<shopListPayload>({
    name: "best-shopList",
    pathname: "/shopList",
    query: { type: "精品店舖" },
    defaultValue: {},
  });
  const hotShopList = useGet<shopListPayload>({
    name: "hot-shopList",
    pathname: "/shopList",
    query: { type: "人氣店舖" },
    defaultValue: {},
  });

  const areas = [
    "中西區",
    "灣仔區",
    "東區",
    "南區",
    "油尖旺區",
    "深水埗區",
    "九龍城區",
    "黃大仙區",
    "觀塘區",
    "葵青區",
    "荃灣區",
    "屯門區",
    "元朗區",
    "北區",
    "大埔區",
    "沙田區",
    "西貢區",
    "離島區",
  ];
  // useEffect(() => {
  //   if(shopDetail){

  //   }
  // }, [shopDetail]);
  useEffect(() => {}, [searchText, type]);

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      setType("main");
      setSearchText("");
      setArea("地區");
      // Any calls to load data go here
      event.detail.complete();
    }, 1000);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">店舖</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSelect
            placeholder="地區"
            slot="start"
            interface="popover"
            value={area}
            onIonChange={(e) => {
              setArea(e.detail.value);
            }}
          >
            <IonSelectOption value="地區">地區</IonSelectOption>
            {areas.map((area, index) => (
              <>
                <IonSelectOption key={index} value={area}>
                  {area}
                </IonSelectOption>
              </>
            ))}
            {/* <IonSelectOption value="中西區">中西區</IonSelectOption>
            <IonSelectOption value="灣仔區">灣仔區</IonSelectOption>
            <IonSelectOption value="東區">東區</IonSelectOption>
            <IonSelectOption value="南區">南區</IonSelectOption>
            <IonSelectOption value="油尖旺區">油尖旺區</IonSelectOption>
            <IonSelectOption value="深水埗區">深水埗區</IonSelectOption>
            <IonSelectOption value="九龍城區">九龍城區</IonSelectOption>
            <IonSelectOption value="黃大仙區">黃大仙區</IonSelectOption>
            <IonSelectOption value="觀塘區">觀塘區</IonSelectOption>
            <IonSelectOption value="葵青區">葵青區</IonSelectOption>
            <IonSelectOption value="荃灣區">荃灣區</IonSelectOption>
            <IonSelectOption value="屯門區">屯門區</IonSelectOption>
            <IonSelectOption value="元朗區">元朗區</IonSelectOption>
            <IonSelectOption value="北區">北區</IonSelectOption>
            <IonSelectOption value="大埔區">大埔區</IonSelectOption>
            <IonSelectOption value="沙田區">沙田區</IonSelectOption>
            <IonSelectOption value="西貢區">西貢區</IonSelectOption>
            <IonSelectOption value="離島區">離島區</IonSelectOption> */}
          </IonSelect>
          <IonSearchbar
            placeholder="搜尋"
            showCancelButton="focus"
            // slot="end"
            // animated={true}
            value={searchText}
            onIonChange={(e) => setSearchText(e.detail.value || "")}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonSegment value="buttons">
            <IonSegmentButton
              value="最新店舖"
              onClick={(e) => {
                setType(e.currentTarget.value);
              }}
            >
              最新店舖
            </IonSegmentButton>
            <IonSegmentButton
              value="精品店舖"
              onClick={(e) => {
                setType(e.currentTarget.value);
              }}
            >
              精品店舖
            </IonSegmentButton>
            <IonSegmentButton
              value="人氣店舖"
              onClick={(e) => {
                setType(e.currentTarget.value);
              }}
            >
              人氣店舖
            </IonSegmentButton>
          </IonSegment>
          {type == "main" && !searchText && area == "地區" ? (
            <>
              <IonCard className="margin-top-bottom">
                <IonCardHeader>
                  <IonCardTitle>精品店舖</IonCardTitle>
                </IonCardHeader>
                <div className="scroll">
                  {bestShopList.render((json) =>
                    json.shopList?.map((shop, idx) => (
                      <>
                        <IonCard
                          key={idx}
                          href={`/shop/${shop.id}`}
                          className="scrollShop"
                        >
                          <img
                            src={`${api_origin}/${shop.image}`}
                            className="scrollShopImage"
                          ></img>
                          <IonHeader>{shop.name}</IonHeader>
                        </IonCard>
                      </>
                    ))
                  )}
                </div>
              </IonCard>
              <IonCard className="margin-top-bottom">
                <IonCardHeader>
                  <IonCardTitle>人氣店舖</IonCardTitle>
                </IonCardHeader>
                {/* <div> */}
                <div className="scroll">
                  {hotShopList.render((json) =>
                    json.shopList?.map((shop, idx) => (
                      <>
                        <IonCard
                          key={idx}
                          href={`/shop/${shop.id}`}
                          className="scrollShop"
                        >
                          <img
                            src={`${api_origin}/${shop.image}`}
                            className="scrollShopImage"
                          ></img>
                          <IonHeader>{shop.name}</IonHeader>
                        </IonCard>
                      </>
                    ))
                  )}
                </div>
                {/* </div> */}
              </IonCard>
            </>
          ) : null}

          <div className="ion-padding">
            {area == "地區" && !searchText ? (
              <>
                <IonLabel className="mainTitle">
                  {type == "main" ? "最新店舖" : type}
                </IonLabel>
                <ShopList type={type == "main" ? "最新店舖" : type} />
              </>
            ) : null}

            {searchText || area ? (
              <ShopList
                searchText={searchText}
                area={area}
                type={type == "main" ? "最新店舖" : type}
              />
            ) : null}
          </div>
        </>
      </IonContent>
    </IonPage>
  );
}

export default Shop;
