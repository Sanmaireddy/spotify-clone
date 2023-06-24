import "./style.css";
const APP_URL = import.meta.env.VITE_APP_URL;

document.addEventListener("DOMContentLoaded", () => {
  var temp = localStorage.getItem("accessToken");
  //window.location = "/login/login.html";
  if (temp) {
    window.location = `${APP_URL}/dashboard/dashboard.html`; //.herf should work but its not working but w/o .herf it is working
  } else {
    window.location = `${APP_URL}/login/login.html`;
  }
});
