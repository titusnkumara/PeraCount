/*
* This file is responsible for managing all the logic for
* Setup page
*
*
 */
var setup = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        // console.log("Device is ready");
    },
    onDeviceReady: function() {
        setup.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};





var worker = {

    start : function(){
        document.getElementById("datePicker").addEventListener("click", datePickAction);

        var options = {
            date: new Date(),
            mode: 'date'
        };

        function onSuccessDate(date) {
            console.log('Selected date: ' + date);
            var res = date.toDateString().split(" ");

            var year = res[3];
            var month = res[1];
            var dateofMonth = res[2];
            var day = res[0];


            var fulldate = year+"-"+month+"-"+dateofMonth; //picking year, month and day
            console.log("full Date "+fulldate);
            document.getElementById("datePicker").value = fulldate;

            //assigning the dirty class after changing the value
            document.getElementById('datePickerDiv').className ='mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-dirty';


            //findout the current day using the date

            var weekday = {Sun:"Sunday",Mon:"Monday",Tue:"Tuesday",Wed:"Wednesday",Thu:"Thursday",Fri:"Friday",Sat:"Saturday"};

            var currentDay = weekday[day]; 

            console.log(currentDay);
            document.getElementById("dayPicker").value = currentDay;
             //assigning the dirty class after changing the value
            document.getElementById('dayPickerDiv').className = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-dirty';

        }

        function onErrorDate(error) { // Android only
            console.log('Error: ' + error);
        }



        function datePickAction(){
            console.log("Clicked date picker");
            this.value = "";
            datePicker.show(options, onSuccessDate, onErrorDate);
        }

    },

}



var dataPicker = {

    registerEvents : function(){
        document.getElementById("saveProjectButton").addEventListener("click", dataPicker.saveDataFromForm);
    },
    saveDataFromForm : function(){
        console.log("You called submit button");

        // validate form

        var form = document.forms[0];

        //retrieving elements from form

        var projectName = form.projectName.value;
        var shortName = form.shortName.value;
        var datePicker  = form.datePicker.value;
        var dayPicker = form.dayPicker.value;
        var station = form.station.value;
        var road = form.road.value;
        var movement = form.movement.value;
        var fromValue = form.from.value;
        var toValue = form.to.value;

        var dataSet = {projectName:projectName,shortName:shortName,date:datePicker,day:dayPicker,station:station,road:road,movement:movement,fromValue:fromValue,toValue:toValue};
        console.log(dataSet);

        //validate data
        var result =  dataPicker.validateData(dataSet);

        if(result==false){
            // cannot proceed
           showErroForSubmit();
        }
        else{
            // show the confirm dialog
            navigator.notification.confirm("Do you want to overwrite previous project data",confirmCallback);
        }

        function showErroForSubmit(){
                alert("Cannot proceed, fill all the data");

        }

        // callback function should have dataSet so I am placing it here

        function confirmCallback(id){
                //if only ok set object

                //I want to save these data to the database
                //object name is projectData
                if(id==1){
                    // saving data
                    // ProjectData contails details about project
                    localStorage.setObject('ProjectData', dataSet);

                    //setting up the file name

                    // This should always available at this poing
                    // This is control data object
                    var obj = localStorage.getObject('ControlData');
                    if(obj){
                        //Creating unique name
                        var timeForName =new Date().getTime().toString();
                        var smallTime = timeForName.substr(timeForName.length - 5);
                        var newDateFormat = datePicker.toString().split('-').join('');
                        obj.filename = dataSet.shortName+"_"+dataSet.station+"_"+dataSet.movement+"_"+newDateFormat+"_"+smallTime+".csv";

                        // setting unique name
                        localStorage.setObject('ControlData',obj);
                        console.log("Unique file name setted "+obj.filename);
                        console.log("Creating the file");

                        // calling function to create and save project data
                        dataPicker.createFileAndSaveProjectData(obj,dataSet);
                    }else{
                        alert("something went wrong");
                        window.location = "index.html";
                    }

                    showToast("Data saved");
                    // redirect to the home page
                    setTimeout(function () {
                            window.location = "index.html";
                            
                    }, 200);
                    
                   
                }
                else{
                   showToast("Data not saved");
                }

                function showToast(message){
                    window.plugins.toast.showWithOptions({
                        message: message,
                        duration: "short",
                        position: "center"
                      });
                }


        }

    },

    validateData : function(dataSet){
        //Iterate through and check whether they are empty
            for (var key in dataSet) {
              if (dataSet.hasOwnProperty(key)) {
                if(dataSet[key]==""){
                    return false;
                }
                console.log(key + " -> " + dataSet[key]);
              }
            }
            return true;
    },
    createFileAndSaveProjectData : function(controlData,projectData){
        var filename = controlData.filename;

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
                console.log("topics write success "+evt);
                writer.seek(writer.length);

                writer.onwriteend = function(evt){
                    console.log("Project Details written");
                }
                writer.write('"'+projectData.projectName+'_'+projectData.shortName+'","'+projectData.station+'_'+projectData.road+'","'+projectData.fromValue+'_'+projectData.toValue+'","'+projectData.movement+'"\n');
                

            };
            console.log("actually writing");
            // write the headers
            writer.write("Date,Time,Seconds,Vehicle\n");
            
            // writing project related data
            //


        }



        /*
        // File reading part
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileReadSuccess, onFileError);


        function onFileReadSuccess(fileSystem){

            // getting the file name from localstorage
            var obj = localStorage.getObject('ControlData');
            if(obj){
                console.log(obj.filename);
                fileSystem.root.getFile(obj.filename, null, fileReading, FileOpenfail);
                console.dir(fileSystem);
            }
            else{
                alert("something went wrong");
            }
        }

        function fileReading(fileEntry){
            fileEntry.file(readAsText, FileOpenfail);
        }

        function readAsText(file) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                console.log("Read as text");
                console.log("Result is: "+evt.target.result);
            };
            reader.readAsText(file);
        }

        function FileOpenfail(){
            console.log("File open failed");
        }
        function onFileError(){
            console.log("File system error");
        }
        */



    }


}




setup.initialize();
worker.start();
dataPicker.registerEvents();



/*
Remove these lines when you are refactoring this

*/

/*
document.getElementById("saveProjectButton").addEventListener("click", saveDataFromForm);



function saveDataFromForm(){
    console.log("You called submit button");

    // validate form

    var form = document.forms[0];

    //retrieving elements from form

    var projectName = form.projectName.value;
    var datePicker  = form.datePicker.value;
    var dayPicker = form.dayPicker.value;
    var station = form.station.value;
    var road = form.road.value;
    var movement = form.movement.value;
    var fromValue = form.from.value;
    var toValue = form.to.value;

    var dataSet = {projectName:projectName,date:datePicker,day:dayPicker,station:station,road:road,movement:movement,fromValue:fromValue,toValue:toValue};
    console.log(dataSet);

    //validate data
    var result =  validateData(dataSet);

    if(result==false){
        // cannot proceed
       showErroForSubmit();
    }
    else{
        // show the confirm dialog
        navigator.notification.confirm("Do you want to overwrite previous project data", confirmCallback);
    }

    function confirmCallback(id){
        //if only ok set object

        //I want to save these data to the database
        //object name is projectData
        if(id==1){
            // saving data
            localStorage.setObject('ProjectData', dataSet);

            //setting up the file name

            // This should always available at this poing
            var obj = localStorage.getObject('ControlData');
            if(obj){
                //Creating unique name
                var timeForName =new Date().getTime().toString();
                var smallTime = timeForName.substr(timeForName.length - 5);
                var newDateFormat = datePicker.toString().replace('-','');
                obj.filename = dataSet.projectName+"_"+newDateFormat+"_"+smallTime+".csv";

                // setting unique name
                localStorage.setObject('ControlData',obj);
                console.log("Unique file name setted "+obj.filename);
            }else{
                alert("something went wrong");
                window.location = "index.html";
            }

            showToast("Data saved");
            // redirect to the home page
            setTimeout(function () {
                    window.location = "index.html";
                    
            }, 200);
           
        }
        else{
           showToast("Data not saved");
        }
    }

    function showToast(message){
        window.plugins.toast.showWithOptions({
            message: message,
            duration: "short",
            position: "center"
          });
    }

    function validateData(dataSet){
    //Iterate through and check whether they are empty
        for (var key in dataSet) {
          if (dataSet.hasOwnProperty(key)) {
            if(dataSet[key]==""){
                return false;
            }
            console.log(key + " -> " + dataSet[key]);
          }
        }
        return true;
    }

    function showErroForSubmit(){
        alert("Cannot proceed, fill all the data");

    }



}


*/