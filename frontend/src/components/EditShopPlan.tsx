import {
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeOutline, imageOutline } from "ionicons/icons";

import { useState } from "react";
import { useParams } from "react-router";

import useFetch from "../hooks/useFetch";
import useGet from "../hooks/useGet";

type TypeEnum = "單次" | "套票";
type PlanEnum = "有效" | "無效";

type GetEditShopPlan = {
  error?: string;
  plan?: MyShopPlan[];
};

interface MyShopPlan {
  id: number;
  plan_name: string;
  intro: string;
  image: string;
  shop_id: number;
  price: number;
  types: TypeEnum;
  buy_period: Date;
  due_period: number;
  package_qty: number;
  plan_status: PlanEnum;
}

const EditShopPlan: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [packageType, setPackageType] = useState("package");

  const { upload } = useFetch();

  const myShopPlan = useGet<GetEditShopPlan>({
    name: "edit shop plan",
    pathname: "/shops/editshopplan",
    shouldAutoReload: true,
    defaultValue: {},
  });

  async function formUpload(event: any) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    let json = await upload("POST", `/shops/editshopplan`, formData);

    if (json.error) return;

    setIsOpen(false);
    myShopPlan.reload();
  }

  return (
    <>
      <IonButton expand="block" onClick={() => setIsOpen(true)}>
        加入套票
      </IonButton>

      <IonModal isOpen={isOpen}>
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons
                slot="end"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <IonIcon icon={closeOutline}></IonIcon>
              </IonButtons>
              <IonTitle>加入產品</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <>
              <form onSubmit={(event) => formUpload(event)}>
                <IonItem counter={true}>
                  <IonLabel position="floating">產品名稱 </IonLabel>
                  <IonInput maxlength={20} name="plan_name" required></IonInput>
                </IonItem>

                <IonItem counter={true}>
                  <IonLabel position="floating">價錢</IonLabel>
                  <IonInput name="price" type="number" required></IonInput>
                </IonItem>

                <IonItem counter={true}>
                  <IonButtons slot="end">
                    <IonLabel position="floating">上傳照片</IonLabel>
                    <label htmlFor="pic">
                      <IonIcon icon={imageOutline}></IonIcon>
                    </label>
                    <input
                      id="pic"
                      hidden={true}
                      type="file"
                      name="image"
                      required
                    ></input>
                  </IonButtons>
                </IonItem>

                <IonItem counter={true}>
                  <IonLabel position="floating">產品介紹</IonLabel>
                  <IonInput maxlength={50} name="intro" required></IonInput>
                </IonItem>

                <IonItem>
                  <IonInput
                    type="number"
                    id="due_period_year"
                    name="cancel_period"
                    placeholder="可取消時限（天）"
                    min="1"
                    required
                  ></IonInput>
                </IonItem>

                <IonList>
                  <IonItem>
                    <IonSelect
                      interface="popover"
                      placeholder="產品種類"
                      name="types"
                      value={packageType}
                      onIonChange={(event) =>
                        setPackageType(event.detail.value)
                      }
                    >
                      <IonSelectOption value="limit">單次</IonSelectOption>
                      <IonSelectOption value="package">套票</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonList>

                <IonList>
                  <IonItem>
                    <IonInput
                      disabled={packageType == "limit"}
                      placeholder="套票次數"
                      name="package_qty"
                      type="number"
                      min="2"
                      max="1000"
                    ></IonInput>
                  </IonItem>
                </IonList>

                <IonItem>
                  <div>可購買日期</div>
                  <div>
                    <input
                      type="date"
                      name="buy_period"
                      id="buy_period"
                      required
                    />
                  </div>
                </IonItem>

                <IonGrid>
                  <IonItem>
                    <IonInput
                      type="number"
                      id="due_period_year"
                      name="due_period"
                      placeholder="使用期限"
                      min="1"
                    ></IonInput>
                    <IonSelect
                      interface="popover"
                      placeholder="年月"
                      slot="end"
                      name="period"
                    >
                      <IonSelectOption value="30">個月</IonSelectOption>
                      <IonSelectOption value="365">年</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonGrid>

                <IonButton
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  取消
                </IonButton>

                <input type="submit" className="greensubmit" />
              </form>
            </>
          </IonContent>
        </IonPage>
      </IonModal>
    </>
  );
};
export default EditShopPlan;
