chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "newLog") {
    chrome.storage.local.get({ logs: [] }, (data) => {
      data.logs.push(msg.message);
      if (data.logs.length > 30) {
        data.logs = data.logs.slice(data.logs.length - 30);
      }
      chrome.storage.local.set({ logs: data.logs });

      // バッジ更新
      chrome.action.setBadgeText({ text: data.logs.length.toString() });
      chrome.action.setBadgeBackgroundColor({ color: "#ff0000" });
    });
  }

  if (msg.type === "clearBadge") {
    chrome.action.setBadgeText({ text: "" });
  }
});
