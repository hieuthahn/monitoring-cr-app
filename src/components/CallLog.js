import { useEffect } from "react";
import { View, Text } from "react-native";
import { PermissionsAndroid } from "react-native";
import CallLogs from "react-native-call-log";

const CallLog = ({ onGetCallLog = () => {} }) => {
    const getCallLog = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                {
                    title: "Call Log",
                    message: "Access your call logs",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                CallLogs.load(100).then((c) => onGetCallLog(c));
            } else {
                console.log(":::Call Log permission denied");
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getCallLog();
    }, []);

    return null;
};

export default CallLog;
