import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
  IonAvatar,
  IonCol,
  IonLabel,
  IonButton,
  IonThumbnail,
  IonTextarea,
  IonItem,
  IonList,
  IonInput,
  IonNote,
  IonToggle,
  IonModal,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonGrid,
  IonRow,
  useIonAlert,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  useIonToast,
  useIonRouter,
} from "@ionic/react";
import { image } from "ionicons/icons";
import { useEffect, useState } from "react";
import useUpload from "../../hooks/useUpload";
import { selectImage } from "@beenotung/tslib/file";
import { compressMobilePhoto, dataURItoBlob } from "@beenotung/tslib/image";
import { api_origin } from "../../api";
import { Icon } from "ionicons/dist/types/components/icon/icon";

const CreateShop: React.FC = () => {
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
  //   const [form, SetForm] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();

  const router = useIonRouter();

  const validateTel = (tel: string) => {
    return tel.match(/^[0-9]{8}$/);
  };
  const validate = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;

    setIsValid(undefined);

    if (value === "") return;

    validateTel(value) !== null ? setIsValid(true) : setIsValid(false);
  };

  const markTouched = () => {
    setIsTouched(true);
  };

  const [state, setState] = useState({
    name: "",
    imageFile: null as File | null,
    imageDataUrl: "",
    area: "",
    open_time: "",
    close_time: "",
    intro: "",
    address: "",
    shop_tel: "",
  });

  const [present, dismiss] = useIonToast();
  async function pickImage() {
    let files = await selectImage();
    let file = files[0];
    if (!file) return;
    let dataUrl = await compressMobilePhoto({ image: file });
    let blob = dataURItoBlob(dataUrl);
    file = new File([blob], file.name, {
      lastModified: file.lastModified,
      type: blob.type,
    });

    setState((state) => ({ ...state, imageDataUrl: dataUrl, imageFile: file }));
  }

  async function submit() {
    let formData = new FormData();
    formData.set("name", state.name);
    if (state.imageFile) {
      formData.set("image", state.imageFile);
    }
    formData.set("area", state.area);
    formData.set("open_time", state.open_time);
    formData.set("close_time", state.close_time);
    formData.set("intro", state.intro);
    formData.set("address", state.address);
    formData.set("shop_tel", state.shop_tel);
    upload("/createshop", formData, (json) => {
      router.back();
    });
  }

  const upload = useUpload();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
            <IonTitle>Back Button</IonTitle>
          </IonButtons>
          <IonTitle>創建商店</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>商店名稱</IonLabel>
            <IonInput
              value={state.name}
              onIonChange={(e) =>
                setState({ ...state, name: e.detail.value || "" })
              }
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>封面圖片</IonLabel>
            {state.imageFile && <IonLabel> {state.imageFile.name}</IonLabel>}
            <IonButton slot="end" onClick={pickImage}>
              <IonIcon icon={image}></IonIcon>
            </IonButton>
          </IonItem>
          {state.imageDataUrl ? (
            <div className="ion-text-center">
              <IonThumbnail style={{ display: "inline-block" }}>
                <img src={`${api_origin}/${state.imageDataUrl}`}></img>
              </IonThumbnail>
            </div>
          ) : null}

          <IonItem
            className={`${isValid && "ion-valid"} ${
              isValid === false && "ion-invalid"
            } ${isTouched && "ion-touched"}`}
          >
            <IonLabel>聯絡電話 +852</IonLabel>
            <IonInput
              type="tel"
              onIonInput={(event) => validate(event)}
              onIonBlur={() => markTouched()}
              value={state.shop_tel}
              onIonChange={(e) =>
                setState({ ...state, shop_tel: e.detail.value || "" })
              }
            ></IonInput>
            <IonNote slot="helper">請輸入有效電話號碼</IonNote>
            <IonNote slot="error">無效電話號碼</IonNote>
          </IonItem>

          <IonItem>
            <IonLabel>地區</IonLabel>
            <IonSelect
              onIonChange={(e) =>
                setState({ ...state, area: e.detail.value || "" })
              }
              interface="action-sheet"
              placeholder="請選擇..."
            >
              {areas.map((area) => (
                <IonSelectOption value={area}>{area}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>開店時間</IonLabel>
            <IonInput
              value={state.open_time}
              onIonChange={(e) =>
                setState({ ...state, open_time: e.detail.value || "" })
              }
              type="time"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>關門時間</IonLabel>
            <IonInput
              value={state.close_time}
              onIonChange={(e) =>
                setState({ ...state, close_time: e.detail.value || "" })
              }
              type="time"
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>地址</IonLabel>
            <IonTextarea
              value={state.address}
              autoGrow={true}
              onIonChange={(e) =>
                setState({ ...state, address: e.detail.value || "" })
              }
            ></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel>店舖介紹</IonLabel>
            <IonTextarea
              placeholder="請介紹一下你的店舖"
              value={state.intro}
              autoGrow={true}
              onIonChange={(e) =>
                setState({ ...state, intro: e.detail.value || "" })
              }
            ></IonTextarea>
          </IonItem>
          <IonButton onClick={submit}>提交申請</IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CreateShop;
