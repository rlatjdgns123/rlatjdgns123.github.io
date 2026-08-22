const posts = [
  { id: 'paper-reading', category: 'academic', label: '논문 리뷰', date: '2026. 08. 22', art: 'PAPER\nREVIEW', title: '논문을 읽고 내 것으로 만드는 작은 습관', content: ['논문을 끝까지 읽는 것보다 먼저 중요한 것은, 이 논문에서 무엇을 얻고 싶은지 한 문장으로 적는 일이다.', '나는 초록을 읽은 뒤 연구 질문과 데이터, 방법, 결론을 빈 노트에 먼저 적어 둔다. 이후 본문을 읽으며 빈칸을 채우면 정보가 훨씬 덜 흩어진다.', '마지막에는 논문의 한계와 내 연구에 연결할 수 있는 지점을 세 줄로 정리한다. 완벽한 요약보다 다음에 다시 열어볼 수 있는 작은 기록을 남기는 것이 목표다.'] },
  { id: 'statistics-start', category: 'japan-life', label: '통계', date: '2026. 08. 18', art: 'STATISTICS\nNOTE', title: '기초 통계를 다시 정리하며: 평균과 분산의 역할', content: ['평균은 데이터의 중심을 보여주지만, 데이터가 얼마나 안정적인지는 알려주지 않는다. 그래서 평균을 볼 때는 항상 분산이나 표준편차를 함께 확인한다.', '같은 평균을 가진 두 집단도 분산이 다르면 전혀 다른 모습일 수 있다. 실제 데이터를 분석할 때는 요약 통계량과 분포 그림을 나란히 두는 편이 좋다.', '작은 연습으로는 관심 있는 데이터 하나를 골라 평균, 중앙값, 표준편차를 계산하고 히스토그램을 그려보는 것을 추천한다.'] },
  { id: 'causal-question', category: 'study-japan', label: '인과추론', date: '2026. 08. 11', art: 'CAUSAL\nINFERENCE', title: '인과추론을 시작할 때 먼저 그려보는 DAG', content: ['인과관계에 관한 질문은 “무엇이 무엇에 영향을 주는가”를 명확히 하는 일에서 시작한다. 이때 DAG는 복잡한 가정을 드러내는 좋은 도구다.', '처치, 결과, 교란변수 후보를 먼저 적고 화살표를 연결한다. 무엇을 통제해야 하는지보다 무엇을 통제하면 안 되는지를 발견하는 데 특히 도움이 된다.', 'DAG는 정답을 만들어주지 않는다. 대신 내가 가진 가정을 다른 사람과 검토할 수 있는 형태로 바꿔준다.'] },
  { id: 'job-prep', category: 'career-japan', label: '일본 취직', date: '2026. 08. 03', art: 'CAREER\nNOTE', title: '일본 취업 준비에서 처음 마주한 질문들', content: ['취업 준비를 시작하며 가장 어려웠던 것은 좋은 답을 찾는 일이 아니라, 내 경험을 상대가 이해할 수 있는 언어로 정리하는 일이었다.', '경험 하나를 상황, 행동, 결과의 순서로 정리하면 면접과 서류에서 모두 활용할 수 있다. 작은 프로젝트라도 내가 맡았던 판단과 배운 점을 구체적으로 적는 것이 중요하다.', '아직 답을 찾는 중이지만, 기록을 쌓는 과정 자체가 다음 질문에 더 빨리 답하게 해 준다고 믿는다.'] },
];

const categories = [
  ['academic', '논문 리뷰'], ['japan-life', '통계'], ['study-japan', '인과추론'], ['career-japan', '일본 취직'],
  ['waseda', '일본 일상'], ['tokyo-univ', '도쿄대학'], ['katusa', '카투사'], ['ai-it', 'AI · IT'],
];

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.desktop-nav');
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('is-open');
});

function categoryNav() {
  return [
    `<p class="sidebar-label">CATEGORIES</p><a href="category.html"><span>전체보기</span><b>${posts.length}</b></a>`,
    ...categories.map(([key, label]) => `<a href="category.html?category=${key}"><span>${label}</span><b>${posts.filter((post) => post.category === key).length}</b></a>`),
  ].join('');
}

if (document.body.dataset.categoryPage !== undefined) {
  const selected = new URLSearchParams(window.location.search).get('category');
  const name = categories.find(([key]) => key === selected)?.[1] ?? '전체 글';
  const selectedPosts = selected ? posts.filter((post) => post.category === selected) : posts;
  document.querySelector('[data-category-title]').textContent = name;
  document.querySelector('[data-category-count]').textContent = `${selectedPosts.length}개의 글`;
  document.title = `${name} | 와세다 한국인 공돌이`;
  document.querySelector('[data-category-nav]').innerHTML = categoryNav();
  const grid = document.querySelector('[data-post-grid]');
  grid.innerHTML = selectedPosts.length
    ? selectedPosts.map((post) => `<a class="archive-card" href="post.html?id=${post.id}"><div class="archive-art">${post.art.replace('\n', '<br />')}</div><h2>${post.title}</h2><p>${post.label} · ${post.date}</p></a>`).join('')
    : '<p class="empty-message">아직 등록된 글이 없습니다.</p>';
}

if (document.body.dataset.postPage !== undefined) {
  const id = new URLSearchParams(window.location.search).get('id');
  const post = posts.find((item) => item.id === id) ?? posts[0];
  document.title = `${post.title} | 와세다 한국인 공돌이`;
  document.querySelector('[data-category-nav]').innerHTML = categoryNav();
  document.querySelector('[data-post-label]').textContent = post.label;
  document.querySelector('[data-post-date]').textContent = post.date;
  document.querySelector('[data-post-title]').textContent = post.title;
  document.querySelector('[data-post-art]').innerHTML = post.art.replace('\n', '<br />');
  document.querySelector('[data-post-content]').innerHTML = post.content.map((paragraph) => `<p>${paragraph}</p>`).join('');
}
