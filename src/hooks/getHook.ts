import { useEffect, useState, useCallback } from "react";
import axiosApi from "../utlis/axiosApi";
import type { AxiosResponse } from "axios";

export const getHook = <TResponse>(url: string) => {
    const [data, setData] = useState<TResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
        const res: AxiosResponse<TResponse> = await axiosApi.get(url);
        setData(res.data);
        } catch (err: any) {
        setError(err.message || "Error al obtener datos");
        } finally {
        setLoading(false);
        }
    }, [url]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);


    return { data, loading, error, refetch: fetchData };
};
