import { useState } from "react";

import {
  IonItem,
  IonButton,
  IonCardSubtitle,
  IonCardTitle,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/react";
import useGet from "../../hooks/useGet";
import InvalidPackageDetailModal from "./packagedetailInvalid";
import { GetMyPackagePayload } from "./model";
import { dhm } from "../../utilts";

function MyInvalidPackage() {
  const myInvalidPackage = useGet<GetMyPackagePayload>({
    name: " myInvalidPackage",
    pathname: "/myInvalidPackage",
    defaultValue: {},
  });

  const [isOpenPackageDetailModal, setIsOpenPackageDetailModal] =
    useState(false);

  const [modalData, setModalData] = useState({});
  function handleModel(data: any) {
    setModalData(data);
    setIsOpenPackageDetailModal(true);
  }

  return (
    <>
      <InvalidPackageDetailModal
        isOpen={isOpenPackageDetailModal}
        data={modalData}
        close={() => setIsOpenPackageDetailModal(false)}
      />
      {myInvalidPackage.render((json) => (
        <>
          {json.Package ? (
            json.Package.length > 0 ? (
              json.Package!.map((Package, index) => (
                <>
                  <IonItem className=" booking d-flex ">
                    <IonGrid>
                      <IonRow>
                        <IonCol size="auto">
                          <IonCardSubtitle>
                            {new Date(Package.due_time as any).toLocaleString()}
                          </IonCardSubtitle>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <IonCardTitle>{Package.plan_name}</IonCardTitle>
                        </IonCol>
                        <IonCol size="auto">
                          <IonCardTitle>${Package.price}</IonCardTitle>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCardSubtitle>
                          remain: {Package.remain}/{Package.package_qty}
                        </IonCardSubtitle>
                      </IonRow>
                      <IonRow>
                        <IonCardSubtitle>
                          ?????????????????????{dhm(Package.due_period)}??????
                        </IonCardSubtitle>
                      </IonRow>
                      <IonRow>
                        <IonCardSubtitle>
                          ?????????{Package.address}
                        </IonCardSubtitle>
                      </IonRow>
                      <IonRow class="ion-justify-content-end">
                        <IonCol size="5" class="ion-justify-content-end">
                          <IonButton
                            size="small"
                            onClick={() => handleModel(Package)}
                          >
                            ??????
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                </>
              ))
            ) : (
              <div>????????????</div>
            )
          ) : (
            <div>????????????</div>
          )}
        </>
      ))}
    </>
  );
}

export default MyInvalidPackage;
