/* ═══════════════════════════════════════
   script.js — Suren Personal Site
   - Real-time decimal age
   - Dark / light theme
   - YouTube via API key
   - Blog modal system
   - Side nav active state
═══════════════════════════════════════ */

/* ── CONFIG ── */
const BIRTH_DATE     = new Date(2008, 7, 25, 0, 0, 0); // Aug 25 2008
const YT_API_KEY     = 'AIzaSyBaFMdPgOGi8SkZjUl_0vzpSYOUWzzcg1k';
const YT_CHANNEL_ID  = 'UCu_nUva-f22K2EH908Pdwng';
const MS_PER_YEAR    = 365.25 * 24 * 60 * 60 * 1000;
const YT_API         = 'https://www.googleapis.com/youtube/v3';

/* ── DOM ── */
const ageEl      = document.getElementById('ageDisplay');
const toggleBtn  = document.getElementById('themeToggle');
const toggleIcon = document.getElementById('toggleIcon');
const ytWrap     = document.getElementById('ytWrap');
const ytFrame    = document.getElementById('ytFrame');
const ytTitle    = document.getElementById('ytTitle');
const ytEmpty    = document.getElementById('ytEmpty');
const yrEl       = document.getElementById('yr');
const overlay    = document.getElementById('modalOverlay');
const modalDate  = document.getElementById('modalDate');
const modalTitle = document.getElementById('modalTitle');
const modalBody  = document.getElementById('modalBody');

/* ════════════════════════════
   1. REAL-TIME DECIMAL AGE
════════════════════════════ */
function tickAge() {
  ageEl.textContent = ((Date.now() - BIRTH_DATE.getTime()) / MS_PER_YEAR).toFixed(15);
}
setInterval(tickAge, 30);
tickAge();

/* ════════════════════════════
   2. DARK / LIGHT THEME
════════════════════════════ */
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  toggleIcon.textContent = t === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', t);
}
setTheme(localStorage.getItem('theme') || 'dark');
toggleBtn.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ════════════════════════════
   3. YOUTUBE API
════════════════════════════ */
async function loadLatestVideo() {
  try {
    // Step 1: get uploads playlist id
    const chRes  = await fetch(`${YT_API}/channels?part=contentDetails&id=${YT_CHANNEL_ID}&key=${YT_API_KEY}`);
    const chData = await chRes.json();
    if (!chData.items?.length) throw new Error('channel not found');
    const uploadsId = chData.items[0].contentDetails.relatedPlaylists.uploads;

    // Step 2: get latest video
    const plRes  = await fetch(`${YT_API}/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=1&key=${YT_API_KEY}`);
    const plData = await plRes.json();
    if (!plData.items?.length) throw new Error('no videos');
    const item = plData.items[0].snippet;

    // Step 3: embed
    ytFrame.src = `https://www.youtube.com/embed/${item.resourceId.videoId}?rel=0&modestbranding=1`;
    ytTitle.textContent = item.title;
    ytWrap.classList.remove('hidden');
    ytEmpty.classList.add('hidden');

  } catch (err) {
    // Show friendly empty state, no ugly errors
    ytEmpty.innerHTML = '<p style="color:var(--sub);font-size:0.88rem;">🎬 No videos yet — stay tuned!</p>';
    console.warn('YouTube load failed:', err.message);
  }
}
loadLatestVideo();

/* ════════════════════════════
   4. BLOG MODAL SYSTEM
   Add your blog content here!
   Each object = one blog post.
════════════════════════════ */
const BLOGS = [
  {
    title:   'Why I Started This Website',
    date:    'Feb 2026',
    tag:     'Life',
    excerpt: 'Every big thing starts with a small decision. This site is mine — a place to share thoughts, videos, and whatever\'s on my mind.',
    // Write the full blog content below inside the backticks
    // Use <p> tags for paragraphs
    body: `
      <p>Every big thing starts with a small decision.</p>
      <p>I wanted a place on the internet that was truly mine — not a social media feed, 
      not a platform with its own rules, but my own space to think out loud.</p>
      <p>This site is exactly that. A place to share what I'm working on, what I'm thinking about, 
      and whatever feels worth putting into words.</p>
      <p>If you're reading this — welcome. I'm glad you're here.</p>
    `
  },

  // ── ADD MORE BLOGS BELOW ──
  // Copy the block above (from { to }) and paste it here,
  // then change the title, date, tag, excerpt and body.
  // Remember to add a comma after each } except the last one.

];

// Opens the blog modal
function openBlog(index) {
  const b = BLOGS[index];
  if (!b) return;
  modalDate.textContent  = `${b.date} · ${b.tag}`;
  modalTitle.textContent = b.title;
  modalBody.innerHTML    = b.body;
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Closes the blog modal
function closeBlog() {
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

// Close modal with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeBlog();
});

/* ════════════════════════════
   5. SIDE NAV ACTIVE STATE
════════════════════════════ */
const sections  = document.querySelectorAll('main > section, main > footer');
const dotLinks  = document.querySelectorAll('.dot-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      dotLinks.forEach(d => d.classList.remove('active'));
      const active = document.querySelector(`.dot-link[data-section="${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => observer.observe(s));

/* ════════════════════════════
   6. COPYRIGHT YEAR
════════════════════════════ */
yrEl.textContent = new Date().getFullYear();
