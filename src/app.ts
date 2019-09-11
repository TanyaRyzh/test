import express from "express";
import { defineTimezone } from "./timezoneController";

const app = express();
const port = 8080;

app.get("/timezone/:city", async (req, res) => {
    try {
        const result = await defineTimezone(req.params.city);

        res.send(result);
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error.message);
        res.status(400).send(error.message);
    }
});

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
