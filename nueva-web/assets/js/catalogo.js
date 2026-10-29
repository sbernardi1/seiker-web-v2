/* ============================================================
   SEIKER — CATÁLOGO DE PRODUCTOS
   ------------------------------------------------------------
   Este es el ÚNICO archivo que hay que tocar para sumar, quitar
   o editar productos. Todo el sitio se arma desde acá: el menú
   "Productos y soluciones", el buscador de productos, las páginas
   de cada línea, la ficha de cada producto y la búsqueda (lupa).

   CÓMO AGREGAR UN PRODUCTO
   1. Copiá un bloque { ... } de la lista "productos" de abajo.
   2. Cambiale el "id" (sin espacios ni tildes, ej. "nitromix-s").
      Ese id es la dirección de su ficha: producto.html?id=nitromix-s
   3. Completá los campos. Los que no tengas, borralos o dejalos
      vacíos ([] o ""): la ficha oculta lo que falta.
   4. Si tenés foto del producto, guardala en assets/img/productos/
      y poné la ruta en "imagen". Si no, se dibuja un envase.

   CÓMO AGREGAR UNA LÍNEA NUEVA (ej. "Semillas")
   Sumá un bloque en "lineas" con un id nuevo y usá ese id en el
   campo "linea" de sus productos. Aparece sola en el menú y en
   los filtros. Si querés que tenga página propia, poné en
   "pagina" el archivo .html; si no, se usa el buscador filtrado.

   Sin import/export a propósito: así funciona abriendo el
   archivo directo en el navegador, por FTP o en cualquier hosting.
   ============================================================ */
(function () {
  "use strict";

  var lineas = [
    {
      id: "fertilizantes",
      nombre: "Fertilizantes líquidos",
      corto: "Fertilizantes",
      pagina: "fertilizantes.html",
      envase: "bidon",            // dibujo por defecto: "bidon" o "caudalimetro"
      resumen: "Línea NITROMIX con nitrógeno, azufre, zinc y boro. Mínima volatilización, disponibilidad inmediata y logística con camiones propios hasta su lote.",
      beneficios: [
        ["Mínima volatilización", "Formulaciones pensadas para que el nitrógeno quede en el lote y no se pierda en el aire."],
        ["Disponibilidad inmediata", "Nutrientes en solución, listos para que el cultivo los tome desde la aplicación."],
        ["Logística propia", "Entrega con camiones propios hasta su lote, para no perder la ventana de aplicación."],
        ["Asesoramiento agronómico", "Ingenieros agrónomos disponibles todo el año, sin costo adicional."]
      ]
    },
    {
      id: "caudalimetros",
      nombre: "Caudalímetros electromagnéticos",
      corto: "Caudalímetros",
      pagina: "caudalimetros.html",
      envase: "caudalimetro",
      resumen: "Medición digital de caudal, conductividad, nivel y presión con transmisión remota. Sin partes móviles dentro del caño: nada que se desgaste ni obstruya.",
      beneficios: [
        ["Sin partes móviles", "Nada se interpone en el caño: no hay desgaste mecánico ni obstrucciones."],
        ["IP68", "Grado de protección para trabajar sumergido o a la intemperie."],
        ["Transmisión remota", "Data logger en tarjeta SD y comunicación GPRS / RS485."],
        ["Garantía 5 años", "Respaldo extendido, con servicio técnico propio."]
      ]
    }
  ];

  /* Características que comparten todos los caudalímetros Seiker */
  var CAUDA_COMUN = [
    "Grado de protección IP68",
    "Garantía de 5 años",
    "Data logger con tarjeta SD",
    "Comunicación GPRS / RS485",
    "Alimentación solar o por baterías",
    "Software de análisis incluido",
    "Sin partes móviles: sin desgaste ni obstrucciones"
  ];
  var CAUDA_MIDE = ["Caudal", "Conductividad", "Nivel", "Presión"];
  var CAUDA_USOS = [
    "Extracción de aguas subterráneas",
    "Redes de distribución de agua potable",
    "Tratamiento de efluentes",
    "Riego y agroindustria",
    "Industria alimentaria",
    "Industria química",
    "Minería e hidrocarburos",
    "Medición fiscal y facturación"
  ];

  function serie(id, nombre, presion, liner, electrodos, precision, resumen, color) {
    return {
      id: id,
      linea: "caudalimetros",
      nombre: nombre,
      bajada: "Presión nominal " + presion,
      tipo: "Caudalímetro electromagnético",
      resumen: resumen,
      descripcion: [
        resumen,
        "Mide caudal, conductividad, nivel y presión con transmisión remota de datos. " +
        "El líquido conductivo atraviesa un campo magnético y genera una tensión proporcional " +
        "a su velocidad (ley de Faraday): no hay piezas dentro del caño que se gasten o se traben."
      ],
      composicion: [
        ["Presión nominal", presion],
        ["Liner", liner],
        ["Electrodos", electrodos],
        ["Precisión", precision],
        ["Protección", "IP68"],
        ["Garantía", "5 años"]
      ],
      tituloComposicion: "Especificaciones técnicas",
      mide: CAUDA_MIDE,
      beneficios: CAUDA_COMUN,
      usos: CAUDA_USOS,
      cultivos: [],
      aplicacion: [],
      dosis: "",
      color: color,
      imagen: "",
      documentos: [],
      destacado: id === "s150" || id === "s600"
    };
  }

  var productos = [

    /* ─────────── FERTILIZANTES LÍQUIDOS ─────────── */
    {
      id: "nitromix-ns",
      linea: "fertilizantes",
      nombre: "NITROMIX NS",
      bajada: "Nitrógeno + Azufre",
      tipo: "Fertilizante líquido",
      resumen: "Fertilizante base para producciones extensivas. Disponibilidad inmediata. Apto para fertirriego y aplicaciones motrices.",
      descripcion: [
        "NITROMIX NS es el fertilizante base de la línea para producciones extensivas: combina nitrógeno y azufre en solución, con disponibilidad inmediata para el cultivo.",
        "Es apto para fertirriego y para aplicaciones motrices, lo que permite integrarlo al esquema de trabajo del establecimiento."
      ],
      composicion: [["N", "26%"], ["S", "8%"], ["pH", "6,5"], ["Densidad", "1,26"]],
      dosis: "100 – 300 l/ha",
      cultivos: ["Maíz", "Sorgo", "Trigo", "Soja", "Alfalfa", "Girasol"],
      aplicacion: ["Fertirriego", "Aplicación motriz"],
      beneficios: [
        "Fertilizante base para producciones extensivas",
        "Nitrógeno y azufre con disponibilidad inmediata",
        "Apto para fertirriego y aplicaciones motrices",
        "Mínima volatilización"
      ],
      color: "#1F7A4D",
      imagen: "",
      documentos: [],
      destacado: true
    },
    {
      id: "nitromix-zn",
      linea: "fertilizantes",
      nombre: "NITROMIX Zn",
      bajada: "Con Zinc quelado",
      tipo: "Fertilizante líquido",
      resumen: "Micronutriente esencial para gramíneas. Favorece la síntesis de proteínas, la floración y el cuaje de granos. Maximiza el rendimiento.",
      descripcion: [
        "NITROMIX Zn suma zinc quelado a la base de nitrógeno y azufre. El zinc es un micronutriente esencial para las gramíneas.",
        "Favorece la síntesis de proteínas, la floración y el cuaje de granos, con el objetivo de maximizar el rendimiento."
      ],
      composicion: [["N", "26%"], ["S", "8%"], ["Zn", "0,5%"], ["pH", "6,5"]],
      dosis: "100 – 300 l/ha",
      cultivos: ["Maíz", "Sorgo", "Trigo"],
      aplicacion: [],
      beneficios: [
        "Zinc quelado: micronutriente esencial para gramíneas",
        "Favorece la síntesis de proteínas",
        "Mejora la floración y el cuaje de granos",
        "Apunta a maximizar el rendimiento"
      ],
      color: "#2D6E96",
      imagen: "",
      documentos: [],
      destacado: true
    },
    {
      id: "nitromix-b",
      linea: "fertilizantes",
      nombre: "NITROMIX B",
      bajada: "Con Boro",
      tipo: "Fertilizante líquido",
      resumen: "Especial para girasol. A la siembra asegura emergencia uniforme y desarrollo radicular. En aplicación tardía, floración homogénea y llenado de granos.",
      descripcion: [
        "NITROMIX B incorpora boro a la base de nitrógeno y azufre y está pensado especialmente para girasol.",
        "Aplicado a la siembra asegura una emergencia uniforme y un buen desarrollo radicular. En aplicación tardía acompaña una floración homogénea y el llenado de granos."
      ],
      composicion: [["N", "26%"], ["S", "8%"], ["B", "0,5%"], ["pH", "6,5"]],
      dosis: "100 – 300 l/ha",
      cultivos: ["Girasol", "Canola"],
      aplicacion: [],
      beneficios: [
        "Especial para girasol",
        "A la siembra: emergencia uniforme y desarrollo radicular",
        "En aplicación tardía: floración homogénea",
        "Acompaña el llenado de granos"
      ],
      color: "#B7832A",
      imagen: "",
      documentos: [],
      destacado: true
    },
    {
      id: "nitromix-plus",
      linea: "fertilizantes",
      nombre: "NITROMIX PLUS",
      bajada: "Base orgánica",
      tipo: "Fertilizante líquido orgánico",
      resumen: "Combinación de nutrientes orgánicos y sales convencionales. Alta eficiencia por bajo tamaño molecular: incorporación inmediata al suelo y reducción de la volatilización.",
      descripcion: [
        "NITROMIX PLUS combina nutrientes de origen orgánico con sales convencionales.",
        "Su bajo tamaño molecular le da alta eficiencia: se incorpora de inmediato al suelo y reduce la volatilización."
      ],
      composicion: [["N equiv.", "24%"], ["P equiv.", "9,5%"], ["M.O.", "36%"]],
      dosis: "Consultar según cultivo y análisis de suelo",
      cultivos: [],
      aplicacion: [],
      beneficios: [
        "Nutrientes orgánicos + sales convencionales",
        "Bajo tamaño molecular: alta eficiencia",
        "Incorporación inmediata al suelo",
        "Reducción de la volatilización"
      ],
      color: "#6B4F2A",
      imagen: "",
      documentos: [],
      destacado: true
    },
    {
      id: "nitroplus-18",
      linea: "fertilizantes",
      nombre: "NITROPLUS 18",
      bajada: "Fertilizante foliar",
      tipo: "Fertilizante foliar",
      resumen: "Aplicación foliar con una combinación exclusiva de nitrógeno amínico y calcio. Alcanza 100% de eficiencia en el uso del nitrógeno aplicado.",
      descripcion: [
        "NITROPLUS 18 es un fertilizante de aplicación foliar con una combinación exclusiva de nitrógeno amínico y calcio.",
        "Alcanza el 100% de eficiencia en el uso del nitrógeno aplicado, eliminando las pérdidas por volatilización y lixiviación."
      ],
      composicion: [["N", "18%"], ["Ca", "7%"], ["Vía", "Foliar"]],
      dosis: "Consultar según cultivo y estado fenológico",
      cultivos: [],
      aplicacion: ["Foliar"],
      beneficios: [
        "Nitrógeno amínico + calcio",
        "100% de eficiencia en el uso del nitrógeno aplicado",
        "Sin pérdidas por volatilización ni lixiviación",
        "Aplicación foliar"
      ],
      color: "#5E8A2E",
      imagen: "",
      documentos: [],
      destacado: false
    },

    /* ─────────── CAUDALÍMETROS ELECTROMAGNÉTICOS ─────────── */
    serie("s150",  "Caudalímetro S150",  "10 kg/cm²",  "PU / Teflon", "AISI 316L",        "±0,25%",
      "La serie de mayor precisión de la línea: ±0,25%. Presión nominal de 10 kg/cm², liner de PU o Teflon y electrodos de acero inoxidable AISI 316L.", "#063734"),
    serie("s300",  "Caudalímetro S300",  "20 kg/cm²",  "Teflon",      "316L / Hastelloy", "±0,3%",
      "Presión nominal de 20 kg/cm², liner de Teflon y electrodos de 316L o Hastelloy. Precisión de ±0,3%.", "#063734"),
    serie("s600",  "Caudalímetro S600",  "40 kg/cm²",  "Teflon",      "316L / Titanio",   "±0,5%",
      "Presión nominal de 40 kg/cm², liner de Teflon y electrodos de 316L o Titanio. Precisión de ±0,5%.", "#063734"),
    serie("s900",  "Caudalímetro S900",  "60 kg/cm²",  "Teflon",      "Titanio",          "±0,5%",
      "Presión nominal de 60 kg/cm², liner de Teflon y electrodos de Titanio. Precisión de ±0,5%.", "#063734"),
    serie("s1500", "Caudalímetro S1500", "100 kg/cm²", "Teflon",      "Tantalio",         "±0,5%",
      "Para las presiones más altas de la línea: 100 kg/cm². Liner de Teflon y electrodos de Tantalio. Precisión de ±0,5%.", "#063734")
  ];

  window.SEIKER_CATALOGO = { lineas: lineas, productos: productos };
})();
