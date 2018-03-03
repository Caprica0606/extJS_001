var http = require('http');
var fs = require("fs");
 
http.createServer(function(request, response) {
  if(request.url === "/index"){
    fs.readFile("index.html", function(err, data){
      if(err){
        response.writeHead(404);
        response.write("Not Found!");
      }
      else{
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
      }
    response.end();
    });
  }
  else {
    response.writeHead(200,{'Content-Type': 'text/html'});
    response.write('<b>Welcome to my server default page!!!</b><br /><br /> Requested URL is: ' + request.url);
    response.end();
  }
}).listen(3000);
