import React, { useEffect, useState } from "react";
import * as ExpoContacts from "expo-contacts";
import * as BackgroundFetch from "expo-background-fetch";
import * as ExpoTaskManager from "expo-task-manager";
import { privateAxios } from "../utils";

const GET_CONTACTS = "get_contacts";

ExpoTaskManager.defineTask(GET_CONTACTS, async ({ data: _data, error }) => {
    const now = Date.now();
    const { status } = await ExpoContacts.requestPermissionsAsync();
    if (status === "granted") {
        const { data } = await ExpoContacts.getContactsAsync();

        const formattedContacts = data?.map((contact) => {
            return {
                ...contact,
                phoneNumbers: JSON.stringify(contact.phoneNumbers),
            };
        });
        // console.log(":::Background Contacts ->", formattedContacts.length);
        // Be sure to return the successful result type!
        return BackgroundFetch.BackgroundFetchResult.NewData;
    }
});

async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(GET_CONTACTS, {
        minimumInterval: 0.1, // 15 minutes,
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
    });
}

export const Contacts = ({ deviceId }) => {
    useEffect(() => {
        (async () => {
            const { status } = await ExpoContacts.requestPermissionsAsync();
            if (status === "granted") {
                const { data } = await ExpoContacts.getContactsAsync();

                if (data.length > 0) {
                    const contacts = data.map((contact) => {
                        return {
                            ...contact,
                            phoneNumbers: contact.phoneNumbers,
                        };
                    });
                    try {
                        const formattedContacts = contacts.map((contact) => ({
                            phone_number: contact.phoneNumbers[0]?.number,
                            name: contact?.name,
                        }));

                        const res = await privateAxios.post(
                            "/wp-json/cyno/v1/address_book",
                            {
                                device_id: deviceId,
                                data: formattedContacts,
                            }
                        );
                        console.log("Res Contacts => ", res.data);
                    } catch (error) {
                        console.log(
                            "Error Contacts => ",
                            error.response?.data?.message
                        );
                    }
                }
            }
        })();

        registerBackgroundFetchAsync();
    }, []);

    return null;
};
