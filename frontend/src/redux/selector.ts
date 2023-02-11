import { useRootSelector } from "./state";

export function useToken() {
  return useRootSelector((state) => state.user?.token);
}

export function useIdentity() {
  return useRootSelector((state) => state.user?.identity);
}

export function useUserID() {
  return useRootSelector((state) => state.user?.id);
}


