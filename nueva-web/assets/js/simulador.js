/* ============================================================
   SEIKER — SIMULADOR "CÓMO FUNCIONA" (caudalimetros.html)
   Ley de Faraday: E = B · v · D. B = 10 mT es el campo típico de
   un equipo industrial; con eso la tensión inducida da unos pocos
   milivoltios, que es el orden real que maneja el instrumento.
   ============================================================ */
(function () {
  "use strict";

  var B = 0.010;                       // Tesla
  var RANGO = { baja: 1, optima: 3, alta: 5 };   // m/s

  function num(n, d) { return n.toFixed(d).replace(".", ","); }

  function init() {
    var cv = document.getElementById("flow-canvas");
    if (!cv) return;
    var cx = cv.getContext("2d");
    var W = 900, H = 400;
    var DN = 150, Q = 120;
    var quieto = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var $ = function (id) { return document.getElementById(id); };

    function area() { return Math.PI * Math.pow(DN / 2000, 2); }     // m²
    function vel()  { return Q / (area() * 3600); }                   // m/s
    function mV()   { return B * vel() * (DN / 1000) * 1000; }        // mV

    var ejeY = 190, planoX = 430, ELIPSE = 50;
    function radio() { return 50 + (DN / 300) * 38; }

    /* Perfil parabólico: en el centro el líquido va más rápido que contra la pared */
    var parts = [];
    for (var i = 0; i < 300; i++) parts.push({ x: Math.random() * W, t: Math.random() * 2 - 1, r: 1 + Math.random() * 1.8 });
    function perfil(t) { return 1 - t * t * 0.72; }

    function dibujar() {
      var R = radio(), pared = 13;
      cx.clearRect(0, 0, W, H);

      /* Caño de acero */
      var g = cx.createLinearGradient(0, ejeY - R - pared, 0, ejeY + R + pared);
      g.addColorStop(0, "#c9d0cd"); g.addColorStop(.5, "#8f9995"); g.addColorStop(1, "#5d6763");
      cx.fillStyle = g;
      cx.fillRect(0, ejeY - R - pared, W, (R + pared) * 2);

      /* Liner */
      cx.fillStyle = "rgba(255,255,255,.35)";
      cx.fillRect(0, ejeY - R - 4, W, 4);
      cx.fillRect(0, ejeY + R, W, 4);

      cx.fillStyle = "#06302d";
      cx.fillRect(0, ejeY - R, W, R * 2);

      /* Campo magnético entre bobinas */
      var pulso = quieto ? .5 : (Math.sin(Date.now() / 640) * .5 + .5);
      cx.lineWidth = 2;
      for (var k = 0; k <= 8; k++) {
        var x = planoX - 148 + k * 37, borde = Math.abs(k - 4) / 4;
        var op = (.85 - borde * .42) * (.62 + pulso * .38);
        cx.strokeStyle = "rgba(201,163,95," + op + ")";
        cx.beginPath(); cx.moveTo(x, ejeY - R - pared); cx.lineTo(x, ejeY + R + pared); cx.stroke();
        [-.42, .18].forEach(function (f) {
          var ay = ejeY + R * f;
          cx.beginPath(); cx.moveTo(x, ay + 9); cx.lineTo(x - 4.5, ay); cx.lineTo(x + 4.5, ay);
          cx.closePath(); cx.fillStyle = "rgba(201,163,95," + op + ")"; cx.fill();
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
        lg.addColorStop(0, "rgba(111,211,176,0)");
        lg.addColorStop(1, "rgba(" + Math.round(140 + rap * 60) + "," + Math.round(215 + rap * 30) + "," + Math.round(195 + rap * 40) + "," + (.5 + rap * .45) + ")");
        cx.strokeStyle = lg; cx.lineWidth = p.r;
        cx.beginPath(); cx.moveTo(p.x - largo, y); cx.lineTo(p.x, y); cx.stroke();
      });

      /* Bobinas */
      [-1, 1].forEach(function (lado) {
        var yb = ejeY + lado * (R + pared), alto = 40;
        var top = lado === -1 ? yb - alto : yb;
        var gb = cx.createLinearGradient(0, top, 0, top + alto);
        if (lado === -1) { gb.addColorStop(0, "#6d4f22"); gb.addColorStop(1, "#a8823f"); }
        else { gb.addColorStop(0, "#a8823f"); gb.addColorStop(1, "#6d4f22"); }
        cx.fillStyle = gb; cx.fillRect(planoX - 116, top, 232, alto);
        cx.strokeStyle = "rgba(40,28,10,.45)"; cx.lineWidth = 2.5;
        for (var s = 0; s < 13; s++) {
          var sx = planoX - 108 + s * 18;
          cx.beginPath(); cx.moveTo(sx, top + 3); cx.lineTo(sx + 9, top + alto - 3); cx.stroke();
        }
      });
      cx.font = '600 12px Roboto, sans-serif';
      cx.fillStyle = "#825F28"; cx.textAlign = "center";
      cx.fillText("BOBINAS · CAMPO MAGNÉTICO B", planoX, ejeY - R - pared - 52);

      /* Plano de medición */
      cx.strokeStyle = "rgba(255,255,255,.65)"; cx.lineWidth = 1.8;
      cx.setLineDash([6, 5]);
      cx.beginPath(); cx.ellipse(planoX, ejeY, ELIPSE, R, 0, 0, Math.PI * 2); cx.stroke();
      cx.setLineDash([]);

      /* Electrodos */
      var senal = Math.min(mV() / 6, 1);
      [-1, 1].forEach(function (lado) {
        var ex = planoX + lado * ELIPSE;
        if (senal > .02) {
          var hal = cx.createRadialGradient(ex, ejeY, 2, ex, ejeY, 12 + senal * 21);
          hal.addColorStop(0, "rgba(111,211,176," + (senal * .6) + ")");
          hal.addColorStop(1, "rgba(111,211,176,0)");
          cx.fillStyle = hal;
          cx.beginPath(); cx.arc(ex, ejeY, 12 + senal * 21, 0, Math.PI * 2); cx.fill();
        }
        cx.beginPath(); cx.arc(ex, ejeY, 8.5, 0, Math.PI * 2);
        cx.fillStyle = "#ffffff"; cx.fill();
        cx.strokeStyle = "#063734"; cx.lineWidth = 2; cx.stroke();
        cx.fillStyle = "#063734";
        cx.font = '700 12px Roboto, sans-serif';
        cx.textAlign = "center"; cx.textBaseline = "middle";
        cx.fillText(lado === 1 ? "+" : "−", ex, ejeY + .5);
        cx.textBaseline = "alphabetic";
      });

      /* Cable hacia la lectura */
      cx.strokeStyle = "rgba(6,55,52," + (.35 + senal * .55) + ")"; cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(planoX + ELIPSE, ejeY);
      cx.lineTo(planoX + ELIPSE + 26, ejeY);
      cx.lineTo(planoX + ELIPSE + 26, ejeY + R + 38);
      cx.lineTo(W - 112, ejeY + R + 38);
      cx.lineTo(W - 112, ejeY + R + 64);
      cx.stroke();
      cx.font = '600 14px "IBM Plex Mono", monospace';
      cx.fillStyle = "#063734";
      cx.textAlign = "right";
      cx.fillText(num(mV(), 2) + " mV", W - 122, ejeY + R + 62);

      cx.textAlign = "center";
      cx.font = '600 12px Roboto, sans-serif';
      cx.fillStyle = "#5f6461";
      cx.fillText("ELECTRODOS", planoX, ejeY + R + pared + 58);
      cx.textAlign = "left";
      cx.fillStyle = "#1F7A4D";
      cx.fillText("FLUJO  →", 20, ejeY - R - pared - 18);
    }

    function actualizar() {
      var v = vel();
      $("r-q").innerHTML = num(Q, 0) + "<small>m³/h</small>";
      $("r-v").innerHTML = num(v, 2) + "<small>m/s</small>";
      $("r-mv").innerHTML = num(mV(), 2) + "<small>mV</small>";
      $("c-q-txt").textContent = num(Q, 0) + " m³/h";

      /* Diagnóstico de calibre: el dato que de verdad sirve para elegir equipo */
      var d = $("diag"), t = $("diag-t"), b = d.querySelector("b");
      if (Q === 0) {
        d.className = "diag baja"; b.textContent = "Sin caudal";
        t.textContent = "Sin flujo no hay tensión inducida: el equipo lee cero real, sin deriva.";
      } else if (v < RANGO.baja) {
        d.className = "diag baja"; b.textContent = "Velocidad baja";
        t.textContent = "Por debajo de 1 m/s la señal es débil. Convendría un diámetro menor para este caudal.";
      } else if (v <= RANGO.optima) {
        d.className = "diag ok"; b.textContent = "Rango óptimo";
        t.textContent = "Velocidad dentro de 1–3 m/s. Calibre bien dimensionado.";
      } else if (v <= RANGO.alta) {
        d.className = "diag alta"; b.textContent = "Velocidad alta";
        t.textContent = "Mide correctamente, pero por encima de 3 m/s el liner se desgasta antes. Evaluar un diámetro mayor.";
      } else {
        d.className = "diag alta"; b.textContent = "Fuera de rango";
        t.textContent = "Más de 5 m/s acelera la erosión del liner y los electrodos. Recomendado subir de diámetro.";
      }
    }

    $("c-q").addEventListener("input", function (e) { Q = +e.target.value; actualizar(); if (quieto) dibujar(); });
    $("c-dn").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-dn]");
      if (!b) return;
      DN = +b.getAttribute("data-dn");
      Array.prototype.forEach.call(document.querySelectorAll("#c-dn button"), function (x) {
        x.classList.toggle("on", x === b);
        x.setAttribute("aria-pressed", x === b ? "true" : "false");
      });
      actualizar(); if (quieto) dibujar();
    });

    /* El bucle corre sólo mientras el simulador está a la vista */
    var corriendo = false, raf = 0;
    function loop() { dibujar(); raf = requestAnimationFrame(loop); }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting && !corriendo && !quieto) { corriendo = true; loop(); }
          else if (!en.isIntersecting && corriendo) { corriendo = false; cancelAnimationFrame(raf); }
        });
      }, { rootMargin: "140px" }).observe(cv);
    }
    actualizar();
    dibujar();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
