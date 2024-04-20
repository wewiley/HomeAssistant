import xapi from 'xapi';
var peoplePresence = '';
var peopleCount = -1;
var httpBody = {Occupied: '', peopleCount: ''};
var webhookURL_ON = "" //ON WEBHOOK URL
var webhookURL_OFF = "" //OFF WEBHOOK URL

async function checkPeoplePresence(peoplePresence) {
  console.log(peoplePresence);
  if (peoplePresence === '') {
    peoplePresence = await xapi.Status.RoomAnalytics.PeoplePresence.get()    
  }
  console.log(peoplePresence)
  if (peoplePresence === "Yes") {
      console.log('Updating Home Assistant - Office Occupied');
      TurnOn();
      
  }
  else {
      console.log('Updating Home Assistant - Office Not Occupied');
      httpBody.Occupied = "No";
      TurnOff();
  }
  console.log(`Occupied = ${httpBody.Occupied}`);
}



function TurnOn() {
  xapi.Command.HttpClient.Post(
    { Timeout: 30, Url: webhookURL_ON }, '');
}

function TurnOff() {
  xapi.Command.HttpClient.Post(
    { Timeout: 30, Url: webhookURL_OFF }, '');
}

//run function 1 time when script loads before relying on subscription to event changes
checkPeoplePresence(peoplePresence);

//Subscribe to Presence Notifications
xapi.Status.RoomAnalytics.PeoplePresence
    .on(peoplePresence => checkPeoplePresence(peoplePresence));  