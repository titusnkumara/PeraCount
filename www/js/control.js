

// document.getElementById("inputbutton1").addEventListener("click", gotoSetup);
// document.getElementById("inputbutton2").addEventListener("click", gotoNext);
// document.getElementById("inputbutton3").addEventListener("click", clickAction);

// function clickAction() {
//     this.innerHTML = "Clicked";
//     window.plugins.toast.showShortTop('Hello there!');
// }

// function gotoNext() {

// 	setTimeout(function () {
//         window.location = "dataentry.html";
//    		localStorage.setObject('myObject', {key1: 'Titus', key2: 'nKumara'});
//     }, 500);

  
// }

// function gotoSetup(){

// 	setTimeout(function () {
//         window.location = "setup.html";
//     }, 500);
// }


var mainWorker = {
	setupElements : function(){
		document.getElementById("setupButton").addEventListener("click", mainWorker.gotoSetup);
		document.getElementById("dataButton").addEventListener("click", mainWorker.gotoNext);
		document.getElementById("manageButton").addEventListener("click", mainWorker.gotoManage);
		// create control object that saves settings and recent data
		// check for the old object
		var obj = localStorage.getObject('ControlData');
		if(obj){
			// then print
			console.log("Control object ");
			console.dir(obj);
		}
		else{
			localStorage.setObject('ControlData',{filename:"untitled.csv",vibration:true});
		}

	},

	gotoManage : function() {
		// vibrate
		mainWorker.vibrate(50);
	    
	    setTimeout(function () {
	        window.location = "datamanager.html";
	   		
	    }, 5);
	    
	},

	gotoNext : function() {
		// vibrate
		mainWorker.vibrate(50);
		setTimeout(function () {
	        window.location = "dataentry.html";
	   		
	    }, 5);

	  
	},

	gotoSetup : function(){
		mainWorker.vibrate(50);
		setTimeout(function () {
	        window.location = "setup.html";
	    }, 5);
	},

	vibrate : function(duration){
		// vibrate
		// initialize toggle button
        var controlData = localStorage.getObject('ControlData');
        if(controlData.vibration){
        	navigator.vibrate(duration)
        }

		
	},

	enableDisableElements : function(){
		var object = localStorage.getObject('ProjectData');
		console.log("printing object");
		console.dir(object);
		if(object){
			// enable buttons
			document.getElementById("dataButton").disabled = false;

		}
		else{
			// disable buttons
			document.getElementById("dataButton").disabled = true;

		}

	}


}

mainWorker.setupElements();
mainWorker.enableDisableElements();


