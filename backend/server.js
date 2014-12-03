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
SERVER._data = {};
/*
 SERVER...

 Done:
 - getLists(userId)
 - getListItemsById(userId)
 - getListById(listId)
 - addList(list)
 - addArticleToList(listId,article)
 - updateList(list)
 - updateArticleInList(listId, article)
 - delArticleInList(listId,articleId)
 - delList(listId)
 - createNewArticleInList(listId)
 - getKnownArticles()
 - addArticleToKnownArticles(articleName);
 */

SERVER.getLists = function (userId) {
    var visibleLists = [];
    for (var i = 0; i < SERVER._data.lists.length; i++) {
        if (SERVER._data.lists[i].owner === userId || SERVER._data.lists[i].shared_with.indexOf(userId) > -1) {
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

SERVER.getListById = function (listId) {
    var list = {};
    for (var i = 0; i < SERVER._data.lists.length; i++) {
        if (SERVER._data.lists[i].id === parseInt(listId)) {
            list = SERVER._data.lists[i];
            break;
        }
    }
    return list;
};


SERVER.addList = function(list, ownerId){
    list.id = parseInt(list.id);
    list.owner = parseInt(ownerId);
    SERVER._data.lists.push(list);
    SERVER.save();
    return list.id;
};

SERVER.getNewId = function () {
    //console.log("getNewId");
    var articleId = SERVER._data.global_Id_Counter;
    SERVER._data.global_Id_Counter++;
    SERVER.save();
    return articleId;

};

SERVER.addArticleToList = function (listId, article) {
    //add article to known articles
    SERVER.addArticleToKnownArticles(article.name);
    for (var i = 0; i < SERVER._data.lists.length; i++) {
        if (SERVER._data.lists[i].id === listId) {
            SERVER._data.lists[i].article.push(article);
            SERVER.save();
            break;
        }
    }
};

SERVER.updateList = function (list) { // ganze liste
    //console.log(list);
    for (var i = 0; i < SERVER._data.lists.length; i++) {
        //console.log(SERVER._data.lists[i].id + " : " + list.id);
        if (SERVER._data.lists[i].id === list.id) {

            SERVER._data.lists[i] = list;
            SERVER.save();
            break;
        }
    }
};

SERVER.updateArticleInList = function (listId, article) {
    //add article to known articles
    SERVER.addArticleToKnownArticles(article.name);

    for (var i = 0; i < SERVER._data.lists.length; i++) {
        if (SERVER._data.lists[i].id === listId) {
            for (var j = 0; j < SERVER._data.lists[i].article.length; j++) {
                if (SERVER._data.lists[i].article[j].id === article.id) {
                    SERVER._data.lists[i].article[j] = article;
                    SERVER.save();
                    break;
                }
            }
            break;
        }
    }
};

SERVER.delArticleInList = function (listId, articleId) {
    //console.log("löschen");
    for (var i = 0; i < SERVER._data.lists.length; i++) {
        if (SERVER._data.lists[i].id === listId) {
            for (var j = 0; j < SERVER._data.lists[i].article.length; j++) {
                //console.log(SERVER._data.lists[i].article[j].id +" : "+ articleId)
                if (parseInt(SERVER._data.lists[i].article[j].id) == parseInt(articleId)) {
                    SERVER._data.lists[i].article.splice(j, 1);
                    SERVER.save();
                    //console.log("gelöscht");
                    break;
                }
            }
            break;
        }
    }
};

SERVER.delList = function (listId) {
    for (var i = 0; i < SERVER._data.lists.length; i++) {
        if (SERVER._data.lists[i].id === parseInt(listId)) {
            SERVER._data.lists.splice(i, 1);
            SERVER.save();
            break;
        }
    }
};

SERVER.getKnownArticles = function () {
    return SERVER._data.known_articles;
}

SERVER.addArticleToKnownArticles = function (articleName) {
    //console.log("test index of " + SERVER._data.known_articles.indexOf(articleName))
    if (SERVER._data.known_articles.indexOf(articleName) < 0) {
        SERVER._data.known_articles.push(articleName);
        SERVER.save();
    }
}

/*
 Interfaces...

 Done:
 - delList(listId)
 - getNewId()
 - addList(list)
 - addArticleToList(listId,article)
 - getListById(listId)
 - getLists(userId)
 - updateList(list)
 - delArticleInList(listId,articleId)
 - updateArticleInList(listId, article)
 - getKnownArticles()
 - addArticleToKnownArticles(article)

 - getListItemsById(userId) unused

 */


// set cors headers for all requests
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, X-XSRF-TOKEN");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// define REST resources
app.get('/api/lists', function (req, res) {
    var decoded = jwt.decode(req.headers.authorization.split(" ")[1]);
    var userId = decoded.id;

    var lists = SERVER.getLists(userId);
    if (lists) {
        res.json(lists);
    }
    else {
        res.statusCode = 404;
        res.send('lists not found!');
    }
});

app.delete('/api/list/:id', function (req, res) {
    SERVER.delList(parseInt(req.params.id));
    if (req.params.id) {
        res.json(true);
    }
    else {
        res.statusCode = 404;
        res.send('no vaild list-id');
    }
});


app.get('/api/newid', function (req, res) {
    var id = SERVER.getNewId();
    if (id) {
        res.json(id)
    }
    else {
        res.statusCode = 404;
        res.send('no valid id');
    }
});


app.put('/api/addlist', function (req, res) {
    var decoded =  jwt.decode(req.headers.authorization.split(" ")[1]);
    SERVER.addList(req.body, decoded.id );

    if (req.body) {
        res.json(true);
    }
    else {
        res.statusCode = 404;
        res.send('list not found');
    }
});


app.put('/api/addarticletolist/:listid', function (req, res) {
    //console.log("articlename: " + req.body.name + "    listId: " + req.params.listid);
    SERVER.addArticleToList(parseInt(req.params.listid), req.body);
    if (req.params.listid && req.body) {
        res.json(true);
    }
    else {
        res.statusCode = 404;
        res.send('no vaild list-id or article');
    }
});

app.get('/api/list/:id', function (req, res) {
    var list = SERVER.getListById(parseInt(req.params.id));
    if (list) {
        res.json(list);
    }
    else {
        res.statusCode = 404;
        res.send('no vaild list-id');
    }
});


app.put('/api/updateList', function (req, res) {
    SERVER.updateList(req.body);
    if (req.body) {
        res.json(true);
    }
    else {
        res.statusCode = 404;
        res.send('list not found');
    }
});


app.delete('/api/delArticleInList/:listid:articleid', function (req, res) {
    SERVER.delArticleInList(parseInt(req.params.listid), parseInt(req.params.articleid));

    //console.log('listid:' +  req.params.listid);
    //console.log('articleid:' +  req.params.articleid);

    if (!req.params.listid) {
        res.statusCode = 404;
        res.send('no valid list-id');
    }
    else if (!req.params.articleid) {
        res.statusCode = 404;
        res.send('no valid article-id');
    }
    else {
        res.json(true);
    }

});


app.put('/api/updateArticleInList/:listid', function (req, res) {
    SERVER.updateArticleInList(parseInt(req.params.listid), req.body);
    if (req.params.listid) {
        res.json(true);
    }
    else {
        res.statusCode = 404;
        res.send('no valid list-id');
    }


});

app.get('/api/getKnownArticles', function (req, res) {
    var articles = {};
    articles = SERVER.getKnownArticles();

    //console.log('known articles: ' + articles.toString());

    if (articles) {
        res.json(articles);
    }
    else {
        res.statusCode = 404;
        res.send('no known articles');
    }
});

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


// Jens sein altes Zeug
//
//app.get('/api/list/:id', function (req, res) {
//    var list = SERVER.getById(req.params.id);
//
//    if (list) {
//        res.json(list);
//    }
//    else {
//        res.statusCode = 404;
//        res.send('list not found!');
//    }
//});
//
//app.post('/api/list', function (req, res) {
//    SERVER._data.push(req.body);
//    res.json(true);
//});
//
//app.put('/api/list/:id', function (req, res) {
//    var list = SERVER.updateList(req.body);
//
//    if (list) {
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
app.use(function (err, req, res, next) {
    if (err.constructor.name === 'UnauthorizedError') {
        res.status(401).send('Unauthorized');
    }
});

app.post('/login', function (req, res) {
    SERVER.read();
    console.log("login.. " + "email: " + req.body.email + " : password: " + req.body.password);
    for (var i = 0; i < SERVER._data.user.length; i++) {
        //console.log(SERVER._data.user[i].email+" : "+req.body.email)
        if (SERVER._data.user[i].email == req.body.email) {
            //console.log("user  gefunden");
            //if is invalid, return 401
            if (!(req.body.password === SERVER._data.user[i].passwort)) {
                //console.log("passwort falsch");
                res.status(401).send('Wrong user or password');
                return;
            }
            // We are sending the profile inside the token
            //console.log("passwort richtig");
            var token = jwt.sign(SERVER._data.user[i], secret, { expiresInMinutes: 60*24*100 });
            return res.json({token: token});
        }
    }
    res.status(401).send('user not found');
});

//save
SERVER.save = function () {
    fs.writeFile(__dirname + '/zettel.json', JSON.stringify(SERVER._data))
};

// read
SERVER.read = function () {
    //console.log("read")
    try {
        SERVER._data = require(__dirname + '/zettel.json');
    }
    catch (e) {
        SERVER.save();
    }
};

SERVER.read();
// start listening
app.listen(process.env.PORT || 8080);
console.log("Server gestartet auf Port: " +(process.env.PORT || 8080 ));