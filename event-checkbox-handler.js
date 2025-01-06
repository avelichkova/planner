const checkBox = document.getElementById('check1');
const text = document.getElementById('text');

function checkChanger() {
    if (checkBox.checked == true){
        console.log("checked");
        text.style.display = "block";
      } else {
        console.log("not checked");
        text.style.display = "none";
      }
}
