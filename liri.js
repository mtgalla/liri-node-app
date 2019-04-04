require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// Load the fs package to read and write
var fs = require("fs");
//Load axios package for OMDB and bandsintown APIs
var axios = require("axios");

//store user inputs
var action = process.argv[2];
var request = process.argv.slice(3).join(" ");

//OMDB and bandsintown API urls with requests stored in them
var queryUrl = "http://www.omdbapi.com/?t=" + request + "&y=&plot=short&apikey=trilogy";
var qryUrl = "https://rest.bandsintown.com/artists/"+ request +"/events?app_id=codingbootcamp";

//npm spotify search
function spotifyThis(){
  spotify.search(
  {
    type: 'track',
    query: request,
    limit:2
  },
    function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
     var track = data.tracks.items[0];
    console.log("Artist: " + track.artists[0].name + "\nSong: " + track.name + "\nPreview link to song: " + 
                  track.preview_url + "\nAlbum: "+ track.album.name);
  });
}

//npm OMDB API request
function movieThis(){
  axios.get(queryUrl).then(
    function(response) {
      console.log("Movie Title: "+ response.data.Title + "\nThe release year of the movie is: " + response.data.Year+"\nIMDB Rating: "+
                    response.data.Ratings[0].Value +"\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value+ "\nCountry: " + 
                    response.data.Country+ "\nLanguage: " + response.data.Language+ "\nPlot: " + response.data.Plot+ "\nActors: " + 
                    response.data.Actors);
    })
    .catch(function(error){
      console.log(error);
    })
}

// npm bandsintown API request
function concertThis(){
  axios.get(qryUrl).then(
    function(res) {
      console.log("Venue: " + res.data[0].venue.name);
      console.log("Location: " + res.data[0].venue.city + ", " +res.data[0].venue.region);
      console.log("Date of Event: " + res.data[0].datetime);
    })
    .catch(function(error){
      console.log(error);
    })
}

//default for user if nothing is entered
function doWhatItSays(){
  fs.readFile('random.txt','utf8', function (err,data){
    if (err){
       return console.log(err)
    }
    var array = data.split(",");
    action = array[0];
    request = array[1];
    runLiri();
  })
}

//liri function using switch case
function runLiri(){
switch (action){
  case "movie-this":
    movieThis();
    break;
  
  case "concert-this":
    concertThis();
    break;
  
  case "spotify-this-song":
    spotifyThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;

  default: console.log("Please enter in one of the liri commands along with your request: \n movie-this" +
                        "\n concert-this \n spotify-this-song \n do-what-it-says")
  }
}

//runs the function to execute liri
runLiri();
