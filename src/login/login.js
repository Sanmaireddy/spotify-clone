import { ACCESS_TOKEN, EXPIRES_IN, TOKEN_TYPE } from "../common";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const scopes =
  "user-top-read user-follow-read playlist-read-private user-library-read"; //things that u r gonna access
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const APP_URL = import.meta.env.VITE_APP_URL;

const authoriseUser = () => {
  console.log(CLIENT_ID);
  console.log(REDIRECT_URI);
  const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&scope=${scopes}&redirect_uri=${REDIRECT_URI}&show_dialog=true"`;
  window.open(url, "login", "width=800,height=600");
};
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", authoriseUser);
});

window.setItemsInLocalStorage = ({ accessToken, tokenType, expiresIn }) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(TOKEN_TYPE, tokenType);
  localStorage.setItem(EXPIRES_IN, Date.now() + expiresIn * 1000);
};

window.addEventListener("load", () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken) {
    console.log("ub");
    window.location = `${APP_URL}/dashboard/dashboard.html`;
  }
  //if window is still open
  if (window.opener !== null && !window.opener.closed) {
    window.focus();
    if (window.location.href.includes("error")) {
      window.close();
    }
    const { hash } = window.location;
    const searchParams = new URLSearchParams(hash);
    const accessToken = searchParams.get("#access_token");
    const tokenType = searchParams.get("token_type");
    const expiresIn = searchParams.get("expires_in");
    if (accessToken) {
      window.close();
      console.log(accessToken, tokenType, expiresIn);
      window.setItemsInLocalStorage({
        accessToken,
        tokenType,
        expiresIn,
      });
      window.opener.location = `${APP_URL}/dashboard/dashboard.html`;
    } else {
      window.close();
    }
  }
});
