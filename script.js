const posts = [
  { category: 'academic', title: '논문을 읽고 내 것으로 만드는 작은 습관', date: '2026. 08. 22', label: '학업', art: 'RESEARCH\nNOTE' },
  { category: 'japan-life', title: '도쿄에서 혼자 산다는 것: 한 달 생활비 기록', date: '2026. 08. 18', label: '일본 일상', art: 'TOKYO\nLIFE' },
  { category: 'study-japan', title: '일본 대학원 진학, 준비는 어디서부터 시작할까', date: '2026. 08. 11', label: '일본 유학', art: 'STUDY\nABROAD' },
  { category: 'career-japan', title: '일본 취업 준비에서 처음 마주한 질문들', date: '2026. 08. 03', label: '일본 취직', art: 'CAREER\nNOTE' },
];

const categories = [
  ['academic', '학업'], ['japan-life', '일본 일상'], ['study-japan', '일본 유학'], ['career-japan', '일본 취직'],
  ['waseda', '와세다대학'], ['tokyo-univ', '도쿄대학'], ['katusa', '카투사'], ['ai-it', 'AI · IT'],
];

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.desktop-nav');
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('is-open');
});

if (document.body.dataset.categoryPage !== undefined) {
  const selected = new URLSearchParams(window.location.search).get('category');
  const name = categories.find(([key]) => key === selected)?.[1] ?? '전체 글';
  const selectedPosts = selected ? posts.filter((post) => post.category === selected) : posts;
  document.querySelector('[data-category-title]').textContent = name;
  document.querySelector('[data-category-count]').textContent = `${selectedPosts.length}개의 글`;
  document.title = `${name} | 와세다 한국인 공돌이`;
  document.querySelector('[data-category-nav]').innerHTML = [
    `<p class="sidebar-label">CATEGORIES</p><a href="category.html"><span>전체보기</span><b>${posts.length}</b></a>`,
    ...categories.map(([key, label]) => `<a href="category.html?category=${key}"><span>${label}</span><b>${posts.filter((post) => post.category === key).length}</b></a>`),
  ].join('');
  const grid = document.querySelector('[data-post-grid]');
  grid.innerHTML = selectedPosts.length
    ? selectedPosts.map((post) => `<a class="archive-card" href="#"><div class="archive-art">${post.art.replace('\n', '<br />')}</div><h2>${post.title}</h2><p>${post.label} · ${post.date}</p></a>`).join('')
    : '<p class="empty-message">아직 등록된 글이 없습니다.</p>';
}
