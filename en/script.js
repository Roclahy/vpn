const planData = {
  gratis: { title:'Free', price:'0 CUP', data:'100 MB', icon:'/assets/plan-icons/mini.webp', link:'https://t.me/roclavpnbot?start=buy_pkg_1771696163', desc:'Your free trial to see how RoCla VPN works before moving up to a paid plan.', benefits:['100 MB of traffic for 30 days.','Includes RoCla+ and Ghost Mode.','To redeem it, follow our Telegram channel: <a href="https://t.me/roclavpn" target="_blank" rel="noopener">t.me/roclavpn</a>.','Available once a month.'], support:'This plan does not include support.' },
  esencial: { title:'Essential', price:'250 CUP', data:'6 GB', icon:'/assets/plan-icons/essencial.webp', link:'https://t.me/roclavpnbot?start=buy_pkg_1771696877', desc:'For moderate daily use: chat, email, social media and some multimedia content.', benefits:['6 GB of traffic for 30 days.','RoCla+ included.','Ghost Mode included.','Unlimited devices, sharing the plan’s data pool.'], support:'Support included: 10 minutes a month.' },
  plus: { title:'Plus', price:'300 CUP', data:'10 GB', icon:'/assets/plan-icons/plus.webp', link:'https://t.me/roclavpnbot?start=buy_pkg_1771696889', desc:'More traffic for your digital routine: social media, music and occasional video.', benefits:['10 GB of traffic for 30 days.','RoCla+ included.','Ghost Mode included.','Unlimited devices, sharing the plan’s data pool.'], support:'Support included: 20 minutes a month.' },
  pro: { title:'Pro', price:'500 CUP', data:'40 GB', icon:'/assets/plan-icons/pro.webp', link:'https://t.me/roclavpnbot?start=buy_pkg_1771696902', desc:'For study, remote work, frequent video calls and intensive use.', benefits:['40 GB of traffic for 30 days.','RoCla+ included.','Ghost Mode included.','Ad blocking included.','Unlimited devices, sharing the plan’s data pool.'], support:'Support included: 40 minutes a month.' },
  premium: { title:'Premium', price:'900 CUP', data:'100 GB', icon:'/assets/plan-icons/premium.webp', link:'https://t.me/roclavpnbot?start=buy_pkg_1771696915', desc:'Maximum traffic for very active users, families or several devices.', benefits:['100 GB of traffic for 30 days.','RoCla+ included.','Ghost Mode included.','Ad blocking included.','Profile limit included.','Unlimited devices, sharing the plan’s data pool.'], support:'Support included: 60 minutes a month.' }
};

const modal = document.getElementById('planModal');
const modalBody = document.getElementById('modal-body');

function openModal(id){
  const p = planData[id];
  if(!p || !modal || !modalBody) return;
  modalBody.innerHTML = `
    <div class="modal-header">
      <div class="modal-title-wrap"><div class="modal-icon"><img src="${p.icon}" alt=""></div><h2>${p.title}</h2></div>
      <button class="close-modal" onclick="closeModal()" aria-label="Close">×</button>
    </div>
    <div class="modal-summary"><div class="modal-price">${p.price}</div><div class="modal-data">${p.data} · 30 days</div><p class="modal-desc">${p.desc}</p></div>
    <div class="modal-section"><h4>Includes</h4><ul>${p.benefits.map(x=>`<li><i class="hgi hgi-stroke hgi-checkmark-circle-02"></i><span>${x}</span></li>`).join('')}</ul></div>
    <div class="modal-section"><h4>Support</h4><ul><li><i class="hgi hgi-stroke hgi-customer-support"></i><span>${p.support}</span></li></ul></div>
    <a href="${p.link}" target="_blank" rel="noopener" class="button button-primary modal-cta">Get ${p.title}</a>`;
  showModal();
}

function closeModal(){
  if(!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

function showModal(){
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}

async function openProxyModal(){
  if(!modal || !modalBody) return;
  modalBody.innerHTML = `
    <div class="modal-header">
      <div class="modal-title-wrap"><div class="modal-icon proxy-modal-icon"><img src="/assets/proxy.webp" alt=""></div><h2>Telegram Proxy</h2></div>
      <button class="close-modal" onclick="closeModal()" aria-label="Close">×</button>
    </div>
    <p class="proxy-copy">A proxy service for Telegram on RoCla VPN's infrastructure, designed as an alternative during blocks or access problems.</p>
    <a id="proxy-connect-btn" href="#" target="_blank" rel="noopener" class="button button-primary modal-cta">Connect</a>`;
  showModal();
  try {
    const res = await fetch('/assets/tg-proxy.txt', {cache:'no-store'});
    if(res.ok){ document.getElementById('proxy-connect-btn').href = (await res.text()).trim(); }
  } catch(e){ console.error('The proxy link could not be loaded.', e); }
}

function initTheme(){
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  if(!button) return;
  const stored = localStorage.getItem('theme');
  const preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (preferredDark ? 'dark' : 'light');
  setTheme(initial);
  button.addEventListener('click',()=>setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  function setTheme(theme){
    if(theme === 'dark') root.setAttribute('data-theme','dark'); else root.removeAttribute('data-theme');
    localStorage.setItem('theme', theme);
    const icon = button.querySelector('i');
    if(icon) icon.className = theme === 'dark' ? 'hgi hgi-stroke hgi-sun-03' : 'hgi hgi-stroke hgi-moon-02';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#000000' : '#f5f5f7');
  }
}

function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){ items.forEach(x=>x.classList.add('visible')); return; }
  const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }}), {threshold:.08});
  items.forEach(x=>observer.observe(x));
}

function parseDate(value){
  if(/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T00:00:00`);
  const months = {Enero:0,Febrero:1,Marzo:2,Abril:3,Mayo:4,Junio:5,Julio:6,Agosto:7,Septiembre:8,Octubre:9,Noviembre:10,Diciembre:11};
  const m = value.match(/^([A-Za-zÁÉÍÓÚáéíóúñÑ]+)\s+(\d{1,2}),\s*(\d{4})$/);
  return m && months[m[1]] !== undefined ? new Date(Number(m[3]),months[m[1]],Number(m[2])) : new Date(value);
}

function formatDate(value){
  const d = parseDate(value);
  if(Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('en',{day:'numeric',month:'short',year:'numeric'}).format(d);
}

async function initLatestBlogs(){
  const grid = document.getElementById('blog-carousel');
  if(!grid) return;
  try{
    const [legacyRes, focusRes] = await Promise.all([
      fetch('/blog/blogs.json', {cache:'no-store'}),
      fetch('https://roclahy.com/api/focus/articles?site=vpn&limit=6', {cache:'no-store', headers:{accept:'application/json'}})
    ]);

    const legacy = legacyRes.ok ? await legacyRes.json() : [];
    let focus = [];
    if(focusRes.ok){
      const payload = await focusRes.json();
      focus = (payload.articles || []).map(article=>({
        title: article.title,
        description: article.description || '',
        date: article.publishedAt || article.updatedAt || '',
        thumbnail: article.coverImage || '/roclavpn-logo-2.webp',
        url: '/blog/?article=' + encodeURIComponent(article.slug)
      }));
    }

    const posts = [...focus, ...legacy]
      .sort((a,b)=>parseDate(b.date)-parseDate(a.date))
      .slice(0,2);

    if(!posts.length) throw new Error('No posts');
    grid.innerHTML = posts.map(post=>`
      <article class="home-blog-card">
        <a href="${post.url}" class="home-blog-thumb"><img src="${post.thumbnail}" alt="${escapeHtml(post.title)}" loading="lazy"></a>
        <div class="home-blog-content">
          <div class="home-blog-date">${formatDate(post.date)}</div>
          <h3 class="home-blog-title"><a href="${post.url}">${escapeHtml(post.title)}</a></h3>
          <p class="home-blog-desc">${escapeHtml(post.description || '')}</p>
          <a href="${post.url}" class="home-blog-link">Read post</a>
        </div>
      </article>`).join('');
  }catch(e){
    grid.innerHTML = '<div class="blog-loading">The posts could not be loaded.</div>';
    console.error('Error loading posts', e);
  }
}

function escapeHtml(text=''){ return String(text).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c])); }

modal?.addEventListener('click',e=>{ if(e.target === modal) closeModal(); });
document.addEventListener('keydown',e=>{ if(e.key === 'Escape') closeModal(); });

function setServiceStatus(id, operational){
  const card = document.getElementById(id);
  if(!card) return;
  card.classList.remove('is-operational','is-down');
  card.classList.add(operational ? 'is-operational' : 'is-down');
  const text = card.querySelector('.service-status-text');
  if(text) text.textContent = operational ? 'Operational' : 'Unavailable';
}

async function refreshServiceStatus(){
  const meta = document.getElementById('service-status-updated');
  try{
    const res = await fetch('https://proxy.roclahy.me/status-vpn.json?ts=' + Date.now(), {cache:'no-store'});
    if(!res.ok) throw new Error('Estado HTTP ' + res.status);
    const data = await res.json();
    setServiceStatus('service-status-vpn', !!data?.services?.vpn?.operational);
    setServiceStatus('service-status-mtproto', !!data?.services?.mtproto?.operational && !!data?.services?.proxy_web?.operational);
    const when = data.updated_at ? new Date(data.updated_at) : null;
    if(meta){
      meta.textContent = when && !Number.isNaN(when.getTime())
        ? 'Updated ' + when.toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit', hour12:true})
        : 'Updated just now';
    }
  }catch(error){
    ['service-status-vpn','service-status-mtproto'].forEach(id=>{
      const card = document.getElementById(id);
      if(!card) return;
      card.classList.remove('is-operational','is-down');
      const text = card.querySelector('.service-status-text');
      if(text) text.textContent = 'Status unavailable';
    });
    if(meta) meta.textContent = 'The status could not be checked';
    console.error('The service status could not be checked.', error);
  }
}


function initServiceStatus(){
  refreshServiceStatus();
  window.setInterval(refreshServiceStatus, 30000);
}

document.addEventListener('DOMContentLoaded',()=>{ initTheme(); initReveal(); initLatestBlogs(); initServiceStatus(); });
