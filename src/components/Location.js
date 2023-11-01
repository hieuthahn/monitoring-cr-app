import React, { useState, useEffect } from "react";
import * as ExpoLocation from "expo-location";
import * as ExpoTaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";
ExpoTaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log("locations error ->", error);

    return;
  }
  if (data) {
    const { locations } = data;
    console.log(":::Locations ->", locations);
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

export const Location = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  return children({ location, errorMsg });
};
