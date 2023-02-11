import {
  IonButton,
  IonIcon,
  IonProgressBar,
  IonText,
  useIonViewWillEnter,
} from "@ionic/react";
import { refreshCircleSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import { api_origin, handleResponse } from "../api";
import { useToken } from "../redux/selector";

export default function useGet<T extends { error?: string }>(options: {
  name: string;
  pathname: string;
  query?: Record<string, string>;
  defaultValue: T;
  shouldAutoReload?: true | ((json: T) => boolean);
}) {
  const token = useToken();
  const [state, setState] = useState({
    loading: true,
    payload: options.defaultValue,
  });
  const [nonce, setNonce] = useState(0);

  let urlWithoutQuery = api_origin + options.pathname;
  let url = urlWithoutQuery;

  if (options.query) {
    url =
      urlWithoutQuery +
      "?" +
      new URLSearchParams(Object.entries(options.query));
  }

  function loadMore(offset: number) {
    let url =
      urlWithoutQuery +
      "?" +
      new URLSearchParams(
        Object.entries({ ...options.query, offset: String(offset) })
      );
    let headers: HeadersInit = {};
    if (token) {
      headers.Authorization = "Bearer " + token;
    }

    return handleResponse(
      fetch(url, {
        headers,
      })
    );
  }

  useEffect(() => {
    setState((state) => ({ ...state, loading: true }));

    let abortController = new AbortController();

    let headers: HeadersInit = {};
    if (token) {
      headers.Authorization = "Bearer " + token;
    }

    handleResponse(
      fetch(url, {
        signal: abortController.signal,
        headers,
      })
    ).then((json) => {
      if (json.error?.startsWith("AbortError")) return;
      setState((state) => ({
        ...state,
        loading: false,
        payload: json,
      }));
    });

    return () => {
      abortController.abort();
    };
  }, [url, nonce, token]);

  useIonViewWillEnter(() => {
    if (!options.shouldAutoReload) return;

    if (
      typeof options.shouldAutoReload === "function" &&
      !options.shouldAutoReload(state.payload)
    )
      return;

    reload();
  }, [options.shouldAutoReload]);

  function render(renderFn: (json: T) => any) {
    if (state.loading) {
      return (
        <div className="ion-text-center">
          <p>Loading {options.name}...</p>
          <IonProgressBar></IonProgressBar>
        </div>
      );
    }
    if (state.payload.error) {
      return (
        <div className="ion-text-center ion-margin">
          <div>Failed to load {options.name}:</div>
          <p>
            <IonText color="danger">{state.payload.error}</IonText>
          </p>
          <IonButton onClick={reload}>
            <IonIcon slot="start" icon={refreshCircleSharp}></IonIcon>
            Retry
          </IonButton>
        </div>
      );
    }

    return renderFn(state.payload);
  }

  function reload() {
    setNonce((nonce) => nonce + 1);
  }

  return { state, setState, render, reload, loadMore };
}
