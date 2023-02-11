import { IonButton, IonButtons, IonIcon, useIonAlert } from "@ionic/react";
import { bookmark, bookmarkOutline, heart, heartOutline } from "ionicons/icons";
import { useState } from "react";
import { fetchData, fetchNonGetData } from "../api";
import "./useLikeCollect.css";

function useLikeCollection(
  type: string,
  users_id: number | undefined,
  id: string,
  updateLikedQty?: (num: number) => void
) {
  const [presentAlert] = useIonAlert();
  const [liked, setLiked] = useState<boolean>(false);
  const [collected, setCollected] = useState<boolean>(false);

  function alertFunction(header: string, message: string, subHeader?: string) {
    presentAlert({
      header: header,
      message: message,
      subHeader: subHeader || "Important message",
      buttons: ["OK"],
    });
  }

  if (users_id) {
    getPerformance("/" + "performance" + type, id);
  }

  async function getPerformance(path: string, id: string) {
    let performance = await fetchData(`${path}/${id}`);
    if (performance.like_id) {
      setLiked(true);
    }
    if (performance.collection_id) {
      setCollected(true);
    }
    if (!performance.like_id) {
      setLiked(false);
    }
    if (!performance.collection_id) {
      setCollected(false);
    }
  }
  async function likeFunction(props: {
    name: string;
    pathname: string;
    data: { users_id: number | undefined; id: string };
  }) {
    let { name, pathname, data } = props;
    if (!data.users_id) {
      alertFunction("FAILED", "PLEASE LOGIN FIRST!");
      return;
    }
    if (!liked) {
      let result = await fetchNonGetData(pathname, "POST", {
        users_id: data.users_id,
        id: data.id,
      });
      if (result.success) {
        if (updateLikedQty) {
          updateLikedQty(1);
        }
        setLiked(true);
      } else {
        alertFunction("FAILED", `FAILED TO LIKE THE ${name}!`);
      }
    } else {
      let result = await fetchNonGetData(pathname, "DELETE", {
        users_id: data.users_id,
        id: data.id,
      });
      if (result.success) {
        if (updateLikedQty) {
          updateLikedQty(-1);
        }
        setLiked(false);
      } else {
        alertFunction("FAILED", `FAILED TO UNLIKE THE ${name}!`);
      }
    }
    return;
  }

  async function collectFunction(props: {
    name: string;
    pathname: string;
    data: { users_id: number | undefined; id: string };
  }) {
    let { name, pathname, data } = props;
    if (!data.users_id) {
      alertFunction("FAILED", "PLEASE LOGIN FIRST!");
      return;
    }
    if (!collected) {
      let result = await fetchNonGetData(pathname, "POST", {
        users_id: data.users_id,
        id: data.id,
      });
      if (result.success) {
        setCollected(true);
      } else {
        alertFunction("FAILED", `FAILED TO COLLECT THE ${name}!`);
      }
    } else {
      let result = await fetchNonGetData(pathname, "DELETE", {
        users_id: data.users_id,
        id: data.id,
      });
      if (result.success) {
        setCollected(false);
      } else {
        alertFunction("FAILED", `FAILED TO UNCOLLECTED THE ${name}!`);
      }
    }
    return;
  }

  function onUseLikeFunction() {
    if (!users_id) {
      alertFunction("FAILED", "PLEASE LOGIN FIRST!");
      return;
    }
    likeFunction({
      name: type,
      pathname: "/like" + type,
      data: { users_id, id },
    });
  }

  function onUseCollectFunction() {
    if (!users_id) {
      alertFunction("FAILED", "PLEASE LOGIN FIRST!");
      return;
    }
    collectFunction({
      name: type,
      pathname: "/collect" + type,
      data: { users_id, id },
    });
  }

  return {
    liked,
    collected,
    likeCode: (
      <IonButtons className="display-inline">
        <IonButton onClick={onUseLikeFunction} fill="clear">
          <IonIcon
            slot="icon-only"
            color="danger"
            size={"default"}
            icon={liked ? heart : heartOutline}
          />
        </IonButton>
      </IonButtons>
    ),
    collectCode: (
      <IonButtons className="display-inline">
        <IonButton fill="clear" onClick={onUseCollectFunction}>
          <IonIcon
            color="primary"
            size={"default"}
            slot="icon-only"
            icon={collected ? bookmark : bookmarkOutline}
          ></IonIcon>
        </IonButton>
      </IonButtons>
    ),
    getPerformance,
    alertFunction,
    likeFunction,
    collectFunction,
  };
}

export default useLikeCollection;
