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
   6. COPYRIGHT YEAR
════════════════════════════ */
yrEl.textContent = new Date().getFullYear();
           
