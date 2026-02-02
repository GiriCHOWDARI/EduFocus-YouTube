let currentMode = "off";
let lastUrl = location.href;

/* ===== SELECTORS ===== */

// Feed (Home)
const FEED = "ytd-rich-grid-renderer";

// Sidebar
const SIDEBAR = "#secondary";

// Comments
const COMMENTS = "ytd-comments";

// Shorts
const SHORTS = "ytd-reel-shelf-renderer";

// Masthead parts (NOT whole header)
const MASTHEAD_END = "#end";        // right icons
const MASTHEAD_START = "#start";    // logo
// Search bar = #center  (we control this)

/* ===== UTILITIES ===== */

function hide(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.style.setProperty("display", "none", "important");
  });
}

function show(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.style.removeProperty("display");
  });
}

function resetAll() {
  show(FEED);
  show(SIDEBAR);
  show(COMMENTS);
  show(SHORTS);
  show(MASTHEAD_END);
  show("#center"); // search bar
}

/* ===== MODE LOGIC ===== */

function applyMode() {
  resetAll();

  if (currentMode === "learning") {
    hide(FEED);
    hide(SIDEBAR);
    hide(COMMENTS);
    hide(SHORTS);
    show("#center"); // search allowed
  }

  if (currentMode === "strict") {
    hide(FEED);
    hide(SIDEBAR);
    hide(COMMENTS);
    hide(SHORTS);
    hide("#center");       // hide search
    hide(MASTHEAD_END);    // hide icons
  }
}

/* ===== NAVIGATION HANDLING ===== */

function handleNavigation() {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(applyMode, 700);
  }
}

/* ===== LISTENERS ===== */

// Instant mode change
chrome.storage.onChanged.addListener(changes => {
  if (changes.mode) {
    currentMode = changes.mode.newValue || "off";
    applyMode();
  }
});

// Popup message
chrome.runtime.onMessage.addListener(msg => {
  if (msg.mode) {
    currentMode = msg.mode;
    applyMode();
  }
});

// SPA observer (URL-based, not DOM spam)
const observer = new MutationObserver(handleNavigation);
observer.observe(document, { childList: true, subtree: true });

/* ===== INITIAL LOAD ===== */

chrome.storage.sync.get(["mode"], res => {
  currentMode = res.mode || "off";
  setTimeout(applyMode, 700);
});
