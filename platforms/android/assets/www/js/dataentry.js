/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var dataentry = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        dataentry.timer();

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'dataentry.receivedEvent(...);'
    onDeviceReady: function() {
        dataentry.receivedEvent('deviceready');
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },


    //timer function that shows the curren time
    //calling itself using dataentry.timer()
    timer: function(){
     var now     = new Date,
         hours   = now.getHours(),
         ampm    = hours<12 ? ' AM' : ' PM',
         minutes = now.getMinutes(),
         seconds = now.getSeconds(),
         t_str   = [(hours>12 ? hours-12 : hours), //otherwise: what's the use of AM/PM?
                    (minutes < 10 ? "0" + minutes : minutes),
                    (seconds < 10 ? "0" + seconds : seconds)]
                     .join(':') + ampm;
     document.getElementById('time').innerHTML = t_str;
     setTimeout(dataentry.timer,1000);
    }


};



var dataInit = {

    start : function(){
        //check whether data available to change
        var object = localStorage.getObject('ProjectData');
        console.log("printing object");
        console.dir(object);
        if(object){
            // set project data
            setData(object);

        }
        else{
            // return to home screen
            alert("Project is not initialized");
            window.location = "index.html";

        }

        function setData(object){
            // getting elements
            var project = document.getElementById("projectName");
            var station = document.getElementById("station");
            var fromSection = document.getElementById("fromRoad");
            var toSection = document.getElementById("toRoad");

            // getting and setting values
            project.innerHTML = object.projectName;
            station.innerHTML = object.station;
            fromSection.innerHTML = object.fromValue;
            toSection.innerHTML = object.toValue;

        }


    }
}


var dataLogger = {

    registerClickListners : function(){

        document.getElementById("inputbutton1").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton2").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton3").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton4").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton5").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton6").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton7").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton8").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton9").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton10").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton11").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton12").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton13").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton14").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton15").addEventListener("click",dataLogger.saveElementToDatabase);
        document.getElementById("inputbutton16").addEventListener("click",dataLogger.saveElementToDatabase);

        //undo button
        document.getElementById("undobutton").addEventListener("click", dataLogger.undoClickAction);
        dataLogger.changeUndoButtonState();

         // back key listener
        document.addEventListener("backbutton", dataLogger.onBackKeyDown, false);

        
    },

    onBackKeyDown : function() {
        // Handle the back button
        // I want to save the current value to the file
        console.log("clicked undo");
 

        // show the confirm dialog
        navigator.notification.confirm("Do you really want to go back", confirmCallback);

        function confirmCallback(id){
            //if only ok remove object
            if(id==1){
                // Take the lastVehicle component
                var lastVehicle = localStorage.getObject('LastVehicle');

                // I need to save LastVehicle to a file
                // check whether I have a LastVehicle
                if(lastVehicle){
                    // make current one null
                    localStorage.setObject('LastVehicle',null);
                    // save it and go to index
                    dataLogger.saveLastElementToFile(lastVehicle);
                    
                }
                else{
                    // directly goto index
                    window.location = "index.html";
                }

            }
        }

        function showToast(message){
            window.plugins.toast.showWithOptions({
                message: message,
                duration: "short",
                position: "center"
              });
        }


    },
    undoClickAction : function(){
        console.log("clicked undo");
        dataLogger.vibrate(50);
        // show the confirm dialog
        navigator.notification.confirm("Do you want to remove last entry", confirmCallback);

        function confirmCallback(id){
            //if only ok remove object
            if(id==1){
                // set lastVehicle to null
                localStorage.setObject('LastVehicle',null);

                showToast("Last entry cleared");
            }
            else{
               showToast("Last entry not cleared");
            }
            // change the current undoButton state
            dataLogger.changeUndoButtonState();
        }

        function showToast(message){
            window.plugins.toast.showWithOptions({
                message: message,
                duration: "short",
                position: "center"
              });
        }


    },

    saveElementToDatabase: function(){
        //record the excact time
        var dateAndTime = new Date();
        // vibrating
        dataLogger.vibrate(50);

        console.log("You clicked :",this.innerText);
        dataLogger.setLastElement(this);
        console.dir(this);

        // Saving data to file
        // query the file name
        var controlObject = localStorage.getObject('ControlData');
        var passingObject = {};
        passingObject.filename = controlObject.filename;
        passingObject.date = getDateFromString(dateAndTime);
        passingObject.time = dateAndTime.getHours()+':'+dateAndTime.getMinutes();
        passingObject.seconds = dateAndTime.getSeconds()+'.'+dateAndTime.getMilliseconds();
        passingObject.vehicle = this.innerText;

        console.dir(passingObject);

        function getDateFromString(dateAndTime){
                var dateArray = dateAndTime.toDateString().split(' ');
                var date = dateArray[3]+'-'+dateArray[1]+'-'+dateArray[2];
                return date;
        }

        // Take the lastVehicle component
        var lastVehicle = localStorage.getObject('LastVehicle');

        // I need to save current data as LastVehicle (overwrite irrespective of there is a element or not)
        localStorage.setObject('LastVehicle',passingObject);

        // I need to save LastVehicle to a file
        // check whether I have a LastVehicle
        if(lastVehicle){
            // save it
            dataLogger.saveElementToFile(lastVehicle);
        }

        // keep the Undo button state
        dataLogger.changeUndoButtonState();
        
    },
    changeUndoButtonState : function(){
         var lastVehicle = localStorage.getObject('LastVehicle');
         if(lastVehicle){
            document.getElementById("undobutton").disabled = false;
         }
         else{
            // disable undo button
            document.getElementById("undobutton").disabled = true;
            // remove elements from last vehicle icon
            var lastElement = document.getElementById("lastclickButton");
            lastElement.innerText = "None";
            lastElement.style.backgroundImage = "none";
         }
    },
    vibrate : function(duration){
        // vibrate
        // initialize toggle button
        var controlData = localStorage.getObject('ControlData');
        if(controlData.vibration){
            navigator.vibrate(duration)
        }
    },
    setLastElement : function(data){
        var lastElement = document.getElementById("lastclickButton");
        lastElement.innerText = data.innerText;
        lastElement.style.backgroundImage = data.style.backgroundImage;
        lastElement.style.backgroundSize = data.style.backgroundSize;

    },
    saveElementToFile : function(data){
        var filename = data.filename;

        //requesting filesystem
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSuccess, onFileError);

        function onFileSuccess(fileSystem) {
            console.log("Got filesystem " + fileSystem.root.toURL());
            console.log("creating file: "+filename);
            fileSystem.root.getFile(filename, {create: true, exclusive: false}, gotFileEntry, FileOpenfail);
        }

        function onFileError(){
            console.log("File system error");
        }

        function gotFileEntry(fileEntry){
            console.log("gotFileEntry");
            fileEntry.createWriter(gotFileWriter, FileOpenfail);
        }

        function FileOpenfail(){
            console.log("File operation failed");
        }


        function gotFileWriter(writer){
            writer.onwriteend = function(evt) {
                console.log("data write success ");
                console.dir(evt);

            };
            console.log("writing data");
            writer.seek(writer.length);
            // write data
            writer.write(data.date+','+data.time+','+data.seconds+','+data.vehicle+'\n');
        }
    },
    saveLastElementToFile : function(data){
        var filename = data.filename;

        //requesting filesystem
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSuccess, onFileError);

        function onFileSuccess(fileSystem) {
            console.log("Got filesystem " + fileSystem.root.toURL());
            console.log("creating file: "+filename);
            fileSystem.root.getFile(filename, {create: true, exclusive: false}, gotFileEntry, FileOpenfail);
        }

        function onFileError(){
            console.log("File system error");
        }

        function gotFileEntry(fileEntry){
            console.log("gotFileEntry");
            fileEntry.createWriter(gotFileWriter, FileOpenfail);
        }

        function FileOpenfail(){
            console.log("File operation failed");
        }


        function gotFileWriter(writer){
            writer.onwriteend = function(evt) {
                console.log("data write success ");
                console.dir(evt);
                window.location = "index.html";

            };
            console.log("writing data");
            writer.seek(writer.length);
            // write data
            writer.write(data.date+','+data.time+','+data.seconds+','+data.vehicle+'\n');
        }
    }    

}



// initializing app
dataentry.initialize();

//check project data and initialize
dataInit.start();

// datalogger for each button click action
dataLogger.registerClickListners();















