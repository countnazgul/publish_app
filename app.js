var http        = require('http')
var fs          = require('fs');
var index       = fs.readFileSync(__dirname + '/index.html');
var progress    = require('progress-stream');
var path        = require("path");
var url         = require("url");
var config      = require('./config');

//mongoose.connect(config.mongoose.url);

var app = http.createServer(function(request, response) {
	var my_path = url.parse(request.url).pathname;
	var full_path = path.join(process.cwd(),my_path);
    
	fs.exists(full_path,function(exists){
		if(!exists){
			response.writeHeader(404, {"Content-Type": "text/plain"});  
			response.write("404 Not Found\n");  
			response.end();
		}
		else{
			fs.readFile(full_path, "binary", function(err, file) {
			     if(err) {  
			         response.writeHeader(500, {"Content-Type": "text/plain"});  
			         response.write(err + "\n");  
			         response.end();  
 
			     }  
				 else{
					response.writeHeader(200);  
			        response.write(file, "binary");  
			        response.end();
				}
		    })
        }       
    });
});

var io = require('socket.io').listen(app);

function sendTime(socketId) {
    //io.emit('time', { time: new Date().toJSON() });
    console.log('socket: ' + socketId);
    io.to(socketId).emit('time', {time: new Date().toJSON()} );    
    
    //socket.broadcast.to(socketId).emit('time', {time: new Date().toJSON()});
}

//setInterval(sendTime, 10000);

io.on('connection', function(socket) {
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    socket.on('i am client', console.log);
    
socket.on('test', function(socket) {
    console.log(socket.id)
    var filename = config.files.in;
    var output   = config.files.out;

	var stat = fs.statSync(filename);
	var str = progress({
		length: stat.size,
		time: 100
	});
	 
	str.on('progress', function(progress) {
		//res.write(progress.percentage.toString());
	    io.to(socket.id).emit('progress', {progress: Math.round(progress)} );    
		
// 		{
// 			percentage: 9.05,
// 			transferred: 949624,
// 			length: 10485760,
// 			remaining: 9536136,
// 			eta: 42,
// 			runtime: 3,
// 			delta: 295396,
// 			speed: 949624
// 		}

	});

	str.on('end', function(bla) {
		console.log('done!');
		//io.to(socket.id).emit('progress', {progress: progress.percentage.toString()} );
	});
fs.createReadStream(filename)
    .pipe(str)
    .pipe(fs.createWriteStream(output));	    
    
//     setInterval(function() { 
//         console.log('socket: ' + socket.id);
//         io.to(socket.id).emit('time', {time: new Date().toJSON()} );    
//     }, 5000)
        
        
        
    
    //socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    //socket.on('i am client', console.log);
});    
    
});




app.listen(8000);



// var express = require('express');
// var app = express();



// var server = app.listen(3001, function () {
//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('Example app listening at http://%s:%s', host, port);
// });




//app.get('/', function (req, res) {
