// ***********************************************   Package Imports   ************************************************
const phidget22 = require('phidget22');


// ***********************************************   Phidget I/O Variables   *******************************************
let wandControlSystem = {
  aLED:'', // 0 Isabella: yellow, Olivia: blue
  bLED:'', // 1 Isabella: green, Olivia: green
  cLED:'', // 2 Isabella: blue, Olivia: yellow
  dLED:'', // 3 Isabella: red, Olivia: red
  accelerometer:'',
  isActive:false
};

let timeToLeaveLEDsOnAfterWaivingWand = 1500; // milliseconds
let timeToLeaveLEDsOnAfterSpell = 10000; // milliseconds



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

function turnOffAllLEDs() {
    console.log(`turning off`);
    wandControlSystem.aLED.setState(false);
    wandControlSystem.bLED.setState(false);
    wandControlSystem.cLED.setState(false);
    wandControlSystem.dLED.setState(false);
}

function turnOnLEDs(numberOfLEDs) {
    switch (numberOfLEDs) {
        case 0:
            turnOffAllLEDs();
            break;
        case 1:
            wandControlSystem.aLED.setState(true);
            wandControlSystem.bLED.setState(false);
            wandControlSystem.cLED.setState(false);
            wandControlSystem.dLED.setState(false);
            break;
        case 2:
            wandControlSystem.aLED.setState(true);
            wandControlSystem.bLED.setState(true);
            wandControlSystem.cLED.setState(false);
            wandControlSystem.dLED.setState(false);
            break;
        case 3:
            wandControlSystem.aLED.setState(true);
            wandControlSystem.bLED.setState(true);
            wandControlSystem.cLED.setState(true);
            wandControlSystem.dLED.setState(false);
            break;
        case 4:
            wandControlSystem.aLED.setState(true);
            wandControlSystem.bLED.setState(true);
            wandControlSystem.cLED.setState(true);
            wandControlSystem.dLED.setState(true);
            break;
        default:
            turnOffAllLEDs();
    }
}

function runWandProgram() {
	wandControlSystem.accelerometer.onAccelerationChange = function (acc, timestamp) {
        let gacc = this.getAcceleration();
        let currentAcceleration = gacc[0]+gacc[1]+gacc[2];
        console.log(currentAcceleration);
        if (!wandControlSystem.isActive && currentAcceleration >0.25 && currentAcceleration <1.5) {
            wandControlSystem.isActive = true;
            turnOnLEDs(1);
            setTimeout(() => {
                turnOffAllLEDs()
                wandControlSystem.isActive = false;
            }, timeToLeaveLEDsOnAfterWaivingWand);
        } else if (!wandControlSystem.isActive && currentAcceleration >= 1.5 && currentAcceleration < 3) {
            wandControlSystem.isActive = true;
            turnOnLEDs(2);
            setTimeout(() => {
                turnOffAllLEDs()
                wandControlSystem.isActive = false;
            }, timeToLeaveLEDsOnAfterWaivingWand);
        } else if (!wandControlSystem.isActive && currentAcceleration >= 3 && currentAcceleration < 5) {
            wandControlSystem.isActive = true;
            turnOnLEDs(3);
            setTimeout(() => {
                turnOffAllLEDs()
                wandControlSystem.isActive = false;
            }, timeToLeaveLEDsOnAfterWaivingWand);
        } else if (!wandControlSystem.isActive && currentAcceleration >= 5) {
            wandControlSystem.isActive = true;
            turnOnLEDs(4);
            setTimeout(() => {
                turnOffAllLEDs()
                wandControlSystem.isActive = false;
            }, timeToLeaveLEDsOnAfterSpell);
        }
        
	};
}