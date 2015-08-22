var socketId;
var socket;

jQuery(document).ready(function($){

    $('#filelist').hide();
    $('#createbackup').prop('checked', false);
    $('#replacefile').prop('checked', false);
    $('#backup').hide();
    $('#publish').hide();
                
    socket = io();

    socket.on('welcome', function(data) {
        socketId = data.id;
        socket.emit('i am client', {data: 'foo!', id: data.id});
        socket.emit('test', {data: 'ttt', id:data.id});                                                                                          
    });

    socket.on('progress', function(data) {
        var isBackup = data.isbackup;
        var isFinished = data.finished;
        
        if( isBackup == false) {
            if( isFinished == false) {
                //$('#id').text(data.progress.percentage)
                $('#bkp_progress').text((data.progress.percentage).toFixed(2) + '%')
                $('#bkp_speed').text( (data.progress.speed / 1024 / 1024).toFixed(2));
                $('#bkp_eta').text(data.progress.eta);
                $('#bkp_finished').text('no');
            } else {
                $('#bkp_finished').text('FINISHED!');
            }
        }
    });	
    
    socket.on('error', console.error.bind(console));
    socket.on('message', console.log.bind(console));

});	
        
$( "#sourceFile" ).focusout(function() {
    var path = $("#sourceFile").val();
   $('#destinationFile').val(path.substring(path.lastIndexOf('\\')+1));
});

$('#createbackup').change(function() {
    if(!$(this).is(":checked")) {
        $('#backup').hide();
    } else {
        $('#backup').show();
    }
});

$('#replacefile').change(function() {
    if(!$(this).is(":checked")) {
        $('#filelist').hide();
        $('#destinationFile').show();
    } else {
        $('#destinationFile').hide();
        socket.emit('sendArea', {area: $('#destarea option:selected').val(), socketid: socketId })
        socket.on('filesList', function(data) {
            $('#folderfiles').empty();
            $.each(data.filesList, function(key, value) {   
             $('#folderfiles')
                .append($("<option></option>")
                .attr("value",key)
                .text(value)); 
            });
            $('#filelist').show();
        });                                      
    }
});


function StartCopy() {
    var sourceName = $('#sourceFile').val();
    var destName;
    var area = $('#destarea option:selected').val();
    var createBackup = $('#createbackup').is(":checked");
    var replaceFile = $('#replacefile').is(":checked");
    var filetoreplace;
    
    if(replaceFile == true) {
        filetoreplace = $("#folderfiles option:selected").text();   
    } else {
        destName = $('#destinationFile').val()
    }
    
        
    var params = { sourcename: sourceName,
                   destname: destName, 
                   area: area, 
                   createbackup: createBackup, 
                   socketid: socketId,
                   replacefile: replaceFile,
                   filetoreplace: filetoreplace
                 };
    
    console.log(params);
    //socket.emit('publishrequest', params );
}