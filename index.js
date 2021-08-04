/*
* Primary file for the API
*
*/

// Dependencies
var http = require('http'); // import http from 'http';

// Server should respond to all requests with a string
var server = http.createServer(function(req, res){
    res.end('Hello World\n')
});

// Start server and have it listening on port 3000
server.listen(3009, function(){
    console.log('Server listening on port 3009 now')
})