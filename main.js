const nav     = document.getElementById('tab-nav');
const content = document.getElementById('tab-content');
const cache   = {};

async function loadTabs() {
  const res = await fetch('./tabs.json');
  if (!res.ok) throw new Error('Could not load tabs.json');
  return res.json();
}

function buildNav(tabs) {
  tabs.forEach(tab => {
    const a = document.createElement('a');
    a.href        = `#${tab.id}`;
    a.className   = 'tab-link';
    a.textContent = tab.label;
    a.dataset.tab = tab.id;
    nav.appendChild(a);
  });
}

function setActiveLink(id) {
  nav.querySelectorAll('.tab-link').forEach(a => {
    a.classList.toggle('active', a.dataset.tab === id);
    a.setAttribute('aria-current', a.dataset.tab === id ? 'page' : 'false');
  });
}

function showMessage(msg, isError = false) {
  content.innerHTML = `<p class="state-msg${isError ? ' error' : ''}">${msg}</p>`;
}

async function activateTab(id, tabs) {
  const tab = tabs.find(t => t.id === id) ?? tabs[0];
  if (!tab) return;

  // Correct the hash if we fell back to the default tab
  if (tab.id !== id) {
    history.replaceState(null, '', `#${tab.id}`);
  }

  setActiveLink(tab.id);
  showMessage('Loading…');

  try {
    if (!cache[tab.id]) {
      cache[tab.id] = await import(tab.module);
    }
    content.innerHTML = '';
    await cache[tab.id].render(content);
  } catch (err) {
    console.error(err);
    showMessage(`Failed to load the ${tab.label} tab. ${err.message}`, true);
  }
}

async function init() {
  try {
    const tabs = await loadTabs();
    buildNav(tabs);

    const handleHash = () => {
      const id = location.hash.slice(1) || tabs[0]?.id;
      activateTab(id, tabs);
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
  } catch (err) {
    showMessage(`Could not initialise portfolio: ${err.message}`, true);
  }
}

init();
