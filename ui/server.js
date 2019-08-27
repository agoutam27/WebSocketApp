var express = require('express');
var app = express();
// console.log(__dirname + '/app');
app.use(express.static(__dirname + '/app')); 
app.get('/*', function (req, res,next) {
 res.sendfile('index.html', {root: __dirname + '/app'}); 
});
app.listen(9000, function() {
 console.log('Server is Listening on port 9000');
});
