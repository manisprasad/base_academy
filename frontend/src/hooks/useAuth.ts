import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export const  useAuth = () => {
    const auth = useContext(AuthContext)
    if(!auth){
        throw new Error("useAuth must be inside AuthProvider");
    }

    return auth;
}
