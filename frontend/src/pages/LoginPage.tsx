import {
  IonContent,
  IonList,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  UseIonToastResult,
  IonText,
  IonRow,
} from "@ionic/react";
import { useState } from "react";
import Data from "../components/Data";

import { loginThunk, RootDispatch, useRootDispatch } from "../redux/thunk";
import useToast from "../hooks/useToast";
import { useIonRouter } from "@ionic/react";
import SignupPage from "../components/SignupPage";
import "./login.css";
import { api_origin } from "../api";
import { routes } from "../Routes";
import { ALL } from "./Main";

const LoginPage: React.FC = () => {
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const dispatch = useRootDispatch();
  const toast = useToast();
  const router = useIonRouter();

  function submit() {
    dispatch(loginThunk(state, toast, router));
  }

  const [isOpenSignupPage, setIsOpenSignupPage] = useState(false);

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding" class="login ">
        <IonRow class="ion-justify-content-center">
          <img className="loginLogo" src="/gelnaillogo.svg"></img>
        </IonRow>
        <SignupPage
          isOpen={isOpenSignupPage}
          close={() => setIsOpenSignupPage(false)}
        />
        <IonList>
          <IonInput
            class="custom"
            type="text"
            placeholder="用戶名稱"
            value={state.username}
            onIonChange={(e) =>
              setState({ ...state, username: e.detail.value || "" })
            }
          ></IonInput>

          <IonInput
            placeholder="密碼"
            class="custom"
            type="password"
            value={state.password}
            onIonChange={(e) =>
              setState({ ...state, password: e.detail.value || "" })
            }
          ></IonInput>
        </IonList>
        <IonButton expand="block" color="medium" onClick={submit}>
          登入
        </IonButton>
        <IonButton
          expand="block"
          fill="clear"
          color="medium"
          onClick={() => setIsOpenSignupPage(true)}
          size="small"
        >
          我是新用戶
        </IonButton>
        <IonButton
          fill="clear"
          expand="block"
          href={routes.tab.Main}
          onClick={(e) => {
            setTimeout(() => {
              window.location.hash = ALL;
            }, 33);
          }}
        >
          <p style={{ color: "white" }}>返回主頁</p>
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
