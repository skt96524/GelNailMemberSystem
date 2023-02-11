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
                          預約取消期限：{dhm(Package.due_period)}天前
                        </IonCardSubtitle>
                      </IonRow>
                      <IonRow>
                        <IonCardSubtitle>
                          地址：{Package.address}
                        </IonCardSubtitle>
                      </IonRow>
                      <IonRow class="ion-justify-content-end">
                        <IonCol size="5" class="ion-justify-content-end">
                          <IonButton
                            size="small"
                            onClick={() => handleModel(Package)}
                          >
                            詳情
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                </>
              ))
            ) : (
              <div>沒有套票</div>
            )
          ) : (
            <div>沒有套票</div>
          )}
        </>
      ))}
    </>
  );
}

export default MyInvalidPackage;
