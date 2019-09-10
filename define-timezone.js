const request = require('request');

const YA_KEY = '82c5857e-e64f-4d8f-80f7-bc82a48cf377';
const YA_URL = 'https://geocode-maps.yandex.ru/1.x';

const G_KEY = 'AIzaSyB_L8NHHUgviHDXajsF3A_nF-QXPWAIoRA';
const G_URL = 'https://maps.googleapis.com/maps/api/timezone/json';

async function getCoords(city) {
    return new Promise(resolve => {
        request({
            url: YA_URL,
            qs: {
                geocode: city,
                apikey: YA_KEY,
                format: "json"
            }
        }, (error, response, body) => {
            if (!response || error) {
                resolve({ err: "Some error" });
            }

            if (response.statusCode === 429) {
                resolve({ err: "Too many attempts. Try later" });
            }

            const results = JSON.parse(body).response.GeoObjectCollection.featureMember;
            if (results.length !== 1) {
                resolve({ err: "Please, clarify city" });
            }

            resolve({ res: results[0].GeoObject.Point.pos });
        })
    });
}

async function getTimezone(coords) {
    return new Promise(resolve => {
        request({
            url: G_URL,
            qs: {
                location: coords.split(' ').join(','),
                timestamp: ~~(Date.now() / 1000),
                key: G_KEY
            }
        }, (error, response, body) => {
            if (!response || error) {
                resolve({ err: "Some error" });
            }

            if (response.statusCode === 429) {
                resolve({ err: "Too many attempts. Try later" });
            }

            resolve({ res: JSON.parse(body).timeZoneId });
        })
    });
}


async function defineTimezone(city) {
    if (!city) {
        return "Please, set a city";
    }

    const coords = await getCoords(city);
    if (coords.err) {
        return coords.err;
    }

    const timezone = await getTimezone(coords.res);
    if (timezone.err) {
        return timezone.err;
    }

    return timezone.res;
}

module.exports = defineTimezone;