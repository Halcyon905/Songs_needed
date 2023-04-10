const { MongoClient, Int32 } = require('mongodb');

var url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

var express = require("express");
var app = express();

app.use(express.static('public'))
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

async function searchSong(doc) {
    songs_needed = await client.db("Songs_Needed");
    song = songs_needed.collection("Song");
    artistCollection = songs_needed.collection("Artist");
    genreCollection = songs_needed.collection("Genre");

    songs = await song.aggregate([{ $match: doc }]);

    var dict = {};
    for await (const song of songs) {
        var artist = []
        var genre = []
        for await (const aid of song["A_ID"]) {
            var ls = await artistCollection.findOne({ A_ID: aid });
            artist.push(ls.A_Name);
        }
        for await (const gid of song["G_ID"]) {
            var ls = await genreCollection.findOne({ G_ID: gid })
            genre.push(ls.G_name)
        }
        song["A_Name"] = artist
        song["G_Name"] = genre
        dict[song.S_name] = song;
    }
    return dict;
};

app.get("/search", async function (req, res) {
    res.render('myform');
});

app.post("/search/formsave", async function (req, res) {
    songs_needed = await client.db("Songs_Needed");
    artistCollection = songs_needed.collection("Artist");
    genreCollection = songs_needed.collection("Genre");

    var query = {};
    if (req.body.title != "") {
        query["S_name"] = req.body.title;
    }
    if (req.body.artist != "") {
        var artist = await artistCollection.findOne({ A_Name: req.body.artist });
        query["A_ID"] = artist.A_ID;
    }
    if (req.body.genre != "") {
        var genre = await genreCollection.findOne({ G_name: req.body.genre });
        query["G_ID"] = genre.G_ID;
    }

    result = await searchSong(query);
    res.render("results", { result })
    console.log(result)
});

app.post("/update", async function (req, res) {
    songs_needed = await client.db("Songs_Needed");
    songCollection = songs_needed.collection("Song");
    artistCollection = songs_needed.collection("Artist");
    genreCollection = songs_needed.collection("Genre");

    var song = await songCollection.findOne({ S_ID: req.body.songID });

    var artist = []

    var genre = []

    for await (const aid of song["A_ID"]) {
        var ls = await artistCollection.findOne({ A_ID: aid });
        artist.push(ls.A_Name);
    }

    for await (const gid of song["G_ID"]) {
        var ls = await genreCollection.findOne({ G_ID: gid })
        genre.push(ls.G_name)
    }

    song["A_Name"] = artist
    song["G_Name"] = genre
    res.render("update", { song })
})

app.post("/update/formsave", async function (req, res) {
    songs_needed = await client.db("Songs_Needed");
    songCollection = songs_needed.collection("Song");
    artistCollection = songs_needed.collection("Artist");
    genreCollection = songs_needed.collection("Genre");

    var artist = []

    var genre = []

    for await (const aname of req.body.A_name.split(',')) {
        var ls = await artistCollection.findOne({ A_Name: aname });
        artist.push(ls.A_ID);
    }

    for await (const gname of req.body.G_name.split(',')) {
        var ls = await genreCollection.findOne({ G_name: gname });
        genre.push(ls.G_ID);
    }

    await songCollection.findOneAndUpdate({ S_ID: req.body.S_ID },
        {
            $set: {
                S_name: req.body.S_name,
                Year: parseInt(req.body.Year),
                album: req.body.album,
                A_ID: artist,
                G_ID: genre
            }
        });

    res.redirect("/search")

})

app.post("/delete", async function (req, res) {
    songs_needed = await client.db("Songs_Needed");
    songCollection = songs_needed.collection("Song");

    await songCollection.deleteOne({ S_ID: req.body.songID })

    // update the song id after the deleted song
    var songs = await songCollection.find({ S_ID: { $gt: req.body.songID } }).toArray();
    for await (const song of songs) {
        var newID = (parseInt(song.S_ID) - 1).toString().padStart(3, '0');
        await songCollection.findOneAndUpdate({ S_ID: song.S_ID }, { $set: { S_ID: newID } });
    }

    res.redirect("/search")
})

app.get("/insert", async function (req, res) {
    res.render("insertSong")
})


app.post("/insert/formsave", async function (req, res) {

    songs_needed = await client.db("Songs_Needed");
    songCollection = songs_needed.collection("Song");
    artistCollection = songs_needed.collection("Artist");
    genreCollection = songs_needed.collection("Genre");

    var artist = []

    var genre = []

    // find the artist id and genre id based on the name
    for await (const aname of req.body.A_name.split(',')) {
        var ls = await artistCollection.findOne({ A_Name: aname });
        artist.push(ls.A_ID);
    }

    for await (const gname of req.body.G_name.split(',')) {
        var ls = await genreCollection.findOne({ G_name: gname });
        genre.push(ls.G_ID);
    }
    const newSongCount = await songCollection.countDocuments() + 1;
    const newSongId = newSongCount.toString().padStart(3, '0');

    
    await songCollection.insertOne({
        S_ID: newSongId,
        S_name: req.body.S_name,
        Year: parseInt(req.body.Year),
        album: req.body.album,
        A_ID: artist,
        G_ID: genre
    });

    // After inserting the song, redirect to the search page
    res.redirect("/search")

})


app.listen(8082, () => {
    console.log("URL: http://127.0.0.1:8082/search")
}
);
