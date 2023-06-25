import { data } from "autoprefixer";
import { fetchRequest } from "../api";
import { ENDPOINT, SECTIONYTPE, logout } from "../common";

const audio = new Audio();
const volume = document.querySelector("#volume");
const playButton = document.querySelector("#play");
const totalSongDuration = document.querySelector("#total-song-duration");
const songDUrationCompleted = document.querySelector(
  "#song-duration-completed"
);
const songProgress = document.querySelector("#progress");
const timeline = document.querySelector("#timeline");
let progressInterval;

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

const onTrackSelection = (id, event) => {
  document.querySelectorAll("#tracks .track").forEach((trackItem) => {
    if (trackItem.id === id) {
      trackItem.classList.add("bg-gray", "selected");
    } else {
      trackItem.classList.remove("bg-gray", "selected");
    }
  });
};

const updateIconsForPlayMode = (id) => {
  playButton.querySelector("span").textContent = "pause_circle";
  const playButtonFromTracks = document.querySelector(`#play-track${id}`);
  playButtonFromTracks.textContent = "||";
  playButtonFromTracks.setAttribute("data-play", "");
};

// const timeline =document.quer ySelector("#")
const onAudioMetaDataLoaded = (id) => {
  totalSongDuration.textContent = `0:${audio.duration.toFixed(0)}`;
  updateIconsForPlayMode(id);
};

const updateIconsForPauseMode = (id) => {
  playButton.querySelector("span").textContent = "play_circle";
  const playButtonFromTracks = document.querySelector(`#play-track${id}`);
  playButtonFromTracks.textContent = "▶️";
  playButtonFromTracks.removeAttribute("data-play"); //take care of this part again related to play and pause
};
const onNowPLayingPlayButtonClicked = (id) => {
  if (audio.paused) {
    audio.play();
    updateIconsForPlayMode(id);
  } else {
    audio.pause();
    updateIconsForPauseMode(id);
  }
};

const onPlayTrack = (
  event,
  { image, artistNames, name, duration, previewUrl, id }
) => {
  //console.log(image, artistNames, name, duration, previewUrl, id);
  const buttonWithDataPlay = document.querySelector("[data-play]");
  const button = event.target;
  if (buttonWithDataPlay?.id === `play-track${id}`) {
    if (audio.paused) {
      audio.play();
      updateIconsForPlayMode(id);
    } else {
      audio.pause();
      updateIconsForPauseMode(id);
    }
  } else {
    const nowPlayingSongImage = document.querySelector("#now-playing-image");
    nowPlayingSongImage.src = image.url;
    const songTitle = document.querySelector("#now-playing-song");
    const artists = document.querySelector("#now-playing-artists");
    songTitle.textContent = name;
    artists.textContent = artistNames;

    audio.src = previewUrl;
    audio.removeEventListener("loadedmetadata", () =>
      onAudioMetaDataLoaded(id)
    );
    audio.addEventListener("loadedmetadata", () => onAudioMetaDataLoaded(id));
    playButton.addEventListener("click", () =>
      onNowPLayingPlayButtonClicked(id)
    );
    audio.play();
    clearInterval(progressInterval);
    //timeline.addEventListener("click");
    setInterval(() => {
      if (audio.paused) {
        return;
      }
      songDUrationCompleted.textContent = `0:${
        audio.currentTime.toFixed(0) < 10
          ? "0" + audio.currentTime.toFixed(0)
          : audio.currentTime.toFixed(0)
      }`;
      songProgress.style.width = `${
        (audio.currentTime / audio.duration) * 100
      }%`;
    }, 100);
  }
};

const loadPlaylistTracks = ({ tracks }) => {
  console.log(tracks);
  const trackSections = document.querySelector("#tracks");
  let trackNo = 1;
  for (let trackItem of tracks.items) {
    let subTrack = trackItem.track;
    let {
      id,
      artists,
      name,
      album,
      duration_ms: duration,
      preview_url: previewUrl,
    } = subTrack;
    let track = document.createElement("section");
    track.id = id;
    track.className =
      "track p-1 grid grid-cols-[50px_1fr_1fr_50px] items-center justify-items-start gap-4 rounded-md hover:bg-light-black h-25";
    let image = album.images.find((img) => img.height === 64);
    let artistNames = Array.from(artists, (artist) => artist.name).join(", ");
    track.innerHTML = `
              <p class="relative w-full flex items-center justify-center justify-self-center"><span class="track-no">${trackNo++}</span></p>
              <section class="grid grid-cols-[auto_1fr] place-items-center">
                <img class="h-10 w-10 mx-5" src="${image.url}" alt="${name}" />
                <article class="flex flex-col gap-2 justify-center">
                  <h2 class="text-base text-primary line-clamp-1">${name}</h2>
                  <p class="text-xm line-clamp-1">${artistNames}</p>
                </article>
              </section>
              <p class="text-sm">${album.name}</p>
              <p class="text-sm">${formatTime(duration)}</p>
     `;
    track.addEventListener("click", (event) => onTrackSelection(id, event));
    const playButton = document.createElement("button");
    playButton.id = `play-track${id}`;
    playButton.className = `play w-full absolute left-0 text-lg invisible`;
    playButton.textContent = "▶️";
    playButton.addEventListener("click", (event) =>
      onPlayTrack(event, { image, artistNames, name, duration, previewUrl, id })
    );
    track.querySelector("p").appendChild(playButton);
    trackSections.appendChild(track);
  }
};
const fillContentforPlaylist = async (playlistId) => {
  const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
  const pageContent = document.querySelector("#page-content");
  const { name, images, tracks } = playlist;
  const coverElement = document.querySelector("#cover-content");
  coverElement.innerHTML = `
  <img class="object-contain h-48 w-48" src="${images[0].url}" alt="" srcset="" />
            <h2 id="playlist-name" class="text-4xl">${name}</h2>
            <p id="playlist-details">${tracks.items.length} songs</p>`;

  pageContent.innerHTML = `<header id="playlist-header" class="mx-8 py-4 border-secondary border-b-[0.5px] z-10">
          <nav class="py-2">
            <ul class="grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary">
              <li class="justify-self-center">#</li>
              <li>Title</li>
              <li>Album</li>
              <li>time</li>
            </ul>
          </nav>
        </header>
        <section class="px-8 text-secondary mt-4" id="tracks">
        </section>
        `;
  loadPlaylistTracks(playlist);
  //console.log(playlist);
};

const onContentScroll = (event) => {
  const { scrollTop } = event.target;
  const header = document.querySelector(".header");
  if (scrollTop >= header.offsetHeight) {
    header.classList.add("sticky", "top-0", "bg-black");
    header.classList.remove("bg-transparent");
  } else {
    header.classList.remove("sticky", "top-0", "bg-black");
    header.classList.add("bg-transparent");
  }
  if (history.state.type === SECTIONYTPE.PLAYLIST) {
    const coverElement = document.querySelector("#cover-content");
    const playlistHeader = document.querySelector("#playlist-header");
    if (scrollTop >= coverElement.offsetHeight - header.offsetHeight) {
      playlistHeader.classList.add("sticky", "bg-black-secondary", "px-8");
      playlistHeader.classList.remove("mx-8");
      playlistHeader.style.top = `${header.offsetHeight}px`;
    } else {
      playlistHeader.classList.remove("sticky", "bg-black-secondary", "px-8");
      playlistHeader.classList.add("mx-8");
      playlistHeader.style.top = `revert`;
    }
  }
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
  //const section = { type: SECTIONYTPE.DASHBOARD };
  const section = {
    type: SECTIONYTPE.PLAYLIST,
    playlist: "37i9dQZF1DWX3SoTqhs2rq",
  };
  //history.pushState(section, "", "");
  history.pushState(section, "", `/dashboard/playlist/${section.playlist}`); //everytime we refresh the page in playlist now it doesn't take to dashboard
  //fills the html for the playlists
  loadSection(section);
  const profileMenu = document.querySelector("#profile-menu");
  document.addEventListener("click", () => {
    if (!profileMenu.classList.contains("hidden")) {
      profileMenu.classList.add("hidden");
    }
  });

  document.querySelector(".content").addEventListener("scroll", (event) => {
    onContentScroll(event);
  });

  volume.addEventListener("change", () => {
    audio.volume = volume.value / 100;
  });

  timeline.addEventListener(
    "click",
    (e) => {
      const timelineWidth = window.getComputedStyle(timeline).width;
      const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
      audio.currentTime = timeToSeek;
      songProgress.style.width = `${
        (audio.currentTime / audio.duration) * 100
      }%`;
    },
    false
  );

  window.addEventListener("popstate", (event) => {
    //where backbtn is clicked popstate is called
    loadSection(event.state); //loads prev state
  });
});
