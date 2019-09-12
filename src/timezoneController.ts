import request from "request-promise";

const YA_URL = "https://geocode-maps.yandex.ru/1.x";
const G_URL = "https://maps.googleapis.com/maps/api/timezone/json";

const getCoords = async (city: string) => {
    const response = await request({
        json: true,
        qs: {
            apikey: process.env.YA_KEY,
            format: "json",
            geocode: city
        },
        url: YA_URL
    });

    if (!response) {
        throw new Error("Yandex: some error");
    }
    const results = response.response.GeoObjectCollection.featureMember;
    if (!results.length) {
        throw new Error("Unknown city");
    }

    return results[0].GeoObject.Point.pos;
};

const getTimezone = async (coords: string) => {
    const response = await request({
        json: true,
        qs: {
            key: process.env.G_KEY,
            location: coords.split(" ").reverse().join(","),
            timestamp: Math.round(Date.now() / 1000)
        },
        url: G_URL
    });

    if (!response || !response.timeZoneId) {
        throw new Error(response || "GoogleMaps: some error");
    }

    return response.timeZoneId;
};

export const defineTimezone = async (city: string) => {
    const coords = await getCoords(city);
    const timezone = await getTimezone(coords);
    return timezone;
};
