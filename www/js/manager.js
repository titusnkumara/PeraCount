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
var manager = {
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
        console.log("manager is ready");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'manager.receivedEvent(...);'
    onDeviceReady: function() {
        manager.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
    }
};


var dataManager = {

    initialize : function(){
        // register click events
        dataManager.registerClickEvents();

        // initialize toggle button
        var controlData = localStorage.getObject('ControlData');
        dataManager.setStateForToggle(controlData.vibration);

    },
    initializeComponents : function(){
        // initialize save project button
        initializeSavebutton();
        initializeClearDatabutton();
        function initializeClearDatabutton(){
            var object = localStorage.getObject('ProjectData');
            var button = document.getElementById("clearData");
            if(object){
                // then we have clear data button
                button.disabled = false;
            }
            else{
                // we should disable button
                 button.disabled = true;
            }
        }
        function initializeSavebutton(){
            var object = localStorage.getObject('ProjectData');
            var button = document.getElementById("saveProject");
            if(object){
                // then we have save project icon
                button.disabled = false;
            }
            else{
                // we should disable button
                 button.disabled = true;
            }
        }
    },

    registerClickEvents : function(){
        document.getElementById("viewProject").addEventListener("click", dataManager.saveProject);
        document.getElementById("clearData").addEventListener("click", dataManager.clearData);
        document.getElementById("switch1").addEventListener("click", dataManager.vibrateHandler);

    },
    
    setStateForToggle : function(state){
        console.log("Setting state for toggle");
        if(state){
            document.getElementById("switchlable").class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked";
            document.getElementById("switch1").checked = true;
        }else{
            document.getElementById("switchlable").class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded ";
             document.getElementById("switch1").checked = false;
        }
    },

    vibrateHandler : function(){
        console.log("Clicked toggle");
        var controlData = localStorage.getObject('ControlData');
        controlData.vibration = this.checked;

        // save new vibration state
        localStorage.setObject('ControlData',controlData);
        if(this.checked){
            console.log("Vibration on");
        }else{
            console.log("vibration off");
        }
        dataManager.setStateForToggle(this.checked);
    },
    saveProject : function(){
        // vibrating
        navigator.vibrate(50);
        console.log("Opening project");
        console.log("View data");
        var projectAlive = localStorage.getObject('ProjectData');
        console.dir(projectAlive);
        if(projectAlive){
            // opening a file
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSuccess, onFileError);

            function onFileSuccess(fileSystem) {
                var filepath = fileSystem.root.toURL();
                var controlData = localStorage.getObject('ControlData');
                console.dir(controlData);
                var filename = controlData.filename;
                console.log(filepath+filename);
                cordova.plugins.fileOpener2.open(
                    filepath+filename, 
                    'text/plain', 
                    {
                        error : function(){ console.log("file open error");}, 
                        success : function(){ console.log("opened"); } 
                    } 
                );


            }

            function onFileError(){
                console.log("File system error");
            }
        }
        

    },
    clearData : function(){
        // vibrating
        navigator.vibrate(50);
        console.log("clearing data");

        // should confirm to clear the data

        // show the confirm dialog
        navigator.notification.confirm("Do you want to clear project data", confirmCallback);

        function confirmCallback(id){
            //if only ok set object

            //I want to save these data to the database
            //object name is projectData
            if(id==1){
                // saving data
                localStorage.setObject('ProjectData', null);
                localStorage.setObject('LastVehicle', null);
                var obj = localStorage.getObject('ControlData');
                obj.filename = 'untitled';
                localStorage.setObject('ControlData',obj);
                showToast("Data cleared");
            }
            else{
               showToast("Data not cleared");
            }
            dataManager.initializeComponents();
        }

        function showToast(message){
            window.plugins.toast.showWithOptions({
                message: message,
                duration: "short",
                position: "center"
              });
        }

    }


}







// initializing the page
manager.initialize();

// initializing the worker
dataManager.initialize();



