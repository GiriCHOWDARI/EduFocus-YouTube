let timer = null;

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    chrome.storage.sync.get(["studyTime"], (res) => {
      chrome.storage.sync.set({
        studyTime: (res.studyTime || 0) + 1
      });
    });
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes.mode) {
    const mode = changes.mode.newValue;
    if (mode === "learning" || mode === "strict") {
      startTimer();
    } else {
      stopTimer();
    }
  }
});
