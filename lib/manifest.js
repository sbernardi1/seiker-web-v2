/* ============================================================
   SEIKER AG — datos de marca
   Patrón IIFE con espacio global. Nada de import/export:
   los módulos ES se rompen en file:// y no heredan el ?v= de caché.
   El CONTENIDO vive en el HTML; acá sólo va configuración.
   ============================================================ */
(function () {
  "use strict";

  var M = {

    /* Física del caudalímetro electromagnético — ley de Faraday.
       B = 10 mT es el campo típico de un equipo industrial; con eso
       la tensión inducida da unos pocos milivoltios, que es el orden
       real que maneja el instrumento. */
    flow: {
      B: 0.010,          // Tesla
      DN: 150,           // mm — diámetro nominal inicial
      Q: 120,            // m³/h — caudal inicial
      maxQ: 400,
      diametros: [80, 150, 200, 300]
    },

    /* Rangos de velocidad que definen si el calibre está bien elegido.
       Debajo de 1 m/s la señal es débil; arriba de 3 el liner se
       desgasta antes; arriba de 5 la erosión se acelera. */
    rangos: {
      baja: 1,
      optima: 3,
      alta: 5
    },

    /* Secciones que entran al índice del buscador */
    zonas: [
      ["#servicios",       "Soluciones"],
      ["#fertilizantes",   "Fertilizantes líquidos"],
      ["#caudalimetros",   "Caudalímetros"],
      ["#principio",       "Principio de medición"],
      ["#cauda-servicios", "Venta · Instalación · Reparación"],
      ["#cauda-usos",      "Usos industriales"],
      ["#nosotros",        "Quiénes somos"],
      ["#contacto",        "Contacto"]
    ],

    /* Paleta del canvas, espejo de los tokens de styles.css */
    tinta: {
      navy:    "#0B2545",
      navyDeep:"#061629",
      sky:     "#7BBFEA",
      bronze:  "#C9882E",
      acero:   "#2b4a6b",
      aceroOsc:"#17304d",
      interior:"#071a2e",
      blanco:  "#eef3f8"
    }
  };

  /* Dos nombres para el mismo objeto: __SEIKER__ se lee mejor en este
     proyecto, __BRAND__ es la convención del generador. */
  window.__SEIKER__ = M;
  window.__BRAND__  = M;
})();
