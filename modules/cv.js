export async function render(container) {
  const res = await fetch('./data/cv.json');
  if (!res.ok) throw new Error('Could not load cv.json');
  const cv = await res.json();

  const page = document.createElement('div');
  page.className = 'cv-page';
  page.innerHTML = `
    ${renderHeader(cv)}
    ${cv.personal.summary ? `<p class="cv-summary">${esc(cv.personal.summary)}</p>` : ''}
    ${renderExperience(cv.experience ?? [])}
    ${renderEducation(cv.education ?? [])}
    ${renderSkills(cv.skills ?? {})}
  `;

  // Print button (above the CV)
  const actions = document.createElement('div');
  actions.className = 'cv-actions';
  const printBtn = document.createElement('button');
  printBtn.className   = 'btn btn--primary';
  printBtn.textContent = '⬇  Download PDF';
  printBtn.addEventListener('click', () => window.print());
  actions.appendChild(printBtn);

  container.appendChild(actions);
  container.appendChild(page);
}

function renderHeader(cv) {
  const p = cv.personal;
  const links = (cv.links ?? []).map(l =>
    `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`
  ).join('');

  return `
    <header class="cv-header">
      <div>
        <h1 class="cv-name">${esc(p.name)}</h1>
        <p class="cv-role">${esc(p.title)}</p>
      </div>
      <div class="cv-meta">
        ${p.email    ? `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>` : ''}
        ${p.phone    ? `<span>${esc(p.phone)}</span>` : ''}
        ${p.location ? `<span>${esc(p.location)}</span>` : ''}
        ${p.website  ? `<a href="https://${esc(p.website)}" target="_blank" rel="noopener noreferrer">${esc(p.website)}</a>` : ''}
        ${links ? `<div class="cv-links">${links}</div>` : ''}
      </div>
    </header>
  `;
}

function renderExperience(entries) {
  if (!entries.length) return '';
  const items = entries.map(e => `
    <div class="cv-entry">
      <div class="cv-entry-header">
        <div>
          <span class="cv-entry-title">${esc(e.role)}</span>
          &nbsp;·&nbsp;
          <span class="cv-entry-sub">${esc(e.company)}</span>
        </div>
        <span class="cv-entry-meta">${esc(e.period)}${e.location ? `  ·  ${esc(e.location)}` : ''}</span>
      </div>
      ${e.bullets?.length ? `<ul class="cv-bullets">${e.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  return `<section class="cv-section"><h2 class="cv-section-title">Experience</h2>${items}</section>`;
}

function renderEducation(entries) {
  if (!entries.length) return '';
  const items = entries.map(e => `
    <div class="cv-entry">
      <div class="cv-entry-header">
        <div>
          <span class="cv-entry-title">${esc(e.degree)}</span>
          &nbsp;·&nbsp;
          <span class="cv-entry-sub">${esc(e.institution)}</span>
        </div>
        <span class="cv-entry-meta">${esc(e.period)}</span>
      </div>
      ${e.note ? `<p class="cv-entry-note">${esc(e.note)}</p>` : ''}
    </div>
  `).join('');

  return `<section class="cv-section"><h2 class="cv-section-title">Education</h2>${items}</section>`;
}

function renderSkills(skills) {
  const keys = Object.keys(skills);
  if (!keys.length) return '';

  const groups = keys.map(cat => `
    <div class="skill-group">
      <p class="skill-group__label">${esc(cat)}</p>
      <div class="skill-chips">
        ${(skills[cat] ?? []).map(s => `<span class="skill-chip">${esc(s)}</span>`).join('')}
      </div>
    </div>
  `).join('');

  return `
    <section class="cv-section">
      <h2 class="cv-section-title">Skills</h2>
      <div class="skill-groups">${groups}</div>
    </section>
  `;
}

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
