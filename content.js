const channelsToWatch = ["診察室", "教習所", "配信"];

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
}

function sendLog(channelName) {
  const now = new Date();
  const timeStr = formatDate(now);
  const logMsg = `${timeStr} に ${channelName} に入室検知`;
  chrome.runtime.sendMessage({ type: "newLog", message: logMsg, channel: channelName, time: timeStr });
}

function checkChannels() {
  channelsToWatch.forEach((channelName) => {
    const channelEls = [...document.querySelectorAll(`[aria-label^="${channelName}"]`)];
    channelEls.forEach((channelEl) => {
      const label = channelEl.getAttribute("aria-label");
      if (label && label.includes("人のユーザー")) {
        const match = label.match(/(\d+) 人のユーザー/);
        const userCount = match ? parseInt(match[1]) : 0;
        if (userCount > 0) {
          if (!channelEl.dataset.notified) {
            sendLog(channelName);
            channelEl.dataset.notified = "true";
          }
        } else {
          channelEl.dataset.notified = "";
        }
      }
    });
  });
}

window.addEventListener("load", () => {
  console.log("Start monitoring voice channels...");
  setInterval(checkChannels, 3000);
});
