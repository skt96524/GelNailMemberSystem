import { upload } from "../api";
import useToast from "./useToast";

export default function useUpload() {
  const toast = useToast();

  return async function (
    pathname: string,
    formData: FormData,
    cb: (json: any) => void
  ) {
    let json = await upload(pathname, formData);
    if (json.error) {
      return toast.showError(json.error);
    }
    cb(json);
  };
}
