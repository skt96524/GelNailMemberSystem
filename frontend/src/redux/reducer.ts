import { RootAction } from "./actions"
import { RootState, initialState, decodeToken } from "./state"


export function rootReducer(
    state: RootState = initialState(),
    action: RootAction,
): RootState {
    switch (action.type) {
        case 'login':
            return {
                user: decodeToken(action.token)
            }
        case 'logout':
            return {
                user: undefined
            }
        case 'signup':
            return {
                user: decodeToken(action.token)
            }


        default:
            return state
    }

}