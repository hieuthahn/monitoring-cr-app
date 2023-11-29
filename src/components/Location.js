import React, { useState, useEffect } from "react";
import * as ExpoLocation from "expo-location";
import * as ExpoTaskManager from "expo-task-manager";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { convertFromTimestamp, privateAxios } from "../utils";

const LOCATION_TASK_NAME = "background-location-task";

ExpoTaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        // Error occurred - check `error.message` for more details.
        console.log("locations error ->", error);

        return;
    }
    if (data) {
        const deviceId = await SecureStore.getItemAsync("device_id");
        const { locations } = data;
        try {
            const location = locations[0];
            const lat = location.coords.latitude;
            const long = location.coords.longitude;
            const locationFromGeo = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=true&key=${process.env.EXPO_PUBLIC_GEO_API_KEY}`
            );
            const formattedLocations = {
                lng_long: `${lat} ${long}`,
                location: locationFromGeo.data?.plus_code?.compound_code,
                date_time: convertFromTimestamp(location.timestamp),
            };
            const res = await privateAxios.post("/wp-json/cyno/v1/location", {
                device_id: deviceId,
                data: formattedLocations,
            });
            console.log("Res Locations => ", res.data);
        } catch (error) {
            console.log("Error Locations => ", error.response?.data?.message);
        }
        // do something with the locations captured in the background
    }
});

const requestPermissions = async () => {
    const { status: foregroundStatus } =
        await ExpoLocation.requestForegroundPermissionsAsync();
    if (foregroundStatus === "granted") {
        const { status: backgroundStatus } =
            await ExpoLocation.requestBackgroundPermissionsAsync();
        if (backgroundStatus === "granted") {
            await ExpoLocation.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                accuracy: ExpoLocation.Accuracy.Highest,
                distanceInterval: 1,
                showsBackgroundLocationIndicator: false,
            });
        }
    }
};

export const Location = () => {
    useEffect(() => {
        requestPermissions();
    }, []);

    return null;
};
