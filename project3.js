// Joe Dowling 2021
// Project 3
// 04/21/2021

//Make sure the delete buttons can be caught by the event listener
let initialized = false;

// Initial get request
const setup = () => {
  ajaxRequest("get");
}

const init = () => {
  //declare the two button variables
  let deleteTaskButton = [...document.querySelectorAll(".deleteButton")];
  let addTaskButton = document.querySelector("#newTaskButton");
  // adding click event listeners to buttons
  addTaskButton.addEventListener("click", function() {
    ajaxRequest("post")
  }, false);
  deleteTaskButton.forEach((remove => {
    remove.addEventListener("click", function() {
      ajaxRequest("delete")
    }, false)
  }));
  initialized = true;
}
// function executes our http verbs on the api
function ajaxRequest(method) {

  let xhr = new XMLHttpRequest();
  let url = "https://ghu8xhzgfe.execute-api.us-east-1.amazonaws.com/tasks";

  let studentID = "2978180";
  if (method == "get") {
    url += "/" + studentID;
  }
  let key = "Itcheui2tB58SlUGe8rrP8mskudGsNDT9nfKKG9S";

  let description;
  if (method == "delete") {
    description = event.currentTarget.nextSibling.nodeValue;
  } else {
    description = document.querySelector("#addNewTask").value;
  }
  let requestBody = {
    "StudentId": studentID,
    "Description": description
  };
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("x-api-key", key);
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (method == "get") {
        let items = JSON.parse(xhr.responseText).Items;
        console.log(items)
        addTasks(items);
      }
    }
  }
  if (method == "post") {
    if(!requestBody.Description) return;
    xhr.send(JSON.stringify(requestBody));
    addTasks([requestBody]);
  } else if (method == "delete") {
    removeTask(event.currentTarget);
    xhr.send(JSON.stringify(requestBody));
  } else {
    xhr.send(null);
  }
  document.querySelector("#addNewTask").value = "";
}
// Adding new tasks to the webpage/api
const addTasks = tasks => {

  let ul;
  if (ul = !document.querySelector("ul")) {
    ul = document.createElement("ul")
  } else {
    ul = document.querySelector("ul");
  }
  tasks.forEach((task => {
    let deleteIcon = document.createElement("img");
    deleteIcon.setAttribute("class", "deleteButton");
    deleteIcon.setAttribute("src", "images/deleteicon.jpg");
    let li = document.createElement("li");
    li.appendChild(deleteIcon);
    li.innerHTML += task.Description;
    li.appendChild(document.createElement("br"));
    ul.appendChild(li);
  }));
  document.body.appendChild(ul);

  let removeButtons = document.querySelectorAll("li img");
  let mostRecentButton = removeButtons[removeButtons.length - 1];
  if (mostRecentButton) {
    mostRecentButton.addEventListener("click", function() {
      ajaxRequest("delete")
    }, false);
  }
  if (initialized == true) {
    "";
  } else {
    init();
  }
}

//remove selected task from webpage/api
const removeTask = event => {

  event.parentElement.remove();
}

//Call the GET ajaxRequest upon page load
window.onload = setup;
