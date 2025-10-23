import { useEffect, useState } from "react"
import axiosApi from "../utlis/axiosApi";

export const getHook = (url: string) => {
    const [ data, setData ] = useState<any>([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            setError(null);

        try {
            const res = await axiosApi.get(url);
            
            setData(res);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [])

    return { data, loading, error }
}