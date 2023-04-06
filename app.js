const {MongoClient} = require('mongodb');

var uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

var express = require("express");
var app = express();

app.set ( "view engine", "ejs" );
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

async function searchSong(doc){
    songs_needed = await client.db("Songs_Needed");
    song = songs_needed.collection("Song");

    test = await song.aggregate([{$match: doc}]);

    var dict = {};
    for await (const song of test) {
        dict[song.S_name] = song;
    }
    return dict;
};

app.get ("/search", async function(req, res) {
    res.render('myform');
});

app.post ("/search/formsave", async function(req, res) {
    songs_needed = await client.db("Songs_Needed");
    artistCollection = songs_needed.collection("Artist");
    genreCollection = songs_needed.collection("Genre");

    var query = {};
    if (req.body.title != "") {
        query["S_name"] = req.body.title;
    }
    if (req.body.artist != "") {
        var artist = await artistCollection.findOne({A_Name: req.body.artist});
        console.log(artist);
        query["A_ID"] = artist.A_ID;
    }
    if (req.body.genre != "") {
        var genre = await genreCollection.findOne({G_name: req.body.genre});
        query["G_ID"] = genre.G_ID;
    }

    result = await searchSong(query);
    res.send(result);
});

app.listen(8082, "127.0.0.1", () => {
    console.log("URL: http://127.0.0.1:8082/search")}
    );
