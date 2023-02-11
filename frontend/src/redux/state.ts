import { useSelector } from "react-redux"
import jwtDecode from 'jwt-decode'

export type RootState = {
    user?: {
        token: string
        id: number
        identity: "admin" | "shop_owner" | "member"

    }
}

export type JWTPayload = {
    id: number
    identity: "admin" | "shop_owner" | "member"
}
export function initialState(): RootState {
    let token = localStorage.getItem('token')
    return {
        user: token ? decodeToken(token) : undefined
    }
}




export function decodeToken(token: string) {
    let payload: JWTPayload = jwtDecode(token)
    return {
        token,
        id: payload.id,
        identity: payload.identity
    }

}

export function useRootSelector<T>(selector: (state: RootState) => T) {
    return useSelector(selector)
}