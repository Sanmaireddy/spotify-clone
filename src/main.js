import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  var temp = localStorage.getItem("accessToken");
  //window.location = "/login/login.html";
  if (temp) {
    window.location = "/dashboard/dashboard.html"; //.herf should work but its not working but w/o .herf it is working
  } else {
    window.location = "/login/login.html";
  }
});
