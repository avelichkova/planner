const checkBox = document.getElementById('check0');
const text = document.getElementById('text');
// const { data } = require("./agenda");

function deleteEvent(event, index){
  const route = '/agenda/delete/' + (Number(index) + 1);
  fetch(route, {
      method: 'DELETE',
      headers: {
          'Content-Type' : 'application-json'
      }, 
      body: JSON.stringify({event: event, index: index})
  }).then(data => {
      location.reload();
  })
  .catch(err => {
      console.log('Error while editing event: ' + err);
  })
}

function checkChanger() {
    if (checkBox.checked == true){
        
        console.log("checked");
        text.style.display = "block";
      } else {
        event.isChecked = false;
        console.log("not checked");
        text.style.display = "none";
      }
}

checkChanger();
// module.exports = { checkChanger };