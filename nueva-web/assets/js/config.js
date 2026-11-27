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
      direccion: "Av. Rural 1200, Rosario, Santa Fe",   // REVISAR: dato de ejemplo de la web anterior
      telefono: "+54 341 000-0000",                     // REVISAR: número de ejemplo
      email: "info@seikeragro.com",                     // casilla de consultas: le llegan los formularios. REVISAR: confirmar dominio oficial
      horario: "Lunes a viernes · 8:00 – 18:00 h",
      whatsapp: ""                                       // REVISAR: falta el número. Ej. "5493410000000" (sin + ni espacios)
    },

    /* Formulario de contacto: "formsubmit" envía cada consulta directo a contacto.email
       a través de FormSubmit (formsubmit.co), sin servidor propio ni cuenta.
       La primera vez llega a esa casilla un mail de FormSubmit con el botón
       "Activate Form": hay que abrirlo una sola vez. Vacío ("") = el formulario
       abre el programa de correo del visitante con la consulta ya escrita. */
    formulario: "formsubmit",
    /* Código que FormSubmit mandó en el mail de activación para no mostrar el mail
       en el código de la página (frena el spam). Vacío = se usa contacto.email. */
    formularioClave: "8c3643286cf116931a93379e3529ba81",

    /* Dejar la URL vacía oculta el ícono. REVISAR: faltan las cuentas reales. */
    redes: {
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: ""
    },

    /* Cifras de la franja oscura: [número, unidad, texto]. El "+" va solo si es "más de". */
    cifras: [
      ["+15", "años", "en el sector agropecuario e industrial"],
      // REVISAR: en la web hay 6 productos de nutrición y coadyuvantes (5 + 1); ¿cuenta otros que no están publicados?
      ["+10", "productos", "de nutrición y coadyuvantes"],
      // REVISAR: el horario es de lunes a viernes 8 a 18 h; propuesta: "24 h hábiles" (no aplicado)
      ["24", "h", "de respuesta técnica"],
      ["5", "años", "de garantía en caudalímetros"]
    ]
  };
})();
