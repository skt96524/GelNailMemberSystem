import { Dispatch } from "redux";
import { ToastController } from "../hooks/useToast";
import { post } from "../api";
import { loginAction, logoutAction, RootAction } from "./actions";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "./state";
import { useDispatch } from "react-redux";
import { UseIonRouterResult } from "@ionic/react";

export function loginThunk(
  user: {
    username: string;
    password: string;
  },
  toastCtl: ToastController,
  router: UseIonRouterResult
) {
  return async (dispatch: Dispatch<RootAction>) => {


    let json = await post('/login', user)
    if (json.error) {
      toastCtl.showError('錯誤帳號或密碼')
      return
    }
    if (json.token) {
      localStorage.setItem('token', json.token)
      dispatch(loginAction(json.token))
      toastCtl.showSuccess('成功登入')
      router.push("/")
      return
    }
    console.error('invalid response from api:', json)
  }
}

export function logoutThunk(toastCtl: ToastController, router: UseIonRouterResult
) {
  return (dispatch: Dispatch<RootAction>) => {
    localStorage.removeItem("token");
    dispatch(logoutAction());
    toastCtl.showSuccess('成功登出')
    router.push("/")

    return
  };
}

export type RootDispatch = ThunkDispatch<RootState, {}, RootAction>;

export function useRootDispatch() {
  const dispatch: RootDispatch = useDispatch();
  return dispatch;
}
