const {MongoClient} = require('mongodb');

var uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

var express = require("express");
var app = express();

async function searchSong(client, doc){
    songs_needed = await client.db("Songs_Needed");
    song = songs_needed.collection("Song");

    test = await song.aggregate([{$match : {G_ID: doc}}]);

    var dict = {};
    for await (const song of test) {
        dict[song.S_name] = song;
    }
    return dict;
};

app.get ("/search", async function(req, res) {
    await client.connect();
    result = await searchSong(client, "01");

    res.send(result);
});

app.listen(8082, "127.0.0.1", () => {
    console.log("URL: http://127.0.0.1:8082/search")}
    );
