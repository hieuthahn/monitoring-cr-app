import { format } from "date-fns";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const convertFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "yyyy-MM-dd HH:mm:ss");
};

export const privateAxios = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});

privateAxios.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync("token");

    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});
