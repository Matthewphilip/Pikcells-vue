// listen on a specific host via the HOST environment variable
var host = process.env.HOST || "0.0.0.0";
// listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

var cors_proxy = require("cors-anywhere");
cors_proxy
  .createServer({
    originWhitelist: [], // empty array allows all origins
  })
  .listen(port, host, function () {
    console.log("Running CORS Anywhere on " + host + ":" + port);
  });
