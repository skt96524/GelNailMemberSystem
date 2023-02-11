import { useIonToast } from "@ionic/react";

export default function useToast() {
  const [present, dismiss] = useIonToast();

  function showError(message: string) {
    return present({
      message,
      color: "danger",
      duration: 5000,
      buttons: [
        {
          text: "關閉",
          role: "cancel",
          handler: dismiss,
        },
      ],
    });
  }

  function showSuccess(message: string) {
    return present({
      cssClass: "toast_style_success",
      message,
      color: "success",
      duration: 3500,
      buttons: [
        {
          text: "關閉",
          role: "cancel",
          handler: dismiss,
        },
      ],
    });
  }

  return {
    showError,
    showSuccess,
  };
}

export type ToastController = ReturnType<typeof useToast>;
