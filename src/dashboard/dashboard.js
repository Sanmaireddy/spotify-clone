import { fetchRequest } from "../api";
import { ENDPOINT, SECTIONYTPE, logout } from "../common";

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

const onPlaylistItemClicked = (event, id) => {
  //event.target.parentElement is the elem that is clicked
  console.log(event.target.parentElement);
  const section = { type: SECTIONYTPE.PLAYLIST, playlist: id };
  history.pushState(section, "", `playlist/${id}`); //displayed @ url part
  loadSection(section);
};

const loadPlaylist = async (endpoint, elementId) => {
  const {
    playlists: { items },
  } = await fetchRequest(endpoint);
  const playlistItemsSection = document.querySelector(`#${elementId}`);
  for (let { name, description, images, id } of items) {
    const playlistItem = document.createElement("section");
    playlistItem.className =
      "rounded  p-4 hover: cursor-pointer hover:bg-light-black";
    playlistItem.id = id;
    //console.log(playlistItem);
    const [{ url: imageUrl }] = images;
    playlistItem.addEventListener("click", (event) =>
      onPlaylistItemClicked(event, id)
    );
    playlistItem.innerHTML = `<img src="${imageUrl}" alt="${name}" class="rounded mb-2 object-contain shadow"/>
              <h2 class="text-base">${name}</h2>
              <h3 class="text-sm text-secondary font-semibold mb-4 truncate line-clamp-2">${description}</h3>`;
    playlistItemsSection.appendChild(playlistItem);
  }
  //playlistItemsSection.innerHTML = playlistItems;
  //console.log(featuredPlaylist);
};

const loadPlaylists = () => {
  loadPlaylist(ENDPOINT.featuredPlaylist, "featured-playlist-items");
  loadPlaylist(ENDPOINT.toplists, "top-playlist-items");
};

const fillContentforDashboard = () => {
  const pageContent = document.querySelector("#page-content");
  const playlistMap = new Map([
    //add more playlists here everything will be taken care
    ["featured", "featured-playlist-items"],
    ["top playlists", "top-playlist-items"],
  ]);
  let innerHTML = "";
  for (let [type, id] of playlistMap) {
    innerHTML += `<article class="p-4">
          <h1 class="mb-4 text-2xl font-bold capitalize">${type}</h1>
          <section
            id="${id}"
            class="featured-songs grid grid-cols-auto-fill-cards gap-4"
          ></section>
        </article>`;
  }
  pageContent.innerHTML = innerHTML;
};

const formatTime = (durarion) => {
  const min = Math.floor(durarion / 60000);
  const sec = ((durarion % 6000) / 1000).toFixed(0);
  const formatedTime =
    sec == 60 ? (min += 1 + ":00") : min + ":" + (sec < 10 ? "0" : "") + sec;
  return formatedTime;
};

const loadPlaylistTracks = ({ tracks }) => {
  console.log(tracks);
  const trackSections = document.querySelector("#tracks");
  let trackNo = 1;
  for (let trackItem of tracks.items) {
    let subTrack = trackItem.track;
    let { id, artists, name, album, duration_ms: duration } = subTrack;
    let track = document.createElement("section");
    track.id = id;
    track.className =
      "track p-1 grid grid-cols-[50px_2fr_1fr_50px] items-center justify-items-start gap-4 rounded-md hover:bg-light-black";
    let image = album.images.find((img) => img.height === 64);
    track.innerHTML = `
              <p class="justify-self-center">${trackNo++}</p>
              <section class="grid grid-cols-[auto_1fr] place-items-center">
                <img calss="h-8 w-8" src="${image.url}" alt="${name}" />
                <article calss="flex flex-col gap-1">
                  <h2 class="text-xl text-primary">${name}</h2>
                  <p class="text-sm">${Array.from(
                    artists,
                    (artist) => artist.name
                  ).join(", ")}</p>
                </article>
              </section>
              <p>${album.name}</p>
              <p>${formatTime(duration)}</p>
     `;
    trackSections.appendChild(track);
  }
};
const fillContentforPlaylist = async (playlistId) => {
  const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
  const pageContent = document.querySelector("#page-content");
  pageContent.innerHTML = `<header id="playlist-header" class="px-8 py-4">
          <nav>
            <ul class="grid grid-cols-[50px_2fr_1fr_50px] gap-4 text-secondary">
              <li class="justify-self-center">#</li>
              <li>Title</li>
              <li>Album</li>
              <li>time</li>
            </ul>
          </nav>
        </header>
        <section class="px-8 text-secondary" id="tracks">
        </section>
        `;
  loadPlaylistTracks(playlist);
  //console.log(playlist);
};

const loadSection = (section) => {
  if (section.type === SECTIONYTPE.DASHBOARD) {
    fillContentforDashboard();
    loadPlaylists();
  } else if (section.type === SECTIONYTPE.PLAYLIST) {
    //loadelems for playlist
    fillContentforPlaylist(section.playlist);
  }
};
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  const section = { type: SECTIONYTPE.DASHBOARD };
  history.pushState(section, "", "");
  //fills the html for the playlists
  loadSection(section);
  const profileMenu = document.querySelector("#profile-menu");
  document.addEventListener("click", () => {
    if (!profileMenu.classList.contains("hidden")) {
      profileMenu.classList.add("hidden");
    }
  });

  document.querySelector(".content").addEventListener("scroll", (event) => {
    const { scrollTop } = event.target;
    const header = document.querySelector(".header");
    if (scrollTop >= header.offsetHeight) {
      header.classList.add("sticky", "top-0", "bg-black-secondary");
      header.classList.remove("bg-transparent");
    } else {
      header.classList.remove("sticky", "top-0", "bg-black-secondary");
      header.classList.add("bg-transparent");
    }
    if (history.state.type === SECTIONYTPE.PLAYLIST) {
      const playlistHeader = document.querySelector("#playlist-header");
      if (scrollTop >= playlistHeader.offsetHeight) {
        playlistHeader.classList.add("sticky", `top-[2px]`);
      }
    }
  });

  window.addEventListener("popstate", (event) => {
    //where backbtn is clicked popstate is called
    loadSection(event.state); //loads prev state
  });
});
