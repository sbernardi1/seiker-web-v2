/* ============================================================
   SEIKER — ILUSTRACIONES E ÍCONOS
   Envases dibujados en SVG para los productos que todavía no
   tienen foto. Cuando haya foto, se carga en el campo "imagen"
   del catálogo y este dibujo deja de usarse para ese producto.
   ============================================================ */
(function () {
  "use strict";

  var n = 0;
  function uid(p) { n += 1; return p + n; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* "NITROMIX NS" → ["NITROMIX", "NS"]; "Caudalímetro S150" → ["Caudalímetro", "S150"] */
  function partir(nombre) {
    var i = nombre.lastIndexOf(" ");
    return i > 0 ? [nombre.slice(0, i), nombre.slice(i + 1)] : [nombre, ""];
  }

  /* ---------- Bidón de 20 L ---------- */
  function bidon(p) {
    var c = p.color || "#1F7A4D";
    var g = uid("b"), k = uid("k"), s = uid("s");
    var nm = partir(p.nombre || "");
    var largo = nm[1].length > 3;
    return '' +
      '<svg class="pk pk--bidon" viewBox="0 0 200 260" role="img" aria-label="Envase de ' + esc(p.nombre) + '">' +
      '<defs>' +
        '<linearGradient id="' + g + '" x1="0" x2="1" y1="0" y2="0">' +
          '<stop offset="0" stop-color="#e4e7e3"/><stop offset=".18" stop-color="#ffffff"/>' +
          '<stop offset=".62" stop-color="#f4f5f2"/><stop offset="1" stop-color="#cfd4cf"/></linearGradient>' +
        '<linearGradient id="' + k + '" x1="0" x2="1">' +
          '<stop offset="0" stop-color="#6d4f22"/><stop offset=".45" stop-color="#a8823f"/><stop offset="1" stop-color="#6d4f22"/></linearGradient>' +
        '<linearGradient id="' + s + '" x1="0" x2="0" y1="0" y2="1">' +
          '<stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".07"/></linearGradient>' +
      '</defs>' +
      '<ellipse cx="102" cy="248" rx="78" ry="7" fill="#000" opacity=".13"/>' +
      /* manija */
      '<path d="M96 46V30a14 14 0 0 1 14-14h40a14 14 0 0 1 14 14v28h-15V32a3 3 0 0 0-3-3h-32a3 3 0 0 0-3 3v14z" fill="url(#' + g + ')" stroke="#c3c8c3" stroke-width="1.2"/>' +
      /* tapa */
      '<rect x="44" y="22" width="30" height="8" rx="2" fill="url(#' + k + ')"/>' +
      '<rect x="47" y="28" width="24" height="20" rx="3" fill="url(#' + k + ')"/>' +
      '<path d="M50 32v12M56 32v12M62 32v12M68 32v12" stroke="#5a411b" stroke-width="1" opacity=".5"/>' +
      /* cuerpo */
      '<path d="M44 48h128a14 14 0 0 1 14 14v168a14 14 0 0 1-14 14H30a14 14 0 0 1-14-14V82a14 14 0 0 1 6-11.5z" fill="url(#' + g + ')" stroke="#c3c8c3" stroke-width="1.2"/>' +
      '<path d="M16 214h170v16a14 14 0 0 1-14 14H30a14 14 0 0 1-14-14z" fill="url(#' + s + ')"/>' +
      '<path d="M24 92v130" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>' +
      /* etiqueta */
      '<rect x="36" y="84" width="136" height="138" rx="7" fill="#fff" stroke="#dfe3df"/>' +
      '<path d="M36 91a7 7 0 0 1 7-7h122a7 7 0 0 1 7 7v25H36z" fill="#063734"/>' +
      '<text x="104" y="106" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="700" font-size="15" fill="#fff" letter-spacing=".5">seiker</text>' +
      '<rect x="36" y="116" width="136" height="3" fill="#a8823f"/>' +
      '<text x="104" y="141" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="700" font-size="' + (nm[0].length > 9 ? 13 : 15) + '" fill="#063734" letter-spacing=".6">' + esc(nm[0]) + '</text>' +
      '<text x="104" y="' + (largo ? 172 : 177) + '" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="800" font-size="' + (largo ? 28 : 38) + '" fill="' + esc(c) + '">' + esc(nm[1]) + '</text>' +
      '<text x="104" y="196" text-anchor="middle" font-family="Roboto, sans-serif" font-size="8.5" fill="#5f6461">' + esc((p.bajada || "").toUpperCase()) + '</text>' +
      '<path d="M36 205h136v10a7 7 0 0 1-7 7H43a7 7 0 0 1-7-7z" fill="' + esc(c) + '"/>' +
      '<text x="160" y="217" text-anchor="end" font-family="Outfit, sans-serif" font-weight="700" font-size="9" fill="#fff">20 L</text>' +
      '</svg>';
  }

  /* ---------- Caudalímetro electromagnético bridado ---------- */
  function caudalimetro(p) {
    var a = uid("a"), v = uid("v"), d = uid("d");
    var serie = partir(p.nombre || "")[1] || "";
    function brida(x) {
      var r = '<rect x="' + x + '" y="128" width="22" height="104" rx="4" fill="url(#' + a + ')" stroke="#7d8784" stroke-width="1"/>';
      [140, 166, 194, 220].forEach(function (y) {
        r += '<circle cx="' + (x + 11) + '" cy="' + y + '" r="3.6" fill="#59625f"/>';
      });
      return r;
    }
    return '' +
      '<svg class="pk pk--cauda" viewBox="0 0 260 260" role="img" aria-label="' + esc(p.nombre) + '">' +
      '<defs>' +
        '<linearGradient id="' + a + '" x1="0" x2="0" y1="0" y2="1">' +
          '<stop offset="0" stop-color="#eef1f0"/><stop offset=".45" stop-color="#b9c1be"/><stop offset="1" stop-color="#7d8784"/></linearGradient>' +
        '<linearGradient id="' + v + '" x1="0" x2="0" y1="0" y2="1">' +
          '<stop offset="0" stop-color="#0d5550"/><stop offset=".5" stop-color="#063734"/><stop offset="1" stop-color="#03211f"/></linearGradient>' +
        '<linearGradient id="' + d + '" x1="0" x2="0" y1="0" y2="1">' +
          '<stop offset="0" stop-color="#d9efe2"/><stop offset="1" stop-color="#b5d8c4"/></linearGradient>' +
      '</defs>' +
      '<ellipse cx="130" cy="244" rx="112" ry="7" fill="#000" opacity=".13"/>' +
      /* caño */
      '<rect x="30" y="150" width="200" height="60" fill="url(#' + a + ')"/>' +
      brida(18) + brida(220) +
      /* cuerpo de medición */
      '<rect x="62" y="138" width="136" height="84" rx="12" fill="url(#' + v + ')"/>' +
      '<rect x="62" y="138" width="136" height="6" rx="3" fill="#fff" opacity=".12"/>' +
      '<text x="130" y="186" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="800" font-size="22" fill="#c9a35f">' + esc(serie) + '</text>' +
      '<text x="130" y="203" text-anchor="middle" font-family="Roboto, sans-serif" font-size="7.5" fill="#fff" opacity=".7" letter-spacing="1.4">ELECTROMAGNÉTICO</text>' +
      /* cuello */
      '<rect x="116" y="104" width="28" height="36" fill="url(#' + a + ')"/>' +
      '<rect x="110" y="98" width="40" height="10" rx="3" fill="#7d8784"/>' +
      /* convertidor */
      '<rect x="66" y="22" width="128" height="80" rx="14" fill="url(#' + v + ')"/>' +
      '<rect x="66" y="22" width="128" height="6" rx="3" fill="#fff" opacity=".14"/>' +
      '<rect x="80" y="36" width="100" height="36" rx="5" fill="url(#' + d + ')"/>' +
      '<text x="172" y="60" text-anchor="end" font-family="IBM Plex Mono, monospace" font-weight="600" font-size="15" fill="#063734">128,4</text>' +
      '<text x="88" y="48" font-family="Roboto, sans-serif" font-size="6.5" fill="#063734" opacity=".75">m³/h</text>' +
      '<rect x="88" y="62" width="40" height="3" rx="1.5" fill="#063734" opacity=".35"/>' +
      '<text x="80" y="90" font-family="Outfit, sans-serif" font-weight="700" font-size="10" fill="#fff" letter-spacing=".4">seiker</text>' +
      '<circle cx="170" cy="87" r="3.2" fill="#6fd39a"/>' +
      '<circle cx="180" cy="87" r="3.2" fill="#c9a35f"/>' +
      '</svg>';
  }

  function envase(p, linea) {
    var tipo = (linea && linea.envase) || "bidon";
    return tipo === "caudalimetro" ? caudalimetro(p) : bidon(p);
  }

  /* ---------- Íconos de línea (trazo = currentColor) ---------- */
  var I = {
    hoja:     '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19l8-8"/>',
    gota:     '<path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/>',
    camion:   '<path d="M2 6h11v10H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
    persona:  '<circle cx="12" cy="7.5" r="3.5"/><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
    escudo:   '<path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    senal:    '<path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a5.6 5.6 0 0 1 8 0"/><circle cx="12" cy="18.5" r="1.2"/>',
    reloj:    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    medidor:  '<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5"/><path d="M4 19h16"/>',
    llave:    '<path d="M14.5 5.5a4 4 0 0 0-5.3 5.2L4 16v4h4l5.3-5.2a4 4 0 0 0 5.2-5.3l-2.6 2.6-2.6-.9-.9-2.6z"/>',
    engranaje:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4L5.3 5.3"/>',
    moneda:   '<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2c-.5-.9-1.6-1.4-2.8-1.4-1.6 0-2.8.8-2.8 2.1 0 2.9 5.8 1.5 5.8 4.3 0 1.3-1.3 2.1-3 2.1-1.4 0-2.6-.6-3-1.6M12 6.2v1.6M12 16.3v1.5"/>',
    lupa:     '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
    flecha:   '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron:  '<path d="M6 9l6 6 6-6"/>',
    mundo:    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.6 5.2 3.6 8.5s-1.1 6.1-3.6 8.5c-2.5-2.4-3.6-5.2-3.6-8.5S9.5 5.9 12 3.5z"/>',
    tel:      '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail:     '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/>',
    pin:      '<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    doc:      '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    check:    '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    menu:     '<path d="M3 7h18M3 12h18M3 17h18"/>',
    cerrar:   '<path d="M6 6l12 12M18 6L6 18"/>',
    planta:   '<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 15c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5z"/>',
    fabrica:  '<path d="M3 21V10l5 3V10l5 3V6h4l1 15z"/><path d="M3 21h18"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 2.8 2.2 5 5 5l1-1.4-1.8-.9-.8.8c-1-.4-1.8-1.2-2.2-2.2l.8-.8-.9-1.8z"/>',
    pausa:    '<path d="M9 6v12M15 6v12"/>',
    play:     '<path d="M8 5.5v13l10-6.5z"/>',
    izq:      '<path d="M15 6l-6 6 6 6"/>',
    der:      '<path d="M9 6l6 6-6 6"/>',
    instagram:'<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".6"/>',
    facebook: '<path d="M14 8h2.5V4.5H14A4 4 0 0 0 10 8.5V11H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3v-2a1 1 0 0 1 1-1z"/>',
    linkedin: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 10.5V16M8 8v.01M11.5 16v-3.2c0-1.4.9-2.3 2.1-2.3s1.9.9 1.9 2.3V16M11.5 10.5V16"/>',
    youtube:  '<rect x="3" y="6" width="18" height="12" rx="4"/><path d="M10.5 9.5v5l4-2.5z"/>'
  };

  function ico(nombre, clase) {
    return '<svg class="ico' + (clase ? " " + clase : "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      (I[nombre] || "") + "</svg>";
  }

  window.SEIKER_ILUS = { envase: envase, bidon: bidon, caudalimetro: caudalimetro, ico: ico };
})();
