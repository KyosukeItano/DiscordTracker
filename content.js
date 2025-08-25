const channelsToWatch = ["診察室", "教習所", "配信"];

// 前回のユーザー状態を保持
let previousState = {};

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
}

function checkChannels() {
  channelsToWatch.forEach((channelName) => {
    const channelEls = [...document.querySelectorAll(`[aria-label^="${channelName}"]`)];
    if (!channelEls.length) return;

    const channelEl = channelEls[0];

    // 現在のユーザー一覧を取得
    const userEls = channelEl.querySelectorAll("ul[aria-label] li[aria-label]");
    const currentUsers = new Set();
    userEls.forEach((el) => {
      const name = el.getAttribute("aria-label");
      if (name) currentUsers.add(name);
    });

    // 前回の状態
    const prevUsers = previousState[channelName] || new Set();

    // 入室ユーザー
    currentUsers.forEach((u) => {
      if (!prevUsers.has(u)) {
        chrome.runtime.sendMessage({
          type: "userJoin",
          channel: channelName,
          user: u,
          joinTime: formatDate(new Date())
        });
      }
    });

    // 退出ユーザー
    prevUsers.forEach((u) => {
      if (!currentUsers.has(u)) {
        chrome.runtime.sendMessage({
          type: "userLeave",
          channel: channelName,
          user: u,
          leaveTime: formatDate(new Date())
        });
      }
    });

    // 状態更新
    previousState[channelName] = currentUsers;
  });
}

window.addEventListener("load", () => {
  console.log("Start monitoring voice channels...");
  setInterval(checkChannels, 3000);
});
