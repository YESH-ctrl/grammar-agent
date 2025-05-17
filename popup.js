document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('start');
  const stopButton = document.getElementById('stop');
  const statusDiv = document.getElementById('status');

  // Check initial state
  chrome.storage.local.get(['running'], function(result) {
    if (result.running) {
      statusDiv.textContent = 'Status: Running';
      startButton.disabled = true;
    }
  });

  startButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["agent.js"]
      });
      chrome.storage.local.set({ running: true });
      statusDiv.textContent = 'Status: Running';
      startButton.disabled = true;
    });
  });

  stopButton.addEventListener("click", () => {
    chrome.storage.local.set({ running: false });
    statusDiv.textContent = 'Status: Stopped';
    startButton.disabled = false;
  });
});