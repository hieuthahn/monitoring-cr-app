import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Location, Contacts } from "../components";
import * as ExpoTaskManager from "expo-task-manager";
import CallLog from "../components/CallLog";
import SMSListener from "../components/SMSListener";
import Media from "../components/Media";

const TASK_MANAGER_NAME = {
    GET_CONTACTS: "GET_CONTACTS",
    LOCATION_TASK_NAME: "background-location-task",
};

const Home = () => {
    useEffect(() => {
        (async () => {
            const res = await ExpoTaskManager.getRegisteredTasksAsync();
            // console.log("getRegisteredTasksAsync", res);
        })();
    }, []);

    return (
        <View>
            <Text>Home</Text>
            <Contacts>
                {({ contacts }) => {
                    // console.log(contacts);
                    return null;
                }}
            </Contacts>
            <Location>
                {({ location, errorMsg }) => {
                    // console.log("location:::", location);
                    // console.log("errorMsg:::", errorMsg);
                    return null;
                }}
            </Location>
            <CallLog />
            <SMSListener />
            <Media />
        </View>
    );
};

export default Home;
