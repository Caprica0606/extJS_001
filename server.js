var http = require('http');
var fs = require("fs");
var url = require('url');
var pg = require('pg');

var pool = new pg.Pool({
  user: 'michelle',
  host: 'localhost',
  database: 'employees',
  password: 'test1234'
});

// Yes, this is not secure but hey, it's enough to get something
// going. In the practical world this would need to check 
// that the path doesn't escape the content area.
function serveFile(pathname, request, response) {
  var file = pathname.substr(1);
  fs.readFile(file, function(err, data){
    if(err){
      response.writeHead(404);
      response.write(file + " Not Found: " + err);
    } else {
      var mime, match = /\.([a-z])+/.exec(file);

      switch (match[0]) {
        case ".html": mime = "text/html";              break;
        case ".css":  mime = "text/css";               break;
        case ".js":   mime = "application/javascript"; break;
        default:      mime = "text/plain";             break;
      }

      response.writeHead(200, {'Content-Type': mime});
      response.write(data);
    }
    response.end();
  });
}

function employeeInfo(pathname, request, response) {
  response.writeHead(200, {'Content-Type': 'application/json'});
  switch (request.method) {
    case "GET":
      pool.query('select * from employee_data', function(err, res) {
        response.write(JSON.stringify(res.rows));
        response.end();
      });
      break;
  }  
}
 
http.createServer(function(request, response) {
  console.log("REQ: " + request.url);

  var pathname = url.parse(request.url).pathname;
  switch (pathname) {
    case "/employee-info":
      employeeInfo(pathname, request, response);
      break;
    
    // Nope -- it's not an API call, so just serve up
    // the file.
    default:
      serveFile(pathname, request, response);
      break;
  }
}).listen(3000);
