let step = 0;

const messages = [
  "I messed up...",
  "I didn’t mean to hurt you 😔",
  "But I know I did...",
  "And I regret it deeply...",
  "You mean a lot to me ❤️",
  "Can you forgive me?"
];

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function startBackgroundSong() {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduceMotion) return;

  const audio = document.getElementById("bgMusic");
  if (!audio) return;

  audio.volume = 0.05;
  audio.loop = true;

  audio.play().catch(() => {});
}

function stopBackgroundSong() {
  const audio = document.getElementById("bgMusic");
  if (!audio) return;
  audio.pause();
}

function syncParagraphVisibility() {
  const p = document.querySelector(".insideParagraph");
  if (!p) return;

  const shouldShow = step === 0;
  p.style.display = shouldShow ? "block" : "none";
  p.setAttribute("aria-hidden", shouldShow ? "false" : "true");
}

function setSongCornerNoteVisible(visible, attachToEl) {
  const inside = document.querySelector(".card__inside");
  if (!inside) return;

  let note = document.getElementById("songCornerNote");
  if (!note) {
    note = document.createElement("div");
    note.id = "songCornerNote";
    note.className = "cornerNote";
    note.textContent = "I hope you enjoyed the song";
    inside.appendChild(note);
  }

  if (attachToEl && attachToEl.appendChild) {
    attachToEl.appendChild(note);
  }

  note.style.display = visible ? "block" : "none";
  note.setAttribute("aria-hidden", visible ? "false" : "true");
}

function nextStep() {
  step++;
  syncParagraphVisibility();
  setSongCornerNoteVisible(false);

  if (step < messages.length) {
    document.getElementById("text").innerText = messages[step];
  } else {
    showFinalOptions();
  }
}

function showFinalOptions() {
  const actions = document.getElementById("actions");
  if (!actions) return;

  syncParagraphVisibility();
  setSongCornerNoteVisible(false);

  actions.innerHTML = `
    <button class="primary" type="button" id="yesBtn">Yes ❤️</button>
    <button class="secondary" type="button" id="noBtn">No 😢</button>
  `;

  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");

  yesBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    forgive();
  });

  noBtn?.addEventListener("mouseenter", (e) => {
    e.stopPropagation();
    moveButton();
  });
  noBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    moveButton();
  });
}

function moveButton() {
  const btn = document.getElementById("noBtn");
  const box = document.getElementById("actions");
  if (!btn || !box) return;

  box.style.minHeight = "70px";

  btn.style.position = "absolute";

  const r = box.getBoundingClientRect();
  const pad = 8;
  const maxX = Math.max(pad, r.width - btn.offsetWidth - pad);
  const maxY = Math.max(pad, r.height - btn.offsetHeight - pad);

  const x = pad + Math.random() * (maxX - pad);
  const y = pad + Math.random() * (maxY - pad);

  btn.style.left = `${clamp(x, pad, maxX)}px`;
  btn.style.top = `${clamp(y, pad, maxY)}px`;
  btn.style.transform = "rotate(" + (Math.random() * 10 - 5).toFixed(1) + "deg)";
}

function heartBlast(originEl) {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduceMotion) return;

  const rect = originEl?.getBoundingClientRect?.();
  const origin = rect
    ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const layer = document.createElement("div");
  layer.className = "heartBlastLayer";
  document.body.appendChild(layer);

  const count = 50;
  const picks = ["💗", "✨", "❤️", "🧿"];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "blastHeart";
    el.textContent = picks[Math.floor(Math.random() * picks.length)];

    const angle = Math.random() * Math.PI * 2;
    const dist = 110 + Math.random() * 190;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - (70 + Math.random() * 70);

    const rot = (Math.random() * 120 - 60).toFixed(0) + "deg";
    const fs = (18 + Math.random() * 10).toFixed(0) + "px";
    const t = (1600 + Math.random() * 900).toFixed(0) + "ms";

    const dxm = dx * 0.55;
    const dym = dy * 0.55;

    el.style.left = `${origin.x}px`;
    el.style.top = `${origin.y}px`;
    el.style.setProperty("--dx", `${dx.toFixed(0)}px`);
    el.style.setProperty("--dy", `${dy.toFixed(0)}px`);
    el.style.setProperty("--dxm", `${dxm.toFixed(0)}px`);
    el.style.setProperty("--dym", `${dym.toFixed(0)}px`);
    el.style.setProperty("--rot", rot);
    el.style.setProperty("--fs", fs);
    el.style.setProperty("--t", t);

    layer.appendChild(el);
  }

  window.setTimeout(() => layer.remove(), 3200);
}

function forgive() {
  const title = document.getElementById("text");
  const actions = document.getElementById("actions");
  const yesBtn = document.getElementById("yesBtn");

  heartBlast(yesBtn);

  syncParagraphVisibility();

  if (title) {
    title.innerText = "Thank you 😭❤️\nI promise I’ll do better.";
  }
  if (actions) {
    actions.innerHTML = `<button class="primary" type="button" id="closeBtn">Close card ✨</button>`;
    setSongCornerNoteVisible(true, actions);
    const closeBtn = document.getElementById("closeBtn");
    closeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("card")?.classList.remove("is-open");
      stopBackgroundSong();
    });
  }
}

function spawnFloaty() {
  const holder = document.getElementById("floaties");
  if (!holder) return;

  const el = document.createElement("span");
  el.className = "floaty";

  const picks = ["💗", "💖", "✨", "⭐", "🌟", "🌷"];
  el.textContent = picks[Math.floor(Math.random() * picks.length)];

  const x = Math.random() * 100;
  const size = 14 + Math.random() * 18;
  const dur = 7 + Math.random() * 8;
  const drift = (Math.random() * 140 - 70).toFixed(0) + "px";
  const rot = (Math.random() * 220 - 110).toFixed(0) + "deg";
  const opacity = (0.35 + Math.random() * 0.55).toFixed(2);

  el.style.setProperty("--x", `${x}%`);
  el.style.setProperty("--size", `${size}px`);
  el.style.setProperty("--dur", `${dur}s`);
  el.style.setProperty("--drift", drift);
  el.style.setProperty("--rot", rot);
  el.style.setProperty("--opacity", opacity);

  holder.appendChild(el);
  window.setTimeout(() => el.remove(), (dur + 0.2) * 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("card");
  const nextBtn = document.getElementById("nextBtn");

  const toggleCard = () => card.classList.toggle("is-open");

  syncParagraphVisibility();
  setSongCornerNoteVisible(false);

  card?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleCard();
    if (card?.classList.contains("is-open")) startBackgroundSong();
    else stopBackgroundSong();
  });

  card?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCard();
      if (card?.classList.contains("is-open")) startBackgroundSong();
      else stopBackgroundSong();
    }
  });

  nextBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    nextStep();
  });

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (!reduceMotion) {
    window.setInterval(spawnFloaty, 520);
    for (let i = 0; i < 10; i++) window.setTimeout(spawnFloaty, i * 180);
  }
});