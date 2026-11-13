const planData = {
  gratis: { title:'Gratis', price:'0 CUP', data:'100 MB', icon:'/assets/plan-icons/mini.webp', link:'https://t.me/roclavpnbot?start=buy_pkg_1771696163', desc:'Tu prueba gratuita para comprobar cómo funciona RoCla VPN antes de subir de plan.', benefits:['100 MB de tráfico durante 30 días.','Incluye RoCla+ y Modo Ghost.','Para canjearlo, sigue nuestro canal de Telegram: t.me/roclavpn.','Disponible una vez por mes.'], support:'Este plan no incluye soporte.' },
  esencial: { title:'Esencial', price:'250 CUP', data:'6 GB', icon:'/assets/plan-icons/essencial.webp', link:'https://t.me/roclavpnbot?start=buy_pkg_1771696877', desc:'Para uso diario moderado: chat, correo, redes y algo de contenido multimedia.', benefits:['6 GB de tráfico durante 30 días.','RoCla+ incluido.','Dispositivos ilimitados, compartiendo la bolsa del plan.'], support:'Soporte incluido: 30 minutos al mes.' },
  plus: { title:'Plus', price:'300 CUP', data:'10 GB', icon:'/assets/plan-icons/plus.webp', link:'https://t.me/roclavpnbot?start=buy_pkg_1771696889', desc:'Más tráfico para tu rutina digital, redes sociales, música y video ocasional.', benefits:['10 GB de tráfico durante 30 días.','RoCla+ incluido.','Dispositivos ilimitados, compartiendo la bolsa del plan.'], support:'Soporte incluido: 60 minutos al mes.' },
  pro: { title:'Pro', price:'500 CUP', data:'40 GB', icon:'/assets/plan-icons/pro.webp', link:'https://t.me/roclavpnbot?start=buy_pkg_1771696902', desc:'Para estudio, trabajo remoto, videollamadas frecuentes y uso intensivo.', benefits:['40 GB de tráfico durante 30 días.','RoCla+ incluido.','Bloqueo de anuncios incluido.','Dispositivos ilimitados, compartiendo la bolsa del plan.'], support:'Soporte incluido: 120 minutos al mes.' },
  premium: { title:'Premium', price:'900 CUP', data:'100 GB', icon:'/assets/plan-icons/premium.webp', link:'https://t.me/roclavpnbot?start=buy_pkg_1771696915', desc:'Máximo tráfico para usuarios muy activos, familias o varios dispositivos.', benefits:['100 GB de tráfico durante 30 días.','RoCla+ incluido.','Bloqueo de anuncios incluido.','Límite de perfil incluido.','Dispositivos ilimitados, compartiendo la bolsa del plan.'], support:'Soporte incluido: 300 minutos al mes.' }
};

const modal = document.getElementById('planModal');
const modalBody = document.getElementById('modal-body');

function openModal(id){
  const p = planData[id];
  if(!p || !modal || !modalBody) return;
  modalBody.innerHTML = `
    <div class="modal-header">
      <div class="modal-title-wrap"><div class="modal-icon"><img src="${p.icon}" alt=""></div><h2>${p.title}</h2></div>
      <button class="close-modal" onclick="closeModal()" aria-label="Cerrar">×</button>
    </div>
    <div class="modal-summary"><div class="modal-price">${p.price}</div><div class="modal-data">${p.data} · 30 días</div><p class="modal-desc">${p.desc}</p></div>
    <div class="modal-section"><h4>Incluye</h4><ul>${p.benefits.map(x=>`<li><i class="hgi hgi-stroke hgi-checkmark-circle-02"></i><span>${x}</span></li>`).join('')}</ul></div>
    <div class="modal-section"><h4>Soporte</h4><ul><li><i class="hgi hgi-stroke hgi-customer-support"></i><span>${p.support}</span></li></ul></div>
    <a href="${p.link}" target="_blank" rel="noopener" class="button button-primary modal-cta">Obtener ${p.title}</a>`;
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
      <button class="close-modal" onclick="closeModal()" aria-label="Cerrar">×</button>
    </div>
    <p class="proxy-copy">Servicio proxy para Telegram con la infraestructura de RoCla VPN, pensado como alternativa durante bloqueos o problemas de acceso.</p>
    <a id="proxy-connect-btn" href="#" target="_blank" rel="noopener" class="button button-primary modal-cta">Conectar</a>`;
  showModal();
  try {
    const res = await fetch('/assets/tg-proxy.txt', {cache:'no-store'});
    if(res.ok){ document.getElementById('proxy-connect-btn').href = (await res.text()).trim(); }
  } catch(e){ console.error('No se pudo cargar el enlace del proxy.', e); }
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
  return new Intl.DateTimeFormat('es',{day:'numeric',month:'short',year:'numeric'}).format(d);
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

    if(!posts.length) throw new Error('Sin publicaciones');
    grid.innerHTML = posts.map(post=>`
      <article class="home-blog-card">
        <a href="${post.url}" class="home-blog-thumb"><img src="${post.thumbnail}" alt="${escapeHtml(post.title)}" loading="lazy"></a>
        <div class="home-blog-content">
          <div class="home-blog-date">${formatDate(post.date)}</div>
          <h3 class="home-blog-title"><a href="${post.url}">${escapeHtml(post.title)}</a></h3>
          <p class="home-blog-desc">${escapeHtml(post.description || '')}</p>
          <a href="${post.url}" class="home-blog-link">Leer publicación</a>
        </div>
      </article>`).join('');
  }catch(e){
    grid.innerHTML = '<div class="blog-loading">No se pudieron cargar las publicaciones.</div>';
    console.error('Error al cargar publicaciones', e);
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
  if(text) text.textContent = operational ? 'Operativo' : 'No disponible';
}

async function refreshServiceStatus(){
  const meta = document.getElementById('service-status-updated');
  try{
    const res = await fetch('https://proxy.roclahy.me/status-vpn.json?ts=' + Date.now(), {cache:'no-store'});
    if(!res.ok) throw new Error('Estado HTTP ' + res.status);
    const data = await res.json();
    setServiceStatus('service-status-vpn', !!data?.services?.vpn?.operational);
    setServiceStatus('service-status-mtproto', !!data?.services?.mtproto?.operational);
    const when = data.updated_at ? new Date(data.updated_at) : null;
    if(meta){
      meta.textContent = when && !Number.isNaN(when.getTime())
        ? 'Actualizado ' + when.toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit', hour12:true})
        : 'Actualizado ahora';
    }
  }catch(error){
    ['service-status-vpn','service-status-mtproto'].forEach(id=>{
      const card = document.getElementById(id);
      if(!card) return;
      card.classList.remove('is-operational','is-down');
      const text = card.querySelector('.service-status-text');
      if(text) text.textContent = 'Estado no disponible';
    });
    if(meta) meta.textContent = 'No se pudo consultar el estado';
    console.error('No se pudo consultar el estado de los servicios.', error);
  }
}


function initServiceStatus(){
  refreshServiceStatus();
  window.setInterval(refreshServiceStatus, 30000);
}

document.addEventListener('DOMContentLoaded',()=>{ initTheme(); initReveal(); initLatestBlogs(); initServiceStatus(); });
