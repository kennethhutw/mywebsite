const zh = document.documentElement.lang === 'zh-Hant';
const language = document.querySelector('#language');
if (zh) { language.href = '../index.html'; language.lang = 'en'; language.setAttribute('aria-label', 'Switch to English'); language.innerHTML = 'EN <span>↗</span>'; }
document.querySelector('#year').textContent = new Date().getFullYear();
const cases = {
  verdikt: {
    kicker: 'AI / WORKFLOW', title: 'VerdiktAI',
    description: zh ? '我從概念到執行全程負責 VerdiktAI，將活動參與者資訊整理成支援分析與後續聯絡的工作流程。' : 'I led VerdiktAI end to end, turning event participant information into a useful workflow for research and follow-up.',
    heading: zh ? '案例重點' : 'Project focus',
    points: zh ? ['活動參與者資訊整理與分析。', '支援 CRM 的名單整理與後續跟進。', '以這類場景作為客製化 AI 需求討論的起點。'] : ['Organizing and analyzing event participant information.', 'Supporting CRM-oriented lead preparation and follow-up.', 'A practical starting point for discussing custom AI workflows.'], service: 'ai'
  },
  bridgenix: {
    kicker: 'CONTENT / COMMUNICATION', title: 'Bridgenix',
    description: zh ? '我為 Bridgenix 撰寫文案與專業貼文，協助將金融科技與數位資產相關概念表達得更清楚。' : 'My contribution to Bridgenix focuses on copywriting and professional posts, helping communicate fintech and digital asset concepts clearly.',
    heading: zh ? '我的貢獻' : 'My contribution',
    points: zh ? ['產品與品牌相關文案。', '面向專業受眾的貼文。', '將產業主題整理為容易理解的內容。'] : ['Product and brand-related copywriting.', 'Posts written for a professional audience.', 'Turning industry topics into accessible content.'], service: 'content'
  }
};
const dialog = document.querySelector('#case-dialog');
let opener;
document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
  const item = cases[button.dataset.case]; opener = button;
  document.querySelector('#dialog-kicker').textContent = item.kicker;
  document.querySelector('#dialog-title').textContent = item.title;
  document.querySelector('#dialog-description').textContent = item.description;
  document.querySelector('#dialog-subheading').textContent = item.heading;
  document.querySelector('#dialog-points').replaceChildren(...item.points.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => opener?.focus());
document.querySelector('#dialog-contact').addEventListener('click', () => dialog.close());
