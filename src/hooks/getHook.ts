import { useEffect, useState, useCallback } from "react";
import axiosApi from "../utlis/axiosApi";

export const getHook = (url: string) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
        const res = await axiosApi.get(url);
        setData(res);
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
