(() => {
  const API = "https://roclahy.com/api/focus";
  const params = new URLSearchParams(location.search);
  const articleSlug = params.get("article");

  const esc = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  const setMeta = (selector, attr, value) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement(attr === "content" ? "meta" : "link");
      if (selector.includes('property="')) el.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
      else if (selector.includes('name="')) el.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
      else if (selector.includes('rel="')) el.setAttribute("rel", selector.match(/rel="([^"]+)"/)?.[1] || "");
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  async function loadArticle(slug) {
    const response = await fetch(API + "/article?site=vpn&slug=" + encodeURIComponent(slug), {
      headers: { accept: "application/json" },
      cache: "no-store"
    });
    if (!response.ok) throw new Error("not_found");
    const data = await response.json();
    return data.article;
  }

  async function loadArticles() {
    const response = await fetch(API + "/articles?site=vpn&limit=50", {
      headers: { accept: "application/json" },
      cache: "no-store"
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.articles || [];
  }

  function renderArticle(article) {
    const container = document.getElementById("blog-container");
    if (!container) return;

    const canonical = "https://vpn.roclahy.com/blog/?article=" + encodeURIComponent(article.slug);
    document.title = article.title + " — RoCla VPN";
    setMeta('meta[name="description"]', "content", article.description || "");
    setMeta('meta[property="og:title"]', "content", article.title);
    setMeta('meta[property="og:description"]', "content", article.description || "");
    setMeta('meta[property="og:url"]', "content", canonical);
    if (article.coverImage) setMeta('meta[property="og:image"]', "content", article.coverImage);
    setMeta('link[rel="canonical"]', "href", canonical);

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description || "",
      image: article.coverImage ? [article.coverImage] : [],
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: { "@type": "Person", name: article.authorName || "Roclahy" },
      publisher: { "@type": "Organization", name: "RoCla VPN", url: "https://vpn.roclahy.com" },
      mainEntityOfPage: canonical
    }).replace(/</g, "\u003c");
    document.head.appendChild(ld);

    const date = new Date(article.publishedAt).toLocaleDateString("es-ES", {
      day: "2-digit", month: "long", year: "numeric"
    });

    container.id = "article-container";
    container.innerHTML = `
      <div class="breadcrumb"><a href="/blog/"><i class="fa-solid fa-arrow-left"></i> Volver al Blog</a></div>
      <h1 id="title">${esc(article.title)}</h1>
      <div id="meta">
        <span class="author"><i class="fa-solid fa-user-circle"></i> ${esc(article.authorName || "Roclahy")}</span>
        <span class="date"><i class="fa-regular fa-calendar"></i> ${esc(date)}</span>
      </div>
      ${article.coverImage ? `<img src="${esc(article.coverImage)}" alt="" style="width:100%;border-radius:var(--radius-md);margin-bottom:2rem" fetchpriority="high">` : ""}
      <div id="content">${article.html}</div>
    `;
  }

  function focusCard(article) {
    const date = new Date(article.publishedAt).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", year: "numeric"
    });
    const href = "/blog/?article=" + encodeURIComponent(article.slug);
    return `
      <article class="blog-card" data-focus-article="${esc(article.slug)}">
        ${article.coverImage ? `<a class="blog-thumbnail" href="${href}"><img src="${esc(article.coverImage)}" alt="" loading="lazy" decoding="async"></a>` : ""}
        <div class="blog-info">
          <span class="blog-date">${esc(date)}</span>
          <h2 class="blog-title"><a href="${href}" style="text-decoration:none;color:inherit">${esc(article.title)}</a></h2>
          <p class="blog-desc">${esc(article.description || "")}</p>
          <a href="${href}" class="blog-btn">Leer más <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </article>
    `;
  }

  async function prependFocusArticles() {
    const items = await loadArticles();
    if (!items.length) return;
    const list = document.getElementById("blog-list");
    if (!list) return;

    // Let the legacy list finish loading first, then place Focus articles first.
    window.setTimeout(() => {
      const current = document.getElementById("blog-list");
      if (!current) return;
      const html = items.map(focusCard).join("");
      current.insertAdjacentHTML("afterbegin", html);
    }, 700);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    if (articleSlug && /^[a-z0-9-]{1,120}$/.test(articleSlug)) {
      try {
        const article = await loadArticle(articleSlug);
        renderArticle(article);
      } catch {
        const container = document.getElementById("blog-container");
        if (container) container.innerHTML = '<div class="breadcrumb"><a href="/blog/">Volver al Blog</a></div><h1 id="title">Artículo no encontrado</h1>';
      }
      return;
    }
    prependFocusArticles();
  });
})();