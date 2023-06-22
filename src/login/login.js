const CLIENT_ID = "d5e58fe8140144978d2ccc0dc75c46ba";
const scopes =
  "user-top-read user-follow-read playlist-read-private user-library-read"; //things that u r gonna access
const REDIRECT_URI = "http://localhost:3000/login/login.html";
const ACCESS_TOKEN_KEY = "accessToken";
const APP_URL = "http://localhost:3000";

const authoriseUser = () => {
  const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&scope=${scopes}&redirect_uri=${REDIRECT_URI}&show_dialog=true"`;
  window.open(url, "login", "width=800,height=600");
};
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", authoriseUser);
});

window.opener.setItemsInLocalStorage = ({
  accessToken,
  tokenType,
  expiresIn,
}) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("tokentype", tokenType);
  localStorage.setItem("expiresIn", expiresIn);
};

window.addEventListener("load", () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken) {
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
      window.opener.setItemsInLocalStorage({
        accessToken,
        tokenType,
        expiresIn,
      });
    } else {
      window.close();
    }
  }
});
