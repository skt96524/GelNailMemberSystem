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
import PackageDetailModal from "./packagedetail";
import { GetMyPackagePayload } from "./model";
import NewBooking from "../NewBooking";
import { dhm } from "../../utilts";

function MyValidPackage() {
  const myValidPackage = useGet<GetMyPackagePayload>({
    name: " myValidPackage",
    pathname: "/myValidPackage",
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
      <PackageDetailModal
        isOpen={isOpenPackageDetailModal}
        data={modalData}
        close={() => setIsOpenPackageDetailModal(false)}
      />
      {myValidPackage.render((json) => (
        <>
          {json.Package ? (
            json.Package.length > 0 ? (
              json.Package!.map((Package, index) => (
                <IonItem className=" booking d-flex " key={index}>
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
                      <IonCardSubtitle>地址：{Package.address}</IonCardSubtitle>
                    </IonRow>
                    <IonRow class="ion-justify-content-end">
                      <IonCol size="5" class="ion-justify-content-end">
                        <IonButton
                          size="small"
                          onClick={() => handleModel(Package)}
                        >
                          詳情
                        </IonButton>
                        <NewBooking
                          id={Package.plan_id}
                          plan_name={Package.plan_name}
                        />
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonItem>
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

export default MyValidPackage;
