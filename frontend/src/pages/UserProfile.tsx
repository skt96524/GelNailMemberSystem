import {
  IonAvatar,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonToolbar,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
} from "@ionic/react";
import { heart } from "ionicons/icons";
import useGet from "../hooks/useGet";
import { useParams } from "react-router";

import "./UserProfile.css";
import { useEffect, useState } from "react";
import ArticleList from "../components/ArticleList";
import useLikeCollection from "../hooks/useLikeCollect";
import { useUserID } from "../redux/selector";

import { useLocation } from "react-router-dom";
import { api_origin } from "../api";

type UsersProfilePayload = {
  error?: string;
  usersProfile?: {
    username?: string;
    nick_name?: string;
    image?: string;
    identity?: string;
    name?: string;
    shop_id?: string;
    address?: string;
    intro?: string;
    shop_image?: string;
  };
};

const UserProfile: React.FC = () => {
  const params = useParams<{ id: string }>();
  const users_id = useUserID();

  const { search } = useLocation();

  let id = new URLSearchParams(search).get("user_id");

  const getUsersProfile = useGet<UsersProfilePayload>({
    name: "usersProfile" + id,
    pathname: "/usersprofile/" + id,
    defaultValue: {},
  });
  const useCollect = useLikeCollection("users", users_id, params.id);
  const { collectCode } = useCollect;

  useEffect(() => {}, [search]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="#"></IonBackButton>
          </IonButtons>
          <IonTitle>用戶資訊</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {getUsersProfile?.render((json) => (
          <>
            <IonGrid>
              <IonRow class="ion-align-items-center">
                <IonCol size="auto">
                  <IonAvatar className="UserAvatar">
                    <img
                      src={`${api_origin}/uploads/${json.usersProfile?.image}`}
                    />
                  </IonAvatar>
                </IonCol>
                <IonCol size="6">
                  <IonCardTitle>{json.usersProfile?.nick_name}</IonCardTitle>
                  <IonCardSubtitle>
                    {json.usersProfile?.username}
                  </IonCardSubtitle>
                </IonCol>
                {users_id + "" != id && <IonCol size="1">{collectCode}</IonCol>}
              </IonRow>
            </IonGrid>

            {json.usersProfile?.identity == "shop_owner" ? (
              <>
                <IonCardTitle>商店</IonCardTitle>
                <IonItem routerLink={`/shop/${json.usersProfile?.shop_id}`}>
                  <IonGrid>
                    <IonRow class="ion-align-items-center">
                      <IonCol size="auto">
                        <IonAvatar>
                          <img
                            src={`${api_origin}/${json.usersProfile?.shop_image}`}
                          />
                        </IonAvatar>
                      </IonCol>
                      <IonCol size="8">
                        <IonCardTitle> {json.usersProfile?.name}</IonCardTitle>

                        <IonCardSubtitle>
                          {json.usersProfile?.intro}
                        </IonCardSubtitle>
                        <IonCardSubtitle>
                          {json.usersProfile?.address}
                        </IonCardSubtitle>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonItem>
              </>
            ) : (
              <></>
            )}
          </>
        ))}
        <IonCardTitle>文章</IonCardTitle>
        <ArticleList users_id={params.id} />
      </IonContent>
    </IonPage>
  );
};

export default UserProfile;
