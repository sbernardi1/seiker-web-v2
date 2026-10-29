/* ============================================================
   SEIKER — DATOS DE LA EMPRESA
   Teléfono, email, dirección y redes se cambian acá y se
   actualizan en todo el sitio (encabezado, pie y contacto).
   ⚠ Los valores marcados PENDIENTE vienen de la web anterior
     y hay que confirmarlos antes de publicar.
   ============================================================ */
(function () {
  "use strict";

  window.SEIKER_CONFIG = {
    marca: "Seiker",
    razonSocial: "Seiker Argentina S.A.",
    pais: "Argentina",

    contacto: {
      direccion: "Av. Rural 1200, Rosario, Santa Fe",   // PENDIENTE
      telefono: "+54 341 000-0000",                     // PENDIENTE
      email: "info@seikerag.com.ar",                    // PENDIENTE
      horario: "Lunes a viernes · 8:00 – 18:00 h",
      whatsapp: ""                                       // ej. "5493410000000" (sin + ni espacios)
    },

    /* Dejar la URL vacía oculta el ícono. */
    redes: {
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: ""
    },

    cifras: [
      ["+15", "años en el sector agropecuario e industrial"],
      ["5", "formulaciones de fertilizantes líquidos"],
      ["24 h", "de respuesta técnica"],
      ["5 años", "de garantía en caudalímetros"]
    ]
  };
})();
