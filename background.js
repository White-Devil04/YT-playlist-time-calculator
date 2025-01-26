chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("youtube.com/playlist")) {
    const queryParams = tab.url.split("?")[1];
    const urlParams = new URLSearchParams(queryParams);

    console.log(urlParams);

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      playlistId: urlParams.get("list"),
    });
  }
});
