/* ============================================================
   SEIKER AG — comportamiento
   IIFE clásica, sin módulos ES: funciona en file://, FTP y CDN.
   Cada init va envuelto en safe() — si uno falla, el resto sigue.
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.__SEIKER__ || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Un init que explota no puede tumbar a los demás. */
  function safe(fn, nombre) {
    try { fn(); }
    catch (e) { if (window.console) console.warn("[seiker] " + nombre + ":", e.message); }
  }

  /* Sin tildes y en minúscula: así "caudalimetro" encuentra "caudalímetro". */
  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function num(n, d) { return n.toFixed(d).replace(".", ","); }

  /* ----------------------------------------------------------
     1. NAVEGACIÓN — encoge al bajar, progreso de lectura
     ---------------------------------------------------------- */
  function initNav() {
    var top = $("#top"), prog = $("#prog");
    var ultimo = -1;

    function alScroll() {
      var y = window.scrollY || 0;
      if (top) top.classList.toggle("shrunk", y > 90);
      if (prog) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.transform = "scaleX(" + (h > 0 ? Math.min(y / h, 1) : 0) + ")";
      }
      /* Resaltar la sección en curso */
      var cur = "";
      $$("section[id], div[id].anchor").forEach(function (s) {
        if (y >= s.offsetTop - 140) cur = s.id;
      });
      if (cur !== ultimo) {
        ultimo = cur;
        $$(".nav-item > a").forEach(function (a) {
          a.style.color = a.getAttribute("href") === "#" + cur ? "var(--bronze)" : "";
        });
      }
    }
    window.addEventListener("scroll", alScroll, { passive: true });
    alScroll();
  }

  /* ----------------------------------------------------------
     2. ANCLAS — scroll nativo con desplazamiento por la barra fija
     Lenis queda fuera a propósito: es frágil en Windows (gotcha B.1.4).
     ---------------------------------------------------------- */
  function initAnclas() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#" || a.hasAttribute("data-noscroll")) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      cerrarMovil();
      var off = 96;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - off,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    });
  }

  /* ----------------------------------------------------------
     3. REVELADO AL SCROLL
     Umbral muy bajo + red de seguridad: nada puede quedar invisible.
     ---------------------------------------------------------- */
  function initReveal() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("anim");

    var sel = ".sec-head, .block, .card, .use, .doc, .prin, .contact, .hero-main > *, .stat, .tbl-wrap, .pills, .prod-grid";
    $$(sel).forEach(function (el) {
      if (el.closest(".ov")) return;          // los superpuestos no se revelan
      el.classList.add("reveal");
    });

    /* Escalonado dentro de cada grupo de hermanos */
    $$(".cards, .uses, .docs, .blocks, .hero-side, .hero-main").forEach(function (g) {
      $$(".reveal", g).forEach(function (el, i) {
        el.style.setProperty("--d", Math.min(i * 65, 320) + "ms");
      });
    });

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.03, rootMargin: "0px 0px -3% 0px" });

    $$(".reveal").forEach(function (el) { io.observe(el); });

    /* Red de seguridad: a los 6 s, lo que siga oculto y esté en pantalla se muestra. */
    setTimeout(function () {
      $$(".reveal:not(.in)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.5) el.classList.add("in");
      });
    }, 6000);

    requestAnimationFrame(function () {
      document.documentElement.classList.add("ready");
    });
  }

  /* ----------------------------------------------------------
     4. CONTADORES — los números del hero suben al entrar
     ---------------------------------------------------------- */
  function initContadores() {
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target;
        var m = /^(\+?)(\d+)(.*)$/.exec(el.textContent.trim());
        if (!m) return;                       // "IP68" no es cantidad: queda quieto
        var pre = m[1], fin = parseInt(m[2], 10), suf = m[3];
        if (reduce) return;
        var t0 = 0, dur = 1100;
        function paso(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          var e2 = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.round(fin * e2) + suf;
          if (p < 1) requestAnimationFrame(paso);
        }
        el.textContent = pre + "0" + suf;
        requestAnimationFrame(paso);
      });
    }, { threshold: 0.05 });
    $$(".stat-n").forEach(function (el) { io.observe(el); });
    /* Si el observador nunca dispara, el número queda en su valor final:
       sólo se pone en cero dentro del callback, justo antes de animar. */
  }

  /* ----------------------------------------------------------
     5. PESTAÑAS DE PRODUCTO
     ---------------------------------------------------------- */
  function initProductos() {
    var nav = $("#prod-nav");
    if (!nav) return;
    nav.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-p]");
      if (!b) return;
      mostrarProducto(b.getAttribute("data-p"));
    });
  }
  function mostrarProducto(id) {
    $$(".prod-panel").forEach(function (p) { p.classList.toggle("on", p.id === "pp-" + id); });
    $$("#prod-nav .ptab").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-p") === id); });
  }
  window.mostrarProducto = mostrarProducto;

  /* ----------------------------------------------------------
     6. BUSCADOR — índice armado desde el contenido real del DOM
     ---------------------------------------------------------- */
  var idx = [], res = [], sel = -1;

  /* textContent pega las celdas de una tabla sin separarlas:
     "S150" + "10 kg/cm²" quedaba como "S15010 kg/cm²". */
  function textoDe(el) {
    if (el.querySelector("td, th")) {
      return $$("tr", el).map(function (f) {
        return $$("td, th", f).map(function (c) { return c.textContent.trim(); })
          .filter(Boolean).join(" · ");
      }).filter(Boolean).join(" — ");
    }
    return el.textContent.replace(/\s+/g, " ").trim();
  }

  function armarIndice() {
    (CFG.zonas || []).forEach(function (z) {
      var sel2 = z[0], seccion = z[1];
      var zona = document.querySelector(sel2);
      if (!zona) return;

      $$("h2, h3", zona).forEach(function (h) {
        var titulo = h.textContent.trim();
        if (!titulo) return;
        var cuerpo = "", n = h.nextElementSibling, saltos = 0;
        while (n && saltos < 4 && !/^H[1-4]$/.test(n.tagName)) {
          cuerpo += " " + textoDe(n); n = n.nextElementSibling; saltos++;
        }
        cuerpo = cuerpo.replace(/\s+/g, " ").trim();
        idx.push({ titulo: titulo, seccion: seccion, texto: cuerpo.slice(0, 260),
                   ancla: sel2, busca: norm(titulo + " " + cuerpo + " " + seccion) });
      });

      /* Los paneles de producto y la tabla de series entran enteros:
         ahí viven las specs que la gente realmente busca. */
      $$(".prod-panel, .tbl-wrap", zona).forEach(function (p) {
        var t = p.querySelector("h3, h4");
        var cuerpo = textoDe(p);
        idx.push({ titulo: t ? t.textContent.trim() : "Especificaciones técnicas",
                   seccion: seccion, texto: cuerpo.slice(0, 260),
                   ancla: sel2, busca: norm(cuerpo + " " + seccion) });
      });
    });

    /* Un mismo título puede aparecer como tarjeta resumen y como sección
       propia. Nos quedamos con la entrada más completa. */
    var mejor = {};
    idx.forEach(function (e) {
      var k = norm(e.titulo);
      if (!mejor[k] || e.texto.length > mejor[k].texto.length) mejor[k] = e;
    });
    idx = Object.keys(mejor).map(function (k) { return mejor[k]; });
  }

  function resaltar(txt, term) {
    var i = norm(txt).indexOf(term);
    if (i < 0) return txt.slice(0, 130) + (txt.length > 130 ? "…" : "");
    var desde = Math.max(0, i - 44);
    var frag = txt.slice(desde, desde + 146), rel = i - desde;
    return (desde ? "…" : "") + esc(frag.slice(0, rel)) +
           "<mark>" + esc(frag.slice(rel, rel + term.length)) + "</mark>" +
           esc(frag.slice(rel + term.length)) + (desde + 146 < txt.length ? "…" : "");
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function buscar(q) {
    var cont = $("#find-res"), term = norm(q.trim());
    sel = -1;
    if (term.length < 2) {
      res = [];
      cont.innerHTML = '<div class="find-empty">Escribí al menos 2 letras. Probá con ' +
        "<strong>nitrógeno</strong>, <strong>precisión</strong>, <strong>IP68</strong> o <strong>reparación</strong>.</div>";
      return;
    }
    res = idx.map(function (e) {
      var enTitulo = norm(e.titulo).indexOf(term) >= 0;
      if (!enTitulo && e.busca.indexOf(term) < 0) return null;
      return { e: e, peso: enTitulo ? 0 : 1 };
    }).filter(Boolean).sort(function (a, b) { return a.peso - b.peso; })
      .slice(0, 8).map(function (o) { return o.e; });

    if (!res.length) {
      cont.innerHTML = '<div class="find-empty">Sin resultados para «' + esc(q) + '».</div>';
      return;
    }
    cont.innerHTML = res.map(function (e, i) {
      return '<button class="find-it" data-i="' + i + '"><b>' + esc(e.titulo) + "</b>" +
             "<i>" + resaltar(e.texto || e.seccion, term) + "</i></button>";
    }).join("");
  }

  function irA(i) {
    var e = res[i];
    if (!e) return;
    cerrarBuscador();
    var d = document.querySelector(e.ancla);
    if (d) window.scrollTo({ top: d.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" });
  }
  function marcar() {
    $$(".find-it").forEach(function (el, i) { el.classList.toggle("sel", i === sel); });
    var a = $(".find-it.sel"); if (a) a.scrollIntoView({ block: "nearest" });
  }
  function abrirBuscador() {
    if (!idx.length) armarIndice();
    $("#find").classList.add("open");
    document.body.style.overflow = "hidden";
    var i = $("#find-i"); i.value = ""; buscar("");
    setTimeout(function () { i.focus(); }, 30);
  }
  function cerrarBuscador() {
    $("#find").classList.remove("open");
    document.body.style.overflow = "";
  }
  window.abrirBuscador = abrirBuscador;
  window.cerrarBuscador = cerrarBuscador;

  function initBuscador() {
    var i = $("#find-i");
    if (!i) return;
    i.addEventListener("input", function (e) { buscar(e.target.value); });
    i.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, res.length - 1); marcar(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); marcar(); }
      else if (e.key === "Enter") { e.preventDefault(); irA(sel < 0 ? 0 : sel); }
    });
    $("#find-res").addEventListener("click", function (e) {
      var b = e.target.closest(".find-it");
      if (b) irA(parseInt(b.getAttribute("data-i"), 10));
    });
    $("#find").addEventListener("click", function (e) { if (e.target.id === "find") cerrarBuscador(); });
  }

  /* ----------------------------------------------------------
     7. LEGAL Y MENÚ MÓVIL
     ---------------------------------------------------------- */
  function abrirLegal(e) {
    if (e) e.preventDefault();
    cerrarMovil();
    $("#legal").classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function cerrarLegal() {
    $("#legal").classList.remove("open");
    document.body.style.overflow = "";
  }
  function abrirMovil() { $("#mob").classList.add("open"); document.body.style.overflow = "hidden"; }
  function cerrarMovil() {
    var m = $("#mob");
    if (m && m.classList.contains("open")) { m.classList.remove("open"); document.body.style.overflow = ""; }
  }
  window.abrirLegal = abrirLegal; window.cerrarLegal = cerrarLegal;
  window.abrirMovil = abrirMovil; window.cerrarMovil = cerrarMovil;

  function initOverlays() {
    var l = $("#legal");
    if (l) l.addEventListener("click", function (e) { if (e.target.id === "legal") cerrarLegal(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { cerrarBuscador(); cerrarLegal(); cerrarMovil(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); abrirBuscador(); }
    });
    var sub = $("#mob-links");
    if (sub) sub.addEventListener("click", function (e) {
      var b = e.target.closest(".mob-plus");
      if (!b) return;
      var t = document.getElementById(b.getAttribute("data-sub"));
      if (t) { t.classList.toggle("open"); b.textContent = t.classList.contains("open") ? "−" : "+"; }
    });
  }

  /* ----------------------------------------------------------
     8. PRINCIPIO DE MEDICIÓN — ley de Faraday, E = B · v · D
     ---------------------------------------------------------- */
  function initFlujo() {
    var cv = $("#flow-canvas");
    if (!cv) return;
    var cx = cv.getContext("2d");
    var W = 900, H = 400;
    var F = CFG.flow || {}, C = CFG.tinta || {}, R_ = CFG.rangos || {};
    var B = F.B || 0.010, DN = F.DN || 150, Q = F.Q || 120;
    var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

    function area() { return Math.PI * Math.pow(DN / 2000, 2); }        // m²
    function vel()  { return Q / (area() * 3600); }                      // m/s
    function mV()   { return B * vel() * (DN / 1000) * 1000; }           // milivoltios

    var ejeY = 196, planoX = 420, ELIPSE = 50;
    function radio() { return 50 + (DN / 300) * 38; }

    /* Perfil parabólico: en el centro el líquido va más rápido que
       contra la pared, como ocurre de verdad en un caño. */
    var parts = [];
    for (var i = 0; i < 300; i++) {
      parts.push({ x: Math.random() * W, t: Math.random() * 2 - 1, r: 1 + Math.random() * 1.8 });
    }
    function perfil(t) { return 1 - t * t * 0.72; }

    function dibujar() {
      var R = radio(), pared = 13;
      cx.clearRect(0, 0, W, H);

      /* Caño */
      var g = cx.createLinearGradient(0, ejeY - R - pared, 0, ejeY + R + pared);
      g.addColorStop(0, C.acero || "#2b4a6b");
      g.addColorStop(.5, C.aceroOsc || "#17304d");
      g.addColorStop(1, "#0f2238");
      cx.fillStyle = g;
      cx.fillRect(0, ejeY - R - pared, W, (R + pared) * 2);

      /* Liner — el material que figura en la tabla de series */
      cx.fillStyle = "rgba(123,191,234,.17)";
      cx.fillRect(0, ejeY - R - 4, W, 4);
      cx.fillRect(0, ejeY + R, W, 4);

      cx.fillStyle = C.interior || "#071a2e";
      cx.fillRect(0, ejeY - R, W, R * 2);

      /* Campo magnético entre bobinas */
      var pulso = quieto ? .5 : (Math.sin(Date.now() / 640) * .5 + .5);
      cx.lineWidth = 2;
      for (var i2 = 0; i2 <= 8; i2++) {
        var x = planoX - 148 + i2 * 37, borde = Math.abs(i2 - 4) / 4;
        var op = (.88 - borde * .44) * (.62 + pulso * .38);
        cx.strokeStyle = "rgba(201,136,46," + op + ")";
        cx.beginPath(); cx.moveTo(x, ejeY - R - pared); cx.lineTo(x, ejeY + R + pared); cx.stroke();
        [-.42, .18].forEach(function (f) {
          var ay = ejeY + R * f;
          cx.beginPath(); cx.moveTo(x, ay + 9); cx.lineTo(x - 4.5, ay); cx.lineTo(x + 4.5, ay);
          cx.closePath(); cx.fillStyle = "rgba(201,136,46," + op + ")"; cx.fill();
        });
      }

      /* Fluido */
      var v = vel(), escala = Math.min(v, 6) * .62 + (v > 0 ? .18 : 0);
      parts.forEach(function (p) {
        if (!quieto) {
          p.x += escala * perfil(p.t) * 2.6;
          if (p.x > W + 10) { p.x = -10; p.t = Math.random() * 2 - 1; }
        }
        var y = ejeY + p.t * (R - 5);
        var rap = perfil(p.t) * Math.min(v / 3.2, 1.3);
        var largo = 4 + rap * 29;
        var lg = cx.createLinearGradient(p.x - largo, 0, p.x, 0);
        lg.addColorStop(0, "rgba(75,163,221,0)");
        lg.addColorStop(1, "rgba(" + Math.round(130 + rap * 70) + "," + Math.round(200 + rap * 40) + ",255," + (.55 + rap * .45) + ")");
        cx.strokeStyle = lg; cx.lineWidth = p.r;
        cx.beginPath(); cx.moveTo(p.x - largo, y); cx.lineTo(p.x, y); cx.stroke();
      });

      /* Bobinas con devanado */
      [-1, 1].forEach(function (lado) {
        var yb = ejeY + lado * (R + pared), alto = 40;
        var top = lado === -1 ? yb - alto : yb;
        var gb = cx.createLinearGradient(0, top, 0, top + alto);
        if (lado === -1) { gb.addColorStop(0, "#7d5417"); gb.addColorStop(1, "#c9882e"); }
        else { gb.addColorStop(0, "#c9882e"); gb.addColorStop(1, "#7d5417"); }
        cx.fillStyle = gb; cx.fillRect(planoX - 116, top, 232, alto);
        cx.strokeStyle = "rgba(10,26,46,.5)"; cx.lineWidth = 2.5;
        for (var k = 0; k < 13; k++) {
          var sx = planoX - 108 + k * 18;
          cx.beginPath(); cx.moveTo(sx, top + 3); cx.lineTo(sx + 9, top + alto - 3); cx.stroke();
        }
      });
      cx.font = '500 11px "IBM Plex Mono", monospace';
      cx.fillStyle = "rgba(226,166,86,.95)"; cx.textAlign = "center";
      cx.fillText("BOBINA — CAMPO MAGNÉTICO B", planoX, ejeY - R - pared - 54);

      /* Plano de medición: oscurecerlo despega la elipse del campo */
      var vig = cx.createRadialGradient(planoX, ejeY, 8, planoX, ejeY, ELIPSE + 32);
      vig.addColorStop(0, "rgba(4,16,30,.72)"); vig.addColorStop(1, "rgba(4,16,30,0)");
      cx.fillStyle = vig;
      cx.beginPath(); cx.ellipse(planoX, ejeY, ELIPSE + 32, R, 0, 0, Math.PI * 2); cx.fill();

      cx.strokeStyle = "rgba(255,255,255,.6)"; cx.lineWidth = 1.8;
      cx.setLineDash([6, 5]);
      cx.beginPath(); cx.ellipse(planoX, ejeY, ELIPSE, R, 0, 0, Math.PI * 2); cx.stroke();
      cx.setLineDash([]);

      /* Electrodos: enfrentados sobre el plano, perpendiculares al campo
         y al flujo. Salen hacia adelante y atrás, fuera del dibujo. */
      var senal = Math.min(mV() / 6, 1);
      [-1, 1].forEach(function (lado) {
        var ex = planoX + lado * ELIPSE;
        if (senal > .02) {
          var hal = cx.createRadialGradient(ex, ejeY, 2, ex, ejeY, 12 + senal * 21);
          hal.addColorStop(0, "rgba(123,191,234," + (senal * .55) + ")");
          hal.addColorStop(1, "rgba(123,191,234,0)");
          cx.fillStyle = hal;
          cx.beginPath(); cx.arc(ex, ejeY, 12 + senal * 21, 0, Math.PI * 2); cx.fill();
        }
        cx.beginPath(); cx.arc(ex, ejeY, 8.5, 0, Math.PI * 2);
        cx.fillStyle = C.blanco || "#eef3f8"; cx.fill();
        cx.strokeStyle = "rgba(11,37,69,.7)"; cx.lineWidth = 2; cx.stroke();
        cx.fillStyle = C.navy || "#0B2545";
        cx.font = '600 11px "IBM Plex Mono", monospace';
        cx.textAlign = "center"; cx.textBaseline = "middle";
        cx.fillText(lado === 1 ? "+" : "−", ex, ejeY + .5);
        cx.textBaseline = "alphabetic";
      });

      /* Cable hacia la lectura */
      cx.strokeStyle = "rgba(123,191,234," + (.3 + senal * .5) + ")"; cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(planoX + ELIPSE, ejeY);
      cx.lineTo(planoX + ELIPSE + 26, ejeY);
      cx.lineTo(planoX + ELIPSE + 26, ejeY + R + 38);
      cx.lineTo(W - 112, ejeY + R + 38);
      cx.lineTo(W - 112, ejeY + R + 66);
      cx.stroke();
      cx.font = '600 12px "IBM Plex Mono", monospace';
      cx.fillStyle = "rgba(123,191,234," + (.55 + senal * .45) + ")";
      cx.textAlign = "right";
      cx.fillText(num(mV(), 2) + " mV", W - 120, ejeY + R + 62);

      cx.textAlign = "center";
      cx.font = '500 11px "IBM Plex Mono", monospace';
      cx.fillStyle = "rgba(255,255,255,.6)";
      cx.fillText("ELECTRODOS", planoX, ejeY + R + pared + 60);

      cx.textAlign = "left";
      cx.fillStyle = "rgba(123,191,234,.72)";
      cx.fillText("FLUJO  →", 20, ejeY - R - pared - 20);
      cx.textAlign = "right";
      cx.font = '400 10px "IBM Plex Mono", monospace';
      cx.fillStyle = "rgba(123,191,234,.5)";
      cx.fillText("LINER PU / TEFLON", W - 20, ejeY - R - pared - 20);
    }

    function actualizar() {
      var v = vel();
      $("#r-q").innerHTML   = num(Q, 0) + "<small>m³/h</small>";
      $("#r-v").innerHTML   = num(v, 2) + "<small>m/s</small>";
      $("#r-mv").innerHTML  = num(mV(), 2) + "<small>mV</small>";
      $("#c-q-txt").textContent = num(Q, 0) + " m³/h";

      /* Diagnóstico de calibre: el dato que de verdad sirve para elegir equipo */
      var d = $("#diag"), t = $("#diag-t"), b = d.querySelector("b");
      if (Q === 0) {
        d.className = "diag baja"; b.textContent = "Sin caudal";
        t.textContent = "Sin flujo no hay tensión inducida: el equipo lee cero real, sin deriva.";
      } else if (v < (R_.baja || 1)) {
        d.className = "diag baja"; b.textContent = "Velocidad baja";
        t.textContent = "Por debajo de 1 m/s la señal es débil. Convendría un diámetro menor para este caudal.";
      } else if (v <= (R_.optima || 3)) {
        d.className = "diag ok"; b.textContent = "Rango óptimo";
        t.textContent = "Velocidad dentro de 1–3 m/s. Calibre bien dimensionado.";
      } else if (v <= (R_.alta || 5)) {
        d.className = "diag alta"; b.textContent = "Velocidad alta";
        t.textContent = "Mide correctamente, pero por encima de 3 m/s el liner se desgasta antes. Evaluar un diámetro mayor.";
      } else {
        d.className = "diag alta"; b.textContent = "Fuera de rango";
        t.textContent = "Más de 5 m/s acelera la erosión del liner y los electrodos. Recomendado subir de diámetro.";
      }
    }

    $("#c-q").addEventListener("input", function (e) { Q = +e.target.value; actualizar(); if (quieto) dibujar(); });
    $("#c-dn").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-dn]");
      if (!b) return;
      DN = +b.getAttribute("data-dn");
      $$("#c-dn button").forEach(function (x) { x.classList.toggle("on", x === b); });
      actualizar(); if (quieto) dibujar();
    });

    /* El bucle corre sólo mientras la sección está a la vista */
    var corriendo = false, raf = 0;
    function loop() { dibujar(); raf = requestAnimationFrame(loop); }
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting && !corriendo && !quieto) { corriendo = true; loop(); }
        else if (!en.isIntersecting && corriendo) { corriendo = false; cancelAnimationFrame(raf); }
      });
    }, { rootMargin: "140px" }).observe(cv);

    actualizar();
    dibujar();
  }

  /* ----------------------------------------------------------
     9. FORMULARIO
     Todavía no envía a ningún lado: lo decimos en pantalla en vez
     de fingir un acuse que haría perder consultas reales.
     ---------------------------------------------------------- */
  function initForm() {
    var f = $("#form-contacto");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var b = $(".btn-send", f);
      var orig = b.innerHTML;
      b.innerHTML = "Revisá el aviso de abajo";
      b.disabled = true;
      setTimeout(function () { b.innerHTML = orig; b.disabled = false; }, 3500);
    });
  }

  /* ----------------------------------------------------------
     ARRANQUE
     ---------------------------------------------------------- */
  function arrancar() {
    safe(initNav,         "nav");
    safe(initAnclas,      "anclas");
    safe(initReveal,      "reveal");
    safe(initContadores,  "contadores");
    safe(initProductos,   "productos");
    safe(initBuscador,    "buscador");
    safe(initOverlays,    "overlays");
    safe(initFlujo,       "flujo");
    safe(initForm,        "form");
    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar);
  } else {
    arrancar();
  }
})();
