chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "newLog") {
    chrome.storage.local.get({ logs: [] }, (data) => {
      // 新しいログを先頭に追加（降順）
      data.logs.unshift(msg.message);

      // 最大30件に制限
      if (data.logs.length > 30) {
        data.logs = data.logs.slice(0, 30);
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

// 🔹 拡張がインストール/更新されたときに隠しタブでDiscordを開く
chrome.runtime.onInstalled.addListener(() => {
  const discordUrl = "https://discord.com/channels/1235612758188228608/1235612758188228610";

  chrome.tabs.query({ url: discordUrl }, (tabs) => {
    if (tabs.length === 0) {
      chrome.tabs.create({
        url: discordUrl,
        active: false,   // ユーザーにフォーカスしない
        pinned: true     // 間違って閉じにくくする
      });
    }
  });
});