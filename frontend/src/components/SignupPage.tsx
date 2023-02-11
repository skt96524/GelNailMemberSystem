import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonModal,
  IonCol,
  IonText,
  IonRow,
  useIonToast,
} from "@ionic/react";
import { useState } from "react";
import Data from "./Data";
import { useIonRouter } from "@ionic/react";
import useUpload from "../hooks/useUpload";
import { api_origin } from "../api";
import "../pages/login.css";
import useToast from "../hooks/useToast";

export default function SignupPage(props: {
  isOpen: boolean;
  close: () => void;
}) {
  const [state, setState] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    nick_name: "",
    email: "",
  });

  const router = useIonRouter();
  const [presentToast] = useIonToast();

  async function submit() {
    let formObj: {
      username?: string;
      password?: string;
      nick_name?: string;
      email?: string;
    } = {};
    formObj["username"] = state.username;
    formObj["password"] = state.password;
    formObj["nick_name"] = state.nick_name;
    formObj["email"] = state.email;
    await fetch(` ${api_origin}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formObj),
    });

    presentToast({
      message: "註冊成功",
      duration: 3500,
      color: "success",
      buttons: [
        {
          text: "關閉",
          role: "cancel",
        },
      ],
    });

    props.close();
  }
  return (
    <IonModal isOpen={props.isOpen}>
      <IonContent fullscreen className="ion-padding">
        <IonButton fill="clear" color="medium" onClick={props.close}>
          取消
        </IonButton>
        <h1>註冊新用戶</h1>
        <IonList>
          <IonInput
            class="regpage"
            type="text"
            placeholder="用戶名稱"
            value={state.username}
            onIonChange={(e) =>
              setState({ ...state, username: e.detail.value || "" })
            }
          ></IonInput>
          <IonInput
            placeholder="密碼"
            class="regpage"
            type="password"
            value={state.password}
            onIonChange={(e) =>
              setState({ ...state, password: e.detail.value || "" })
            }
          ></IonInput>

          <IonInput
            placeholder="暱稱"
            type="text"
            class="regpage"
            value={state.nick_name}
            onIonChange={(e) =>
              setState({ ...state, nick_name: e.detail.value || "" })
            }
          ></IonInput>
          <IonInput
            placeholder="電郵地址"
            type="text"
            class="regpage"
            value={state.email}
            onIonChange={(e) =>
              setState({ ...state, email: e.detail.value || "" })
            }
          ></IonInput>
        </IonList>
        <IonButton expand="block" color="medium" onClick={submit}>
          創建新用戶
        </IonButton>

        {/* <Data data={state} /> */}
      </IonContent>
    </IonModal>
  );
}
