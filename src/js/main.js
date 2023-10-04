let accelerometer = null;
const ax = document.getElementById('ax');
const ay = document.getElementById('ay');
const az = document.getElementById('az');
const canvasPlot = document.getElementById("canvas-plot")

// INIT
function accelerometerUpdate(e) {
    var aX = e.accelerationIncludingGravity.x*1;
    var aY = e.accelerationIncludingGravity.y*1;
    var aZ = e.accelerationIncludingGravity.z*1;
    // update labels
    ax.innerHTML = "X: " + aX;
    ay.innerHTML = "Y: " + aY;
    az.innerHTML = "Z: " + aZ;
    // store data
    structData.time.push(e.timeStamp)
    structData.accel[0].push(aX);
    structData.accel[1].push(aY);
    structData.accel[2].push(aZ);

    plotData();
 }
structData = {
    'time': [],
    'accel': [[],[],[]],
    'labels': ['X', 'Y', 'Z']
};

try {
    console.log('starting accelerometer')
    accelerometer = new Accelerometer({ frequency: 60 });
    accelerometer.onerror = (event) => {
        // Handle runtime errors.
        if (event.error.name === 'NotAllowedError') {
            console.log('Permission to access sensor was denied.');
        } else if (event.error.name === 'NotReadableError') {
            console.log('Cannot connect to the sensor.');
        }
    };
    accelerometer.onreading = (e) => {
        ax.innerHTML = "X: " + e.currentTarget.x;
        ay.innerHTML = "Y: " + e.currentTarget.y;
        az.innerHTML = "Z: " + e.currentTarget.z;
        //console.log([e.currentTarget.x, e.currentTarget.y, e.currentTarget.z]);
        // store data
        structData.time.push(e.timeStamp)
        structData.accel[0].push(e.currentTarget.x);
        structData.accel[1].push(e.currentTarget.y);
        structData.accel[2].push(e.currentTarget.z);

        plotData();
    };
    //accelerometer.start();
} catch (error) {
    // Handle construction errors.
    if (error.name === 'SecurityError') {
        console.log('Sensor construction was blocked by the Permissions Policy.');
    } else if (error.name === 'ReferenceError') {
        console.log('Sensor is not supported by the User Agent.');
    } else {
        throw error;
    }
}

window.onload = function () {
    initPlot();
    if (window.DeviceMotionEvent == undefined) {
        //No accelerometer is present. Use buttons. 
        alert("no accelerometer");
    }
    else {
        //alert("accelerometer found");
        window.addEventListener("devicemotion", accelerometerUpdate, true);
    }
}

//#region PLOT FUNCTIONS
function initPlot() {
    // Define Data
    var data = [{
        x: [],
        y: [],
        mode: "markers"
    }];

    // Define Layout
    var layout = {
        autosize: false,
        height: 400,
        width: 800,
        title: "Foot XY-Time"
    };

    // Display using Plotly
    Plotly.newPlot(canvasPlot, data, layout);
}

function plotData() {
    // Define Data
    data = []
    for (i=0; i<3; i++) {
        var trace = {
            x: structData.time,
            y: structData.accel[i],
            name: structData.labels[i],
            mode: 'lines'
        };

        data.push(trace)
    }
    console.log(structData.time[structData.time.length - 1])

    // Define Layout
    var layout = {
        title: "Acceleration XYZ-Time",
        xaxis: {
            autorange: false,
            range: [structData.time[0], structData.time[structData.time.length - 1]],
            title: 'Timestamp'
        },
        yaxis: {
            title: 'Acceleration'
        }
    };

    // Display using Plotly
    Plotly.newPlot(canvasPlot, data, layout);
}
//#endregion