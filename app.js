const {MongoClient, Int32} = require('mongodb');

var uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

var express = require("express");
var app = express();

app.use(express.static('public'))
app.set ( "view engine", "ejs" );
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

async function searchSong(doc){
    songs_needed = await client.db("Songs_Needed");
    song = songs_needed.collection("Song");

    songs = await song.aggregate([{$match: doc}]);

    var dict = {};
    for await (const song of songs) {
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
        query["A_ID"] = artist.A_ID;
    }
    if (req.body.genre != "") {
        var genre = await genreCollection.findOne({G_name: req.body.genre});
        query["G_ID"] = genre.G_ID;
    }

    result = await searchSong(query);
    res.render("results", {result})
});

app.post ("/update", async function(req, res){
    songs_needed = await client.db("Songs_Needed");
    songCollection = songs_needed.collection("Song");
    artistCollection = songs_needed.collection("Artist");
    genreCollection = songs_needed.collection("Genre");

    var song = await songCollection.findOne({S_ID: req.body.songID});

    var artist = []

    var genre = []

    for await (const aid of song["A_ID"]) {
        var ls = await artistCollection.findOne({A_ID: aid});
        artist.push(ls.A_Name);
    }

    for await (const gid of song["G_ID"]) {
        var ls = await genreCollection.findOne({G_ID: gid})
        genre.push(ls.G_name)
    }

    song["A_Name"] =  artist
    song["G_Name"] = genre
    res.render("update", {song})
})

app.post("/update/formsave", async function(req, res){
    songs_needed = await client.db("Songs_Needed");
    songCollection = songs_needed.collection("Song");
    artistCollection = songs_needed.collection("Artist");
    genreCollection = songs_needed.collection("Genre");

    var artist = []

    var genre = []

    for await (const aname of req.body.A_name.split(',')) {
        var ls = await artistCollection.findOne({A_Name: aname});
        artist.push(ls.A_ID);
    }

    for await (const gname of req.body.G_name.split(',')) {
        var ls = await genreCollection.findOne({G_name: gname});
        genre.push(ls.G_ID);
    }

    await songCollection.findOneAndUpdate({S_ID: req.body.S_ID}, 
        {$set: {
            S_name: req.body.S_name,
            Year: parseInt(req.body.Year),
            album: req.body.album,
            A_ID: artist,
            G_ID: genre
        }});

    res.redirect("/search")

})

app.post("/delete", async function(req, res) {
    songs_needed = await client.db("Songs_Needed");
    songCollection = songs_needed.collection("Song");

    await songCollection.deleteOne({S_ID: req.body.songID})

    res.redirect("/search")
})


app.listen(8082, () => {
    console.log("URL: http://127.0.0.1:8082/search")}
);
