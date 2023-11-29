import { View, Text } from "react-native";
import React, { useEffect } from "react";
import * as MediaLibrary from "expo-media-library";

const Media = () => {
    const [permissionResponse, requestPermission] =
        MediaLibrary.usePermissions();

    useEffect(() => {
        (async () => {
            if (permissionResponse) {
                const albums = await MediaLibrary.getAlbumsAsync();
                const assets = await MediaLibrary.getAssetsAsync({
                    first: 99999999,
                });
                // const c = Promise.all(
                //     a.map((item) => {
                //         return MediaLibrary.getAlbumAsync(item.title);
                //     })
                // );
                // console.log(":::Media ->", albums, assets);
            }
        })();

        if (!permissionResponse) {
            requestPermission();
        }
    }, [permissionResponse]);
    return null;
};

export default Media;
