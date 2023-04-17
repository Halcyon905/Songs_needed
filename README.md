# Songs_needed

## Instructions

In order to use this UI for managing and collecting data, you will need to complete the following steps in mongosh.

### Create database.
```
use Songs_Needed
```
For this command, MongDB will automatically create the database name "Songs_Needed"

### Create Collections.
```
db.createCollection("Song")
db.createCollection("Artist")
db.createCollection("Genre")
```

### Insert some data.
* For `Songs Collection`
```
db.Song.insertMany([
        {
            "S_ID": "001",
            "S_name": "7 Years",
            "Year": 2015,
            "album": "Lukas Graham (Blue Album)",
            "A_ID": ["123"],
            "G_ID": ["01"]
        },
        {
            "S_ID": "002",
            "S_name": "Perfect",
            "Year": 2017,
            "album": "Divide",
            "A_ID": ["204"],
            "G_ID": ["01"] 
        },
        {
            "S_ID": "003",
            "S_name": "Payphone",
            "Year": 2012,
            "album": "Overexposed",
            "A_ID": ["105"],
            "G_ID": ["01"] 
        },
        {
            "S_ID": "004",
            "S_name": "祝福",
            "Year": 2022,
            "album": "祝福",
            "A_ID": ["996"],
            "G_ID": ["02"] 
        },
        {
            "S_ID": "005",
            "S_name": "Resist",
            "Year": 2005,
            "album": "Lipta",
            "A_ID": ["357"],
            "G_ID": ["01"] 
        },
        {
            "S_ID": "006",
            "S_name": "Wishing",
            "Year": 2020,
            "album": "HIGECORE! HIGEDRIVER BEST in KADOKAWA ANISON",
            "A_ID": ["224"],
            "G_ID": ["02"] 
        },
        {
            "S_ID": "007",
            "S_name": "Happy Ending",
            "Year": 2020,
            "album": "Best of The Year 2020",
            "A_ID": ["111"],
            "G_ID": ["01"]  
        },
        {
            "S_ID": "008",
            "S_name": "Eien Pressure",
            "Year": 2022,
            "album": "Eien Pressure (ผูกพันนิรันดร์)",
            "A_ID": ["48"],
            "G_ID": ["02"]  
        },
        {
            "S_ID": "009",
            "S_name": "The Beginning",
            "Year": 2013,
            "album": "Jinsei × Boku =",
            "A_ID": ["241"],
            "G_ID": ["02", "04"]  
        },
        {
            "S_ID": "010",
            "S_name": "Kyouran Hey Kids!!",
            "Year": 2016,
            "album": "The Oral Cigarettes",
            "A_ID": ["431"],
            "G_ID": ["02", "04"]  
        }
    ])
```

* For `Artist Collection`
```
db.Artist.insertMany([
  {"A_ID": "123","A_Name" : "Lukas Graham"},
  {"A_ID": "204","A_Name" : "Ed Sheeran"},
  {"A_ID": "105","A_Name" : "Maroon 5"},
  {"A_ID": "996","A_Name" : "YOASOBI"},
  {"A_ID": "357","A_Name" : "Lipta"},
  {"A_ID": "224","A_Name" : "Inori Minase"},
  {"A_ID": "111","A_Name" : "Pop pongkool"},
  {"A_ID": "48", "A_Name" : "CGM48"},
  {"A_ID": "241","A_Name" : "ONE OK ROCK"},  
  {"A_ID": "431","A_Name" : "Oral Cigarettes"}
])
```

* For `Genre Collection`
```
db.Genre.insertMany([
 {"G_ID": "01", "G_name": "Pop"},
 {"G_ID": "02", "G_name": "Jpop"},
 {"G_ID": "03", "G_name": "EDM"},
 {"G_ID": "04", "G_name": "Rock"},
 {"G_ID": "05", "G_name": "Indie"},
 {"G_ID": "06", "G_name": "Jazz"},
 {"G_ID": "07", "G_name": "Luk tung"},
 {"G_ID": "08", "G_name": "Electro rock"},
 {"G_ID": "09", "G_name": "country"},
 {"G_ID": "10", "G_name": "Hip hop"} 
])
```
