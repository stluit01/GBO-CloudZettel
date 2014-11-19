// import express
var express = require('express');

// init express app
var app = express();


// define a global application object
var SERVER = {};

// define fs
var fs = require('fs');

var jwt = require('express-jwt');
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
var tokenManager = require('./config/token_manager');
var secret = require('./config/secret');


//list in code for better auto correct
SERVER._data = {
    lists : [
        {
            id : 1,
            owner : 1,
            shared_with : [],
            title : "Lebensmittel",
            article : [
                {
                    id : 1,
                    name : "Tee",
                    count : 5,
                    purchased : false
                },
                {
                    id : 2,
                    name : "Wurst",
                    count : 3,
                    purchased : false
                },
                {
                    id : 3,
                    name : "Sahne 100ml",
                    count : 2,
                    purchased : true
                }
            ]
        },
        {
            id : 2,
            owner : 2,
            shared_with : [ 1 ],
            title : "Baumarkt",
            article : [
                {
                    id : 1,
                    name : "Axt",
                    count : 1,
                    purchased : false
                },
                {
                    id : 2,
                    name : "Hammer",
                    count : 2,
                    purchased : false
                },
                {
                    id : 3,
                    name : "Nägel",
                    count : 100,
                    purchased : true
                }
            ]
        }
    ],
    known_articles : [
        "Tee",
        "Wurst",
        "Sahne 100ml",
        "Axt",
        "Hammer",
        "Nägel"
    ]
}


/*

 getLists(userId) -> done ?
 getListItemsById(listID) -> done ?
 addList(list) -> done ?
 addArticleToList(listId,article) done ?
 updateListById(listId,attr) -> was für attr?
 updateArticleInList(listId, article)
 delArticleInList(listId,articleId)
 delList(listId)

*/

SERVER.getLists = function(userId){

    var visibleLists = [];
    for(var i=0; i < SERVER._data.lists.length; i++){
        if(SERVER._data.lists[i].owner === userId || SERVER._data.lists[i].shared_with.indexOf(userId) > -1){
            visibleLists.push(SERVER._data.lists[i]);
        }
    }
    return visibleLists;
};

SERVER.getListItemsById = function(listId){
    var article = {};
    for(var i=0; i < SERVER._data.lists.length; i++){
        if(SERVER._data.lists[i].id === listId){
            article = SERVER._data.lists[i].article;
            break;
        }
    }
    return article;
};

SERVER.addList = function(list){

    list.id = (SERVER._data.lists.length + 1);
    SERVER._data.lists.push(list);

    return list.id;
};

SERVER.addArticleToList = function(listId,article){
    for(var i=0; i < SERVER._data.lists.length; i++){
        if(SERVER._data.lists[i].id === listId){
            SERVER._data.lists[i].article.push(article);
            break;
        }
    }
};

SERVER.updateListById = function(listId,attr){
    for(var i=0; i < SERVER._data.lists.length; i++){
        if(SERVER._data.lists[i].id === listId){
            SERVER._data.lists[i].title = attr.title;
            SERVER._data.lists[i].shared_with = attr.shared_with;
            break;
        }
    }
};

SERVER.updateArticleInList = function(listId, article){
    for(var i=0; i < SERVER._data.lists.length; i++){
        if(SERVER._data.lists[i].id === listId){
            for(var j = 0; j < SERVER._data.lists[i].article.length; j++){
                if(SERVER._data.lists[i].article[j].id = article.id){
                    SERVER._data.lists[i].article[j] = article;
                    break;
                }
            }
            break;
        }
    }
};

SERVER.delArticleInList = function(listId,articleId){
    for(var i=0; i < SERVER._data.lists.length; i++){
        if(SERVER._data.lists[i].id === listId){
            for(var j = 0; j < SERVER._data.lists[i].article.length; j++){
                if(SERVER._data.lists[i].article[j].id = articleId){
                    SERVER._data.lists[i].article.splice(j, 1);
                    break;
                }
            }
            break;
        }
    }
};

SERVER.delList = function(listId){
    for(var i=0; i < SERVER._data.lists.length; i++){
        if(SERVER._data.lists[i].id === listId){
            SERVER._data.lists.splice(i, 1);
            break;
        }
    }
};

/*

SERVER.deleteListeById = function (id) {
    var i = SERVER._data.length;
    while (i--) {
        if (parseInt(id) === SERVER._data[i].id) {
            return SERVER._data.splice(i, 1);
        }
    }
    return null;
};

SERVER.getNewId = function () {
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;

    if (SERVER._data.length > 0) {

        for (var i = SERVER._data.length - 1; i >= 0; i--) {
            tmp = SERVER._data[i].id;
            if (tmp < lowest) lowest = tmp;
            if (tmp > highest) highest = tmp;
        }
        return ++highest;
    }
    else
        return 0;
}

*/

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
    res.json(SERVER._data.lists);
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
    SERVER._data.push(req.body);
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

/*
 Login
 */
app.post('/login', routes.users.login);

//save
app.save = function() {
    fs.writeFile(__dirname + '/zettel.json',JSON.stringify(SERVER._data))
}

// read
try{
    SERVER._data = require(__dirname + '/zettel.json');
}
catch (e){
    app.save();
}

// start listening
app.listen(process.env.PORT || 4730);
