'use strict'

const assert = require('assert')

const hapi = require('hapi')
const inert = require('inert')
const vision = require('vision')
const fs = require('fs');

const indexRoutes = require('./lib/routes/index.routes')
const assetRoutes = require('./lib/routes/asset.routes')

const server = new hapi.Server()
server.connection({
  host: process.env.IP || 'localhost',
  port: process.env.PORT || 3000
})

server.register([inert, vision], (err) => {
  assert(!err, err)

  server.route(indexRoutes)
  server.route(assetRoutes)

// Add the route when serach for title
server.route({
    method: 'GET',
    path:'/getdata/title/{keyword?}',
    handler: function (request, reply) {

      var params = request.params || {}
      var keywordTitle='';
      if (params.keyword) {
         keywordTitle = params.keyword;
      }

      fs.readFile('books.json', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }

        // FILTER DATA
        var obj = JSON.parse(data);
        var arrBooks = [];
        var arrBooksOLID = [];
        var resultarrBooks = [];
        var tmpObj, tmpVal, tmpIndex;
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            arrBooks.push(obj[key]);
            arrBooksOLID.push(key);
          }
        }

        if (keywordTitle) {
                for (var i=0 ; i < arrBooks.length ; i++) {
                      tmpObj = "";
                      // IF TITLE FOUND, PUT arrBooks[i] INTO RESULT ARRAY
                      tmpVal = arrBooks[i]["title"];
                      tmpVal = tmpVal.toLowerCase();
                      keywordTitle = keywordTitle.toLowerCase();
                      tmpIndex = tmpVal.indexOf(keywordTitle);
                      if (tmpIndex > -1) {
                         resultarrBooks.push(arrBooks[i]);
                      }
                }
          }
          else {
            for (var i=0 ; i < arrBooks.length ; i++) {
                  resultarrBooks.push(arrBooks[i]);
            }
          }
        // CREATE OBJECT WITH ARRAY FOR BOOKS DATA AND OLID ARRAY FOR EASY SEARCH IN ANGULAR
        var finalReplyObj= { olid: arrBooksOLID, books: resultarrBooks  };
        reply(finalReplyObj);
      });

     }

  })


  // Add the route when serach for olid
  server.route({
      method: 'GET',
      path:'/getdata/olid/{keyword?}',
      handler: function (request, reply) {

        var params = request.params || {}
        var keywordTitle='';
        if (params.keyword) {
           keywordTitle = params.keyword;
        }

        fs.readFile('books.json', 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }

          // FILTER DATA
          var obj = JSON.parse(data);
          var arrBooks = [];
          var arrBooksOLID = [];
          var resultarrBooks = [];
          var tmpObj, tmpVal, tmpIndex;
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              arrBooks.push(obj[key]);
              arrBooksOLID.push(key);
            }
          }
          if (keywordTitle) {
                  for (var i=0 ; i < arrBooks.length ; i++) {
                        tmpObj = "";
                        // IF TITLE FOUND, PUT arrBooks[i] INTO RESULT ARRAY
                        tmpVal = arrBooks[i]["identifiers"]["openlibrary"][0];
                        tmpVal = tmpVal.toLowerCase();
                        keywordTitle = keywordTitle.toLowerCase();
                        tmpIndex = tmpVal.indexOf(keywordTitle);
                        if (tmpIndex > -1) {
                           resultarrBooks.push(arrBooks[i]);
                        }
                  }
            }
            else {
              for (var i=0 ; i < arrBooks.length ; i++) {
                    resultarrBooks.push(arrBooks[i]);
              }
            }
          // CREATE OBJECT WITH ARRAY FOR BOOKS DATA AND OLID ARRAY FOR EASY SEARCH IN ANGULAR
          var finalReplyObj= { olid: arrBooksOLID, books: resultarrBooks  };
          reply(finalReplyObj);
        });

       }

    })



  server.start((err) => {
    assert(!err, err)
    console.log(`Server running at: ${server.info.uri}`)
  })
})
