var http = require('http')
const url = require('url');
var nodeRequest = require('request')
var config = require('./config.json')

// start server
var server = http.createServer(handle);
server.listen(config.port);
console.log('Server is listening');

function handle(serverRequest, serverResponse) {
  console.log('Handling request', serverRequest.url)

  // parse request
  var requestUrl = url.parse(serverRequest.url)
  var urlSplit = requestUrl.pathname.split('/')

  var filePath = ''
  for (var i = 3; i < urlSplit.length; i++) {
    filePath += '/' + urlSplit[i]
  }

  nodeRequest.get({
      url: config.gitlabUrl + 'api/v3/projects/' + urlSplit[1] + '%2F' + urlSplit[2] + '/repository/files?ref=' + config.branch + '&file_path=' + filePath,
      headers: {
        'PRIVATE-TOKEN': config.gitlabToken
      }
    }, function (error, response, body) {
      if (error) {
        console.log(error)
        serverResponse.writeHead(500, {});
        serverResponse.write('Internal Server Error');
        serverResponse.end();
      } else if (response.statusCode !== 200) {
        console.log('GitLab error', response.statusCode, body)
        serverResponse.writeHead(response.statusCode, {})
        serverResponse.write('Got error from GitLab')
        serverResponse.end()
      } else {
        var json = JSON.parse(body)
        var content = new Buffer(json.content, 'base64')
        serverResponse.writeHead(200, {})
        serverResponse.write(content)
        serverResponse.end()
      }
  })
}
