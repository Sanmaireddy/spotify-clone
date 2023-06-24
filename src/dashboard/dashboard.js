import { fetchRequest } from "../api";
import { ENDPOINT, logout } from "../common";

const onProfileClick = (event) => {
  //work on this part
  event.stopPropagation();
  const profileMenu = document.querySelector("#profile-menu");
  profileMenu.classList.toggle("hidden");
  if (!profileMenu.classList.contains("hidden")) {
    profileMenu.querySelector("li#logout").addEventListener("click", logout);
  }
};

const loadUserProfile = async () => {
  const defaultImage = document.querySelector("#default-image");
  const profileButton = document.querySelector("#user-profile-btn");
  const displayNameElement = document.querySelector("#display-name");

  const { display_name: displayName, images } = await fetchRequest(
    ENDPOINT.userInfo
  );
  //console.log(userInfo);
  if (images?.length) {
    defaultImage.classList.add("hidden");
  } else {
    defaultImage.classList.remove("hidden");
  }
  displayNameElement.textContent = displayName;
  profileButton.addEventListener("click", onProfileClick);
};

const onPlaylistItemClicked = (event) => {
  //event.target.parentElement is the elem that is clicked
  console.log(event.target.parentElement);
};

const loadFeaturedPlaylist = async () => {
  const {
    playlists: { items },
  } = await fetchRequest(ENDPOINT.featuredPlaylist);
  const playlistItemsSection = document.querySelector(
    "#featured-playlist-items"
  );
  for (let { name, description, images, id } of items) {
    const playlistItem = document.createElement("section");
    playlistItem.className =
      "rounded border-2 border-solid p-4 hover: cursor-pointer";
    playlistItem.id = id;
    //console.log(playlistItem);
    const [{ url: imageUrl }] = images;
    playlistItem.addEventListener("click", onPlaylistItemClicked);
    playlistItem.innerHTML = `<img src="${imageUrl}" alt="${name}" class="rounded mb-2 object-contain shadow"/>
              <h2 class="text-sm">${name}</h2>
              <h3 class="text-xs">${description}</h3>`;
    playlistItemsSection.appendChild(playlistItem);
  }
  //playlistItemsSection.innerHTML = playlistItems;
  //console.log(featuredPlaylist);
};
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  loadFeaturedPlaylist();
  const profileMenu = document.querySelector("#profile-menu");
  document.addEventListener("click", () => {
    if (!profileMenu.classList.contains("hidden")) {
      profileMenu.classList.add("hidden");
    }
  });
});
