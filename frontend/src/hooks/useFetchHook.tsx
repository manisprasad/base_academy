import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
    method?: HttpMethod;
    body?: any;
    trigger?: any; // use this to manually re-trigger the request
}

export const useFetch = <T = unknown>(
    endPoint: string,
    options: FetchOptions = {}
) => {
    const {
        method = "GET",
        body = null,
        trigger = null, // used to manually re-trigger the request
    } = options;

    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let response;

                switch (method) {
                    case "GET":
                        response = await axiosInstance.get<T>(endPoint);
                        break;
                    case "POST":
                        response = await axiosInstance.post<T>(endPoint, body);
                        break;
                    case "PUT":
                        response = await axiosInstance.put<T>(endPoint, body);
                        break;
                    case "DELETE":
                        response = await axiosInstance.delete<T>(endPoint);
                        break;
                    default:
                        throw new Error("Unsupported HTTP method");
                }

                setData(response.data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endPoint, method, body, trigger]);

    return { data, error, loading };
};
