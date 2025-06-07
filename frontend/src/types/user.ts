
export type UserInfo = {
    userId: string,
    name: string,
    roles: number
}

export type AuthContextType = {
    user: UserInfo | null,
    loading: boolean,
    setUser: (user:UserInfo | null) => void;
}


