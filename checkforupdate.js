function checkForUpdates(divName) {
try {
		var version = '0.1';
		var repoReleaseUrl = "https://api.github.com/repos/countnazgul/RadialTree/releases";
		var xmlhttp;	
		
		var div = document.createElement("div");
			div.id = "update";
			div.style.width = "10px";
			div.style.height = "10px";
			div.style.csstext = 'position: absolute; top: 0; left: 0;';
			div.style.visibility = 'hidden';
		
		var arrowDiv = document.createElement("div");
			arrowDiv.title = "New version of this extension is available!";
			arrowDiv.id = "updateArrow";
			arrowDiv.style.width = "0px";
			arrowDiv.style.height = "0px";
			arrowDiv.style.borderBottom = "7px solid green";
			arrowDiv.style.borderLeft = "7px solid transparent";
			arrowDiv.style.borderRight = "7px solid transparent";
			
		div.appendChild(arrowDiv);	
		
		var a = document.getElementById(divName);
			a.appendChild(div);	
		
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
			   if(xmlhttp.status == 200){
					response = JSON.parse(xmlhttp.responseText);
					
					if( response[0].tag_name != version) {
						document.getElementById('update').style.visibility = 'visible';
					}			
			   }
			   else if(xmlhttp.status == 400) {
			   }
			   else {
			   }
			}
		}

		xmlhttp.open("GET", repoReleaseUrl, true);
		xmlhttp.send();
	} catch( err ) {
	}
}
