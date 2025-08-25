const logsContainer = document.getElementById("logs");

function renderLogs(logs) {
  logsContainer.innerHTML = "";
  logs.forEach((log) => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.textContent = `${log.joinTime} に ${log.channel} に ${log.user} が入室`;

    // 詳細（退出情報）
    const details = document.createElement("div");
    details.className = "log-details";
    if (log.leaveTime) {
      details.textContent = `${log.leaveTime} に退出（${log.duration}）`;
    } else {
      details.textContent = "まだ退出していません";
    }
    div.appendChild(details);

    // アコーディオン開閉
    div.addEventListener("click", () => {
      div.classList.toggle("open");
    });

    logsContainer.appendChild(div);
  });
}

chrome.storage.local.get({ logs: [], unreadCount: 0 }, (data) => {
  renderLogs(data.logs);
  chrome.storage.local.set({ unreadCount: 0 }, () => {
    chrome.action.setBadgeText({ text: "" });
  });
});

document.getElementById("clearLogs").addEventListener("click", () => {
  chrome.storage.local.set({ logs: [] }, () => {
    renderLogs([]);
    chrome.runtime.sendMessage({ type: "clearBadge" });
  });
});

chrome.runtime.sendMessage({ type: "clearBadge" });
