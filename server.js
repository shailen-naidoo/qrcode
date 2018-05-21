const express = require("express");
const { json } = require("express");
const cors = require("cors");
const axios = require("axios");
const r = require("rethinkdb");
const app = express();

let { DATA_RETHINK_HOST: host } = process.env;

app.use(cors());
app.use(json());

app.use("/",express.static(__dirname + "/"));

app.get("/",(req,res) => res.sendFile(__dirname + "/index.html"));

app.post("/generate",async (req,res) => {

    let { user } = req.body;

    let conn = await r.connect({ host, port: 28015, db: "qrcode" });

    let { generated_keys: [ id ] } = await r.table("profiles").insert({ ...user }).run(conn);

    res.json({ id });

});

app.get("/get_profile",async (req,res) => {

    let { id } = req.query;
    
    const conn = await r.connect({ host, port: 28015, db: "qrcode" });

    let profile = await r.table("profiles").get(id).run(conn);

    res.json({ ...profile });

})

app.listen(3000,"0.0.0.0",() => console.log("Server listening on :3000"));