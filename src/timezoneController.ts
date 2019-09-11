import request from "request-promise";

const YA_KEY = "82c5857e-e64f-4d8f-80f7-bc82a48cf377";
const YA_URL = "https://geocode-maps.yandex.ru/1.x";

const G_KEY = "AIzaSyB_L8NHHUgviHDXajsF3A_nF-QXPWAIoRA";
const G_URL = "https://maps.googleapis.com/maps/api/timezone/json";

async function getCoords(city: string) {
    try {
        const response = await request({
            qs: {
                apikey: YA_KEY,
                format: "json",
                geocode: city
            },
            url: YA_URL
        });

        if (!response) {
            throw new Error("Yandex: some error");
        }
        const results = JSON.parse(response).response.GeoObjectCollection.featureMember;

        if (!results.lenght) {
            throw new Error("Unknown city");
        }

        return results[0].GeoObject.Point.pos;
    } catch (error) {
        throw error;
    }
}

async function getTimezone(coords: string) {
    try {
        const response = await request({
            qs: {
                key: G_KEY,
                location: coords.split(" ").join(","),
                timestamp: Math.round(Date.now() / 1000)
            },
            url: G_URL
        });

        if (!response) {
            throw new Error("GoogleMaps: some error");
        }

        const responseObj = JSON.parse(response);

        if (!responseObj.timeZoneId) {
            throw new Error("GoogleMaps: some error");
        }

        return responseObj.timeZoneId;
    } catch (error) {
        throw error;
    }
}

export async function defineTimezone(city: string) {
    try {
        const coords = await getCoords(city);
        const timezone = await getTimezone(coords);
        return timezone;
    } catch (error) {
        throw error;
    }
}
