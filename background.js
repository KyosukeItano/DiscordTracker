// Discord Webhook URL をここに設定してください
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/XXXXXXXXXXXX";

function sendDiscordNotification(message) {
  fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message })
  }).catch(err => console.error("Discord通知失敗:", err));
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "newLog") {
    chrome.storage.local.get({ logs: [] }, (data) => {
      data.logs.unshift(msg.message);
      if (data.logs.length > 30) {
        data.logs = data.logs.slice(0, 30);
      }
      chrome.storage.local.set({ logs: data.logs });

      // バッジ更新
      chrome.action.setBadgeText({ text: data.logs.length.toString() });
      chrome.action.setBadgeBackgroundColor({ color: "#ff0000" });

      // Discord Webhook通知
      sendDiscordNotification(`🔔 ${msg.message}`);
    });
  }

  if (msg.type === "clearBadge") {
    chrome.action.setBadgeText({ text: "" });
  }
});
