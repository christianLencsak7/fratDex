const page = document.body.dataset.page;

// Members data is loaded from players.js (included before this script in HTML)
// Tasks are loaded from tasks.js

// ─── Pi Host Configuration ───────────────────────────────────────
// When running on the Pi itself (Nginx/kiosk): leave PI_HOST empty ("") —
//   all fetch() calls use relative URLs and Flask/FastAPI serve from origin.
// When testing from a laptop: set PI_HOST to "http://<PI_IP>:8000"
const PI_HOST = ""; // e.g. "http://192.168.1.42:8000"

const API_SCAN  = PI_HOST ? `${PI_HOST}/api/scan`  : "/api/scan";
const API_STATE = PI_HOST ? `${PI_HOST}/api/state` : "/api/state";
const API_RESET = PI_HOST ? `${PI_HOST}/api/reset` : "/api/reset";
const VIDEO_FEED = PI_HOST ? `${PI_HOST}/video_feed` : "/video_feed";

// ─── Server state sync ───────────────────────────────────────────
async function syncState() {
  try {
    const res = await fetch(API_STATE);
    if (!res.ok) return false;
    const state = await res.json();
    let changed = false;
    players.forEach((p) => {
      const shouldBeCollected = state.collected.includes(p.name);
      if (p.collected !== shouldBeCollected) {
        p.collected = shouldBeCollected;
        changed = true;
      }
    });
    return changed;
  } catch {
    return false;
  }
}

// ─── Sound System ────────────────────────────────────────────────
const SOUNDS = {
  success: "sounds/success.mp3",
  error:   "sounds/error.mp3",
  click:   "sounds/click.mp3"
};

function playSound(type) {
  const audio = new Audio(SOUNDS[type]);
  audio.play().catch(e => {
    console.warn(`Audio play failed for ${type}:`, e);
    // Fallback to synthetic beep if MP3 is missing/fails
    if (type === 'success' || type === 'click') playVictorySound();
  });
}

function playVictorySound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "square";
  osc.frequency.setValueAtTime(523.25, ctx.currentTime);
  osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
  osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
  osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
  osc.start();
  osc.stop(ctx.currentTime + 0.8);
}

function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="task-icon"></span><span style="font-size: 8px;">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

function checkGlobalTasks() {
  const storageIndices = "fratdex-selected-indices";
  const storageKey = "fratdex-tasks";
  const selectedIndices = JSON.parse(localStorage.getItem(storageIndices));
  if (!selectedIndices || !selectedIndices.length) return;

  const savedState = JSON.parse(localStorage.getItem(storageKey) || "{}");
  const unlockedBefore = JSON.parse(localStorage.getItem("fratdex-unlocked-before") || "{}");

  const sessionPlayers = players.map(p => ({
    ...p,
    collected: p.collected && !unlockedBefore[p.name]
  }));

  let anyChange = false;
  selectedIndices.forEach((origIndex) => {
    if (!savedState[origIndex]) {
      const task = defaultTasks[origIndex];
      if (task && task.check && task.check(sessionPlayers)) {
        savedState[origIndex] = true;
        anyChange = true;
        let msg = task.label;
        if (msg.length > 50) msg = msg.substring(0, 48) + "...";
        showToast("Task Complete: " + msg);
        playVictorySound();
      }
    }
  });

  if (anyChange) {
    localStorage.setItem(storageKey, JSON.stringify(savedState));
  }
}

// Fires a custom event so any page that cares can react
function broadcastStateChange() {
  checkGlobalTasks();
  window.dispatchEvent(new CustomEvent("fratdex:statechange"));
}

// Listens for instant server broadcasts via Socket.IO
function startSocketListeners() {
  if (!window.io) return;
  const socket = window.io();
  socket.on("state_update", (state) => {
    let changed = false;
    players.forEach((p) => {
      const shouldBeCollected = state.collected.includes(p.name);
      if (p.collected !== shouldBeCollected) {
        p.collected = shouldBeCollected;
        changed = true;
      }
    });
    if (changed) broadcastStateChange();
  });

  socket.on("scan_event", (memberName) => {
    const key = "fratdex-unlocked-before";
    const unlockedBefore = JSON.parse(localStorage.getItem(key) || "{}");
    if (unlockedBefore[memberName]) {
      delete unlockedBefore[memberName];
      localStorage.setItem(key, JSON.stringify(unlockedBefore));
      broadcastStateChange();
    }
  });

  // ─── Arduino Controller Support ─────────────────────────────────
  socket.on("arduino_input", (action) => {
    console.log(`[Arduino] Action: ${action}`);
    const keyMap = {
      "up":     "ArrowUp",
      "down":   "ArrowDown",
      "left":   "ArrowLeft",
      "right":  "ArrowRight",
      "enter":  "Enter",
      "escape": "Escape"
    };
    const keyName = keyMap[action];
    if (keyName) {
      // Create and dispatch a fake keyboard event to trigger existing navigation logic
      const event = new KeyboardEvent("keydown", {
        key: keyName,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(event);
    }
  });
}


function goHome() {
  window.location.href = "index.html";
}

function getDirection(event) {
  const key = event.key;
  if (key === "ArrowUp" || key === "w" || key === "W") return "up";
  if (key === "ArrowDown" || key === "s" || key === "S") return "down";
  if (key === "ArrowLeft" || key === "a" || key === "A") return "left";
  if (key === "ArrowRight" || key === "d" || key === "D") return "right";
  return null;
}

// ─── Menu ────────────────────────────────────────────────────────
function setupMenu() {
  const nodes = Array.from(document.querySelectorAll(".selectable"));
  const byId = Object.fromEntries(nodes.map((node) => [node.dataset.navId, node]));
  let current = nodes[0];

  const lastScanInfo  = document.getElementById("last-scan-info");
  const lastScanName  = document.getElementById("last-scan-name");
  const lastScanMeta  = document.getElementById("last-scan-meta");
  const camLabel      = document.getElementById("camera-circle-label");
  const cameraCircle  = document.getElementById("camera-circle");

  const lastScanImage = localStorage.getItem("last-scanned-image");
  const lastScan      = localStorage.getItem("last-scanned-player");

  if (lastScan && typeof players !== "undefined") {
    const p = players.find(player => player.name === lastScan);
    if (p) {
      if (lastScanName) lastScanName.textContent = p.name;
      if (lastScanMeta) lastScanMeta.textContent = p.pos;
      if (lastScanInfo) lastScanInfo.style.display = "flex";
      if (camLabel) camLabel.style.display = "none";

      if (cameraCircle) {
        // Try to display the actual scan photo from the FastAPI server
        const imgUrl = `${PI_HOST}/api/last-scan-image?t=${Date.now()}`;
        const probe = new Image();
        probe.onload = () => {
          cameraCircle.style.background = `url('${imgUrl}') center/cover no-repeat`;
          cameraCircle.style.boxShadow  = `inset 0 0 0 6px rgba(248,247,223,0.25), 0 6px 0 ${p.colors ? p.colors[1] : "#3a1870"}`;
        };
        probe.onerror = () => {
          // Fallback: member colours if no image saved yet
          if (p.colors) {
            cameraCircle.style.background = `radial-gradient(circle, #f8f8f8 0 30%, ${p.colors[1]} 30% 42%, ${p.colors[0]} 42% 100%)`;
            cameraCircle.style.boxShadow  = `inset 0 0 0 6px rgba(248,247,223,0.2), 0 6px 0 ${p.colors[1]}`;
          }
        };
        probe.src = imgUrl;
      }
    }
  }

  function highlight(next) {
    if (current !== next) playSound('click');
    nodes.forEach((node) => node.classList.toggle("is-selected", node === next));
    current = next;
    current.focus();
  }

  function activateCurrent() {
    playSound('click');
    const href = current.dataset.href;
    if (href) window.location.href = href;
  }

  nodes.forEach((node) => {
    node.addEventListener("mouseenter", () => highlight(node));
    node.addEventListener("click", activateCurrent);
  });

  highlight(current);

  document.addEventListener("keydown", (event) => {
    const direction = getDirection(event);
    if (direction) {
      event.preventDefault();
      const nextId = current.dataset[direction];
      if (nextId && byId[nextId]) highlight(byId[nextId]);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      activateCurrent();
    }
  });
}

// ─── Camera (MJPEG stream from FastAPI /video_feed) ──────────────
function setupCamera() {
  const imgEl     = document.getElementById("cam-video");
  const scanLabel = document.getElementById("scan-label");
  let scanning    = false;

  // Point the MJPEG img tag at the FastAPI stream
  if (imgEl) imgEl.src = VIDEO_FEED;

  async function scan() {
    if (scanning) return;
    scanning = true;

    if (scanLabel) {
      scanLabel.textContent = "Scanning...";
      scanLabel.classList.add("blink");
    }

    try {
      // Tell the Pi to grab the current frame and run InsightFace on it
      const response = await fetch(API_SCAN, { method: "POST" });
      const result   = await response.json();
      const conf     = typeof result.score === "number" ? ` (${(result.score * 100).toFixed(0)}%)` : "";

      if (result.success && result.player && result.player !== "Unknown") {
        playSound('success');
        if (scanLabel) {
          scanLabel.textContent = result.player.toUpperCase() + conf;
          scanLabel.classList.remove("blink");
        }
        localStorage.setItem("last-scanned-player", result.player);
      } else {
        playSound('error');
        if (scanLabel) {
          const reason = result.reason || "No Match";
          scanLabel.textContent = reason + conf;
          scanLabel.classList.remove("blink");
        }
      }
    } catch {
      playSound('error');
      if (scanLabel) {
        scanLabel.textContent = "Server Offline";
        scanLabel.classList.remove("blink");
      }
    }

    setTimeout(() => goHome(), 2200);
  }

  // Tap anywhere on the screen or press Space to trigger a scan
  document.addEventListener("click",       () => scan());
  document.addEventListener("contextmenu", (e) => { e.preventDefault(); scan(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Spacebar") { event.preventDefault(); scan(); return; }
    if (event.key === "Escape" || event.key === "Backspace") { event.preventDefault(); goHome(); }
  });
}

// ─── Dex ─────────────────────────────────────────────────────────
function setupDex() {
  const modeView   = document.getElementById("dex-mode-view");
  const gridView   = document.getElementById("dex-grid-view");
  const detailView = document.getElementById("dex-detail-view");
  const grid       = document.getElementById("dex-grid");
  const dexCount   = document.getElementById("dex-count");
  const dexGridCount = document.getElementById("dex-grid-count");

  const nameNode    = document.getElementById("detail-name");
  const teamNode    = document.getElementById("detail-team");
  const roleNode    = document.getElementById("detail-role");
  const statsNode   = document.getElementById("stat-grid");
  const notesNode   = document.getElementById("detail-notes");
  const spriteBox   = document.getElementById("sprite-box");
  const indexLabel  = document.getElementById("detail-index-label");
  const statusBadge = document.getElementById("detail-status-badge");

  // ── Filter mode definitions ───────────────────────────────────
  const MODES = [
    { id: "mode-all",   label: "ALL MEMBERS",   filter: () => true },
    { id: "mode-ec",    label: "EXEC BOARD",    filter: p => EXEC_ROLES.includes(p.pos) },
    { id: "mode-bro",   label: "BROTHERS",      filter: p => p.pos === "Brother" },
    { id: "mode-sweet", label: "SWEETHEARTS",   filter: p => p.pos === "Sweetheart" },
    { id: "mode-fac",   label: "FACULTY/STAFF", filter: p => ["Faculty Fellow","Resident Scholar","Chapter Counselor"].includes(p.pos) },
  ];
  const COLS = 3;
  let view          = "mode";
  let modeIndex     = 0;
  let activePlayers = [];
  let gridIndex     = 0;
  let activeIndex   = 0;

  // ── Helpers ───────────────────────────────────────────────────
  function updateDexCount() {
    const n = players.filter(p => p.collected).length;
    if (dexCount) dexCount.textContent = `Collected ${n}/${players.length}`;
  }

  function hideAll() {
    [modeView, gridView, detailView].forEach(v => v?.classList.add("dex-view--hidden"));
  }

  updateDexCount();

  // ── MODE SELECT ───────────────────────────────────────────────
  function showMode() {
    view = "mode";
    hideAll();
    modeView.classList.remove("dex-view--hidden");
    renderMode();
  }

  function renderMode() {
    modeView.querySelectorAll(".mode-option")
      .forEach((opt, i) => opt.classList.toggle("is-selected", i === modeIndex));
  }

  MODES.forEach((m, i) => {
    document.getElementById(m.id)?.addEventListener("click", () => {
      playSound('click');
      openModeGrid(i);
    });
  });

  // ── GRID ──────────────────────────────────────────────────────
  function openModeGrid(idx) {
    modeIndex     = idx;
    activePlayers = players.filter(MODES[idx].filter);
    gridIndex     = 0;
    view          = "grid";
    hideAll();
    gridView.classList.remove("dex-view--hidden");
    const hdr = gridView.querySelector(".status-bar span:first-child");
    if (hdr) hdr.textContent = MODES[idx].label;
    renderGrid();
  }

  function renderGrid() {
    grid.innerHTML = "";
    const collected = activePlayers.filter(p => p.collected).length;
    if (dexGridCount) dexGridCount.textContent = `${collected}/${activePlayers.length}`;

    if (!activePlayers.length) {
      grid.innerHTML = '<div class="centered-copy">No members here.</div>';
      return;
    }

    activePlayers.forEach((player, i) => {
      const tile = document.createElement("button");
      tile.type  = "button";
      tile.className = "dex-tile";
      tile.classList.toggle("is-selected", i === gridIndex);

      const spriteClass = player.collected ? "sprite-collected" : "sprite-unknown";
      const nameDisplay = player.collected ? player.name : "???";
      const roleDisplay = player.collected ? player.pos  : "???";

      tile.innerHTML = `
        <div class="tile-sprite ${spriteClass}" aria-hidden="true"></div>
        <div class="tile-name">${nameDisplay}</div>
        <div class="tile-team">${roleDisplay}</div>
      `;
      tile.addEventListener("click", () => {
        playSound('click');
        gridIndex   = i;
        activeIndex = i;
        showDetail();
      });
      grid.appendChild(tile);
    });

    // Scroll selected tile into view
    const sel = grid.children[gridIndex];
    if (sel) sel.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  // ── DETAIL ────────────────────────────────────────────────────
  function showDetail() {
    view = "detail";
    hideAll();
    detailView.classList.remove("dex-view--hidden");
    renderDetail();
  }

  function renderDetail() {
    const player = activePlayers[activeIndex];
    if (indexLabel) indexLabel.textContent = `${activeIndex + 1} / ${activePlayers.length}`;

    if (!player) {
      spriteBox.className = "detail-sprite sprite-unknown";
      if (nameNode)    nameNode.textContent = "No Entry";
      if (teamNode)    teamNode.textContent = "";
      if (roleNode)    roleNode.textContent = "";
      if (notesNode)   notesNode.innerHTML  = buildProfileGrid(null);
      if (statusBadge) statusBadge.textContent = "Unknown";
      if (statsNode)   statsNode.innerHTML  = "";
      return;
    }

    if (player.collected) {
      spriteBox.className = "detail-sprite sprite-collected";
      if (nameNode)    nameNode.textContent = player.name;
      if (teamNode)    teamNode.textContent = player.team;
      if (roleNode)    roleNode.textContent = player.pos;
      if (notesNode)   notesNode.innerHTML  = buildProfileGrid(player);
      if (statusBadge) statusBadge.textContent = "Collected";
      if (statsNode) {
        statsNode.innerHTML = "";
        player.stats.forEach(([label, value]) => {
          const row = document.createElement("div");
          row.className = "stat-row";
          row.innerHTML = `<span>${label} ${value}</span><div class="stat-bar" style="--bar-fill:${value}%;"><span></span></div>`;
          statsNode.appendChild(row);
        });
      }
    } else {
      spriteBox.className = "detail-sprite sprite-unknown";
      if (nameNode)    nameNode.textContent = "???";
      if (teamNode)    teamNode.textContent = "Not yet scanned";
      if (roleNode)    roleNode.textContent = "";
      if (notesNode)   notesNode.innerHTML  = buildProfileGrid(null);
      if (statusBadge) statusBadge.textContent = "Locked";
      if (statsNode)   statsNode.innerHTML  = "";
    }
  }

  // ── PROFILE GRID ─────────────────────────────────────────────
  function buildProfileGrid(player) {
    if (!player) {
      return `<div class="profile-grid profile-grid--locked">
        <span class="pg-label">Status</span><span class="pg-value">Locked</span>
      </div>`;
    }
    const rows = [
      ["Chapter", player.team],
      ["Role",    player.pos],
      ["School",  "Stevens"],
      ["Frat",    "\u03a3\u03a6\u0395"],
    ];
    return `<div class="profile-grid">${
      rows.map(([label, val]) =>
        `<span class="pg-label">${label}</span><span class="pg-value">${val}</span>`
      ).join("")
    }</div>`;
  }

  // ── KEYBOARD ─────────────────────────────────────────────────
  document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (view === "mode") {
      if (key === "Escape" || key === "Backspace") { event.preventDefault(); goHome(); return; }
      const dir = getDirection(event);
      if (dir === "up")   { event.preventDefault(); playSound('click'); modeIndex = (modeIndex - 1 + MODES.length) % MODES.length; renderMode(); }
      if (dir === "down") { event.preventDefault(); playSound('click'); modeIndex = (modeIndex + 1) % MODES.length; renderMode(); }
      if (key === "Enter") { event.preventDefault(); playSound('click'); openModeGrid(modeIndex); }
      return;
    }

    if (view === "grid") {
      if (key === "Escape" || key === "Backspace") { event.preventDefault(); playSound('click'); showMode(); return; }
      if (key === "Enter") { event.preventDefault(); playSound('click'); activeIndex = gridIndex; showDetail(); return; }
      const dir = getDirection(event);
      if (!dir) return;
      event.preventDefault();
      playSound('click');
      if (dir === "up")    gridIndex = Math.max(0, gridIndex - COLS);
      if (dir === "down")  gridIndex = Math.min(activePlayers.length - 1, gridIndex + COLS);
      if (dir === "left")  gridIndex = Math.max(0, gridIndex - 1);
      if (dir === "right") gridIndex = Math.min(activePlayers.length - 1, gridIndex + 1);
      renderGrid();
      return;
    }

    if (view === "detail") {
      if (key === "Escape" || key === "Backspace") {
        event.preventDefault();
        playSound('click');
        view = "grid";
        hideAll();
        gridView.classList.remove("dex-view--hidden");
        renderGrid();
        return;
      }
      const dir = getDirection(event);
      if (dir === "left")  { event.preventDefault(); playSound('click'); activeIndex = Math.max(0, activeIndex - 1); gridIndex = activeIndex; renderDetail(); }
      if (dir === "right") { event.preventDefault(); playSound('click'); activeIndex = Math.min(activePlayers.length - 1, activeIndex + 1); gridIndex = activeIndex; renderDetail(); }
    }
  });

  // ── LIVE UPDATE (on state change from syncState) ──────────────
  window.addEventListener("fratdex:statechange", () => {
    updateDexCount();
    if (view === "grid")   renderGrid();
    else if (view === "detail") renderDetail();
  });

  showMode();
}


// ─── Tasks ───────────────────────────────────────────────────────
function setupTasks() {
  const storageIndices = "fratdex-selected-indices";
  const storageKey     = "fratdex-tasks";
  const taskList       = document.getElementById("task-list");
  const taskMeta       = document.getElementById("task-meta");
  let view = "main";

  const mainOptions = ["View Tasks", "New Tasks (Wipes Data)"];
  let mainIndex = 0;

  const categories = ["Short Term", "Medium Term", "Long Term"];
  let catIndex = 0;
  let taskIndex = 0;
  let activeTasks = [];

  let selectedIndices = JSON.parse(localStorage.getItem(storageIndices));
  if (!selectedIndices || selectedIndices.length === 0) {
    const shuffle = (arr) => arr.map(a => ({ sort: Math.random(), value: a }))
                                .sort((a, b) => a.sort - b.sort)
                                .map(a => a.value);
    const sIdx = defaultTasks.map((t, i) => ({ t, i })).filter(x => x.t.category === "Short Term");
    const mIdx = defaultTasks.map((t, i) => ({ t, i })).filter(x => x.t.category === "Medium Term");
    const lIdx = defaultTasks.map((t, i) => ({ t, i })).filter(x => x.t.category === "Long Term");
    selectedIndices = [
      ...shuffle(sIdx).slice(0, Math.min(6, sIdx.length)).map(x => x.i),
      ...shuffle(mIdx).slice(0, Math.min(4, mIdx.length)).map(x => x.i),
      ...shuffle(lIdx).slice(0, Math.min(2, lIdx.length)).map(x => x.i),
    ];
    localStorage.setItem(storageIndices, JSON.stringify(selectedIndices));
  }

  const savedState = JSON.parse(localStorage.getItem(storageKey) || "{}");
  const tasks = selectedIndices.map((origIndex) => ({
    ...defaultTasks[origIndex],
    originalIndex: origIndex,
    done: savedState[origIndex] ?? false,
  }));

  function save() {
    const stateToSave = {};
    tasks.forEach(t => { stateToSave[t.originalIndex] = t.done; });
    localStorage.setItem(storageKey, JSON.stringify(stateToSave));
  }

  function applyPredicates() {
    let anyChange = false;
    const unlockedBefore = JSON.parse(localStorage.getItem("fratdex-unlocked-before") || "{}");
    const sessionPlayers = players.map(p => ({
      ...p,
      collected: p.collected && !unlockedBefore[p.name]
    }));
    tasks.forEach((task) => {
      if (!task.done && task.check && task.check(sessionPlayers)) {
        task.done = true;
        anyChange = true;
      }
    });
    if (anyChange) save();
    return anyChange;
  }

  async function doNewTasks() {
    const snapshot = {};
    players.forEach(p => { if (p.collected) snapshot[p.name] = true; });
    localStorage.setItem("fratdex-unlocked-before", JSON.stringify(snapshot));
    localStorage.removeItem(storageIndices);
    localStorage.removeItem(storageKey);
    window.location.reload();
  }

  function renderMain() {
    if (taskMeta) taskMeta.textContent = `Tasks Menu`;
    taskList.innerHTML = "";
    mainOptions.forEach((opt, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "task-row";
      row.classList.toggle("is-selected", index === mainIndex);
      row.innerHTML = `<span class="task-icon" aria-hidden="true">></span><span>${opt}</span>`;
      row.addEventListener("click", () => {
        mainIndex = index;
        if (mainIndex === 0) { view = "categories"; render(); } else { doNewTasks(); }
      });
      taskList.appendChild(row);
    });
    const selected = taskList.children[mainIndex];
    if (selected) selected.scrollIntoView({ block: "nearest", behavior: "auto" });
  }

  function renderCategories() {
    applyPredicates();
    const completed = tasks.filter((t) => t.done).length;
    if (taskMeta) taskMeta.textContent = `Completed ${completed}/${tasks.length}`;
    taskList.innerHTML = "";
    categories.forEach((cat, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "task-row";
      row.classList.toggle("is-selected", index === catIndex);
      const catTasks = tasks.filter(t => t.category === cat);
      const catDone  = catTasks.filter(t => t.done).length;
      row.innerHTML = `<span class="task-icon" aria-hidden="true">></span><span>${cat} (${catDone}/${catTasks.length})</span>`;
      row.addEventListener("click", () => { catIndex = index; openCategory(); });
      taskList.appendChild(row);
    });
    const selected = taskList.children[catIndex];
    if (selected) selected.scrollIntoView({ block: "nearest", behavior: "auto" });
  }

  function renderTasks() {
    applyPredicates();
    if (taskMeta && activeTasks.length) {
      const completed = activeTasks.filter((t) => t.done).length;
      taskMeta.textContent = `${categories[catIndex]} – ${completed}/${activeTasks.length}`;
    }
    taskList.innerHTML = "";
    activeTasks.forEach((task, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "task-row";
      row.classList.toggle("is-selected", index === taskIndex);
      row.classList.toggle("is-complete",  task.done);
      row.innerHTML = `<span class="task-icon" aria-hidden="true"></span><span>${task.done ? "[x]" : "[ ]"} ${task.label}</span>`;
      row.addEventListener("click", () => { taskIndex = index; toggleTask(); });
      taskList.appendChild(row);
    });
    const selected = taskList.children[taskIndex];
    if (selected) selected.scrollIntoView({ block: "nearest", behavior: "auto" });
  }

  function render() {
    if (view === "main") renderMain();
    else if (view === "categories") renderCategories();
    else renderTasks();
  }

  function openCategory() {
    const cat = categories[catIndex];
    activeTasks = tasks.filter(t => t.category === cat);
    taskIndex = 0;
    view = "list";
    render();
  }

  function toggleTask() {
    if (view !== "list" || !activeTasks[taskIndex]) return;
    const t = activeTasks[taskIndex];
    t.done = !t.done;
    save();
    render();
  }

  window.addEventListener("fratdex:statechange", render);
  syncState().then(() => render());
  startSocketListeners();

  document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "Escape" || key === "Backspace") {
      event.preventDefault();
      if (view === "list") { view = "categories"; render(); }
      else if (view === "categories") { view = "main"; render(); }
      else goHome();
      return;
    }
    const direction = getDirection(event);
    if (direction === "up" || direction === "down") {
      event.preventDefault();
      if (view === "main") {
        mainIndex = direction === "up"
          ? (mainIndex - 1 + mainOptions.length) % mainOptions.length
          : (mainIndex + 1) % mainOptions.length;
      } else if (view === "categories") {
        catIndex = direction === "up"
          ? (catIndex - 1 + categories.length) % categories.length
          : (catIndex + 1) % categories.length;
      } else {
        if (!activeTasks.length) return;
        taskIndex = direction === "up"
          ? (taskIndex - 1 + activeTasks.length) % activeTasks.length
          : (taskIndex + 1) % activeTasks.length;
      }
      render();
      return;
    }
    if (key === "Enter") {
      event.preventDefault();
      if (view === "main") {
        if (mainIndex === 0) { view = "categories"; render(); } else doNewTasks();
      } else if (view === "categories") openCategory();
      else toggleTask();
    }
  });
}

// ─── Boot ─────────────────────────────────────────────────────────
(async () => {
  await syncState();
  startSocketListeners();
  if (page === "menu")    setupMenu();
  else if (page === "camera") setupCamera();
  else if (page === "dex")    setupDex();
  else if (page === "tasks")  setupTasks();
})();
