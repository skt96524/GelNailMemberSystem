import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonSearchbar,
  IonModal,
  IonButton,
  IonIcon,
  useIonAlert,
} from "@ionic/react";

import { useEffect, useState } from "react";
import { api_origin, fetchNonGetData } from "../../api";
import { useUserID } from "../../redux/selector";

import { routes } from "../../Routes";
import { add, addCircleOutline, reload } from "ionicons/icons";

type MyMemberProps = {
  id: number;
  name: string;
  tel: number;
  icon: string;
  email: string;
};

const MyMember: React.FC = () => {
  const [userData, setUserData] = useState<MyMemberProps[]>([]);
  const [searchState, setSearchState] = useState<string>("");
  const [addMemberModal, setAddMemberModal] = useState<boolean>(false);
  const [addMemberData, setAddMemberData] = useState<MyMemberProps[]>([]);
  const [addMemberSearchState, setAddMemberSearchState] = useState<string>("");
  const [reload, setReload] = useState<number>(0);
  const [presentAlert] = useIonAlert();
  const userID = useUserID();

  useEffect(() => {
    let input = {};
    if (userID) {
      input = { userID, searchState };
    }
    (async () => {
      let data = await fetchNonGetData("/membersList", "POST", {
        input,
      });
      setUserData(data.rows);
    })();
  }, [searchState, reload]);

  useEffect(() => {
    if (addMemberSearchState.length < 3) {
      return setAddMemberData([]);
    }
    if (!userID) {
      return;
    }

    let input = { userID, addMemberSearchState };

    (async () => {
      let data = await fetchNonGetData("/addmemberslist", "POST", {
        input,
      });
      if (!data) {
        return;
      }
      setAddMemberData(data.rows);
    })();
  }, [addMemberSearchState]);

  function addMember(member: number) {
    (async () => {
      let data = await fetchNonGetData("/addmember", "POST", {
        member,
      });
      if (!data.rows) {
        return presentAlert({
          header: "Failed",
          message: data.message,
          buttons: ["OK"],
        });
      }

      setAddMemberModal(false);
      setReload(reload + 1);
      return presentAlert({
        header: "Success",
        message: "Already added",
        buttons: ["OK"],
      });
    })();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={routes.tab.MyShop}></IonBackButton>
          </IonButtons>

          <IonTitle>會員一覽</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setAddMemberModal(true)}>
              <IonIcon icon={addCircleOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonSearchbar
          placeholder="search by name or email"
          onIonInput={(e: any) => setSearchState(e.target.value)}
        ></IonSearchbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          {userData
            ? userData.map((member) => (
                <IonItem
                  key={member.id}
                  routerLink={routes.member.detail(member.id)}
                >
                  <IonThumbnail slot="start">
                    <img src={`${api_origin}/uploads/${member.icon}`}></img>
                  </IonThumbnail>
                  <IonLabel>
                    <div>{member.name}</div>
                    <div>{member.tel}</div>
                  </IonLabel>
                </IonItem>
              ))
            : null}
        </IonList>

        <IonModal isOpen={addMemberModal}>
          <IonContent>
            <IonToolbar>
              <IonTitle>新增會員</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  color="dark"
                  onClick={() => setAddMemberModal(false)}
                >
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
            <IonSearchbar
              placeholder="search by name or email"
              onIonInput={(e: any) => setAddMemberSearchState(e.target.value)}
            ></IonSearchbar>
            <IonList>
              {addMemberData
                ? addMemberData.map((member) => (
                    <IonItem key={member.id}>
                      <IonThumbnail slot="start">
                        <img src={`${api_origin}/uploads/${member.icon}`}></img>
                      </IonThumbnail>
                      <IonLabel>
                        <div>{member.name}</div>
                        <div>{member.tel}</div>
                        <div>{member.email}</div>
                      </IonLabel>
                      <IonButtons slot="end">
                        <IonButton onClick={() => addMember(member.id)}>
                          <IonIcon icon={add} />
                        </IonButton>
                      </IonButtons>
                    </IonItem>
                  ))
                : null}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default MyMember;
