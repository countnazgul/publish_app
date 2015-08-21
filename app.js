var http        = require('http')
var fs          = require('fs');
var index       = fs.readFileSync(__dirname + '/index.html');
var progress    = require('progress-stream');
var path        = require("path");
var url         = require("url");
var config      = require('./config');

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
    console.log('socket: ' + socketId);
    io.to(socketId).emit('time', {time: new Date().toJSON()} );    
}

io.on('connection', function(socket) {
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    socket.on('i am client', console.log);
    
	socket.on('publishrequest', function(socket) {
		console.log(socket.socketid)
		var filename = socket.sourcename;
		var output   = config.files.folder +  socket.area + '\\' + socket.destname;
		var createbackup = socket.createbackup;
		
		console.log(filename);
		console.log(output);
		console.log(createbackup);		
		//if( createbackup == false) {
			var stat = fs.statSync(filename);
			var str = progress({
				length: stat.size,
				time: 100
			});
			
			str.on('progress', function(progress) {
				io.to(socket.socketid).emit('progress', { isbackup: false, finished: false, progress: progress } );
			});

			str.on('end', function(bla) {
			console.log('end');
				io.to(socket.socketid).emit('progress', { isbackup: false, finished: true, progress: {} } );
			});
			fs.createReadStream(filename)
				.pipe(str)
				.pipe(fs.createWriteStream(output));			
				
			//}

/*		var stat = fs.statSync(filename);
		var str = progress({
			length: stat.size,
			time: 100
		});
		 
 		str.on('progress', function(progress) {
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
			.pipe(fs.createWriteStream(output)); */
	});    
    
});
app.listen(8000);