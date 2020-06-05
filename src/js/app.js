

//defining classes to hold the data
class Trips {
  constructor() {
    this.trips = [];
  }

  add(start, end, length, type) {
    this.trips.push(new Trip(start, end, length, type));
  }
  deleteAt(index) {
    this.trips.splice(index, 1);
  }
}
class Trip {
  constructor(start, end, length, type) {
    this.start = start;
    this.end = end;
    this.length = length;
    this.type = type;
  }
}

//create new log of trips and an individual trip as a placeholder
const tripLog = new Trips();

const newTrip = new Trip();


//for displaying the odometer reading on screen
let odElement = document.getElementById('odometer');

gm.info.watchVehicleData(watchOdometer, ['odometer']);


function watchOdometer(data) {
  let odometer = data.odometer;
  odElement.innerHTML = odometer;
  console.log(odometer)

}






const form = document.querySelector("form"); // stores reference to the form in a variable


form.addEventListener("submit", e => { // listens for submit and then calls a function holding the event object
  e.preventDefault(); // prevents the page from refreshing 
  let buttons = document.getElementsByName('radio');
  //looks at each button and checks for which one is true
  for (i = 0; i < buttons.length; i++) {
    if (buttons[i].checked)
      // adds the value of the true button to the trip
      newTrip.type = buttons[i].value;

  }

  //runs the odometer reading and stores in the trip
  gm.info.getVehicleData(displayOdometer, ['odometer']);

  function displayOdometer(data) {
    newTrip.start = data.odometer;

  }


  console.log('trip start ', newTrip);

})


//runs the odometer reading and stores in the trip end, calculating the length of the trip
//currently the first trip added isn't calculating end and length?
function updateOdometer() {

  gm.info.getVehicleData(displayOdometer, ['odometer']);

  function displayOdometer(data) {
    newTrip.end = data.odometer;
    newTrip.length = newTrip.end - newTrip.start

  }

  console.log('trip added ', newTrip);
  // adds the trip to the trip log
  // to be added: code to prevent addition if there's no trip length
  tripLog.add(newTrip.start, newTrip.end, newTrip.length, newTrip.type);

  console.log('trips in log ', tripLog.trips);

  display();
}


//displays the trips on screen
function display() {
  document.querySelector("#trips").innerHTML = ""; // clears for each load
  tripLog.trips.forEach((trip, index) => { // loops through contacts and logs their index
    const newRecord = document.createElement("div"); // creates a new div stored into a variable
    newRecord.classList.add("record"); // adds a class to the div
    newRecord.innerHTML = // adds the form content to the div
      `<p class="delete" data-index="${index}" >X</p>
      <p>Trip: ${trip.type}</p>
      <p>Length: ${trip.length} km</p>`;
    // // safely appending text 
    // const paragraphs = new.Entry.querySelectorAll("p");
    // paragraphs[0].innerText += contact.name;
    document.querySelector("#trips").appendChild(newRecord); // adds new div to the container div

  });

}



document.querySelector("#trips").addEventListener("click", deleteTrip);

function deleteTrip(e) { // holds the event object
  if (e.target.classList.contains("delete")) { // from the event object, references the class of the item clicked
    const index = e.target.getAttribute("data-index"); // from the event Object, references the attribute holding the index number
    tripLog.deleteAt(index); // calls the delete function
    display();
  }
};

// // Async (Recommended)
// gm.io.readFile(success, failure, '/prefs.json', { isPrivate: true });

// function success(contents) {
//   console.log(contents);
// }

// function failure(err) {
//   // handle it!

// }

// // Or...Sync
// let contents = gm.io.readFile('prefs.json');
// if (contents !== null) {
//   processContents(contents);
// }

// // read a private file
// let contents = gm.io.readFile('prefs.json', { isPrivate: true });