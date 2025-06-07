import React, { createContext, useEffect, useState } from "react";
import {type  UserInfo } from "@/types/user";
import {type AuthContextType } from "@/types/user";
import { axiosInstance } from "@/api/axios";



export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axiosInstance.get("/me");
        console.log(res)
        setUserInfo(res.data.UserInfo.UserInfo);
      } catch {
        // Try refresh if access token expired
        try {
          await axiosInstance.get("/refresh",);
          const res = await axiosInstance.get("/me");
          setUserInfo(res.data.user);
        } catch {
          setUserInfo(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{user: userInfo, loading, setUser: setUserInfo}}>
      {children}
    </AuthContext.Provider>
  );
};
