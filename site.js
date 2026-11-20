// Shared header, footer and post feeds for coffeycompassrealtygroup.com
(function () {
  var page = document.body.getAttribute('data-page') || '';
  var links = [
    ['search.html', 'Search Homes', 'search'],
    ['listings.html', 'Our Listings', 'listings'],
    ['areas.html', 'Areas', 'areas'],
    ['about.html', 'Our Team', 'about'],
    ['community.html', 'Community', 'community'],
    ['podcast.html', 'Podcast', 'podcast'],
    ['corners.html', 'Journal', 'corners']
  ];
  var nav = links.map(function (l) {
    return '<a href="' + l[0] + '"' + (l[2] === page ? ' class="on"' : '') + '>' + l[1] + '</a>';
  }).join('');

  var header = document.getElementById('site-header');
  if (header) {
    header.innerHTML =
      '<div class="utility"><div class="wrap">' +
      '<div><span class="hide-sm">350 E. High St, Mooresville, IN 46158</span></div>' +
      '<div><span><a href="tel:13174009258">317-400-9258</a></span><span class="hide-sm"><a href="mailto:markcoffey@kw.com">markcoffey@kw.com</a></span></div>' +
      '</div></div>' +
      '<div class="top"><div class="wrap">' +
      '<a class="brand" href="index.html"><img src="img/logo.webp" alt="Coffey Compass Realty Group, Keller Williams"></a>' +
      '<button class="menu-btn" aria-label="Menu">Menu</button>' +
      '<nav class="nav">' + nav + '<a class="cta" href="index.html#contact">Home value</a></nav>' +
      '</div></div>';
    var btn = header.querySelector('.menu-btn');
    var navEl = header.querySelector('.nav');
    btn.addEventListener('click', function () { navEl.classList.toggle('open'); });
  }

  var footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML =
      '<footer><div class="wrap"><div class="grid">' +
      '<div><a class="logo" href="index.html"><img src="img/logo.webp" alt="Coffey Compass Realty Group"></a>' +
      '<p style="margin-top:22px;max-width:300px">A family real estate team serving Mooresville and central Indiana.</p></div>' +
      '<div><h5>Contact</h5><ul><li>Mark: <a href="tel:13174009258">317-400-9258</a></li><li>Patsy: <a href="tel:13172813413">317-281-3413</a></li><li><a href="mailto:markcoffey@kw.com">markcoffey@kw.com</a></li><li>350 E. High St<br>Mooresville, IN 46158</li></ul></div>' +
      '<div><h5>Explore</h5><ul><li><a href="search.html">Search all homes</a></li><li><a href="listings.html">Our listings</a></li><li><a href="index.html#sold">Recently sold</a></li><li><a href="land.html">Selling land</a></li><li><a href="expired.html">Listing expired?</a></li><li><a href="about.html">Our team</a></li><li><a href="community.html">Community</a></li><li><a href="podcast.html">Podcast</a></li><li><a href="corners.html">Journal</a></li></ul></div>' +
      '<div><h5>Areas</h5><ul><li><a href="mooresville.html">Mooresville</a></li><li><a href="martinsville.html">Martinsville</a></li><li><a href="indianapolis.html">Indianapolis</a></li><li><a href="greenwood.html">Greenwood</a></li><li><a href="hendricks-county.html">Plainfield &amp; Hendricks Co.</a></li><li><a href="https://search.google.com/local/reviews?placeid=ChIJc22aI9ujbIgRrxVjRH2wT7s" target="_blank" rel="noopener">Google reviews</a></li></ul></div>' +
      '</div>' +
      '<div class="legal"><div>Coffey Compass Realty Group, Keller Williams Indy Metro Partners. Each Keller Williams office is independently owned and operated. Equal Housing Opportunity.</div>' +
      '<div>&copy; ' + new Date().getFullYear() + ' Coffey Compass Realty Group</div></div>' +
      '</div></footer>';
  }

  // Lead forms -> Make webhook (logs to Website Leads, texts Mark)
  var HOOK = 'https://hook.us2.make.com/2y6giz2cdbhhvh952x6e5hia7v9syoem';
  document.querySelectorAll('form.lead-form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = f.querySelector('.form-msg');
      var fd = new FormData(f);
      if (!fd.get('phone') && !fd.get('email')) { msg.textContent = 'Please add a phone number or email so we can reach you.'; return; }
      if (f.hasAttribute('data-criteria')) {
        var parts = [];
        f.querySelectorAll('[data-crit]').forEach(function (el) { if (el.value) parts.push(el.getAttribute('data-crit') + ': ' + el.value); });
        var extra = fd.get('notes') ? ' Notes: ' + fd.get('notes') : '';
        fd.set('notes', 'Listing alert request. ' + parts.join('; ') + '.' + extra);
      }
      fd.append('source', f.getAttribute('data-source') || location.pathname);
      var btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'Sending...';
      fetch(HOOK, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(fd) })
        .then(function () {
          f.innerHTML = '<h3>Thank you.</h3><p class="form-sub">We got it. Mark or Patsy will be in touch shortly, usually the same day. If it\'s urgent, call or text Mark at <a href="tel:13174009258">317-400-9258</a>.</p>';
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Try again';
          msg.innerHTML = 'Something went wrong. Please call or text <a href="tel:13174009258">317-400-9258</a>.';
        });
    });
  });
  // "Ask about it" buttons prefill the form on the page
  document.querySelectorAll('[data-ask]').forEach(function (a) {
    a.addEventListener('click', function () {
      var f = document.querySelector('form.lead-form');
      if (!f) return;
      var ad = f.querySelector('[name=address]'), n = f.querySelector('[name=notes]');
      var m = a.getAttribute('data-ask').match(/info on (.*)$/);
      if (ad && m) ad.value = m[1];
      if (n && !n.value) n.value = a.getAttribute('data-ask');
    });
  });

  // Phone call / text / search bar
  if (!document.querySelector('.callbar')) {
    var cb = document.createElement('div');
    cb.className = 'callbar';
    cb.innerHTML = '<a href="tel:13174009258">Call</a><a href="sms:13174009258">Text</a><a class="hot" href="search.html">Search</a>';
    document.body.appendChild(cb);
  }

  // Listing photo gallery + full-screen viewer
  var gal = document.querySelector('.gallery');
  if (gal) {
    var photos = JSON.parse(gal.getAttribute('data-photos') || '[]');
    var mainImg = gal.querySelector('.g-main img');
    var count = gal.querySelector('.g-count');
    var thumbs = gal.querySelectorAll('.g-thumb');
    var lb = document.querySelector('.lightbox');
    var lbImg = lb.querySelector('img'), lbCount = lb.querySelector('.lb-count');
    var cur = 0;
    function show(i) {
      cur = (i + photos.length) % photos.length;
      mainImg.src = photos[cur];
      count.textContent = (cur + 1) + ' / ' + photos.length;
      lbImg.src = photos[cur];
      lbCount.textContent = (cur + 1) + ' / ' + photos.length;
      thumbs.forEach(function (t, j) { t.classList.toggle('on', j === cur); });
      if (thumbs[cur] && thumbs[cur].scrollIntoView) {
        var strip = gal.querySelector('.g-strip');
        strip.scrollTo({ left: thumbs[cur].offsetLeft - strip.offsetLeft - 20, behavior: 'smooth' });
      }
      new Image().src = photos[(cur + 1) % photos.length];
    }
    function open() { lb.hidden = false; document.body.style.overflow = 'hidden'; show(cur); }
    function close() { lb.hidden = true; document.body.style.overflow = ''; }
    gal.querySelector('.g-prev').onclick = function () { show(cur - 1); };
    gal.querySelector('.g-next').onclick = function () { show(cur + 1); };
    gal.querySelector('.g-full').onclick = open;
    mainImg.onclick = open;
    thumbs.forEach(function (t) { t.onclick = function () { show(+t.getAttribute('data-i')); }; });
    lb.querySelector('.lb-x').onclick = close;
    lb.querySelector('.lb-prev').onclick = function () { show(cur - 1); };
    lb.querySelector('.lb-next').onclick = function () { show(cur + 1); };
    lb.onclick = function (e) { if (e.target === lb) close(); };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
      else if (e.key === 'Escape') close();
    });
    [gal.querySelector('.g-main'), lb].forEach(function (el) {
      var x0 = null;
      el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      el.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
        x0 = null;
      });
    });
    show(0);
  }

  // Long descriptions: show a few lines with Read more on phones
  var rm = document.querySelector('[data-clamp]');
  if (rm && window.innerWidth < 760 && rm.scrollHeight > 260) {
    rm.classList.add('clamp');
    var mb = document.createElement('button');
    mb.className = 'more-btn'; mb.type = 'button'; mb.textContent = 'Read more';
    mb.onclick = function () { rm.classList.remove('clamp'); mb.remove(); };
    rm.parentNode.insertBefore(mb, rm.nextSibling);
  }

  // Search page: quick searches load inside the page
  var frame = document.querySelector('.idx-frame iframe');
  if (frame) {
    var mode = 'homes';
    var now = document.querySelector('.idx-now');
    function go(btn) {
      var url = btn.getAttribute('data-' + mode) || btn.getAttribute('data-homes');
      if (!url) return;
      frame.src = url;
      document.querySelectorAll('.chips button').forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      window.__lastPick = btn;
      if (now) now.textContent = 'Showing ' + (mode === 'land' ? 'land' : 'homes') + ' near ' + btn.textContent + '. Zoom the map or use the filters to narrow it down.';
      document.querySelector('.idx-frame').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.querySelectorAll('.chips button').forEach(function (b) { b.addEventListener('click', function () { go(b); }); });
    var box = document.querySelector('.qs-box');
    if (box) box.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = box.q.value.trim();
      if (!v) return;
      var q = v;
      if (!/^\d{5}$/.test(v) && !/(,\s*in\b|indiana)/i.test(v)) q = v + ', IN';
      var base = 'https://markcoffey.kw.com/search/sale?q=' + encodeURIComponent(q);
      var fake = document.createElement('button');
      fake.setAttribute('data-homes', base);
      fake.setAttribute('data-land', base + '&property_subtype=LOTSANDLAND');
      fake.textContent = v;
      go(fake);
      if (/school/i.test(v) && now) now.textContent += ' For an exact school district search, use the "Send me new listings" form below and we will set it up straight from the MLS.';
    });
    document.querySelectorAll('.toggle button').forEach(function (t) {
      t.addEventListener('click', function () {
        mode = t.getAttribute('data-mode');
        document.querySelectorAll('.toggle button').forEach(function (x) { x.classList.toggle('on', x === t); });
        var on = window.__lastPick || document.querySelector('.chips button.on');
        if (on) go(on);
        var alertType = document.querySelector('form [name=looking_for]');
        if (alertType) alertType.value = mode === 'land' ? 'Land' : 'A home';
      });
    });
  }

  // Post feeds: any element with data-feed="category1,category2" and optional data-limit
  var feeds = document.querySelectorAll('[data-feed]');
  if (!feeds.length) return;

  var labels = { local: 'Local News', events: 'Events', health: "Patsy's Health Corner", faith: "Becca's Faith & Community", business: "Mark on Business & Building" };

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function fmt(d) { var t = new Date(d + 'T12:00:00'); return isNaN(t) ? '' : t.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }

  function render(el, posts) {
    var cats = el.getAttribute('data-feed').split(',');
    var limit = parseInt(el.getAttribute('data-limit') || '99', 10);
    var list = posts.filter(function (p) { return cats.indexOf(p.category) > -1; })
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); })
      .slice(0, limit);
    if (!list.length) {
      el.innerHTML = '<div class="empty">' + esc(el.getAttribute('data-empty') || 'New posts are on the way.') + '</div>';
      return;
    }
    el.innerHTML = list.map(function (p) {
      return '<article class="post">' +
        '<span class="tag">' + esc(labels[p.category] || p.category) + '</span>' +
        '<div class="date">' + esc(fmt(p.date)) + '</div>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p>' + esc(p.summary) + '</p>' +
        (p.url ? '<a class="src" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.source ? 'Read more at ' + p.source : 'Read more') + ' &rarr;</a>' : '') +
        '</article>';
    }).join('');
  }

  fetch('data/posts.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : []; })
    .catch(function () { return []; })
    .then(function (posts) {
      window.__ccgPosts = posts || [];
      feeds.forEach(function (el) { render(el, window.__ccgPosts); });
    });

  // Tabs on the corners page swap the feed category
  document.querySelectorAll('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.tabs button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      var target = document.getElementById(b.getAttribute('data-target'));
      target.setAttribute('data-feed', b.getAttribute('data-cats'));
      target.setAttribute('data-empty', b.getAttribute('data-empty'));
      render(target, window.__ccgPosts || []);
    });
  });
})();
