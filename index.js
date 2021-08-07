/*
* Primary file for the API
*
*/

// Dependencies
const http = require('http'); // import http from 'http';
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder;

// Server should respond to all requests with a string
const server = http.createServer(function(req, res){

    // Get url and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the http method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload if any
    const decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){ // end event will always be called so response can be here
        buffer += decoder.end();

        // Choose handler the request should go to & construct data object to send to handler
        var chosenHandler = typeof(router[trimmedPath]) !== undefined ? router[trimmedPath] : handlers.notfound;
        // var chosenHandler = router[trimmedPath] || handlers.notfound;
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'buffer': buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function(status, payload){
            //Use status code & payload called back by handler, or default to 200 & {}
            statusCode = typeof(statusCode) == 'number' ? statusCode: 200;
            payload = typeof (statusCode) == 'object' ? payload : {};
            // Convert payload to string
            var payloadString = JSON.stringify(payload);
            // Return response
            res.writeHead(statusCode);
            res.end(payloadString); 
           // Log the request path
            console.log('Returning this response: ', statusCode, payloadString);
        })

    }); 

    // // Send the response
    // // test in new terminal with 'curl localhost:3009/foo?age=35'
    // res.end('Hello World 😎 \n')
    // // Log the request path
    // // console.log('Request received on path: ' + trimmedPath + ' with method: ' + method + ' with query string parameters: ', queryStringObject);
    // console.log('Request received with these headers: ', headers);

});

// Start server and have it listening on port 3009
server.listen(3009, function(){
    console.log('Server listening on port 3009 now')
})

// Define the handlers
var handlers = {};
// Sample handler
handlers.sample = function(data, callback){
    // callback http status code and payload object
    callback(406,{'name': 'Sample handler'});
};
// Not found handler
handlers.notfound = function(data, callback){
    callback(404);
    // callback(404,{'name': 'Page not found!'})
};



// Define a request router
var router = {
    'sample': handlers.sample
}
