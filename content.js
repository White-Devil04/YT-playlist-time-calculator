(() => {
  let playlist_header;
  let playlistData = [];
  let totalDuration = [];

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { type, playlistId } = request;
    let currentPlaylistId = "";

    if (type === "NEW") {
      currentPlaylistId = playlistId;
      newPlaylistLoader();
    }
  });

  const newPlaylistLoader = () => {
    const playlistBtn = document.getElementById("playlist-calculator-btn");

    if (!playlistBtn) {
      const calculateBtn = document.createElement("img");

      calculateBtn.src = chrome.runtime.getURL("assets/calculate.png");
      calculateBtn.id = "playlist-calculator-btn";
      calculateBtn.title = "Calculate Playlist Duration";
      calculateBtn.style.cssText =
        "display: inline-flex; justify-content: center; align-items: center; width: 24px; height: 24px; padding: 6px; background-color:rgb(105, 105, 105, 0.5); border-radius: 50%; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); cursor: pointer;";

      playlist_header = document.getElementsByClassName(
        "yt-flexible-actions-view-model-wiz__action-row",
      )[0];

      if (playlist_header) {
        playlist_header.appendChild(calculateBtn);
        calculateBtn.addEventListener("click", addPlaylistCalculator,{once: true});
      }
    }
  };

  const addPlaylistCalculator = () => {
    console.log("Calculator clicked");
    let totalSeconds = 0;
    playlistData = [];

    const videoElements = document.querySelectorAll(
      // "#contents .ytd-playlist-video-renderer",  -- this selection give 3 time duplicate data
      "ytd-playlist-video-list-renderer ytd-playlist-video-renderer",
    );

    if (!videoElements.length) {
      console.log("No videos found");
      return;
    }

    videoElements.forEach((video) => {
      const title =
        video.querySelector("#video-title")?.innerText.trim() || "Unknown";
      const durationText = video
        .querySelector("span.ytd-thumbnail-overlay-time-status-renderer")
        ?.innerText.trim();

      if (durationText) {
        const timeParts = durationText.split(":").map(Number);
        let videoDuration = 0;

        if (timeParts.length == 3) {
          const [hours, minutes, seconds] = timeParts;
          videoDuration = hours * 3600 + minutes * 60 + seconds;
        } else if (timeParts.length == 2) {
          const [minutes, seconds] = timeParts;
          videoDuration = minutes * 60 + seconds;
        }

        totalSeconds += videoDuration;

        playlistData.push({
          title,
          durationText,
          durationInSeconds: videoDuration,
        });
      }
    });

    totalDuration = formatDuration(totalSeconds);

    displayPlaylistDuration();
  };

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  };

  const displayPlaylistDuration = () => {
    const playlistDisplayArea = document.getElementsByClassName(
      "page-header-view-model-wiz__page-header-flexible-actions yt-flexible-actions-view-model-wiz",
    )[1];

    if (!playlistDisplayArea) {
      console.log("No playlist display area found");
      return;
    }

    let playlistDuration = document.createElement("span");
    playlistDuration.innerText = `Total Duration: ${totalDuration.hours}h ${totalDuration.minutes}m ${totalDuration.seconds}s`;
    playlistDuration.style.cssText = `
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: #f1f1f1;
    background-color: rgba(105, 105, 105, 0.5);
    padding: 8px 12px;
    border-radius: 18px;
    margin-left: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: default;
    font-family: "Roboto", sans-serif;
    `;
    playlistDisplayArea.appendChild(playlistDuration);
  };

  newPlaylistLoader();
})();
