const page = document.body.dataset.page;

// Members data is loaded from players.js (included before this script in HTML)
// Tasks are loaded from tasks.js

// ─── Server state sync ───────────────────────────────────────────
async function syncState() {
  try {
    const res = await fetch("/api/state");
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
      if (lastScanMeta) lastScanMeta.textContent = `${p.pos} · ${p.exp}`;
      if (lastScanInfo) lastScanInfo.style.display = "flex";
      if (camLabel) camLabel.style.display = "none";

      if (cameraCircle) {
        if (lastScanImage) {
          cameraCircle.style.background = `url(${lastScanImage}) center/cover no-repeat`;
          cameraCircle.style.boxShadow  = `0 6px 0 ${p.colors ? p.colors[1] : "#41526d"}`;
        } else if (p.colors) {
          cameraCircle.style.background = `radial-gradient(circle, #f8f8f8 0 30%, ${p.colors[1]} 30% 42%, ${p.colors[0]} 42% 100%)`;
          cameraCircle.style.boxShadow  = `inset 0 0 0 6px rgba(248, 247, 223, 0.2), 0 6px 0 ${p.colors[1]}`;
        }
      }
    }
  }

  function highlight(next) {
    nodes.forEach((node) => node.classList.toggle("is-selected", node === next));
    current = next;
    current.focus();
  }

  function activateCurrent() {
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

// ─── Camera ──────────────────────────────────────────────────────
function setupCamera() {
  const video     = document.getElementById("cam-video");
  const canvas    = document.getElementById("cam-canvas");
  const scanLabel = document.getElementById("scan-label");
  let stream    = null;
  let captured  = false;

  async function startCam() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      video.srcObject = stream;
    } catch {
      video.style.display = "none";
      if (scanLabel) scanLabel.textContent = "No Camera";
    }
  }

  async function capture() {
    if (captured) return;
    captured = true;

    const w = video.videoWidth || canvas.offsetWidth;
    const h = video.videoHeight || canvas.offsetHeight;
    canvas.width  = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -w, 0, w, h);
    ctx.restore();

    canvas.classList.add("captured");

    if (scanLabel) {
      scanLabel.textContent = "Scanning...";
      scanLabel.classList.add("blink");
    }

    if (stream) stream.getTracks().forEach((t) => t.stop());

    try {
      const imageData = canvas.toDataURL("image/jpeg", 0.9);
      const response  = await fetch("/api/recognize", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ image: imageData }),
      });
      const result = await response.json();

      if (result.success && result.player && result.player !== "Unknown") {
        if (scanLabel) {
          scanLabel.textContent = result.player.toUpperCase();
          scanLabel.classList.remove("blink");
        }
        localStorage.setItem("last-scanned-player", result.player);
        localStorage.setItem("last-scanned-image",  imageData);
      } else {
        if (scanLabel) {
          scanLabel.textContent = "No Match";
          scanLabel.classList.remove("blink");
        }
      }
    } catch {
      if (scanLabel) {
        scanLabel.textContent = "Server Offline";
        scanLabel.classList.remove("blink");
      }
    }

    setTimeout(() => goHome(), 2000);
  }

  document.addEventListener("contextmenu", (e) => { e.preventDefault(); capture(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Spacebar") { event.preventDefault(); capture(); return; }
    if (event.key === "Escape" || event.key === "Backspace") {
      event.preventDefault();
      if (stream) stream.getTracks().forEach((t) => t.stop());
      goHome();
    }
  });

  startCam();
}

// ─── Dex ─────────────────────────────────────────────────────────
function setupDex() {
  const modeView   = document.getElementById("dex-mode-view");
  const gridView   = document.getElementById("dex-grid-view");
  const detailView = document.getElementById("dex-detail-view");

  const grid          = document.getElementById("dex-grid");
  const gridPrevBtn   = document.getElementById("dex-grid-prev");
  const gridNextBtn   = document.getElementById("dex-grid-next");
  const gridPageLabel = document.getElementById("dex-grid-page");

  const dexCount     = document.getElementById("dex-count");
  const dexGridCount = document.getElementById("dex-grid-count");

  const nameNode    = document.getElementById("detail-name");
  const teamNode    = document.getElementById("detail-team");
  const roleNode    = document.getElementById("detail-role");
  const statsNode   = document.getElementById("stat-grid");
  const notesNode   = document.getElementById("detail-notes");
  const spriteBox   = document.getElementById("sprite-box");
  const indexLabel  = document.getElementById("detail-index-label");
  const statusBadge = document.getElementById("detail-status-badge");

  // ── State ────────────────────────────────────────────────────
  let view        = "mode";
  const COLS      = 3;
  const ROWS      = 3;
  const PAGE_SIZE = COLS * ROWS;
  let gridIndex   = 0;
  let modeIndex   = 0;
  let activePlayers = [];
  let activeIndex   = 0;

  function clampIndex(index, length) {
    if (!length) return 0;
    return Math.max(0, Math.min(length - 1, index));
  }
  function getPageCount(length) {
    return Math.max(1, Math.ceil(length / PAGE_SIZE));
  }
  function getPageNumber(index, length) {
    if (!length) return 0;
    return Math.floor(clampIndex(index, length) / PAGE_SIZE) + 1;
  }
  function formatPagedBadge(collected, total, selectedIndex) {
    const pageNumber = getPageNumber(selectedIndex, total);
    const pageCount  = total ? getPageCount(total) : 0;
    return `${collected}/${total} | P${pageNumber}/${pageCount}`;
  }
  function updatePager(labelNode, prevNode, nextNode, index, total) {
    const pageNumber = getPageNumber(index, total);
    const pageCount  = total ? getPageCount(total) : 0;
    if (labelNode) labelNode.textContent = total ? `PAGE ${pageNumber} / ${pageCount}` : "PAGE 0 / 0";
    if (prevNode) prevNode.disabled = !total || pageNumber <= 1;
    if (nextNode) nextNode.disabled = !total || pageNumber >= pageCount;
  }

  function updateAllGridBadge() {
    if (!dexGridCount) return;
    const collected = players.filter((p) => p.collected).length;
    dexGridCount.textContent = formatPagedBadge(collected, players.length, gridIndex);
    updatePager(gridPageLabel, gridPrevBtn, gridNextBtn, gridIndex, players.length);
  }

  const collectedCount = players.filter((p) => p.collected).length;
  if (dexCount) dexCount.textContent = `Collected ${collectedCount}/${players.length}`;

  // ── Hide all views ───────────────────────────────────────────
  function hideAll() {
    [modeView, gridView, detailView].forEach((v) => {
      if (v) v.classList.add("dex-view--hidden");
    });
  }

  // ── MODE SELECT ──────────────────────────────────────────────
  function showMode() {
    view = "mode";
    hideAll();
    modeView.classList.remove("dex-view--hidden");
    renderMode();
  }

  function renderMode() {
    const options = modeView.querySelectorAll(".mode-option");
    options.forEach((opt, i) => opt.classList.toggle("is-selected", i === modeIndex));
  }

  document.getElementById("mode-all")?.addEventListener("click", () => {
    modeIndex = 0; openAllGrid();
  });

  // ── ALL-MEMBERS GRID ─────────────────────────────────────────
  function openAllGrid() {
    view = "grid";
    activePlayers = players;
    gridIndex = clampIndex(gridIndex, activePlayers.length);
    hideAll();
    gridView.classList.remove("dex-view--hidden");
    updateAllGridBadge();
    renderPlayerGrid(grid, activePlayers, gridIndex, (i) => {
      gridIndex = i;
      activeIndex = i;
      showDetail("grid");
    });
  }

  gridPrevBtn?.addEventListener("click", () => { if (view === "grid") changeGridPage(-1); });
  gridNextBtn?.addEventListener("click", () => { if (view === "grid") changeGridPage(1); });

  // ── SHARED GRID RENDER ───────────────────────────────────────
  function renderPlayerGrid(container, playerList, selectedIndex, onSelect) {
    container.innerHTML = "";
    if (!playerList.length) {
      container.innerHTML = '<div class="centered-copy">No members here.</div>';
      return;
    }
    const safeIndex  = clampIndex(selectedIndex, playerList.length);
    const pageStart  = Math.floor(safeIndex / PAGE_SIZE) * PAGE_SIZE;
    const pagePlayers = playerList.slice(pageStart, pageStart + PAGE_SIZE);

    pagePlayers.forEach((player, localIndex) => {
      const globalIndex = pageStart + localIndex;
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "dex-tile";
      tile.classList.toggle("is-selected", globalIndex === safeIndex);

      const spriteClass   = player.collected ? "sprite-collected" : "sprite-unknown";
      const nameDisplay   = player.collected ? player.name : "???";
      const chapterDisplay = player.collected ? player.team : "???";

      tile.innerHTML = `
        <div class="tile-sprite ${spriteClass}" aria-hidden="true"></div>
        <div class="tile-name">${nameDisplay}</div>
        <div class="tile-team">${chapterDisplay}</div>
      `;
      tile.addEventListener("click", () => onSelect(globalIndex));
      container.appendChild(tile);
    });

    for (let i = pagePlayers.length; i < PAGE_SIZE; i++) {
      const filler = document.createElement("div");
      filler.className = "dex-tile dex-tile--empty";
      filler.setAttribute("aria-hidden", "true");
      container.appendChild(filler);
    }
  }

  function stepPage(index, length, delta) {
    if (!length) return 0;
    const slot        = clampIndex(index, length) % PAGE_SIZE;
    const currentPage = Math.floor(clampIndex(index, length) / PAGE_SIZE);
    const nextPage    = Math.max(0, Math.min(getPageCount(length) - 1, currentPage + delta));
    return Math.min(length - 1, nextPage * PAGE_SIZE + slot);
  }

  function changeGridPage(delta) {
    gridIndex = stepPage(gridIndex, activePlayers.length, delta);
    updateAllGridBadge();
    renderPlayerGrid(grid, activePlayers, gridIndex, (i) => {
      gridIndex = i; activeIndex = i; showDetail("grid");
    });
  }

  // ── DETAIL VIEW ──────────────────────────────────────────────
  function showDetail(fromView) {
    view = "detail";
    hideAll();
    detailView.classList.remove("dex-view--hidden");
    renderDetail(fromView);
  }

  function renderDetail(fromView) {
    const player = activePlayers[activeIndex];
    const total  = activePlayers.length;

    if (indexLabel) indexLabel.textContent = `${activeIndex + 1} / ${total}`;

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
          row.innerHTML = `
            <span>${label} ${value}</span>
            <div class="stat-bar" style="--bar-fill:${value}%;"><span></span></div>
          `;
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

  // ── PROFILE GRID BUILDER ─────────────────────────────────────
  function buildProfileGrid(player) {
    if (!player) {
      return `<div class="profile-grid profile-grid--locked">
        <span class="pg-label">Status</span><span class="pg-value">Locked</span>
      </div>`;
    }
    const rows = [
      ["Chapter", player.team],
      ["Role",    player.pos],
      ["Year",    player.exp],
      ["Major",   player.college],
      ["Height",  player.ht.replace("-", "'\u00a0") + "\u201d"],
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
      if (key === "Enter") { event.preventDefault(); openAllGrid(); return; }
    }

    if (view === "grid") {
      if (key === "Escape" || key === "Backspace") { event.preventDefault(); showMode(); return; }
      if (key === "PageUp"   || key === "q" || key === "Q") { event.preventDefault(); changeGridPage(-1); return; }
      if (key === "PageDown" || key === "e" || key === "E") { event.preventDefault(); changeGridPage(1);  return; }
      if (key === "Enter") { event.preventDefault(); activeIndex = gridIndex; showDetail("grid"); return; }
      const dir = getDirection(event);
      if (!dir) return;
      event.preventDefault();
      if (dir === "up")    gridIndex = Math.max(0, gridIndex - COLS);
      if (dir === "down")  gridIndex = Math.min(activePlayers.length - 1, gridIndex + COLS);
      if (dir === "left")  gridIndex = Math.max(0, gridIndex - 1);
      if (dir === "right") gridIndex = Math.min(activePlayers.length - 1, gridIndex + 1);
      updateAllGridBadge();
      renderPlayerGrid(grid, activePlayers, gridIndex, (i) => { gridIndex = i; activeIndex = i; showDetail("grid"); });
      return;
    }

    if (view === "detail") {
      if (key === "Escape" || key === "Backspace") {
        event.preventDefault();
        view = "grid";
        hideAll();
        updateAllGridBadge();
        renderPlayerGrid(grid, activePlayers, gridIndex, (i) => { gridIndex = i; activeIndex = i; showDetail("grid"); });
        gridView.classList.remove("dex-view--hidden");
        return;
      }
      const dir = getDirection(event);
      if (dir === "left") {
        event.preventDefault();
        activeIndex = Math.max(0, activeIndex - 1);
        gridIndex = activeIndex;
        renderDetail("grid");
      } else if (dir === "right") {
        event.preventDefault();
        activeIndex = Math.min(activePlayers.length - 1, activeIndex + 1);
        gridIndex = activeIndex;
        renderDetail("grid");
      }
    }
  });

  // ── LIVE UPDATE ──────────────────────────────────────────────
  window.addEventListener("fratdex:statechange", () => {
    const collectedCount = players.filter((p) => p.collected).length;
    if (dexCount) dexCount.textContent = `Collected ${collectedCount}/${players.length}`;
    updateAllGridBadge();

    if (view === "grid") {
      renderPlayerGrid(grid, activePlayers, gridIndex, (i) => { gridIndex = i; activeIndex = i; showDetail("grid"); });
    } else if (view === "detail") {
      renderDetail("grid");
    }
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
