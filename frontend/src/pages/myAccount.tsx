import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCol,
  IonRow,
  IonGrid,
  IonItem,
  IonLabel,
  IonIcon,
  IonModal,
  IonButtons,
  IonAvatar,
  useIonRouter,
} from "@ionic/react";
import { logoutThunk, useRootDispatch } from "../redux/thunk";
import { useIdentity, useToken } from "../redux/selector";
import { routes } from "../Routes";
import "./myAccount.css";
import { createOutline } from "ionicons/icons";
import useGet from "../hooks/useGet";
import { useState } from "react";
import NewArticle from "./NewArticle";
import "./myAccount.css";
import { Route } from "workbox-routing";
import { selectImage } from "@beenotung/tslib/file";
import { compressMobilePhoto, dataURItoBlob } from "@beenotung/tslib/image";
import useUpload from "../hooks/useUpload";
import useToast from "../hooks/useToast";
import { api_origin } from "../api";

type ProfilePayload = {
  error?: string;
  profile?: {
    id: number;
    username?: string;
    nick_name?: string;
    phone_number?: string;
    email?: string;
    image?: string;
  };
};

const MyAccount: React.FC = () => {
  const hasLogin = useToken();
  const identity = useIdentity();
  const dispatch = useRootDispatch();
  const profile = useGet<ProfilePayload>({
    name: "userinfo",
    pathname: "/userinfo",
    defaultValue: {},
  });
  const [isOpenNewArticle, setIsOpenNewArticle] = useState<boolean>(false);
  const toast = useToast();
  const router = useIonRouter();
  function logout() {
    dispatch(logoutThunk(toast, router));
  }

  const [state, setState] = useState({
    imageFile: null as File | null,
    imageDataUrl: "",
  });

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
    if (state.imageFile) {
      formData.set("image", state.imageFile);
    }
    upload("/update", formData, (json) => {});
  }
  const upload = useUpload();

  const pages = [
    { name: "我的收藏", href: "/mycollection" },
    { name: "我的預約", href: "/mybooking" },
    { name: "我的套票", href: "/mypackage" },
    { name: "投稿文章", href: "/newarticle" },
    { name: "我要開舖", href: "/creatshop" },
  ];

  const [isOpenMyCollection, setIsOpenMycollection] = useState(false);

  return (
    <IonPage>
      {/* <MyCollection
        isOpen={isOpenMyCollection}
        close={() => setIsOpenMycollection(false)}
      /> */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {hasLogin ? (
          <>
            <div>
              <IonItem>
                <IonLabel className="d-flex">
                  {profile.render((json) => (
                    <>
                      <IonAvatar slot="start">
                        {
                          json.profile?.image ? (
                            <img
                              src={`${api_origin}/uploads/${json.profile?.image}`}
                            />
                          ) : null
                          // <img src={profile.state.payload.profile?.avatar} />
                        }
                      </IonAvatar>

                      {json.profile?.username ? (
                        <div>{json.profile?.username}</div>
                      ) : null}

                      {json.profile?.nick_name ? (
                        <div>
                          <b>{json.profile?.nick_name}</b>
                        </div>
                      ) : null}
                    </>
                  ))}

                  {/* <IonButton routerLink={routes.Users.UpdateUserInfo}>
                    <IonIcon color="light" icon={createOutline}></IonIcon>
                  </IonButton> */}
                </IonLabel>
              </IonItem>
              <IonGrid>
                <IonRow class="ion-text-center">
                  <IonCol
                    class="ion-text-center"
                    size="6"
                    size-md="4"
                    size-lg="2"
                  >
                    {profile.render((json) => (
                      <>
                        <IonButton
                          routerLink={`/usersprofile/${json.profile?.id}?user_id=${json.profile?.id}`}
                        >
                          個人頁面
                        </IonButton>
                      </>
                    ))}
                  </IonCol>
                  {pages.map((page) =>
                    page.name == "我要開舖" &&
                    identity == "shop_owner" ? null : (
                      <IonCol
                        class="ion-text-center"
                        size="6"
                        size-md="4"
                        size-lg="2"
                      >
                        {page.name == "投稿文章" ? (
                          <IonButton onClick={() => setIsOpenNewArticle(true)}>
                            <div>{page.name}</div>
                          </IonButton>
                        ) : (
                          <IonButton routerLink={page.href}>
                            <div>{page.name}</div>
                          </IonButton>
                        )}
                      </IonCol>
                    )
                  )}
                </IonRow>
              </IonGrid>
              {/* <IonButton onClick={() => setIsOpenMycollection(true)}>
                My Collection
              </IonButton> */}
            </div>
          </>
        ) : (
          <>
            <IonButton routerLink={routes.LoginPage}>Login</IonButton>
          </>
        )}
      </IonContent>

      <IonButton onClick={logout}>登出帳號</IonButton>

      <IonModal isOpen={isOpenNewArticle}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setIsOpenNewArticle(false)}>
                Cancel
              </IonButton>
            </IonButtons>
            <IonTitle>發佈文章</IonTitle>
          </IonToolbar>
        </IonHeader>
        <NewArticle setIsOpenNewArticle={setIsOpenNewArticle} />
      </IonModal>
    </IonPage>
  );
};

export default MyAccount;
