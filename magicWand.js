// ***********************************************   Package Imports   ************************************************
const phidget22 = require('phidget22');


// ***********************************************   Phidget I/O Variables   *******************************************
let wandControlSystem = {
  aLED:'', // 0 Isabella: yellow, Olivia: blue
  bLED:'', // 1 Isabella: green, Olivia: green
  cLED:'', // 2 Isabella: blue, Olivia: yellow
  dLED:'', // 3 Isabella: red, Olivia: red
  accelerometer:'',
  maxAcceleration:0
};



// ***********************************************   Phidget Board Initialization ************************************
console.log('Phidget connecting');
var SERVER_PORT = 5661;
var hostName = '127.0.0.1';
var conn = new phidget22.Connection(SERVER_PORT, hostName, { name: 'Server Connection', passwd: '' });
conn.connect(wandControlSystem)
  .then(initializePhidgetBoards(wandControlSystem))
  .catch(function (err) {
    console.error('Error connecting to phidget:', err.message);
    process.exit(1);
  });

async function initializePhidgetBoards( wandControlSystem) {
  let aLED = new phidget22.DigitalOutput();
  aLED.setHubPort(5);
  aLED.setChannel(0);
  await aLED.open();
  wandControlSystem.aLED = aLED;
  console.log('first LED attached');

  let bLED = new phidget22.DigitalOutput();
  bLED.setHubPort(5);
  bLED.setChannel(1);
  await bLED.open();
  wandControlSystem.bLED = bLED;
  console.log('second LED attached');

  let cLED = new phidget22.DigitalOutput();
  cLED.setHubPort(5);
  cLED.setChannel(2);
  await cLED.open();
  wandControlSystem.cLED = cLED;
  console.log('third LED attached');

  let dLED = new phidget22.DigitalOutput();
  dLED.setHubPort(5);
  dLED.setChannel(3);
  await dLED.open();
  wandControlSystem.dLED = dLED;
  console.log('fourth LED attached');

  var accelerometer = new phidget22.Accelerometer();
  accelerometer.setHubPort(3);
//   accelerometer.setChannel(0);
//   accelerometer.setDataInterval(500);
  await accelerometer.open();
  wandControlSystem.accelerometer = accelerometer;
  console.log('accelerometer attached');
  
  console.log(`Fractional still control system established`);
  runWandProgram();
  return true;
}

function runWandProgram() {

	wandControlSystem.accelerometer.onAccelerationChange = function (acc, timestamp) {
        var gacc = this.getAcceleration();
        let currentAcceleration = gacc[0]+gacc[1]+gacc[2];
        console.log(`max accel: ${wandControlSystem.maxAcceleration}`);
        let dLEDstatus = wandControlSystem.dLED.getState();
        if (currentAcceleration >= wandControlSystem.maxAcceleration) {
            console.log(`new max: ${currentAcceleration}`);
            wandControlSystem.maxAcceleration = currentAcceleration;
            wandControlSystem.dLED.setState(!dLEDstatus);
        }
        
	};

	ch.onError = function (code, msg) {
		console.error("Channel error", msg);
	};

}