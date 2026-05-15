export async function render(container) {
  const res = await fetch('./data/projects-data.json');
  if (!res.ok) throw new Error('Could not load projects-data.json');
  const projects = await res.json();

  if (!projects.length) {
    container.innerHTML = '<p class="state-msg">No projects yet.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'projects-grid';

  grid.innerHTML = projects.map(p => `
    <article class="project-card">
      <img
        class="project-card__img"
        src="${escape(p.screenshot)}"
        alt="${escape(p.title)} screenshot"
        loading="lazy"
      />
      <div class="project-card__body">
        <h2 class="project-card__title">${escape(p.title)}</h2>
        <p class="project-card__desc">${escape(p.description)}</p>
        <div class="project-card__tags">
          ${(p.tags ?? []).map(t => `<span class="tag">${escape(t)}</span>`).join('')}
        </div>
      </div>
      <div class="project-card__footer">
        <a class="btn btn--primary" href="${escape(p.link)}" target="_blank" rel="noopener noreferrer">
          View project ↗
        </a>
      </div>
    </article>
  `).join('');

  container.appendChild(grid);
}

function escape(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
