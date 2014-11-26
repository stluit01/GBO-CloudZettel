// import express,....
var express = require('express');
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');  //https://npmjs.org/package/node-jsonwebtoken
var expressJwt = require('express-jwt'); //https://npmjs.org/package/express-jwt

//secret
var secret = 'this is the secret secret secret 12356';

// init express app
var app = express();

// define a global application object
var SERVER = {};

// define fs
var fs = require('fs');

// We are going to protect /api routes with JWT
app.use('/api', expressJwt({secret: secret}));

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/../'));


//list in code for better auto correct
SERVER._data = {}
/*
 SERVER...

 Done:
 - getLists(userId)
 - getListItemsById(userId)
 - getListById(listId)
 - addList(list)
 - addArticleToList(listId,article)
 - updateListById(listId,articleId)
 - updateArticleInList(listId, article)
 - delArticleInList(listId,articleId)
 - delList(listId)
 createNewArticleInList(listId)

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

//SERVER.getListItemsById = function(listId){
//    var article = {};
//    for(var i=0; i < SERVER._data.lists.length; i++){
//        if(SERVER._data.lists[i].id === listId){
//            article = SERVER._data.lists[i].article;
//            break;
//        }
//    }
//    return article;
//};

SERVER.getListById = function(listId){
    var list = {};
    for(var i=0; i < SERVER._data.lists.length; i++){
        if(SERVER._data.lists[i].id === parseInt(listId)){
            list = SERVER._data.lists[i];
            break;
        }
    }
    return list;
};


SERVER.addList = function(list){

    list.id = SERVER._data.global_Id_Counter;
    global_Id_Counter++;
    SERVER._data.lists.push(list);
    SERVER.save();
    return list.id;
};

SERVER.getNewId = function(listId) {
    var articleId = global_Id_Counter;
    global_Id_Counter++;
    return articleId;

}

SERVER.addArticleToList = function(listId,article){
    for(var i=0; i < SERVER._data.lists.length; i++){
        if(SERVER._data.lists[i].id === listId){
            SERVER._data.lists[i].article.push(article);
            SERVER.save();
            break;
        }
    }
};

SERVER.updateListById = function(listId,attr){ // ganze liste
    for(var i=0; i < SERVER._data.lists.length; i++){
        if(SERVER._data.lists[i].id === listId){
            SERVER._data.lists[i].title = attr.title;
            SERVER._data.lists[i].shared_with = attr.shared_with;
            SERVER.save();
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
            SERVER.save();
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
            SERVER.save();
            break;
        }
    }
};

SERVER.delList = function(listId){
    for(var i=0; i < SERVER._data.lists.length; i++){
        if(SERVER._data.lists[i].id === parseInt(listId)){
            SERVER._data.lists.splice(i, 1);
            SERVER.save();
            break;
        }
    }
};


/*
 Interfaces...


 - getLists(userId) gmacht
 - getListItemsById(userId) brauchmer grad ed
 - getListById(listId) gmacht
 - addList(list)
 - addArticleToList(listId,article)
 - updateListById(listId,articleId)
 - updateArticleInList(listId, article)
 - delArticleInList(listId,articleId)
 - delList(listId) gmacht

 */


// set cors headers for all requests
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, X-XSRF-TOKEN");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// define REST resources
app.get('/api/listen', function (req, res) {
    var decoded =  jwt.decode(req.headers.authorization.split(" ")[1]);
    var userId = decoded.id

    var lists = SERVER.getLists(userId);
    if (lists) {
        res.json(lists);
    }
    else {
        res.statusCode = 404;
        res.send('lists not found!');
    }
})

app.delete('/api/liste/:id', function (req, res) {
    SERVER.delList(req.params.id);
    res.json(true);
    //if (liste) { //FIXME:404?!?!?
    //
    //    res.json(true);
    //}
    //else {
    //    res.statusCode = 404;
    //    res.send('liste not found!');
    //}
});

app.get('/api/liste/:id', function(req, res) {
    var list = SERVER.getListById(req.params.id);
    if (list) {
        res.json(list);
    }
    else {
        res.statusCode = 404;
        res.send('list not found!');
    }
})

//app.get('/api/lists/article/:id', function (req, res) {
//    var listItems = SERVER.getListItemsById(req.params.id);
//    if (listItems) {
//        res.json(listItems);
//    }
//    else {
//        res.statusCode = 404;
//        res.send('lists not found!');
//    }
//})



//TODO REST!!!!!
//
//app.get('/api/liste/:id', function (req, res) {
//    var liste = SERVER.getById(req.params.id);
//
//    if (liste) {
//        res.json(liste);
//    }
//    else {
//        res.statusCode = 404;
//        res.send('liste not found!');
//    }
//});
//
//app.post('/api/liste', function (req, res) {
//    SERVER._data.push(req.body);
//    res.json(true);
//});
//
//app.put('/api/liste/:id', function (req, res) {
//    var liste = SERVER.updateListe(req.body);
//
//    if (liste) {
//        res.json(true);
//    }
//    else {
//        res.statusCode = 404;
//        res.send('liste not found!');
//    }
//});
//
//


/*
 Login
 */
app.use(function(err, req, res, next){
    if (err.constructor.name === 'UnauthorizedError') {
        res.status(401).send('Unauthorized');
    }
});

app.post('/login', function (req, res) {
    console.log("login.. "+ "email: " + req.body.email + " : password: " + req.body.password);
    for(var i=0; i < SERVER._data.user.length; i++){
        //console.log(SERVER._data.user[i].email+" : "+req.body.email)
        if(SERVER._data.user[i].email == req.body.email){
            //console.log("user  gefunden");
            //if is invalid, return 401
            if (!(req.body.password === SERVER._data.user[i].passwort)) {
                //console.log("passwort falsch");
                res.status(401).send('Wrong user or password');
                return;
            }
            // We are sending the profile inside the token
            //console.log("passwort richtig");
            var token = jwt.sign(SERVER._data.user[i], secret, { expiresInMinutes: 60*5 });
            return res.json({ token: token });
        }
    }
    res.status(401).send('user not found');
});

//save
SERVER.save = function() {
    fs.writeFile(__dirname + '/zettel.json',JSON.stringify(SERVER._data))
}

// read
SERVER.read = function() {
    try {
        SERVER._data = require(__dirname + '/zettel.json');
    }
    catch (e) {
        SERVER.save();
    }
}

SERVER.read();
// start listening
app.listen(process.env.PORT || 8080);
