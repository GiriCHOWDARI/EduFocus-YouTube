const modeSelect = document.getElementById("mode");
const status = document.getElementById("status");
const darkToggle = document.getElementById("darkToggle");
const timeText = document.getElementById("time");

/* ===== LOAD STATE ===== */
chrome.storage.sync.get(["mode", "dark", "studyTime"], (res) => {
  modeSelect.value = res.mode || "off";
  darkToggle.checked = res.dark || false;
  timeText.textContent = `${Math.floor((res.studyTime || 0) / 60)} min`;
  status.innerText = "Mode: " + modeSelect.value;

  if (darkToggle.checked) document.body.classList.add("dark");
});

/* ===== MODE CHANGE ===== */
modeSelect.addEventListener("change", () => {
  const mode = modeSelect.value;
  chrome.storage.sync.set({ mode });
  status.innerText = "Mode: " + mode;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { mode });
  });
});

/* ===== DARK MODE ===== */
darkToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ dark: darkToggle.checked });
  document.body.classList.toggle("dark", darkToggle.checked);
});
