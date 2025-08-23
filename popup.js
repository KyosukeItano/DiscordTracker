const logsContainer = document.getElementById("logs");

function renderLogs(logs) {
  logsContainer.innerHTML = "";
  logs.forEach((log) => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.textContent = log;
    logsContainer.appendChild(div);
  });
}

chrome.storage.local.get({ logs: [], unreadCount: 0 }, (data) => {
  renderLogs(data.logs);

  // popupを開いたら未読数をリセット
  chrome.storage.local.set({ unreadCount: 0 }, () => {
    chrome.action.setBadgeText({ text: "" });
  });
});

// 「ログ削除」ボタン
document.getElementById("clearLogs").addEventListener("click", () => {
  chrome.storage.local.set({ logs: [] }, () => {
    renderLogs([]);
    chrome.runtime.sendMessage({ type: "clearBadge" });
  });
});

// バッジ数リセット要求
chrome.runtime.sendMessage({ type: "clearBadge" });
