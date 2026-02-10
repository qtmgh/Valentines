const noLines = [
  "Are you sure?",
  "Please??",
  "Pookie, think of the cats...",
  "Think of the gatitos...",
  "Tiny paws are counting on you",
  "Okay but... really sure?",
  "This is your dramatic no era",
  "Don't ragebait me",
  "What if we add more cuddly cats?",
  "Pookie please, reconsider",
  "Are you absolutely sure-sure?",
  "The gatitos voted yes",
  "This no is emotionally risky",
  "I can keep asking all day",
  "You are too cute to click no",
  "Cuddle committee says retry",
  "The pookie protocol requires yes",
  "No button is under review",
  "Romance department says: please?",
  "Final warning from the cuddle committee",
  "This is getting dramatic",
  "Last chance to pick joy"
];

const yesLines = [
  "Yes, obviously",
  "Yes, pookie",
  "Yes, be my Valentine",
  "Yes, let's do this",
  "Yes, for the gatitos",
  "Yes, 100% yes",
  "YES, forever vibes",
  "YES, pookie. Right now."
];

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");
const proposalCard = document.getElementById("proposalCard");
const loveScreen = document.getElementById("loveScreen");
const confettiLayer = document.getElementById("confettiLayer");
const heartLayer = document.getElementById("heartLayer");
const canvas = document.getElementById("fireworksCanvas");
const collageTall = document.getElementById("collageTall");
const collageWide = document.getElementById("collageWide");
const isMobile = window.matchMedia("(max-width: 720px)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const collageImages = [
  "pookies.jpeg",
  "us/IMG_1273.JPG",
  "us/IMG_1596.jpeg",
  "us/IMG_9364.jpeg",
  "us/IMG_0168.jpeg",
  "us/IMG_1276.JPG",
  "us/IMG_0440.jpeg",
  "us/IMG_1841.jpeg",
  "us/DSC00385.JPG",
  "us/IMG_1772.jpeg",
  "us/IMG_3974.jpeg",
  "us/IMG_1899.jpeg",
  "us/IMG_0395.jpeg",
  "us/IMG_3864.jpeg",
  "us/DSC00238.JPG",
  "us/DSC00166.JPG",
  "us/DSCN0095.jpeg",
  "us/DSC09806.jpeg",
  "us/IMG_1701.jpeg",
  "us/IMG_1594.jpeg",
  "us/DSC00262.JPG",
  "us/IMG_0832.jpeg"
];

let noClicks = 0;
let scale = 1;
const fullscreenThreshold = isMobile ? 3 : 8;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderCollage() {
  if (!collageTall || !collageWide) return;
  collageTall.innerHTML = "";
  collageWide.innerHTML = "";
  const maxItems = isMobile ? 10 : 16;
  const selected = shuffle([...collageImages]).slice(0, maxItems);

  function createItem(src, index) {
    const wrap = document.createElement("div");
    wrap.className = "collage-item";
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Our memory ${index + 1}`;
    img.loading = "lazy";
    wrap.appendChild(img);
    return { wrap, img };
  }

  selected.forEach((src, index) => {
    const probe = new Image();
    probe.src = src;

    probe.onload = () => {
      const { wrap, img } = createItem(src, index);
      if (probe.naturalHeight > probe.naturalWidth) {
        collageTall.appendChild(wrap);
      } else {
        collageWide.appendChild(wrap);
      }
      img.onerror = () => {
        wrap.remove();
      };
    };

    probe.onerror = () => {
      // Skip missing images.
    };
  });
}

function makeYesFullscreen() {
  document.body.style.overflow = "hidden";
  yesBtn.classList.add("fullscreen");
  yesBtn.textContent = "YES POOKIE";
  noBtn.style.display = "none";
  message.textContent = "The yes button has taken over.";
}

function spawnConfetti(count = 100) {
  const colors = ["#ff2f66", "#ffcf56", "#54d9ff", "#98ff78", "#ff8bbd"];
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.8 + Math.random() * 2.6}s`;
    piece.style.opacity = `${0.65 + Math.random() * 0.35}`;
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}

function spawnHearts(count = 45) {
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "♥";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${3.4 + Math.random() * 2.8}s`;
    heart.style.opacity = `${0.45 + Math.random() * 0.45}`;
    heartLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 6500);
  }
}

function startFireworks() {
  const ctx = canvas.getContext("2d");
  const particles = [];
  const burstParticleCount = prefersReducedMotion ? 0 : isMobile ? 30 : 60;
  const burstInterval = isMobile ? 980 : 720;

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function burst() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height * 0.6);
    const baseHue = Math.floor(Math.random() * 360);

    for (let i = 0; i < burstParticleCount; i += 1) {
      const angle = (Math.PI * 2 * i) / Math.max(burstParticleCount, 1);
      const speed = 1 + Math.random() * 3.8;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 70 + Math.random() * 35,
        hue: baseHue + Math.random() * 35,
        size: 1.8 + Math.random() * 2.8
      });
    }
  }

  function tick() {
    ctx.fillStyle = "rgba(255, 236, 244, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.022;
      p.life -= 1;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = Math.max(p.life / 100, 0);
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 100%, 64%, ${alpha})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  if (prefersReducedMotion) {
    return;
  }

  burst();
  setInterval(burst, burstInterval);
  tick();
}

let celebrationStarted = false;
function launchCelebration() {
  if (celebrationStarted) return;
  celebrationStarted = true;

  proposalCard.classList.add("hidden");
  loveScreen.classList.add("active");
  loveScreen.setAttribute("aria-hidden", "false");

  spawnConfetti(prefersReducedMotion ? 30 : isMobile ? 65 : 140);
  spawnHearts(prefersReducedMotion ? 15 : isMobile ? 28 : 55);
  startFireworks();

  if (prefersReducedMotion) return;
  setInterval(() => spawnConfetti(isMobile ? 18 : 42), isMobile ? 1450 : 1200);
  setInterval(() => spawnHearts(isMobile ? 8 : 18), isMobile ? 1750 : 1500);
}

noBtn.addEventListener("click", () => {
  noClicks += 1;

  if (noClicks >= fullscreenThreshold) {
    makeYesFullscreen();
    return;
  }

  scale = Math.min(scale + 0.26, 3.4);
  yesBtn.style.transform = `scale(${scale})`;
  yesBtn.style.boxShadow = `0 10px ${18 + noClicks * 3}px rgba(255, 61, 110, 0.45)`;

  noBtn.textContent = noLines[Math.min(noClicks - 1, noLines.length - 1)];
  yesBtn.textContent = yesLines[Math.min(noClicks, yesLines.length - 1)];

  if (scale > 2.2) {
    noBtn.style.opacity = "0.64";
  }
});

yesBtn.addEventListener("click", () => {
  launchCelebration();
});

renderCollage();
