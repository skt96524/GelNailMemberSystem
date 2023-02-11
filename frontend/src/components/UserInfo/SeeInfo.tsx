import { IonList, IonItem, IonInput, IonLabel } from "@ionic/react";
import useGet from "../../hooks/useGet";

export function SeeInfo() {
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
            <IonInput>
              {json.profile?.nick_name ? (
                <div>{json.profile?.nick_name}</div>
              ) : null}
            </IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>電話號碼：</IonLabel>
            <IonInput>
              {json.profile?.phone_number ? (
                <div>{json.profile?.phone_number}</div>
              ) : null}
            </IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>電郵：</IonLabel>
            <IonInput>
              {json.profile?.email ? <div>{json.profile?.email}</div> : null}
            </IonInput>
          </IonItem>
        </>
      ))}
    </IonList>
  );
}
