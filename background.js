function calcDuration(join, leave) {
  const j = new Date(join);
  const l = new Date(leave);
  const diffMs = l - j;
  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);
  return `${minutes}分${seconds}秒`;
}

chrome.runtime.onMessage.addListener((msg) => {
  chrome.storage.local.get({ logs: [] }, (data) => {
    let logs = data.logs;

    if (msg.type === "userJoin") {
      logs.unshift({
        channel: msg.channel,
        user: msg.user,
        joinTime: msg.joinTime,
        leaveTime: null,
        duration: null
      });
    }

    if (msg.type === "userLeave") {
      // 同じユーザー・同じチャンネル・未退出のログを探す
      const log = logs.find(
        (l) =>
          l.channel === msg.channel &&
          l.user === msg.user &&
          !l.leaveTime
      );
      if (log) {
        log.leaveTime = msg.leaveTime;
        log.duration = calcDuration(log.joinTime, log.leaveTime);
      }
    }

    // 最大30件
    if (logs.length > 30) logs = logs.slice(0, 30);

    chrome.storage.local.set({ logs });
    chrome.action.setBadgeText({ text: logs.length.toString() });
    chrome.action.setBadgeBackgroundColor({ color: "#ff0000" });
  });

  if (msg.type === "clearBadge") {
    chrome.action.setBadgeText({ text: "" });
  }
});
