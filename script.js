const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Mobile nav */
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}));

/* Scroll reveal */
const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  }
}), { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

/* Decode / decrypt text effect for headings (preserves nested <span> markup) */
const CIPHER = "!<>-_\\/[]{}—=+*^?#$%01";
function decodeText(el) {
  if (reduceMotion) return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.trim().length) nodes.push(node);
  }
  if (!nodes.length) return;
  const originals = nodes.map((n) => n.textContent);
  let frame = 0;
  const totalFrames = 16;
  const interval = setInterval(() => {
    nodes.forEach((n, ni) => {
      const orig = originals[ni];
      n.textContent = [...orig].map((ch, i) => {
        if (ch === " ") return " ";
        const revealFrame = Math.floor((i / orig.length) * totalFrames);
        if (frame >= revealFrame + 5) return ch;
        return CIPHER[Math.floor(Math.random() * CIPHER.length)];
      }).join("");
    });
    frame++;
    if (frame > totalFrames + 6) {
      nodes.forEach((n, ni) => (n.textContent = originals[ni]));
      clearInterval(interval);
    }
  }, 30);
}
const decodeObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    decodeText(entry.target);
    decodeObserver.unobserve(entry.target);
  }
}), { threshold: 0.3 });
document.querySelectorAll(".decode").forEach((el) => decodeObserver.observe(el));

/* Hero terminal typing sequence */
const heroLines = document.querySelectorAll(".hero-term .line");
if (heroLines.length) {
  if (reduceMotion) {
    heroLines.forEach((l) => (l.style.opacity = 1));
  } else {
    heroLines.forEach((line) => (line.style.opacity = 0));
    let delay = 200;
    heroLines.forEach((line, idx) => {
      const text = line.dataset.text || "";
      setTimeout(() => {
        line.style.opacity = 1;
        if (!text) return;
        let i = 0;
        const target = line.querySelector(".typed") || line;
        target.textContent = "";
        const typer = setInterval(() => {
          target.textContent = text.slice(0, i + 1);
          i++;
          if (i >= text.length) clearInterval(typer);
        }, 18);
      }, delay);
      delay += (line.dataset.text || "").length * 18 + 260;
    });
  }
}
