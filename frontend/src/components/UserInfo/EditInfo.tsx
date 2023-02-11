import { IonList, IonItem, IonInput, IonLabel } from "@ionic/react";
import useGet from "../../hooks/useGet";

export function EditInfo() {
  type ProfilePayload = {
    error?: string;
    profile?: {
      username?: string;
      nick_name?: string;
      phone_number?: string;
      email?: string;
    };
  };
  const profile = useGet<ProfilePayload>({
    name: "userinfo",
    pathname: "/userinfo",
    defaultValue: {},
  });

  return (
    <IonList>
      {profile.render((json) => (
        <>
          <IonItem>
            <IonLabel>名稱：</IonLabel>
            <IonInput value={json.profile?.nick_name}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>電話號碼：</IonLabel>
            <IonInput value={json.profile?.phone_number}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>電郵：</IonLabel>
            <IonInput value={json.profile?.email}></IonInput>
          </IonItem>
        </>
      ))}
    </IonList>
  );
}
