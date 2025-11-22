import { useState } from "react";
import type { AxiosResponse } from "axios";
import axiosApi from "../utlis/axiosApi"; 

export const usePost = <TResponse, TBody>(url: string) => {
    const [data, setData] = useState<TResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (body: TBody): Promise<TResponse | null> => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response: AxiosResponse<TResponse> = await axiosApi.post(url, body);
            setData(response.data);
            return response.data; 
        } catch (err: any) {
            const errorMessage = 
                err.response?.data?.message || 
                err.message ||                 
                "Ocurrió un error inesperado";
            
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, execute };
};