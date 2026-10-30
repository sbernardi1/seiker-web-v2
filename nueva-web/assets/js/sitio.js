/* ============================================================
   SEIKER — COMPORTAMIENTO DEL SITIO
   Arma encabezado, pie, menú, búsqueda y las páginas de producto
   a partir de catalogo.js y config.js.
   IIFE clásica, sin módulos ES: funciona en file://, FTP y CDN.
   Cada parte va envuelta en safe(): si una falla, el resto sigue.
   ============================================================ */
(function () {
  "use strict";

  var CAT = window.SEIKER_CATALOGO || { lineas: [], productos: [] };
  var CFG = window.SEIKER_CONFIG || { contacto: {}, redes: {}, cifras: [] };
  var IL = window.SEIKER_ILUS;
  var PAGINA = document.body.getAttribute("data-page") || "";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function safe(fn, nombre) {
    try { fn(); }
    catch (e) { if (window.console) console.warn("[seiker] " + nombre + ":", e); }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  /* Sin tildes y en minúscula: así "caudalimetro" encuentra "caudalímetro". */
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function ico(n, c) { return IL ? IL.ico(n, c) : ""; }
  function param(k) {
    var m = new RegExp("[?&]" + k + "=([^&#]*)").exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Acceso al catálogo ---------- */
  function linea(id) {
    for (var i = 0; i < CAT.lineas.length; i++) if (CAT.lineas[i].id === id) return CAT.lineas[i];
    return null;
  }
  function producto(id) {
    for (var i = 0; i < CAT.productos.length; i++) if (CAT.productos[i].id === id) return CAT.productos[i];
    return null;
  }
  function deLinea(id) { return CAT.productos.filter(function (p) { return p.linea === id; }); }
  function urlProducto(p) { return "producto.html?id=" + encodeURIComponent(p.id); }
  function urlLinea(l) { return l.pagina || ("linea.html?id=" + encodeURIComponent(l.id)); }
  function imagenDe(p) {
    if (p.imagen) return '<img class="pk pk--foto" src="' + esc(p.imagen) + '" alt="' + esc(p.nombre) + '" loading="lazy" decoding="async" />';
    return IL ? IL.envase(p, linea(p.linea)) : "";
  }
  /* Productos explícitos de "relacionados" primero, después el resto de la línea */
  function relacionadosDe(p) {
    var lista = [];
    (p.relacionados || []).forEach(function (id) { var r = producto(id); if (r && r !== p) lista.push(r); });
    deLinea(p.linea).forEach(function (r) { if (r !== p && lista.indexOf(r) < 0) lista.push(r); });
    return lista;
  }

  /* ----------------------------------------------------------
     ENCABEZADO
     ---------------------------------------------------------- */
  function htmlMega() {
    var cols = CAT.lineas.map(function (l) {
      var items = deLinea(l.id).map(function (p) {
        return '<li><a href="' + urlProducto(p) + '"><b>' + esc(p.nombre) + "</b><span>" + esc(p.bajada) + "</span></a></li>";
      }).join("");
      return '<div class="mega-col"><a class="mega-h" href="' + urlLinea(l) + '">' + esc(l.nombre) + ico("flecha") + "</a>" +
             "<ul>" + items + "</ul></div>";
    }).join("");
    return '' +
      '<div class="mega" id="mega-prod" role="region" aria-label="Productos y soluciones">' +
        '<div class="wrap mega-in">' +
          '<div class="mega-main">' +
            '<div class="mega-cols">' + cols + "</div>" +
            '<div class="mega-serv"><span>Servicios</span>' +
              '<a href="caudalimetros.html#servicio">Venta, instalación y reparación de caudalímetros</a>' +
              '<a href="caudalimetros.html#como-funciona">Cómo funciona la medición</a>' +
              '<a href="agronomia.html">Asesoramiento agronómico</a>' +
            "</div>" +
          "</div>" +
          '<a class="mega-promo" href="productos.html">' +
            '<img src="assets/img/campo-girasol.webp" alt="" loading="lazy" />' +
            '<span class="mega-promo-t"><small>Buscador de productos</small>Encontrá la solución indicada para tu cultivo' +
            '<span class="lnk lnk--light">Buscar productos' + ico("flecha") + "</span></span>" +
          "</a>" +
        "</div>" +
      "</div>";
  }

  function htmlHeader() {
    var c = CFG.contacto || {};
    return '' +
      '<a class="skip" href="#contenido">Saltar al contenido</a>' +
      '<div class="util"><div class="wrap util-in">' +
        '<span class="util-l">Soluciones agroindustriales para el campo argentino</span>' +
        '<nav class="util-r" aria-label="Secundario">' +
          '<a href="quienes-somos.html">Quiénes somos</a>' +
          '<a href="agronomia.html">Agronomía</a>' +
          (c.telefono ? '<a href="tel:' + esc(c.telefono.replace(/[^\d+]/g, "")) + '">' + ico("tel") + esc(c.telefono) + "</a>" : "") +
          '<span class="util-pais">' + ico("mundo") + "Argentina | Español</span>" +
        "</nav>" +
      "</div></div>" +
      '<div class="hdr"><div class="wrap hdr-in">' +
        '<a class="logo" href="index.html" aria-label="Seiker — inicio">' +
          '<img src="assets/img/logo-seiker.webp" alt="Seiker" width="1047" height="238" /></a>' +
        '<nav class="menu" aria-label="Principal"><ul>' +
          '<li class="m-item has-mega" data-sec="productos">' +
            '<button class="m-link" type="button" aria-expanded="false" aria-controls="mega-prod">Productos y soluciones' + ico("chevron", "chev") + "</button>" +
            htmlMega() +
          "</li>" +
          '<li class="m-item" data-sec="agronomia"><a class="m-link" href="agronomia.html">Agronomía</a></li>' +
          '<li class="m-item" data-sec="nosotros"><a class="m-link" href="quienes-somos.html">Quiénes somos</a></li>' +
          '<li class="m-item" data-sec="contacto"><a class="m-link" href="contacto.html">Contacto</a></li>' +
        "</ul></nav>" +
        '<div class="hdr-tools">' +
          '<button class="ib" type="button" data-abrir="buscar" aria-label="Buscar en el sitio">' + ico("lupa") + "</button>" +
          '<a class="btn btn--pri btn--sm hdr-cta" href="productos.html">Buscador de productos</a>' +
          '<button class="ib burger" type="button" data-abrir="mnav" aria-label="Abrir menú">' + ico("menu") + "</button>" +
        "</div>" +
      "</div></div>";
  }

  function htmlMovil() {
    var c = CFG.contacto || {};
    var grupos = CAT.lineas.map(function (l, i) {
      return '' +
        '<div class="mn-g">' +
          '<button class="mn-row" type="button" aria-expanded="false" aria-controls="mn-' + i + '">' + esc(l.nombre) + ico("chevron", "chev") + "</button>" +
          '<div class="mn-sub" id="mn-' + i + '">' +
            '<a class="mn-all" href="' + urlLinea(l) + '">Ver toda la línea</a>' +
            deLinea(l.id).map(function (p) { return '<a href="' + urlProducto(p) + '">' + esc(p.nombre) + "</a>"; }).join("") +
          "</div>" +
        "</div>";
    }).join("");
    return '' +
      '<div class="ov ov--side" id="mnav" role="dialog" aria-modal="true" aria-label="Menú">' +
        '<div class="mn">' +
          '<div class="mn-top">' +
            '<img src="assets/img/logo-seiker.webp" alt="Seiker" width="1047" height="238" />' +
            '<button class="ib" type="button" data-cerrar aria-label="Cerrar menú">' + ico("cerrar") + "</button>" +
          "</div>" +
          '<a class="btn btn--pri mn-cta" href="productos.html">' + ico("lupa") + "Buscador de productos</a>" +
          '<p class="mn-h">Productos y soluciones</p>' + grupos +
          '<a class="mn-row" href="agronomia.html">Agronomía</a>' +
          '<a class="mn-row" href="quienes-somos.html">Quiénes somos</a>' +
          '<a class="mn-row" href="contacto.html">Contacto</a>' +
          '<div class="mn-foot">' +
            (c.telefono ? "<p>" + ico("tel") + esc(c.telefono) + "</p>" : "") +
            (c.email ? "<p>" + ico("mail") + esc(c.email) + "</p>" : "") +
            "<p>" + ico("mundo") + "Argentina | Español</p>" +
          "</div>" +
        "</div>" +
      "</div>";
  }

  function htmlBuscador() {
    return '' +
      '<div class="ov ov--top" id="buscar" role="dialog" aria-modal="true" aria-label="Buscar en el sitio">' +
        '<div class="sch">' +
          '<div class="wrap">' +
            '<div class="sch-bar">' + ico("lupa") +
              '<input id="sch-i" type="search" autocomplete="off" placeholder="Buscá productos, nutrientes, cultivos o especificaciones" aria-label="Buscar" />' +
              '<button class="ib" type="button" data-cerrar aria-label="Cerrar búsqueda">' + ico("cerrar") + "</button>" +
            "</div>" +
            '<div class="sch-res" id="sch-res" aria-live="polite"></div>' +
          "</div>" +
        "</div>" +
      "</div>";
  }

  function htmlFooter() {
    var c = CFG.contacto || {}, r = CFG.redes || {};
    var redes = ["instagram", "facebook", "linkedin", "youtube"].filter(function (k) { return r[k]; }).map(function (k) {
      return '<a href="' + esc(r[k]) + '" target="_blank" rel="noopener" aria-label="' + k + '">' + ico(k) + "</a>";
    }).join("");
    var cols = '<div class="ft-col"><h4>Productos y soluciones</h4><ul>' +
      CAT.lineas.map(function (l) { return '<li><a href="' + urlLinea(l) + '">' + esc(l.nombre) + "</a></li>"; }).join("") +
      '<li><a href="productos.html">Buscador de productos</a></li></ul></div>';
    var cta = PAGINA === "contacto" ? "" :
      '<div class="ft-cta"><div class="wrap ft-cta-in">' +
        "<div><h2>¿Necesitás asesoramiento?</h2><p>Nuestro equipo técnico te ayuda a elegir la solución para tu campo o tu industria.</p></div>" +
        '<div class="ft-cta-b"><a class="btn btn--gold" href="contacto.html">Contactá a un asesor' + ico("flecha") + "</a>" +
        (c.whatsapp ? '<a class="btn btn--ghost-light" href="https://wa.me/' + esc(c.whatsapp) + '" target="_blank" rel="noopener">' + ico("whatsapp") + "WhatsApp</a>" : "") +
        "</div>" +
      "</div></div>";
    return cta +
      '<div class="ft-main"><div class="wrap">' +
        '<div class="ft-grid">' +
          '<div class="ft-brand">' +
            '<img src="assets/img/logo-seiker-blanco.webp" alt="Seiker" width="1047" height="238" />' +
            "<p>Fertilizantes, nutrición foliar, coadyuvantes y caudalímetros electromagnéticos para el agro y la industria argentina.</p>" +
            (redes ? '<div class="ft-redes">' + redes + "</div>" : "") +
          "</div>" +
          cols +
          '<div class="ft-col"><h4>Compañía</h4><ul>' +
            '<li><a href="quienes-somos.html">Quiénes somos</a></li>' +
            '<li><a href="agronomia.html">Agronomía</a></li>' +
            '<li><a href="contacto.html">Contacto</a></li>' +
            '<li><a href="privacidad.html">Política de privacidad</a></li>' +
          "</ul></div>" +
          '<div class="ft-col ft-contacto"><h4>Contacto</h4><ul>' +
            (c.direccion ? "<li>" + ico("pin") + esc(c.direccion) + "</li>" : "") +
            (c.telefono ? '<li><a href="tel:' + esc(c.telefono.replace(/[^\d+]/g, "")) + '">' + ico("tel") + esc(c.telefono) + "</a></li>" : "") +
            (c.email ? '<li><a href="mailto:' + esc(c.email) + '">' + ico("mail") + esc(c.email) + "</a></li>" : "") +
            (c.horario ? "<li>" + ico("reloj") + esc(c.horario) + "</li>" : "") +
          "</ul></div>" +
        "</div>" +
      "</div></div>" +
      '<div class="ft-bot"><div class="wrap ft-bot-in">' +
        "<span>© " + new Date().getFullYear() + " " + esc((CFG.razonSocial || "Seiker").replace(/\.$/, "")) + ". Todos los derechos reservados.</span>" +
        '<span class="ft-legal"><a href="privacidad.html">Política de privacidad</a><span>' + ico("mundo") + "Argentina | Español</span></span>" +
      "</div></div>";
  }

  function initLayout() {
    var h = $("#site-header"), f = $("#site-footer");
    if (h) h.innerHTML = htmlHeader();
    if (f) f.innerHTML = htmlFooter();
    document.body.insertAdjacentHTML("beforeend", htmlMovil() + htmlBuscador());

    /* Sección activa en el menú */
    var activa = PAGINA;
    if (PAGINA === "producto" || PAGINA === "productos" || PAGINA === "linea" || linea(PAGINA)) activa = "productos";
    $$(".m-item").forEach(function (li) {
      if (li.getAttribute("data-sec") === activa) li.classList.add("on");
    });
  }

  /* ----------------------------------------------------------
     MENÚ: megamenú, menú móvil y superpuestos
     ---------------------------------------------------------- */
  function initMenu() {
    var hdr = $("#site-header");
    var item = $(".has-mega"), btn = item && $(".m-link", item), t = 0;

    function abrir(v) {
      if (!item) return;
      item.classList.toggle("open", v);
      btn.setAttribute("aria-expanded", v ? "true" : "false");
    }
    if (item) {
      /* En pantallas táctiles el toque dispara mouseenter y click seguidos:
         sin esta marca, el click cerraría lo que el mouseenter acaba de abrir. */
      var abiertoEn = 0;
      item.addEventListener("mouseenter", function () { clearTimeout(t); abiertoEn = Date.now(); abrir(true); });
      item.addEventListener("mouseleave", function () { t = setTimeout(function () { abrir(false); }, 160); });
      btn.addEventListener("click", function () {
        if (Date.now() - abiertoEn < 400) return;
        abrir(!item.classList.contains("open"));
      });
      document.addEventListener("click", function (e) { if (!item.contains(e.target)) abrir(false); });
      item.addEventListener("focusout", function (e) { if (!item.contains(e.relatedTarget)) abrir(false); });
    }

    /* Al bajar, la barra superior se pliega y queda sólo el menú */
    var ult = null;
    function alScroll() {
      var s = (window.scrollY || 0) > 40;
      if (s !== ult) { ult = s; if (hdr) hdr.classList.toggle("is-scrolled", s); }
    }
    window.addEventListener("scroll", alScroll, { passive: true });
    alScroll();

    /* Superpuestos (menú móvil y búsqueda) */
    var ultimoFoco = null;
    function abrirOv(id) {
      var ov = document.getElementById(id);
      if (!ov) return;
      ultimoFoco = document.activeElement;
      ov.classList.add("open");
      document.documentElement.classList.add("no-scroll");
      var f = id === "buscar" ? $("#sch-i") : $("button, a", ov);
      setTimeout(function () { if (f) f.focus(); }, 40);
      if (id === "buscar") buscar("");
    }
    function cerrarOv() {
      $$(".ov.open").forEach(function (o) { o.classList.remove("open"); });
      document.documentElement.classList.remove("no-scroll");
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }
    window.SEIKER_ABRIR = abrirOv;

    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-abrir]");
      if (a) { e.preventDefault(); abrirOv(a.getAttribute("data-abrir")); return; }
      if (e.target.closest("[data-cerrar]") || e.target.classList.contains("ov")) { cerrarOv(); return; }
      var r = e.target.closest(".mn-row[aria-controls]");
      if (r) {
        var sub = document.getElementById(r.getAttribute("aria-controls"));
        var abierto = r.getAttribute("aria-expanded") === "true";
        r.setAttribute("aria-expanded", abierto ? "false" : "true");
        if (sub) sub.classList.toggle("open", !abierto);
      }
      /* Un enlace a un ancla de esta misma página cierra el menú */
      if (e.target.closest(".ov a[href]")) cerrarOv();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { cerrarOv(); abrir(false); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); abrirOv("buscar"); }
    });
  }

  /* ----------------------------------------------------------
     BÚSQUEDA (lupa del encabezado)
     ---------------------------------------------------------- */
  var indice = null, resultados = [], sel = -1;

  var PAGINAS = [
    ["Quiénes somos", "quienes-somos.html", "Empresa argentina con más de 15 años en el sector agropecuario e industrial. Asesoramiento, respuesta 24 h, tecnología, sustentabilidad, financiación."],
    ["Agronomía", "agronomia.html", "Notas técnicas y preguntas frecuentes sobre fertilización líquida, boro en girasol, zinc en gramíneas y elección del calibre del caudalímetro."],
    ["Cómo funciona un caudalímetro electromagnético", "caudalimetros.html#como-funciona", "Ley de Faraday, E = B · v · D. Medición sin partes móviles. Simulador de caudal y diámetro nominal."],
    ["Venta, instalación y reparación", "caudalimetros.html#servicio", "Servicio técnico de caudalímetros: venta, instalación, puesta en marcha, mantenimiento preventivo y correctivo, recalibración."],
    ["Usos industriales y agropecuarios", "caudalimetros.html#usos", "Aguas subterráneas, agua potable, efluentes, riego, industria alimentaria, química, minería e hidrocarburos, medición fiscal."],
    ["Buscador de productos", "productos.html", "Filtrá productos por línea, cultivo y aplicación."],
    ["Contacto", "contacto.html", "Solicitá una cotización o asesoramiento técnico. Teléfono, email, dirección y horario."],
    ["Política de privacidad", "privacidad.html", "Ley 25.326 de Protección de los Datos Personales."]
  ];

  function armarIndice() {
    indice = [];
    CAT.productos.forEach(function (p) {
      var l = linea(p.linea) || {};
      var specs = (p.composicion || []).concat(p.propiedades || []).map(function (c) { return c.join(" "); }).join(" · ");
      var guia = (p.guia || []).map(function (g) {
        return g.titulo + " " + g.filas.map(function (f) { return f.join(" "); }).join(" ") + " " + (g.pie || "");
      }).join(" ");
      var notas = (p.notas || []).map(function (n) { return n[0] + " " + [].concat(n[1]).join(" "); }).join(" ");
      var ben = (p.beneficios || []).map(function (b) { return [].concat(b).join(" "); }).join(" ");
      indice.push({
        tipo: "Producto", titulo: p.nombre + " — " + p.bajada, url: urlProducto(p),
        texto: p.resumen,
        busca: norm([p.nombre, p.bajada, p.tipo, p.resumen, (p.descripcion || []).join(" "), specs,
          (p.cultivos || []).join(" "), (p.aplicacion || []).join(" "), ben, guia, notas,
          p.comoActua ? p.comoActua.titulo + " " + p.comoActua.texto : "",
          (p.usos || []).join(" "), l.nombre].join(" "))
      });
    });
    CAT.lineas.forEach(function (l) {
      indice.push({ tipo: "Línea", titulo: l.nombre, url: urlLinea(l), texto: l.resumen,
        busca: norm(l.nombre + " " + l.resumen + " " + (l.beneficios || []).map(function (b) { return b.join(" "); }).join(" ")) });
    });
    PAGINAS.forEach(function (pg) {
      indice.push({ tipo: "Página", titulo: pg[0], url: pg[1], texto: pg[2], busca: norm(pg[0] + " " + pg[2]) });
    });
  }

  function recorte(txt, term) {
    var i = norm(txt).indexOf(term);
    if (i < 0) return esc(txt.length > 140 ? txt.slice(0, 140) + "…" : txt);
    var d = Math.max(0, i - 50), frag = txt.slice(d, d + 150), rel = i - d;
    return (d ? "…" : "") + esc(frag.slice(0, rel)) + "<mark>" + esc(frag.slice(rel, rel + term.length)) + "</mark>" +
      esc(frag.slice(rel + term.length)) + (d + 150 < txt.length ? "…" : "");
  }

  function buscar(q) {
    var cont = $("#sch-res");
    if (!cont) return;
    if (!indice) armarIndice();
    var term = norm(q.trim());
    sel = -1;
    if (term.length < 2) {
      resultados = [];
      cont.innerHTML = '<p class="sch-hint">Búsquedas frecuentes</p><div class="sch-chips">' +
        ["Zinc", "Boro", "Papa", "Foliar", "Coadyuvante", "IP68"].map(function (s) {
          return '<button type="button" class="chip" data-q="' + s + '">' + s + "</button>";
        }).join("") + "</div>";
      return;
    }
    var palabras = term.split(/\s+/);
    resultados = indice.map(function (e) {
      var ok = palabras.every(function (w) { return e.busca.indexOf(w) >= 0 || norm(e.titulo).indexOf(w) >= 0; });
      if (!ok) return null;
      return { e: e, peso: (norm(e.titulo).indexOf(palabras[0]) >= 0 ? 0 : 1) + (e.tipo === "Página" ? .5 : 0) };
    }).filter(Boolean).sort(function (a, b) { return a.peso - b.peso; }).slice(0, 8).map(function (o) { return o.e; });

    if (!resultados.length) {
      cont.innerHTML = '<p class="sch-empty">No encontramos resultados para «' + esc(q) + '». ' +
        '<a href="contacto.html">Consultá a un asesor</a>.</p>';
      return;
    }
    cont.innerHTML = '<p class="sch-hint">' + resultados.length + " resultado" + (resultados.length > 1 ? "s" : "") + "</p>" +
      resultados.map(function (e, i) {
        return '<a class="sch-it" data-i="' + i + '" href="' + esc(e.url) + '"><span class="tag">' + esc(e.tipo) + "</span>" +
          "<b>" + esc(e.titulo) + "</b><i>" + recorte(e.texto || "", palabras[0]) + "</i></a>";
      }).join("");
  }

  function initBuscar() {
    var i = $("#sch-i");
    if (!i) return;
    i.addEventListener("input", function () { buscar(i.value); });
    i.addEventListener("keydown", function (e) {
      var items = $$(".sch-it");
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, items.length - 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); }
      else if (e.key === "Enter") {
        e.preventDefault();
        var r = resultados[sel < 0 ? 0 : sel];
        if (r) location.href = r.url;
        else if (i.value.trim()) location.href = "productos.html?q=" + encodeURIComponent(i.value.trim());
        return;
      } else return;
      items.forEach(function (el, k) { el.classList.toggle("sel", k === sel); });
      if (items[sel]) items[sel].scrollIntoView({ block: "nearest" });
    });
    $("#sch-res").addEventListener("click", function (e) {
      var c = e.target.closest("[data-q]");
      if (c) { i.value = c.getAttribute("data-q"); buscar(i.value); i.focus(); }
    });
  }

  /* ----------------------------------------------------------
     TARJETA DE PRODUCTO (se usa en todo el sitio)
     ---------------------------------------------------------- */
  function tarjeta(p) {
    var l = linea(p.linea) || {};
    /* Hasta 3 datos cortos: los largos ("316L / Hastelloy") no entran en la tarjeta */
    var datos = (p.composicion || []).filter(function (c) { return String(c[1]).length <= 9; }).slice(0, 3).map(function (c) {
      return "<span><b>" + esc(c[1]) + "</b>" + esc(c[0]) + "</span>";
    }).join("");
    return '' +
      '<article class="pcard">' +
        '<a class="pcard-a" href="' + urlProducto(p) + '">' +
          '<div class="pcard-img">' + imagenDe(p) + "</div>" +
          '<div class="pcard-b">' +
            '<span class="tag">' + esc(l.corto || p.tipo) + "</span>" +
            "<h3>" + esc(p.nombre) + "</h3>" +
            '<p class="pcard-sub">' + esc(p.bajada) + "</p>" +
            '<p class="pcard-t">' + esc(p.resumen) + "</p>" +
            (datos ? '<div class="pcard-d">' + datos + "</div>" : "") +
            '<span class="lnk">Ver producto' + ico("flecha") + "</span>" +
          "</div>" +
        "</a>" +
      "</article>";
  }

  /* Rellena cualquier contenedor marcado con data-productos:
     data-productos="destacados" | "fertilizantes" | "caudalimetros" */
  function initGrillas() {
    $$("[data-productos]").forEach(function (g) {
      var q = g.getAttribute("data-productos");
      var lista = q === "destacados"
        ? CAT.productos.filter(function (p) { return p.destacado; })
        : deLinea(q);
      g.innerHTML = lista.map(tarjeta).join("");
    });
    $$("[data-beneficios]").forEach(function (g) {
      var l = linea(g.getAttribute("data-beneficios"));
      if (!l) return;
      var icos = l.iconos || ["check"];
      g.innerHTML = (l.beneficios || []).map(function (b, i) {
        return '<div class="feat"><span class="feat-i">' + ico(icos[i % icos.length]) + "</span><h3>" + esc(b[0]) + "</h3><p>" + esc(b[1]) + "</p></div>";
      }).join("");
    });
    /* Una tarjeta por línea (inicio y quiénes somos) */
    $$("[data-lineas]").forEach(function (g) {
      g.innerHTML = CAT.lineas.map(function (l) {
        var n = deLinea(l.id).length, arte = producto(l.arte);
        var media = l.imagen
          ? '<img src="' + esc(l.imagen) + '" alt="" loading="lazy" decoding="async" />'
          : '<div class="cat-art" aria-hidden="true">' + (arte ? imagenDe(arte) : "") + "</div>";
        return '<a class="cat rv" href="' + urlLinea(l) + '">' + media +
          '<div class="cat-b"><span class="tag">' + n + (n === 1 ? " producto" : " productos") + "</span>" +
          "<h3>" + esc(l.nombre) + "</h3><p>" + esc(l.resumen) + "</p>" +
          '<span class="lnk lnk--light">Ver la línea' + ico("flecha") + "</span></div></a>";
      }).join("");
    });
    $$("[data-cifras]").forEach(function (g) {
      g.innerHTML = (CFG.cifras || []).map(function (c) {
        return '<div class="stat"><span class="stat-n">' + esc(c[0]) + '</span><span class="stat-l">' + esc(c[1]) + "</span></div>";
      }).join("");
    });
    $$("[data-envase]").forEach(function (el) {
      var p = producto(el.getAttribute("data-envase"));
      if (p) el.outerHTML = imagenDe(p);
    });

    /* Tabla comparativa de una línea. Si todos los productos comparten
       los mismos datos (caso caudalímetros) va una columna por dato;
       si no (caso fertilizantes), una columna de composición resumida. */
    $$("[data-tabla]").forEach(function (box) {
      var lista = deLinea(box.getAttribute("data-tabla"));
      if (!lista.length) return;
      var claves = (lista[0].composicion || []).map(function (c) { return c[0]; });
      var iguales = lista.every(function (p) {
        return (p.composicion || []).map(function (c) { return c[0]; }).join("|") === claves.join("|");
      });
      var cols, filas;
      if (iguales && claves.length) {
        claves = claves.slice(0, 4);
        cols = ["Producto"].concat(claves);
        filas = lista.map(function (p) {
          return [p].concat(claves.map(function (k, i) { return p.composicion[i][1]; }));
        });
      } else {
        cols = ["Producto", "Composición", "Dosis", "Cultivos"];
        filas = lista.map(function (p) {
          var cu = p.cultivos || [];
          return [p, (p.composicion || []).map(function (c) { return c[0] + " " + c[1]; }).join(" · "),
            p.dosis || "—", cu.length > 5 ? cu.slice(0, 5).join(", ") + " y " + (cu.length - 5) + " más" : (cu.join(", ") || "Consultar")];
        });
      }
      box.innerHTML = '<table class="tbl' + (iguales ? " tbl--series" : "") + '"><caption class="sr-only">Comparativa de la línea</caption><thead><tr>' +
        cols.map(function (c) { return '<th scope="col">' + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        filas.map(function (f) {
          return '<tr><td><a href="' + urlProducto(f[0]) + '">' + esc(f[0].nombre) + "</a></td>" +
            f.slice(1).map(function (v) { return "<td>" + esc(v) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</tbody></table>";
    });
  }

  /* Íconos escritos en el HTML como <i data-ico="flecha"></i> */
  function initIconos() {
    $$("i[data-ico]").forEach(function (el) { el.outerHTML = ico(el.getAttribute("data-ico")); });
  }

  /* Filas con desplazamiento lateral y flechas (carruseles de tarjetas) */
  function initFilas() {
    $$("[data-fila]").forEach(function (box) {
      var track = $(".fila", box), prev = $(".fila-prev", box), next = $(".fila-next", box);
      if (!track) return;
      function paso() { var c = $(".pcard", track); return c ? c.getBoundingClientRect().width + 24 : 300; }
      function estado() {
        var max = track.scrollWidth - track.clientWidth - 4;
        if (prev) prev.disabled = track.scrollLeft <= 4;
        if (next) next.disabled = track.scrollLeft >= max;
        box.classList.toggle("sin-flechas", max <= 0);
      }
      if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -paso(), behavior: "smooth" }); });
      if (next) next.addEventListener("click", function () { track.scrollBy({ left: paso(), behavior: "smooth" }); });
      track.addEventListener("scroll", estado, { passive: true });
      window.addEventListener("resize", estado);
      estado();
    });
  }

  /* ----------------------------------------------------------
     HERO EN CARRUSEL (inicio)
     ---------------------------------------------------------- */
  function initHero() {
    var h = $(".hero");
    if (!h) return;
    var slides = $$(".hs", h), dots = $(".hero-dots", h), i = 0, t = 0, pausa = false;
    if (slides.length < 2) return;
    dots.innerHTML = slides.map(function (s, k) {
      return '<button type="button" aria-label="Ir a la diapositiva ' + (k + 1) + '"><span></span></button>';
    }).join("");
    var bts = $$("button", dots);

    function ir(k) {
      i = (k + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        s.classList.toggle("on", n === i);
        s.setAttribute("aria-hidden", n === i ? "false" : "true");
        $$("a, button", s).forEach(function (a) { a.tabIndex = n === i ? 0 : -1; });
      });
      bts.forEach(function (b, n) { b.classList.toggle("on", n === i); b.setAttribute("aria-current", n === i ? "true" : "false"); });
      h.style.setProperty("--dur", pausa ? "0s" : "7s");
      programar();
    }
    function programar() {
      clearTimeout(t);
      if (!pausa) t = setTimeout(function () { ir(i + 1); }, 7000);
    }
    var bp = $(".hero-pausa", h);
    function setPausa(v) {
      pausa = v;
      h.classList.toggle("paused", v);
      if (bp) { bp.innerHTML = ico(v ? "play" : "pausa"); bp.setAttribute("aria-label", v ? "Reanudar carrusel" : "Pausar carrusel"); }
      programar();
    }
    bts.forEach(function (b, n) { b.addEventListener("click", function () { ir(n); }); });
    var pv = $(".hero-prev", h), nx = $(".hero-next", h);
    if (pv) pv.addEventListener("click", function () { ir(i - 1); });
    if (nx) nx.addEventListener("click", function () { ir(i + 1); });
    if (bp) bp.addEventListener("click", function () { setPausa(!pausa); });
    h.addEventListener("focusin", function () { clearTimeout(t); });

    /* Deslizar con el dedo en el celular */
    var x0 = null;
    h.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    h.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) ir(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    setPausa(false);
    ir(0);
  }

  /* ----------------------------------------------------------
     BUSCADOR DE PRODUCTOS (productos.html)
     ---------------------------------------------------------- */
  function initBuscador() {
    var root = $("#finder");
    if (!root) return;
    var estado = { q: param("q"), linea: param("linea"), cultivos: param("cultivo") ? [param("cultivo")] : [], aplic: [] };

    function unicos(campo) {
      var s = {};
      CAT.productos.forEach(function (p) { (p[campo] || []).forEach(function (v) { s[v] = (s[v] || 0) + 1; }); });
      return Object.keys(s).sort(function (a, b) { return a.localeCompare(b, "es"); });
    }
    var cultivos = unicos("cultivos"), aplic = unicos("aplicacion");

    /* Más de 8 opciones: se muestran las primeras y el resto con "Ver todos" */
    function grupoChecks(titulo, nombre, valores) {
      if (!valores.length) return "";
      return '<fieldset class="fl-g' + (valores.length > 8 ? " fl-g--corto" : "") + '"><legend>' + titulo + "</legend>" + valores.map(function (v) {
        return '<label class="ck"><input type="checkbox" name="' + nombre + '" value="' + esc(v) + '"><span>' + esc(v) + "</span></label>";
      }).join("") + (valores.length > 8 ? '<button type="button" class="fl-mas" data-mas>Ver todos (' + valores.length + ")</button>" : "") +
      "</fieldset>";
    }
    $("#fl-campos").innerHTML = '' +
      '<fieldset class="fl-g"><legend>Línea de productos</legend>' +
        '<label class="ck ck--r"><input type="radio" name="linea" value=""><span>Todas las líneas</span></label>' +
        CAT.lineas.map(function (l) {
          return '<label class="ck ck--r"><input type="radio" name="linea" value="' + esc(l.id) + '"><span>' + esc(l.nombre) +
            ' <em>' + deLinea(l.id).length + "</em></span></label>";
        }).join("") +
      "</fieldset>" +
      grupoChecks("Cultivo", "cultivo", cultivos) +
      grupoChecks("Aplicación", "aplic", aplic);

    var qi = $("#fl-q");
    qi.value = estado.q;

    function sincronizarControles() {
      $$(".fl-g--corto", root).forEach(function (g) {
        if ($$(".ck input", g).slice(8).some(function (c) { return estado.cultivos.indexOf(c.value) >= 0; })) {
          g.classList.remove("fl-g--corto");
          var b = $("[data-mas]", g); if (b) b.textContent = "Ver menos";
        }
      });
      $$('input[name="linea"]', root).forEach(function (r) { r.checked = r.value === estado.linea; });
      $$('input[name="cultivo"]', root).forEach(function (c) { c.checked = estado.cultivos.indexOf(c.value) >= 0; });
      $$('input[name="aplic"]', root).forEach(function (c) { c.checked = estado.aplic.indexOf(c.value) >= 0; });
    }

    function filtrar() {
      var term = norm(estado.q.trim()), ws = term ? term.split(/\s+/) : [];
      var lista = CAT.productos.filter(function (p) {
        if (estado.linea && p.linea !== estado.linea) return false;
        if (estado.cultivos.length && !estado.cultivos.some(function (c) { return (p.cultivos || []).indexOf(c) >= 0; })) return false;
        if (estado.aplic.length && !estado.aplic.some(function (c) { return (p.aplicacion || []).indexOf(c) >= 0; })) return false;
        if (ws.length) {
          var t = norm([p.nombre, p.bajada, p.tipo, p.resumen, (p.cultivos || []).join(" "),
            (p.composicion || []).map(function (c) { return c.join(" "); }).join(" "),
            (p.aplicacion || []).join(" ")].join(" "));
          if (!ws.every(function (w) { return t.indexOf(w) >= 0; })) return false;
        }
        return true;
      });

      $("#fl-grid").innerHTML = lista.length ? lista.map(tarjeta).join("") :
        '<div class="fl-vacio"><h3>No hay productos con esos filtros</h3><p>Probá quitando algún filtro o ' +
        '<a href="contacto.html">consultá a un asesor</a>: te ayudamos a encontrar la solución.</p>' +
        '<button type="button" class="btn btn--line" data-limpiar>Limpiar filtros</button></div>';
      $("#fl-n").textContent = lista.length + (lista.length === 1 ? " producto" : " productos");

      /* Filtros activos como chips */
      var chips = [];
      if (estado.linea) { var l = linea(estado.linea); chips.push(["linea", estado.linea, l ? l.nombre : estado.linea]); }
      estado.cultivos.forEach(function (c) { chips.push(["cultivo", c, c]); });
      estado.aplic.forEach(function (c) { chips.push(["aplic", c, c]); });
      if (estado.q) chips.push(["q", estado.q, "«" + estado.q + "»"]);
      $("#fl-chips").innerHTML = chips.map(function (c) {
        return '<button type="button" class="chip chip--x" data-quitar="' + c[0] + '" data-v="' + esc(c[1]) + '">' + esc(c[2]) + ico("cerrar") + "</button>";
      }).join("") + (chips.length > 1 ? '<button type="button" class="chip-clear" data-limpiar>Limpiar todo</button>' : "");
      var badge = $("#fl-badge");
      if (badge) { badge.textContent = chips.length || ""; badge.hidden = !chips.length; }

      /* La URL refleja el filtro: se puede compartir o volver atrás */
      var u = [];
      if (estado.linea) u.push("linea=" + encodeURIComponent(estado.linea));
      if (estado.cultivos.length === 1) u.push("cultivo=" + encodeURIComponent(estado.cultivos[0]));
      if (estado.q) u.push("q=" + encodeURIComponent(estado.q));
      try { history.replaceState(null, "", location.pathname + (u.length ? "?" + u.join("&") : "")); } catch (e) {}

      var l2 = linea(estado.linea);
      $("#fl-titulo").textContent = l2 ? l2.nombre : "Todos los productos";
    }

    root.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "linea") estado.linea = t.value;
      if (t.name === "cultivo" || t.name === "aplic") {
        var k = t.name === "cultivo" ? "cultivos" : "aplic";
        estado[k] = $$('input[name="' + t.name + '"]:checked', root).map(function (c) { return c.value; });
      }
      filtrar();
    });
    qi.addEventListener("input", function () { estado.q = qi.value; filtrar(); });
    $("#fl-form").addEventListener("submit", function (e) { e.preventDefault(); });
    root.addEventListener("click", function (e) {
      var x = e.target.closest("[data-quitar]");
      if (x) {
        var k = x.getAttribute("data-quitar"), v = x.getAttribute("data-v");
        if (k === "linea") estado.linea = "";
        if (k === "q") { estado.q = ""; qi.value = ""; }
        if (k === "cultivo") estado.cultivos = estado.cultivos.filter(function (c) { return c !== v; });
        if (k === "aplic") estado.aplic = estado.aplic.filter(function (c) { return c !== v; });
        sincronizarControles(); filtrar();
      }
      var mas = e.target.closest("[data-mas]");
      if (mas) {
        var g = mas.closest(".fl-g");
        g.classList.toggle("fl-g--corto");
        mas.textContent = g.classList.contains("fl-g--corto") ? "Ver todos (" + $$(".ck", g).length + ")" : "Ver menos";
      }
      if (e.target.closest("[data-limpiar]")) {
        estado = { q: "", linea: "", cultivos: [], aplic: [] };
        qi.value = ""; sincronizarControles(); filtrar();
      }
      if (e.target.closest("[data-filtros]") || (e.target === root && root.classList.contains("fl-open"))) {
        root.classList.toggle("fl-open");
      }
    });

    sincronizarControles();
    filtrar();
  }

  /* ----------------------------------------------------------
     FICHA DE PRODUCTO (producto.html?id=...)
     ---------------------------------------------------------- */
  function initFicha() {
    var root = $("#ficha");
    if (!root) return;
    /* El id viene en ?id=...; también se acepta #id por si un visor recorta la consulta */
    var p = producto(param("id")) || producto(decodeURIComponent(location.hash.slice(1)));
    if (!p) {
      root.innerHTML = '<section class="sec"><div class="wrap narrow txt-c">' +
        '<h1 class="h2">No encontramos ese producto</h1>' +
        '<p class="lead">Puede que el enlace esté incompleto o que el producto ya no forme parte del catálogo.</p>' +
        '<a class="btn btn--pri" href="productos.html">Ir al buscador de productos' + ico("flecha") + "</a></div></section>";
      return;
    }
    var l = linea(p.linea) || { nombre: "", corto: "" };
    document.title = p.nombre + " — " + p.bajada + " | Seiker";
    var md = $('meta[name="description"]');
    if (md) md.setAttribute("content", p.resumen);

    var cotizar = "contacto.html?producto=" + encodeURIComponent(p.id);
    var comp = p.composicion || [], props = p.propiedades || [], cu = p.cultivos || [], ap = p.aplicacion || [];
    var guia = p.guia || [], notas = p.notas || [], docs = p.documentos || [];
    var ben = p.beneficios || [], benPares = ben.length && typeof ben[0] !== "string";
    var esCauda = p.linea === "caudalimetros";

    /* Datos clave del encabezado */
    var datos = [];
    if (p.dosis) datos.push(["Dosis", p.dosis]);
    if (cu.length) datos.push(["Cultivos", cu.length > 6 ? cu.slice(0, 5).join(", ") + " y " + (cu.length - 5) + " más" : cu.join(", ")]);
    if (ap.length) datos.push(["Aplicación", ap.join(" · ")]);
    if (p.presentacion) datos.push(["Presentación", p.presentacion]);
    if ((p.mide || []).length) datos.push(["Mide", p.mide.join(" · ")]);

    /* Cada sección: [id, título de la pestaña, html]. El fondo se alterna solo. */
    var secciones = [];

    secciones.push(["descripcion", "Descripción",
      (benPares
        ? '<div class="pd-desc"><p class="eyebrow">Descripción</p><h2 class="h2">' + esc(p.nombre) + "</h2>" +
            (p.descripcion || [p.resumen]).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div>" +
          '<h3 class="h4 pd-ben-t">Beneficios</h3>' +
          '<div class="ben-grid' + (ben.length % 4 === 0 ? " ben-grid--4" : "") + '">' + ben.map(function (b) {
            return '<div class="ben">' + ico("check") + "<h3>" + esc(b[0]) + "</h3><p>" + esc(b[1]) + "</p></div>";
          }).join("") + "</div>"
        : '<div class="pd-cols"><div><p class="eyebrow">Descripción</p><h2 class="h2">' + esc(p.nombre) + "</h2>" +
            (p.descripcion || [p.resumen]).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div>" +
          (ben.length ? '<aside class="pd-ben"><h3>Beneficios y características</h3><ul>' +
            ben.map(function (b) { return "<li>" + ico("check") + "<span>" + esc(b) + "</span></li>"; }).join("") +
          "</ul></aside>" : "") + "</div>")]);

    if (comp.length) secciones.push(["composicion", p.tituloComposicion || (esCauda ? "Especificaciones" : "Composición"),
      '<p class="eyebrow">' + esc(p.tituloComposicion || (esCauda ? "Especificaciones técnicas" : "Composición")) + "</p>" +
      '<h2 class="h2">' + (esCauda ? "Especificaciones de la serie" : "Composición garantizada") + "</h2>" +
      '<div class="spec-grid">' + comp.map(function (c) {
        return '<div class="spec"><span class="spec-v">' + esc(c[1]) + '</span><span class="spec-k">' + esc(c[0]) + "</span>" +
          (c[2] ? '<span class="spec-d">' + esc(c[2]) + "</span>" : "") + "</div>";
      }).join("") + "</div>" +
      (props.length ? '<dl class="props">' + props.map(function (x) {
        return "<div><dt>" + esc(x[0]) + "</dt><dd>" + esc(x[1]) + "</dd></div>";
      }).join("") + "</dl>" : "")]);

    var ca = p.comoActua;
    if (ca) secciones.push(["como-actua", "Cómo actúa",
      '<div class="sec-h"><p class="eyebrow">Cómo actúa</p><h2 class="h2">' + esc(ca.titulo) + '</h2><p class="lead">' + esc(ca.texto) + "</p></div>" +
      '<div class="actua actua--' + (ca.modo === "flujo" ? "flujo" : "comparar") + '">' + (ca.pasos || []).map(function (ps, i, arr) {
        var marca = ca.modo === "flujo" ? '<span class="actua-n">' + (i + 1) + "</span>" : ico(i ? "check" : "cerrar", "actua-i");
        return '<div class="actua-p">' + marca + "<h3>" + esc(ps[0]) + "</h3><p>" + esc(ps[1]) + "</p></div>" +
          (ca.modo === "flujo" && i < arr.length - 1 ? '<span class="actua-fl" aria-hidden="true">' + ico("flecha") + "</span>" : "");
      }).join("") + "</div>" +
      (ca.nota ? '<p class="actua-nota">' + ico("escudo") + "<span>" + esc(ca.nota) + "</span></p>" : "")]);

    if (guia.length || notas.length || p.dosis || cu.length) {
      var html = '<p class="eyebrow">' + (guia.length ? "Guía de aplicación" : "Dosis y cultivos") + "</p>" +
        '<h2 class="h2">' + (guia.length ? "Dosis por cultivo" : "Recomendación de uso") + "</h2>";
      if (guia.length) {
        html += guia.map(function (g) {
          var n = g.columnas.length;
          return (guia.length > 1 ? '<h3 class="h4 guia-t">' + esc(g.titulo) + "</h3>" : "") +
            '<div class="tbl-wrap"><table class="tbl tbl--guia"><caption class="sr-only">' + esc(g.titulo) + "</caption><thead><tr>" +
            g.columnas.map(function (c) { return '<th scope="col">' + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
            g.filas.map(function (f) {
              if (f.length === 1) return '<tr class="tbl-grupo"><th colspan="' + n + '" scope="colgroup">' + esc(f[0]) + "</th></tr>";
              /* data-label: en el celular cada fila se apila como ficha y muestra el nombre de la columna */
              return "<tr>" + f.map(function (v, k) {
                if (!k) return '<th scope="row">' + esc(v) + "</th>";
                return '<td data-label="' + esc(g.columnas[k] || "") + '"' + (k === (g.colDosis == null ? 1 : g.colDosis) ? ' class="c-dosis"' : "") + ">" + esc(v) + "</td>";
              }).join("") + "</tr>";
            }).join("") + "</tbody></table></div>" +
            (g.pie ? '<p class="nota guia-pie">' + esc(g.pie) + "</p>" : "");
        }).join("");
        if (cu.length || ap.length) html += '<div class="pd-chips">' +
          (cu.length ? '<div><h3 class="h4">Cultivos</h3><div class="chips">' + cu.map(function (c) {
            return '<a class="chip" href="productos.html?cultivo=' + encodeURIComponent(c) + '">' + ico("planta") + esc(c) + "</a>";
          }).join("") + "</div></div>" : "") +
          (ap.length ? '<div><h3 class="h4">Aplicación</h3><div class="chips">' + ap.map(function (c) {
            return '<span class="chip">' + esc(c) + "</span>"; }).join("") + "</div></div>" : "") + "</div>";
      } else {
        html = '<div class="pd-cols"><div>' + html +
          (p.dosis ? '<div class="dose"><span>Dosis recomendada</span><b>' + esc(p.dosis) + "</b></div>" : "") +
          '<p class="nota">Las dosis son orientativas. Ajustalas con tu asesor según el análisis de suelo, el cultivo y su estado.</p></div>' +
          (cu.length ? '<div><h3 class="h4">Cultivos</h3><div class="chips">' +
            cu.map(function (c) { return '<a class="chip" href="productos.html?cultivo=' + encodeURIComponent(c) + '">' + ico("planta") + esc(c) + "</a>"; }).join("") +
            "</div>" + (ap.length ? '<h3 class="h4">Aplicación</h3><div class="chips">' +
            ap.map(function (c) { return '<span class="chip">' + esc(c) + "</span>"; }).join("") + "</div>" : "") + "</div>"
          : '<div class="pd-asesor">' + ico("persona") + "<h3>¿Qué dosis usar en tu lote?</h3><p>Te ayudamos a definirla según cultivo, estado fenológico y análisis de suelo.</p>" +
            '<a class="lnk" href="' + cotizar + '">Consultar a un agrónomo' + ico("flecha") + "</a></div>") + "</div>";
      }
      if (notas.length) html += '<div class="notas">' + notas.map(function (nt) {
        var cuerpo = Array.isArray(nt[1])
          ? "<ol>" + nt[1].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>"
          : "<p>" + esc(nt[1]) + "</p>";
        return '<div class="nota-b' + (nt[2] === "alerta" ? " nota-b--alerta" : "") + '"><h3>' + esc(nt[0]) + "</h3>" + cuerpo + "</div>";
      }).join("") + "</div>";
      secciones.push(["dosis", guia.length ? "Guía de aplicación" : "Dosis y cultivos", html]);
    }

    if ((p.usos || []).length) secciones.push(["usos", "Usos",
      '<p class="eyebrow">Usos</p><h2 class="h2">Aplicaciones industriales y agropecuarias</h2>' +
      '<ul class="usos">' + p.usos.map(function (u, i) {
        return "<li><span>" + (i < 9 ? "0" : "") + (i + 1) + "</span>" + esc(u) + "</li>";
      }).join("") + "</ul>"]);

    secciones.push(["documentos", "Documentos",
      '<p class="eyebrow">Documentos</p><h2 class="h2">Fichas y documentación</h2><div class="docs">' +
      (docs.length ? docs.map(function (d) {
        return '<a class="doc" href="' + esc(d.url) + '" target="_blank" rel="noopener">' + ico("doc") +
          "<span><b>" + esc(d.nombre) + "</b><small>PDF · abrir o descargar</small></span>" + ico("flecha") + "</a>";
      }).join("") : "") +
      '<a class="doc" href="' + cotizar + '&doc=ficha">' + ico("mail") +
        "<span><b>" + (docs.length ? "Pedir más información" : "Ficha técnica de " + esc(p.nombre)) + "</b>" +
        "<small>Te la enviamos por email</small></span>" + ico("flecha") + "</a></div>"]);

    var relacionados = relacionadosDe(p);
    var folleto = docs[0];

    root.innerHTML = '' +
      '<div class="crumbs"><div class="wrap"><ol>' +
        '<li><a href="index.html">Inicio</a></li>' +
        '<li><a href="productos.html">Productos</a></li>' +
        '<li><a href="' + urlLinea(l) + '">' + esc(l.nombre) + "</a></li>" +
        '<li aria-current="page">' + esc(p.nombre) + "</li>" +
      "</ol></div></div>" +

      '<section class="pd-hero"><div class="wrap pd-hero-in">' +
        '<div class="pd-txt">' +
          '<span class="tag">' + esc(p.tipo) + "</span>" +
          "<h1>" + esc(p.nombre) + "</h1>" +
          '<p class="pd-sub">' + esc(p.bajada) + "</p>" +
          '<p class="lead">' + esc(p.resumen) + "</p>" +
          (datos.length ? '<dl class="pd-datos">' + datos.map(function (d) {
            return "<div><dt>" + esc(d[0]) + "</dt><dd>" + esc(d[1]) + "</dd></div>";
          }).join("") + "</dl>" : "") +
          '<div class="btns">' +
            '<a class="btn btn--pri" href="' + cotizar + '">Solicitar cotización' + ico("flecha") + "</a>" +
            (folleto ? '<a class="btn btn--line" href="' + esc(folleto.url) + '" target="_blank" rel="noopener">Ver folleto PDF</a>'
                     : '<a class="btn btn--line" href="#documentos">Ficha técnica</a>') +
          "</div>" +
        "</div>" +
        '<div class="pd-img' + (p.imagen ? " pd-img--foto" : "") + '">' + imagenDe(p) + "</div>" +
      "</div></section>" +

      '<nav class="pd-tabs" aria-label="Secciones del producto"><div class="wrap"><ul>' +
        secciones.map(function (t, i) { return '<li><a href="#' + t[0] + '"' + (i ? "" : ' class="on"') + ">" + esc(t[1]) + "</a></li>"; }).join("") +
      "</ul></div></nav>" +

      secciones.map(function (s, i) {
        return '<section class="sec pd-sec' + (i % 2 ? " sec--gris" : "") + '" id="' + s[0] + '"><div class="wrap">' + s[2] + "</div></section>" +
          (i === 0 && p.frase ? '<div class="pd-frase"><div class="wrap"><blockquote>' + esc(p.frase) + "</blockquote></div></div>" : "");
      }).join("") +

      (relacionados.length ? '<section class="sec ' + (secciones.length % 2 ? "sec--gris" : "") + '"><div class="wrap">' +
        '<div class="sec-h sec-h--row"><div><p class="eyebrow">' + esc(l.nombre) + '</p><h2 class="h2">Productos relacionados</h2></div>' +
        '<a class="lnk" href="' + urlLinea(l) + '">Ver toda la línea' + ico("flecha") + "</a></div>" +
        '<div class="fila-box" data-fila><div class="fila">' + relacionados.map(tarjeta).join("") + "</div>" +
        '<button class="fila-prev ib ib--round" type="button" aria-label="Anteriores">' + ico("izq") + "</button>" +
        '<button class="fila-next ib ib--round" type="button" aria-label="Siguientes">' + ico("der") + "</button></div>" +
      "</div></section>" : "");

    /* Pestañas fijas: resaltan la sección que se está leyendo */
    var links = $$(".pd-tabs a", root);
    var secs = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
    window.addEventListener("scroll", function () {
      var y = window.scrollY + 190, cur = 0;
      secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
      links.forEach(function (a, i) { a.classList.toggle("on", i === cur); });
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     PÁGINA DE LÍNEA (linea.html?id=...): para las líneas que no
     tienen una página propia escrita a mano.
     ---------------------------------------------------------- */
  function initLinea() {
    var root = $("#linea-page");
    if (!root) return;
    var l = linea(param("id")) || linea(decodeURIComponent(location.hash.slice(1)));
    if (!l) {
      root.innerHTML = '<section class="sec"><div class="wrap narrow txt-c"><h1 class="h2">No encontramos esa línea</h1>' +
        '<a class="btn btn--pri" href="productos.html">Ir al buscador de productos' + ico("flecha") + "</a></div></section>";
      return;
    }
    document.title = l.nombre + " | Seiker";
    var md = $('meta[name="description"]');
    if (md) md.setAttribute("content", l.resumen);
    var lista = deLinea(l.id), n = lista.length;
    root.innerHTML = '' +
      '<section class="banner">' +
        (l.imagen ? '<img src="' + esc(l.imagen) + '" alt="" />' : "") +
        '<div class="wrap">' +
          '<nav class="crumbs" aria-label="Ruta"><ol><li><a href="index.html">Inicio</a></li><li><a href="productos.html">Productos</a></li>' +
          '<li aria-current="page">' + esc(l.nombre) + "</li></ol></nav>" +
          '<p class="eyebrow">Productos y soluciones</p>' +
          '<h1 class="h1">' + esc(l.nombre) + "</h1><p>" + esc(l.resumen) + "</p>" +
        "</div>" +
        '<div class="banner-art banner-art--bidones" aria-hidden="true">' +
          lista.slice(0, 3).map(function (p) { return imagenDe(p); }).join("") + "</div>" +
      "</section>" +
      ((l.beneficios || []).length ? '<section class="sec"><div class="wrap">' +
        '<div class="sec-h rv"><p class="eyebrow">Por qué elegir esta línea</p><h2 class="h2">' + esc(l.nombre) + "</h2></div>" +
        '<div class="feats" data-beneficios="' + esc(l.id) + '" data-stagger></div></div></section>' : "") +
      '<section class="sec sec--gris"><div class="wrap">' +
        '<div class="sec-h sec-h--row rv"><div><p class="eyebrow">Portafolio</p><h2 class="h2">' + n + (n === 1 ? " producto" : " productos") + "</h2></div>" +
        '<a class="lnk" href="productos.html?linea=' + encodeURIComponent(l.id) + '">Abrir en el buscador' + ico("flecha") + "</a></div>" +
        '<div class="pgrid" data-productos="' + esc(l.id) + '"></div></div></section>' +
      (n > 1 ? '<section class="sec"><div class="wrap"><div class="sec-h rv"><p class="eyebrow">Comparativa</p>' +
        '<h2 class="h2">Composición y dosis de la línea</h2></div><div class="tbl-wrap rv" data-tabla="' + esc(l.id) + '"></div></div></section>' : "");
  }

  /* ----------------------------------------------------------
     CONTACTO: completa línea y producto desde la URL y arma el
     correo. No hay servidor detrás: en lugar de fingir un envío,
     abre el programa de correo con la consulta ya escrita.
     ---------------------------------------------------------- */
  function initContacto() {
    var f = $("#form-contacto");
    if (!f) return;
    var sp = $("#f-producto"), sl = $("#f-linea");
    sl.innerHTML = '<option value="">Elegí una opción</option>' +
      CAT.lineas.map(function (l) { return '<option value="' + esc(l.id) + '">' + esc(l.nombre) + "</option>"; }).join("") +
      '<option value="servicio">Servicio técnico / reparación</option><option value="otra">Otra consulta</option>';

    function llenarProductos() {
      var lista = sl.value && linea(sl.value) ? deLinea(sl.value) : CAT.productos;
      var prev = sp.value;
      sp.innerHTML = '<option value="">Sin producto específico</option>' + lista.map(function (p) {
        return '<option value="' + esc(p.id) + '">' + esc(p.nombre + " — " + p.bajada) + "</option>";
      }).join("");
      if (prev && producto(prev) && lista.indexOf(producto(prev)) >= 0) sp.value = prev;
    }
    sl.addEventListener("change", llenarProductos);
    llenarProductos();

    var pre = producto(param("producto"));
    if (pre) {
      sl.value = pre.linea; llenarProductos(); sp.value = pre.id;
      var m = $("#f-msg");
      if (m && !m.value) m.value = param("doc") === "ficha"
        ? "Hola, quisiera recibir la ficha técnica de " + pre.nombre + "."
        : "Hola, quisiera una cotización de " + pre.nombre + ".";
    }

    var c = CFG.contacto || {};
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var faltan = $$("[required]", f).filter(function (i) {
        var ok = i.type === "checkbox" ? i.checked : i.value.trim() && (!i.checkValidity || i.checkValidity());
        i.closest(".fg").classList.toggle("err", !ok);
        return !ok;
      });
      if (faltan.length) { faltan[0].focus(); return; }

      var d = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
      var pr = producto(sp.value), li = sl.options[sl.selectedIndex];
      var asunto = "Consulta web — " + (pr ? pr.nombre : (li && li.value ? li.text : "Seiker"));
      var cuerpo = [
        "Nombre: " + d("f-nombre"),
        "Empresa / establecimiento: " + (d("f-empresa") || "—"),
        "Teléfono: " + d("f-tel"),
        "Email: " + d("f-email"),
        "Localidad / provincia: " + (d("f-loc") || "—"),
        "Línea de interés: " + (li && li.value ? li.text : "—"),
        "Producto: " + (pr ? pr.nombre : "—"),
        "",
        d("f-msg")
      ].join("\n");
      var href = "mailto:" + (c.email || "") + "?subject=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(cuerpo);
      $("#f-ok").hidden = false;
      $("#f-ok-mail").setAttribute("href", href);
      try { location.href = href; } catch (er) {}
    });
    f.addEventListener("input", function (e) {
      var g = e.target.closest(".fg");
      if (g) g.classList.remove("err");
    });

    $$("[data-cfg]").forEach(function (el) {
      var v = c[el.getAttribute("data-cfg")];
      if (!v) { var row = el.closest(".ci"); if (row) row.hidden = true; return; }
      el.textContent = v;
      if (el.tagName === "A") el.setAttribute("href", el.getAttribute("data-cfg") === "email" ? "mailto:" + v : "tel:" + v.replace(/[^\d+]/g, ""));
    });
  }

  /* ----------------------------------------------------------
     REVELADO SUAVE AL BAJAR
     Umbral bajo + red de seguridad: nada puede quedar invisible.
     ---------------------------------------------------------- */
  function initReveal() {
    if (reduce || !("IntersectionObserver" in window)) return;
    var els = $$(".rv");
    document.documentElement.classList.add("rv-on");
    $$("[data-stagger]").forEach(function (g) {
      $$(".rv", g).forEach(function (el, i) { el.style.transitionDelay = Math.min(i * 70, 350) + "ms"; });
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.04, rootMargin: "0px 0px -4% 0px" });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { el.classList.add("in"); }); }, 5000);
  }

  /* Anclas internas: compensan la altura del encabezado fijo */
  function initAnclas() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute("href").length < 2) return;
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (!el) return;
      e.preventDefault();
      var off = ($(".hdr") ? $(".hdr").offsetHeight : 80) + ($(".pd-tabs") ? 56 : 12);
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: reduce ? "auto" : "smooth" });
      try { history.replaceState(null, "", a.getAttribute("href")); } catch (er) {}
    });
  }

  function arrancar() {
    safe(initLayout, "layout");
    safe(initLinea, "linea");
    safe(initMenu, "menu");
    safe(initBuscar, "buscar");
    safe(initGrillas, "grillas");
    safe(initIconos, "iconos");
    safe(initFicha, "ficha");
    safe(initBuscador, "buscador");
    safe(initFilas, "filas");
    safe(initHero, "hero");
    safe(initContacto, "contacto");
    safe(initAnclas, "anclas");
    safe(initReveal, "reveal");
    document.documentElement.classList.add("listo");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
  else arrancar();
})();
