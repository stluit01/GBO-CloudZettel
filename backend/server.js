// import express
var express = require('express');

// init express app
var app = express();

// tell express to use body parser
app.use(express.bodyParser());

// define a global application object
var SERVER = {};

// define fs
var fs = require('fs');

// define some default Zettel
SERVER._liste= [
    {
        titel: 'Lebensmittel',
        id:'01',
        artikel: [{
            //'092380' ,'092380' ,'092380' ,'092380' ,'092380' ,
            name: 'Tee', anzahl: '2', status:'check'}, {
            name: 'Sprudel', anzahl: '5', status:'uncheck'}, {
            name: 'Bier', anzahl: '10', status:'check'}]
    },
    {
        titel: 'Büro',
        id:'02',
        artikel: [{
            name: 'Kugelschreiber', anzahl: '5', status:'check'}, {
            name: 'Papier', anzahl: '200', status:'uncheck'}]
    },
    {
        titel: 'Bücher',
        id:'03',
        artikel: [{
            name: 'AngularJS', anzahl: '1', status:'uncheck'}, {
            name: 'PhoneGap', anzahl: '1', status:'uncheck'}]
    },
    {
        titel: 'Kosmetik',
        id:'04',
        artikel: [{
            name: 'Mascara', anzahl: '1', status:'uncheck'}, {
            name: 'Wattepads', anzahl: '1', status:'check'}]
    }];



SERVER.updateList = function (list) {
    for (var i = 0, n = SERVER._liste.length; i < n; i++) {
        if (parseInt(list.id) === SERVER._liste[i].id) {
            SERVER._liste[i] = list;
            //return list;
        }
    }
    return null;
};

SERVER.deleteListeById = function (id) {
    var i = SERVER._liste.length;
    while (i--) {
        if (parseInt(id) === SERVER._liste[i].id) {
            return SERVER._liste.splice(i, 1);
        }
    }
    return null;
};

SERVER.getNewId = function () {
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;

    if (SERVER._liste.length > 0) {

        for (var i = SERVER._liste.length - 1; i >= 0; i--) {
            tmp = SERVER._liste[i].id;
            if (tmp < lowest) lowest = tmp;
            if (tmp > highest) highest = tmp;
        }
        return ++highest;
    }
    else
        return 0;
}


// set cors headers for all requests
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, X-XSRF-TOKEN");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});


// define REST resources
app.get('/api/newId', function (req, res) {
    res.json(SERVER.getNewId());
});

app.get('/api/listen', function (req, res) {
    res.json(SERVER._liste);
});

app.get('/api/liste/:id', function (req, res) {
    var liste = SERVER.getById(req.params.id);

    if (liste) {
        res.json(liste);
    }
    else {
        res.statusCode = 404;
        res.send('liste not found!');
    }
});

app.post('/api/liste', function (req, res) {
    SERVER._liste.push(req.body);
    res.json(true);
});

app.put('/api/liste/:id', function (req, res) {
    var liste = SERVER.updateListe(req.body);

    if (liste) {
        res.json(true);
    }
    else {
        res.statusCode = 404;
        res.send('liste not found!');
    }
});

app.delete('/api/liste/:id', function (req, res) {
    var liste = SERVER.deleteListeById(req.params.id);

    if (liste) {
        res.json(true);
    }
    else {
        res.statusCode = 404;
        res.send('Liste not found!');
    }
});

//save
app.save = function() {
    fs.writeFile(__dirname + '/zettel.json',JSON.stringify(SERVER._liste))
}

// read
try{
    SERVER._liste = require(__dirname + '/zettel.json');
}
catch (e){
    app.save();
}

// start listening
app.listen(process.env.PORT || 4730);
