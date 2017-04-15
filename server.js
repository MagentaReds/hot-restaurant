var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();
var PORT = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

var table = [];
var tableCount = 2000;
var waitList = [];
var pageCount = "";

// Reservation constructor
function Reservation(name, phone, email, id, onWaitList = false) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.id = id;
    this.onWaitList = onWaitList;
}
// Returns true if table is free otherwise returnes false
function tableFree() {
    return table.length < 5;
}

// Page routes
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/reserve", function(req, res) {
    res.sendFile(path.join(__dirname, "reserve.html"));
});

app.get("/table", function(req, res) {
    pageCount++;
    res.sendFile(path.join(__dirname, "tables.html"));
});

// Data routs
app.get("/api/tables", function(req, res) {
    return res.json(table);
});

app.get("/api/waitlist", function(req, res) {
    return res.json(waitList);
});

// Creates new table reservation - takes in JSON from font in using body-parser
app.post("/api/tables", function(req, res) {
    var cRes = req.body;
    var newRes = new Reservation(cRes.name, cRes.phone, cRes.email, tableCount);
    tableCount++;
    if (tableFree()) {
        table.push(newRes);
    } else {
        newRes.onWaitList = true;
        waitList.push(newRes);
    }
    res.json(newRes);
});

//Starts server listening 

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});