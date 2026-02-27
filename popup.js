document.getElementById('btn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // Inject content script (safe to call multiple times — content script checks for re-entry)
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
  window.close(); // close popup so user can interact with the page
});
