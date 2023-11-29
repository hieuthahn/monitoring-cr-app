import { useEffect } from "react";
import { View, Text } from "react-native";
import { PermissionsAndroid } from "react-native";
import CallLogs from "react-native-call-log";
import { privateAxios } from "../utils";

const CallLog = ({ deviceId }) => {
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
                CallLogs.load(500).then(async (calls) => {
                    try {
                        const formattedCallLog = calls.map((call) => ({
                            phone_number: call?.phoneNumber,
                            name: call?.name,
                            duration: call?.duration,
                            date_time: call?.timestamp,
                        }));
                        const res = await privateAxios.post(
                            "/wp-json/cyno/v1/call_history",
                            {
                                device_id: deviceId,
                                data: formattedCallLog,
                            }
                        );
                        console.log("Res CallLog => ", res.data);
                    } catch (error) {
                        console.log(
                            "Error CallLog => ",
                            error.response?.data?.message
                        );
                    }
                });
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
