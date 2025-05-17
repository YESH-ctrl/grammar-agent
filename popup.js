document.getElementById("start").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["agent.js"]
    });
    chrome.storage.local.set({ running: true });
  });
});

document.getElementById("stop").addEventListener("click", () => {
  chrome.storage.local.set({ running: false });
});