import React, { useEffect, useState } from "react";
import * as ExpoContacts from "expo-contacts";
import * as BackgroundFetch from "expo-background-fetch";
import * as ExpoTaskManager from "expo-task-manager";

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
        console.log(":::Contacts ->", formattedContacts);
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

export const Contacts = ({ children }) => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        (async () => {
            const { status } = await ExpoContacts.requestPermissionsAsync();
            if (status === "granted") {
                const { data } = await ExpoContacts.getContactsAsync();

                if (data.length > 0) {
                    const formattedContacts = data.map((contact) => {
                        return {
                            ...contact,
                            phoneNumbers: contact.phoneNumbers,
                        };
                    });
                    console.log(
                        ":::useEffect formattedContacts ->",
                        formattedContacts
                    );
                    setContacts(formattedContacts);
                }
            }
        })();

        registerBackgroundFetchAsync();
    }, []);

    return children({ contacts });
};
