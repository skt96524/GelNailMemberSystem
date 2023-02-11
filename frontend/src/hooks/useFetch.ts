import { api_origin } from "../api";
import { useToken } from "../redux/selector";
import useToast from "./useToast";

export default function useFetch() {
  const token = useToken();

  const toast = useToast();

  async function fetchJSON(
    method: "POST" | "PUT" | "DELETE" | "PATCH",
    url: string,
    body: object
  ) {
    try {
      let res = await fetch(api_origin + url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(body),
      });
      let json = await res.json();
      if (json.error) throw json.error;
      return json;
    } catch (error) {
      toast.showError(String(error));
      return {
        error: String(error),
      };
    }
  }
  async function upload(
    method: "POST" | "PUT" | "DELETE" | "PATCH",
    url: string,
    body: FormData
  ) {
    try {
      let res = await fetch(api_origin + url, {
        method,
        headers: {
          Authorization: "Bearer " + token,
        },
        body,
      });
      let json = await res.json();
      if (json.error) throw json.error;
      return json;
    } catch (error) {
      toast.showError(String(error));
      return {
        error: String(error),
      };
    }
  }
  return { fetchJSON, upload };
}
