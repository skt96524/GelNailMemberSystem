export function loginAction(token: string) {
    return {
        type: 'login' as const,
        token,
    }
}

export function signupAction(token: string) {
    return {
        type: 'signup' as const,
        token,
    }
}



export function logoutAction() {
    return {
        type: 'logout' as const,
    }
}

export type RootAction = ReturnType<typeof loginAction>
    | ReturnType<typeof loginAction>
    | ReturnType<typeof logoutAction>
    | ReturnType<typeof signupAction>
