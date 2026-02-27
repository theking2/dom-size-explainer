// Background service worker - relays messages from content script to popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'DOM_SIZE_RESULT') {
    // Store result so popup can read it when it opens
    chrome.storage.local.set({ domSizeResult: msg.data, domSizeTimestamp: Date.now() });
  }
});
