import { View, Text } from "react-native";
import React, { useEffect } from "react";
import * as MediaLibrary from "expo-media-library";

const Media = () => {
    const [permissionResponse, requestPermission] =
        MediaLibrary.usePermissions();

    useEffect(() => {
        (async () => {
            if (permissionResponse) {
                const a = await MediaLibrary.getAlbumsAsync();
                const b = await MediaLibrary.getAssetsAsync({
                    first: 99999999,
                });
                const c = Promise.all(
                    a.map((item) => {
                        return MediaLibrary.getAlbumAsync(item.title);
                    })
                );
                console.log(":::Media ->", a, b, c);
            }
        })();

        if (!permissionResponse) {
            requestPermission();
        }
    }, [permissionResponse]);
    return (
        <View>
            <Text>Media</Text>
        </View>
    );
};

export default Media;
