export const api_origin =
  window.location.origin == "http://localhost:3000"
    ? "http://localhost:8100"
    : "https://gelnailbackend.hardy06.me";

export function handleResponse(promise: Promise<Response>) {
  return promise
    .then((res) => res.json())
    .catch((err) => ({ error: String(err) }));
}

export function post(pathname: string, body: object) {
  let url = api_origin + pathname;
  let token = localStorage.getItem("token");
  let headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  return handleResponse(
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
  );
}

export function upload(pathname: string, formData: FormData) {
  let url = api_origin + pathname;
  let token = localStorage.getItem("token");
  let headers: HeadersInit = {};
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  return handleResponse(
    fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })
  );
}

export async function fetchData(path: string) {
  let token = localStorage.getItem("token");
  let headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  const res = await fetch(api_origin + path, { headers });
  const result = await res.json();

  return result;
}

export async function fetchNonGetData(
  url: string,
  method: "POST" | "PUT" | "DELETE" | "PATCH",
  data: any
) {
  try {
    let token = localStorage.getItem("token");
    let headers: HeadersInit = {
      "content-type": "application/json",
    };

    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }

    const res = await fetch(api_origin + url, {
      method: method,
      headers: headers,
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    return null;
  }
}

export async function uploadToServer(files: File) {
  let formData = new FormData();
  formData.append("image", files);
  return await upload("/contextImg", formData);
}

export function toImageUrl(url: string) {
  if (url.startsWith("http")) return url;
  return api_origin + "/uploads/" + url;
}
