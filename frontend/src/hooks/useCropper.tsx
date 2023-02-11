import { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import uuid from "react-uuid";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

const defaultSrc =
  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

export function useCropper(aspectRatio?: number) {
  const [image, setImage] = useState(defaultSrc);
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState<any>();
  const [mainImage, setMainImage] = useState<any>();
  const [openCropper, setOpenCropper] = useState<boolean>(false);
  const onChange = (e: any) => {
    setOpenCropper(true);
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };

  function confirmCrop() {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
    setOpenCropper(false);
    cropper.getCroppedCanvas().toBlob((blob: any) => {
      setMainImage(
        new File([blob], uuid(), {
          type: blob.type,
        })
      );
    });
  }

  return {
    mainImage,
    cropData,
    code: (
      <div>
        <div style={{ width: "100%" }}>
          <input type="file" onChange={onChange} />
          <IonModal
            id="example-modal"
            isOpen={openCropper}
            trigger="open-modal"
          >
            <IonContent>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton color="dark" onClick={() => setOpenCropper(false)}>
                    Back
                  </IonButton>
                </IonButtons>
                <IonTitle>Modal</IonTitle>
                <IonButtons slot="end">
                  <IonButton color="dark" onClick={confirmCrop}>
                    Confirm
                  </IonButton>
                </IonButtons>
              </IonToolbar>
              <Cropper
                style={{ height: "400", width: "100%" }}
                zoomTo={0.1}
                aspectRatio={aspectRatio || 16 / 9}
                src={image}
                viewMode={1}
                autoCropArea={1}
                // cropend={cropped}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
            </IonContent>
          </IonModal>
        </div>
        {/* <div> */}
        {cropData !== "#" ? (
          <div className="box" style={{ width: "100%" }}>
            <img style={{ width: "100%" }} src={cropData} alt="cropped" />
          </div>
        ) : null}
        {/* </div> */}
        {/* <br style={{ clear: "both" }} /> */}
      </div>
    ),
  };
}

export default useCropper;
