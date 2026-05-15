let photos   = [];
let current  = 0;
let keyHandler = null;

export async function render(container) {
  const res = await fetch('./data/photos.json');
  if (!res.ok) throw new Error('Could not load photos.json');
  photos = await res.json();

  if (!photos.length) {
    container.innerHTML = '<p class="state-msg">No photos yet.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'photo-grid';

  photos.forEach((photo, i) => {
    const item = document.createElement('div');
    item.className = 'photo-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Open photo: ${photo.caption}`);

    const img = document.createElement('img');
    img.src     = photo.src;
    img.alt     = photo.caption;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className   = 'photo-item__overlay';
    overlay.textContent = photo.caption;

    item.appendChild(img);
    item.appendChild(overlay);
    item.addEventListener('click',  () => openLightbox(i));
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); });
    grid.appendChild(item);
  });

  container.appendChild(grid);
  setupLightbox();
}

function setupLightbox() {
  const lb      = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lb-close');
  const prevBtn  = document.getElementById('lb-prev');
  const nextBtn  = document.getElementById('lb-next');

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click',  () => navigate(-1));
  nextBtn.addEventListener('click',  () => navigate(+1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
}

function openLightbox(index) {
  current = index;
  updateLightboxContent();

  const lb = document.getElementById('lightbox');
  lb.hidden = false;
  document.body.style.overflow = 'hidden';

  keyHandler = handleKey;
  document.addEventListener('keydown', keyHandler);
  document.getElementById('lb-close').focus();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.hidden = true;
  document.body.style.overflow = '';

  if (keyHandler) {
    document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
  }
}

function navigate(delta) {
  current = (current + delta + photos.length) % photos.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const photo = photos[current];
  const img   = document.getElementById('lb-img');
  const cap   = document.getElementById('lb-caption');

  img.src = photo.src;
  img.alt = photo.caption;
  cap.textContent = photo.caption + (photo.date ? `  ·  ${formatDate(photo.date)}` : '');
}

function handleKey(e) {
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   navigate(-1);
  if (e.key === 'ArrowRight')  navigate(+1);
}

function formatDate(ym) {
  const [y, m] = ym.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[+m - 1]} ${y}`;
}
