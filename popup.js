const logsContainer = document.getElementById("logs");

chrome.storage.local.get({ logs: [], unreadCount: 0 }, (data) => {
  // ログ表示
  logsContainer.innerHTML = "";
  data.logs.forEach((log) => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.textContent = log;
    logsContainer.appendChild(div);
  });

  // popupを開いたら未読数をリセット
  chrome.storage.local.set({ unreadCount: 0 }, () => {
    chrome.action.setBadgeText({ text: "" });
  });
});

// バッジ数リセット要求
chrome.runtime.sendMessage({ type: "clearBadge" });
