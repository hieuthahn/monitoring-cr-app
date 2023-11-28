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
import SmsListener from "react-native-android-sms-listener";

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
        (count, smsList) => {
            var arr = JSON.parse(smsList);
            console.log(":::Message -> ", arr);
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
    } catch (err) {}
}

const SMSListener = () => {
    React.useEffect(() => {
        getSMS();
        requestReadSmsPermission();

        const subscription = SmsListener.addListener((message) => {
            console.info(message);
        });
        return () => {
            subscription.remove();
        };
    }, []);

    return null;
};

export default SMSListener;
