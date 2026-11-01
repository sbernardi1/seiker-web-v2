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

   FICHAS COMPLETAS: STARTER PLUS es el modelo con todos los
   campos (beneficios con título, cómo actúa, guía de dosis,
   notas, folleto PDF). El detalle de cada campo está en LEEME.md.

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
      pagina: "fertilizantes.html",   // si no tiene página propia, se usa linea.html?id=...
      envase: "bidon",                // dibujo por defecto: "bidon", "bolsa" o "caudalimetro"
      imagen: "assets/img/campo-girasol.webp",  // foto de la tarjeta y del encabezado de la línea
      resumen: "Línea NITROMIX con nitrógeno, azufre, zinc y boro. Mínima volatilización, disponibilidad inmediata y logística con camiones propios hasta su lote.",
      iconos: ["hoja", "gota", "camion", "persona"],
      beneficios: [
        ["Mínima volatilización", "Formulaciones pensadas para que el nitrógeno quede en el lote y no se pierda en el aire."],
        ["Disponibilidad inmediata", "Nutrientes en solución, listos para que el cultivo los tome desde la aplicación."],
        ["Logística propia", "Entrega con camiones propios hasta su lote, para no perder la ventana de aplicación."],
        ["Asesoramiento agronómico", "Ingenieros agrónomos disponibles todo el año, sin costo adicional."]
      ]
    },
    {
      id: "nutricion",
      nombre: "Soluciones nutricionales",
      corto: "Nutrición",
      envase: "bidon",
      imagen: "assets/img/lineas/nutricion.webp",
      resumen: "Fertilizantes foliares y solubles para cada etapa del cultivo: micronutrientes para el arranque, nutrición completa, balance fuente/sumidero y potasio para el llenado.",
      iconos: ["escudo", "gota", "planta", "check"],
      beneficios: [
        ["Nutrientes protegidos", "Micronutrientes quelatados o acomplejados, con una absorción cercana al 100%."],
        ["Rápida absorción", "Ingresan por hojas, tallos y tejidos verdes, en una sola pasada."],
        ["Cada etapa del cultivo", "Del arranque y el macollaje al llenado de granos, frutos y tubérculos."],
        ["Pensados para mezclar", "Baja interferencia con plaguicidas. Siempre con una prueba de compatibilidad previa."]
      ]
    },
    {
      id: "coadyuvantes",
      nombre: "Coadyuvantes",
      corto: "Coadyuvantes",
      envase: "bidon",
      imagen: "assets/img/lineas/coadyuvantes.webp",
      resumen: "Aceite vegetal de soja que mejora la emulsión, la cobertura y la adherencia del caldo, y reduce las pérdidas por evaporación y volatilización.",
      iconos: ["gota", "escudo", "reloj", "hoja"],
      beneficios: [
        ["Mejor cobertura", "Mojado uniforme aun en hojas con mucha pilosidad o cera."],
        ["Menos pérdidas", "Reduce la evaporación y la volatilización del caldo."],
        ["Más adherencia", "El producto queda adherido más tiempo, aun con lluvia o rocío."],
        ["Base vegetal", "Aceite de soja fácilmente biodegradable, sin halógenos orgánicos ni metales."]
      ]
    },
    {
      id: "caudalimetros",
      nombre: "Caudalímetros electromagnéticos",
      corto: "Caudalímetros",
      pagina: "caudalimetros.html",
      envase: "caudalimetro",
      arte: "s600",                   // sin foto: se dibuja este producto
      resumen: "Medición digital de caudal, conductividad, nivel y presión con transmisión remota. Sin partes móviles dentro del caño: nada que se desgaste ni obstruya.",
      iconos: ["engranaje", "escudo", "senal", "check"],
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
      destacado: id === "s150"
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
      cultivos: ["Maíz", "Sorgo", "Trigo", "Girasol"],   // sin soja ni alfalfa: las leguminosas fijan su propio nitrógeno
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
      destacado: false
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
      destacado: false
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
      dosis: "10 l/ha en trigo y cebada",
      cultivos: ["Trigo", "Cebada"],
      aplicacion: ["Foliar"],
      guia: [{
        titulo: "Dosis por cultivo",
        columnas: ["Cultivo", "Dosis", "Momento de aplicación"],
        filas: [
          ["Trigo · Cebada", "10 l/ha", "Desde macollaje hasta hoja bandera"]
        ],
        pie: "Para otros cultivos, consulte a su ingeniero agrónomo."
      }],
      notas: [
        ["Importante", "No aplicar en días calurosos ni en las horas de máxima insolación. Orden de carga: agua, NITROPLUS 18 y después los demás productos."]
      ],
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

    /* ─────────── SOLUCIONES NUTRICIONALES ─────────── */
    {
      id: "starter-plus",
      linea: "nutricion",
      nombre: "STARTER PLUS",
      bajada: "Micronutrientes foliares",
      tipo: "Fertilizante líquido foliar",
      resumen: "Zinc, manganeso, cobre y boro quelatados, de rápida absorción, para más macollaje, sanidad y rendimiento.",
      descripcion: [
        "Starter Plus es un fertilizante líquido de aplicación foliar que suministra zinc, manganeso, cobre y boro de forma equilibrada: cuatro micronutrientes en una sola aplicación.",
        "Se absorbe rápidamente por hojas, tallos y demás tejidos verdes, y la fracción que llega al suelo puede ser aprovechada por las raíces."
      ],
      frase: "Micronutrientes protegidos, absorción cercana al 100%.",
      composicion: [["Zinc (Zn)", "5%", "≈ 65 g/L"], ["Manganeso (Mn)", "3%", "≈ 39 g/L"], ["Cobre (Cu)", "0,5%", "≈ 6,5 g/L"], ["Boro (B)", "0,5%", "≈ 6,5 g/L"]],
      propiedades: [["Formulación", "Líquido, quelatado"], ["Densidad", "1,3 g/ml"], ["pH", "7,9"], ["Aplicación", "Foliar · semilla · fertirriego"], ["Envase", "Bidón 5 L"]],
      presentacion: "Bidón 5 L",
      dosis: "2–4 l/ha en extensivos",
      cultivos: ["Maíz", "Trigo", "Cebada", "Avena", "Arroz", "Soja", "Poroto", "Arveja", "Lenteja", "Papa", "Frutales", "Olivo", "Nogal", "Hortalizas", "Ajo", "Cebolla"],
      aplicacion: ["Foliar", "Tratamiento de semilla", "Fertirriego"],
      beneficios: [
        ["Zinc disponible", "Aporta zinc rápidamente disponible para la planta."],
        ["Equilibrio", "Suministra micronutrientes de forma equilibrada."],
        ["Macollaje", "Favorece el macollaje y la sanidad del cultivo."],
        ["Más nitrógeno", "Complementa y potencia la fertilización nitrogenada."],
        ["Rendimiento", "Contribuye al logro de altos rendimientos."],
        ["Hojas activas", "Hojas más verdes y fotosintéticamente activas."],
        ["Desarrollo", "Favorece el desarrollo vegetativo de la planta."],
        ["Balance", "Ayuda al balance nutricional del cultivo."]
      ],
      comoActua: {
        titulo: "El poder de la quelatación.",
        texto: "Un quelato es un compuesto en el que una molécula orgánica (el agente quelante) rodea y se enlaza al ion metálico, protegiéndolo de reacciones indeseadas con el medio.",
        modo: "comparar",
        pasos: [
          ["Micronutriente sin proteger", "El ion libre reacciona en el caldo de aplicación o en el suelo y forma compuestos insolubles que la planta no puede absorber."],
          ["Micronutriente quelatado", "El agente quelante protege al nutriente hasta que llega a la hoja: la eficiencia de absorción es cercana al 100%."]
        ]
      },
      guia: [{
        titulo: "Dosis por cultivo",
        columnas: ["Cultivo", "Dosis", "Momento de aplicación"],
        filas: [
          ["Cultivos extensivos"],
          ["Maíz", "3–4 l/ha", "Aplicación entre V3 y V5"],
          ["Trigo · Cebada · Avena", "2–4 l/ha", "1 a 2 aplicaciones durante el macollaje"],
          ["Arroz", "1–1,5 l/100 kg", "Tratamiento a la semilla"],
          ["Arroz", "2–4 l/ha", "1 a 2 aplicaciones durante el macollaje"],
          ["Soja", "3 l/ha", "1 a 2 aplicaciones a los 20 y 45 días post emergencia"],
          ["Poroto · Arveja · Lenteja", "2–3 l/ha", "1 a 2 aplicaciones desde los 20–25 días post emergencia"],
          ["Papa", "2–4 l/ha", "Desde tuberización en adelante, según requerimiento"],
          ["Frutales y hortícolas"],
          ["Frutales en general", "3–5 l/ha", "4 aplic./año: brotación, prefloración, post cuaje y post cosecha"],
          ["Olivo", "3–5 l/ha", "4 aplic./año: inicio de floración, crecimiento de fruto y post cosecha"],
          ["Nogal (plantas jóvenes)", "350 ml/100 l agua", "3 aplicaciones c/15 días en etapas de máximo crecimiento"],
          ["Nogal (adultas)", "3–5 l/ha", "Yema hinchada, formación de racimos y/o correctivas"],
          ["Hortalizas en general", "300 ml/100 l agua", "4 aplic. c/7 días, desde la 1ª aplicación de defensivos"],
          ["Ajo · Cebolla", "300 ml/100 l agua", "4 aplic. c/7 días, desde la 1ª aplicación de defensivos"]
        ],
        pie: "Complemento, no sustituto, de la fertilización de base al suelo. Consulte a su ingeniero agrónomo."
      }],
      notas: [
        ["Preparación", "Orden de carga: 1 · agua, 2 · Starter Plus, 3 · agroquímicos + Natur'l Óleo. En fertirriego, diluir en no más del 50% del volumen final y aplicar en el último tercio del riego."],
        ["Importante", "Complementa, no reemplaza, la fertilización al suelo. Para mejor mojado, sumar un tensioactivo no iónico al 0,5–1%. No aplicar con calor extremo. No exceder las dosis. Probar compatibilidad antes de mezclar."]
      ],
      color: "#E8821E",
      imagen: "assets/img/productos/starter-plus.webp",
      documentos: [{ nombre: "Folleto Starter Plus", url: "docs/starter-plus.pdf" }],
      relacionados: ["naturl-oleo"],
      destacado: true
    },
    {
      id: "mastermins-plus",
      linea: "nutricion",
      nombre: "MASTERMINS PLUS",
      bajada: "Macro y micronutrientes",
      tipo: "Fertilizante líquido foliar",
      resumen: "Macro y micronutrientes de rápida absorción, con micros quelatados de baja interferencia en mezcla con plaguicidas.",
      descripcion: [
        "Mastermins Plus es un fertilizante líquido de aplicación foliar que aporta elevadas concentraciones de macro y micronutrientes de rápida absorción y asimilación: nueve nutrientes en una sola aplicación.",
        "Se absorbe rápidamente por hojas, tallos y raíces, y sus micronutrientes quelatados tienen baja interferencia en mezcla con plaguicidas."
      ],
      frase: "Entender lo que el cultivo pide y dárselo en una sola pasada.",
      composicion: [
        ["Nitrógeno (N)", "10%", "≈ 140 g/L"], ["Potasio (K)", "4,9%", "≈ 69 g/L · soluble"], ["Zinc (Zn)", "4%", "≈ 56 g/L"],
        ["Manganeso (Mn)", "2%", "≈ 28 g/L"], ["Fósforo (P)", "1,7%", "≈ 24 g/L · asimilable"], ["Magnesio (Mg)", "1%", "≈ 14 g/L"],
        ["Azufre (S)", "1%", "≈ 14 g/L"], ["Boro (B)", "0,5%", "≈ 7 g/L"], ["Molibdeno (Mo)", "0,05%", "≈ 0,7 g/L"]
      ],
      propiedades: [["Densidad", "1,4 g/ml"], ["pH", "1,8"], ["Aspecto", "Líquido marrón, no inflamable"], ["Envase", "Bidón 5 L"]],
      presentacion: "Bidón 5 L",
      dosis: "2–6 l/ha en extensivos",
      cultivos: ["Maíz", "Trigo", "Cebada", "Arroz", "Soja", "Maní", "Girasol", "Poroto", "Garbanzo", "Arveja", "Algodón", "Alfalfa", "Pasturas", "Papa",
                 "Cítricos", "Vid", "Pera", "Manzana", "Ciruela", "Cereza", "Durazno", "Damasco", "Olivo", "Ajo", "Cebolla", "Tomate", "Melón", "Sandía"],
      aplicacion: ["Foliar"],
      beneficios: [
        ["Equilibrio", "Nutrición completa y balance nutricional del cultivo."],
        ["Corrige", "Corrige deficiencias de micronutrientes."],
        ["Rápida absorción", "Absorción por hojas, tallos y raíces."],
        ["Quelatados", "Baja interferencia en mezcla con plaguicidas."],
        ["Hojas activas", "Hojas más verdes y activas."],
        ["Fotosíntesis", "Aumenta la eficiencia fotosintética."],
        ["Desarrollo", "Favorece el desarrollo vegetativo de las plantas."],
        ["Rendimiento", "Aumenta el rendimiento del cultivo."]
      ],
      comoActua: {
        titulo: "Micronutrientes quelatados.",
        texto: "El agente quelante, una molécula orgánica, rodea al ion metálico y lo protege de reacciones indeseadas en el caldo y en contacto con el suelo.",
        modo: "comparar",
        pasos: [
          ["Sin protección", "El ion libre forma compuestos insolubles en el caldo o en el suelo y la planta no lo aprovecha."],
          ["Quelatado · Mastermins Plus", "Llega protegido a la hoja: eficiencia de absorción cercana al 100% y baja interferencia con plaguicidas."]
        ]
      },
      guia: [{
        titulo: "Dosis por cultivo",
        columnas: ["Cultivo", "Dosis", "Momento de aplicación"],
        filas: [
          ["Extensivos y pasturas"],
          ["Maíz", "3–6 l/ha", "1 a 2 aplicaciones entre V3 y V6"],
          ["Trigo · Cebada", "2–4 l/ha", "1 a 2 aplicaciones desde macollaje"],
          ["Arroz", "3–6 l/ha", "1 a 2 aplicaciones desde macollaje"],
          ["Soja · Maní · Girasol", "3 l/ha", "1 a 2 aplic. durante el ciclo, según requerimiento"],
          ["Poroto · Garbanzo · Arveja", "3 l/ha", "1 a 2 aplic. durante el ciclo, según requerimiento"],
          ["Algodón", "3 l/ha", "2 a 3 aplic. desde estados vegetativos tempranos"],
          ["Alfalfa · Pasturas", "3 l/ha", "10 días después de cada corte"],
          ["Papa", "3 l/ha", "Cada 15 días durante el ciclo, según requerimiento"],
          ["Frutales y hortícolas"],
          ["Cítricos", "250–300 ml/100 l", "3 a 4 aplic./año, de brotación a fruto cuajado"],
          ["Vid (vinificar y mesa)", "250–300 ml/100 l", "3 a 4 aplicaciones al año"],
          ["Pera · Manzana", "250–300 ml/100 l", "3 aplicaciones al año"],
          ["Ciruela · Cereza", "150–200 ml/100 l", "3 aplicaciones al año"],
          ["Durazno · Damasco", "250–300 ml/100 l", "3 aplicaciones al año"],
          ["Olivo", "500 cm³/100 l · 5 l/ha", "Jóvenes: quincenal desde plantación · Adultas: 3 aplic./año"],
          ["Ajo · Cebolla", "300–350 ml/100 l", "Cada 15 días desde estados vegetativos tempranos"],
          ["Tomate", "400–500 ml/100 l", "Cada 7–10 días durante todo el ciclo"],
          ["Melón · Sandía", "300–400 ml/100 l", "Cada 7–10 días desde estados vegetativos tempranos"]
        ],
        pie: "Antes de mezclar con otros productos, hacer una prueba de compatibilidad física. Consulte a su ingeniero agrónomo."
      }],
      notas: [
        ["Orden de carga", "1 · Agua, 2 · Mastermins Plus, 3 · Agroquímicos + Natur'l Óleo."],
        ["Importante", "Complementa la fertilización al suelo. Hacer prueba de compatibilidad física antes de mezclar. No aplicar con calor extremo. No exceder las dosis."]
      ],
      color: "#E8821E",
      imagen: "assets/img/productos/mastermins-plus.webp",
      documentos: [{ nombre: "Folleto Mastermins Plus", url: "docs/mastermins-plus.pdf" }],
      relacionados: ["naturl-oleo"],
      destacado: true
    },
    {
      id: "nitrate-balancer",
      linea: "nutricion",
      nombre: "NITRATE BALANCER",
      bajada: "Balance fuente / sumidero",
      tipo: "Fertilizante líquido foliar",
      resumen: "Regula el crecimiento vegetativo y lleva los asimilados desde las hojas hacia tubérculos, frutos y órganos de reserva.",
      descripcion: [
        "Nitrate Balancer es un fertilizante líquido de aplicación foliar que regula la actividad hormonal y modula la relación fuente/sumidero.",
        "Frena por un tiempo el crecimiento vegetativo y facilita la máxima transferencia de azúcares desde las hojas hacia los órganos de reserva: tubérculos, frutos, yemas y madera."
      ],
      frase: "Lo que la hoja produce, que llegue a la cosecha.",
      composicion: [["Boro (B)", "8%", "acomplejado · p/v"], ["Molibdeno (Mo)", "0,03%", "acomplejado · p/v"]],
      propiedades: [["Complejante", "Aminas y ácidos carboxílicos"], ["pH", "7,5"], ["Densidad (20 °C)", "1,3 g/ml"], ["Solubilidad (20 °C)", "100%"]],
      presentacion: "",
      dosis: "1–6 l/ha según cultivo",
      cultivos: ["Papa", "Maní", "Maíz", "Cebolla", "Pera", "Manzana", "Vid", "Frutales", "Frutilla", "Palto",
                 "Almendro", "Arándano", "Avellano", "Cereza", "Ciruela", "Damasco", "Durazno", "Kiwi", "Nogal"],
      aplicacion: ["Foliar"],
      beneficios: [
        ["Llenado", "Estimula el llenado de tubérculos en la fase final del ciclo."],
        ["Calibre", "Mejora el tamaño de los tubérculos."],
        ["Rendimiento", "Más azúcares en el órgano que se cosecha, más kilos por hectárea."],
        ["Más reservas", "Aumenta las reservas de los frutales de hoja caduca antes del receso."],
        ["Lignificación", "Acelera la lignificación y frena el crecimiento vegetativo."],
        ["Yemas fértiles", "Mejora la fertilidad de las yemas futuras y favorece la brotación."]
      ],
      comoActua: {
        titulo: "De la hoja al órgano de reserva.",
        texto: "Las hojas son la fuente de azúcares; tubérculos, frutos, yemas y madera son los sumideros. Nitrate Balancer inclina ese balance hacia el sumidero que se cosecha.",
        modo: "comparar",
        pasos: [
          ["Sin balance", "La planta sigue armando hojas y tallos: los azúcares se quedan arriba y el órgano de reserva llena menos."],
          ["Con Nitrate Balancer", "Freno vegetativo temporario: los asimilados bajan al tubérculo, al fruto o a la madera."]
        ],
        nota: "Nutrientes acomplejados. Boro y molibdeno van rodeados por un agente complejante (aminas primarias y ácidos carboxílicos) que evita que formen compuestos insolubles en el caldo o en el suelo. Así la absorción se acerca al 100%."
      },
      guia: [{
        titulo: "Dosis por cultivo",
        columnas: ["Cultivo", "Dosis", "Momento de aplicación"],
        filas: [
          ["Extensivos y hortícolas"],
          ["Papa", "1,5–2 / 2–4 / 4–5 l/ha", "3 aplicaciones: tuberización plena / pleno llenado / 1 mes antes de madurez"],
          ["Papa · Bs. As. Sur", "2–4 / 2–4 / 4–5 l/ha", "3 aplicaciones: pleno llenado / 10 días después / 1 mes antes de madurez"],
          ["Maní", "1–2 l/ha", "En R5"],
          ["Maíz", "1,5 l/ha", "En R3"],
          ["Cebolla (Cuyo)", "5 l/ha", "30 días antes de cosecha"],
          ["Frutales"],
          ["Pera · Manzana", "6 l/ha", "Poscosecha"],
          ["Vid", "5 l/ha", "Poscosecha, con 5–10% de hojas amarillas"],
          ["Frutales de hoja caduca*", "4–6 l/ha", "Desde la 1ª quincena de abril, cuando baja la temperatura, se acorta el fotoperíodo y las hojas empiezan a amarillear. Repetir cada 15 días, hasta 3 aplicaciones"],
          ["Frutilla", "2–4 l/ha", "Para controlar el exceso de vigor; repetir cada 15 días si es necesario"],
          ["Palto", "4–5 l/ha", "En floración"]
        ],
        pie: "*Almendro, arándano, avellano europeo, cerezo, ciruelo, damasco, duraznero, kiwi, manzano, nectarín, nogal, peral, plantaciones nuevas y viveros, vid de mesa y vinífera."
      }],
      notas: [
        ["Compatibilidad", "Compatible con la mayoría de los agroquímicos de uso común. Hacer siempre una prueba de mezcla: el orden de carga depende de los productos, sus formulaciones y su pH."],
        ["Almacenamiento", "En su envase original, bien cerrado, en lugar fresco y seco. Evitar el contacto directo con el suelo y otros productos."],
        ["Metales pesados", "Arsénico 17,4 mg/kg · plomo, cadmio y mercurio < 0,5 mg/kg (límite analítico 0,5 mg/kg)."]
      ],
      color: "#E8821E",
      imagen: "assets/img/productos/nitrate-balancer.webp",
      documentos: [{ nombre: "Folleto Nitrate Balancer", url: "docs/nitrate-balancer.pdf" }],
      relacionados: ["harvest-more"],
      destacado: true
    },
    {
      id: "harvest-more",
      linea: "nutricion",
      nombre: "HARVEST MORE 5-5-45",
      bajada: "Llenado de frutos",
      tipo: "Fertilizante soluble en polvo",
      resumen: "Fertilizante en polvo 100% soluble, alto en potasio, que moviliza los azúcares hacia frutos y órganos de reserva.",
      descripcion: [
        "Harvest More 5-5-45 es un fertilizante concentrado en polvo 100% soluble en agua, para aplicación foliar, riego tecnificado o localizado al suelo.",
        "Está formulado para movilizar los azúcares de las hojas hacia los frutos y órganos de almacenamiento durante el crecimiento y el llenado, aumentando el rendimiento y la calidad."
      ],
      frase: "Lo que la hoja produce, el fruto lo cosecha.",
      composicion: [["Nitrógeno (N)", "5%", "Nitrógeno total, sin nitratos"], ["Fósforo (P₂O₅)", "5%", "2,1% de fósforo asimilable (P)"], ["Potasio (K₂O)", "45%", "37,5% de potasio soluble (K)"]],
      propiedades: [["Micronutrientes", "Zn 0,1% · Cu 0,05% · B 0,02% · Co 0,001%"], ["Trazas", "Mn y Mo"], ["Formulación", "Polvo soluble, azul"], ["Envase", "Bolsa 25 kg"]],
      presentacion: "Bolsa 25 kg",
      envase: "bolsa",
      dosis: "3–5 kg/ha",
      cultivos: ["Papa", "Ajo", "Vid", "Pera", "Manzana", "Cebolla", "Algodón", "Naranja", "Mandarina", "Frutales", "Olivo", "Hortalizas", "Pasturas", "Caña de azúcar"],
      aplicacion: ["Foliar", "Fertirriego", "Localizada al suelo"],
      beneficios: [
        ["Translocación", "Favorece el paso de los azúcares de las hojas a los frutos y órganos de reserva."],
        ["Llenado uniforme", "Estimula un llenado parejo de los frutos."],
        ["Calidad y calibre", "Mejora la calidad y aumenta el calibre de los frutos."],
        ["Rendimiento", "Aumenta el rendimiento del cultivo."],
        ["100% soluble", "Para pulverización foliar, riego tecnificado o aplicación localizada."],
        ["Sin nitratos", "Nitrógeno total sin nitratos, ideal para la etapa de maduración."]
      ],
      comoActua: {
        titulo: "De la hoja al fruto.",
        texto: "En crecimiento y llenado, el potasio de Harvest More impulsa el movimiento de los azúcares que produce la hoja hacia donde se arma la cosecha.",
        modo: "flujo",
        pasos: [
          ["Fuente · Hoja", "La fotosíntesis genera azúcares que deben salir de la hoja."],
          ["Transporte · Potasio 45% K₂O", "Favorece la translocación de los azúcares por la planta."],
          ["Destino · Fruto y reservas", "Llenado uniforme, más calibre y mejor calidad en frutos, bulbos y tubérculos."]
        ]
      },
      guia: [{
        titulo: "Dosis por cultivo",
        columnas: ["Cultivo", "Dosis", "Momento de aplicación"],
        filas: [
          ["Papa (Cuyo)", "5 kg/ha", "60 y 40 días antes de cosecha"],
          ["Vid", "5 kg/ha", "45 y 30 días antes de cosecha"],
          ["Cebolla (NOA · NEA)", "3 kg/ha", "Llenado de bulbo"],
          ["Cebolla (Cuyo)", "5 kg/ha", "30 días antes de cosecha"],
          ["Algodón", "3 kg/ha", "Inicio de llenado de las primeras bochas"],
          ["Pera · Manzana", "5 kg/ha", "45, 30 y 15 días antes de cosecha"],
          ["Naranja · Mandarina", "3 kg/ha", "Llenado de fruto (50% del tamaño final) / envero"],
          ["Ajo", "5 kg/ha", "60 y 30 días antes de cosecha"],
          ["Recomendación general"],
          ["Frutales", "5 kg/ha", "Pera, manzana, carozos, olivos y frutos secos"],
          ["Hortícolas", "3–5 kg/ha", "Según requerimiento del cultivo"],
          ["Cereales · oleaginosas · pasturas · caña", "0,5–3 kg/100 l", "Aplicación foliar"]
        ],
        pie: "Las dosis pueden variar según zona, suelo y cultivo. Consulte a su ingeniero agrónomo."
      }],
      notas: [
        ["Preparación", "Solución madre: mezclar la dosis con 50 l de agua, agitar e incorporar al tanque. La solubilidad aumenta con la temperatura del agua. En fertirriego, la CE de la solución del suelo no debe superar 2 dS/m."],
        ["Importante", "No dejar las bolsas abiertas: el producto toma humedad del aire. Complementa, no reemplaza, la fertilización al suelo. Usar con tensioactivo o junto con agroquímicos. No aplicar con temperatura o insolación elevadas."]
      ],
      color: "#E8821E",
      imagen: "",
      documentos: [{ nombre: "Folleto Harvest More 5-5-45", url: "docs/harvest-more.pdf" }],
      relacionados: ["nitrate-balancer"],
      destacado: true
    },

    /* ─────────── COADYUVANTES ─────────── */
    {
      id: "naturl-oleo",
      linea: "coadyuvantes",
      nombre: "NATUR'L ÓLEO",
      bajada: "Aceite vegetal de soja",
      tipo: "Coadyuvante · Insecticida / acaricida",
      resumen: "Mejora la emulsión, la cobertura y la adherencia del caldo, y reduce las pérdidas por evaporación y volatilización.",
      descripcion: [
        "Natur'l Óleo es un coadyuvante a base de aceite vegetal de soja. Mejora la emulsión del caldo, reduce las pérdidas por evaporación y volatilización y, al actuar sobre la tensión superficial de la gota, mejora la cobertura y el mojado aun en hojas con mucha pilosidad o cera.",
        "Funciona como adhesivo antievaporante para herbicidas, insecticidas, acaricidas y fungicidas. También está registrado como insecticida/acaricida."
      ],
      frase: "Lo que se aplica, se queda donde tiene que estar.",
      composicion: [["Aceite de soja", "93%", "85 g por cada 100 cm³ · p/p"], ["Dosis general", "0,5% v/v", "en todos los cultivos"]],
      tituloComposicion: "Composición y dosis",
      propiedades: [["Emulsionante", "c.s.p. 100 cm³"], ["Densidad", "0,916–0,922 g/cm³"], ["Clase · inflamabilidad", "IV · 3ª categoría"], ["Envase", "Bidón 20 L"]],
      presentacion: "Bidón 20 L",
      dosis: "0,5% v/v (dosis general)",
      cultivos: [],
      aplicacion: ["Pulverización"],
      beneficios: [
        ["Mejor emulsión", "Mejora la emulsión del caldo de aplicación."],
        ["Menos pérdidas", "Reduce las pérdidas de producto por evaporación y volatilización."],
        ["Mojado uniforme", "Mejor cobertura aun en hojas pilosas o cerosas."],
        ["Adherencia", "Mantiene el producto adherido más tiempo y favorece su penetración con lluvias o rocío."],
        ["Control de plagas", "Arañuela roja europea en manzano y cochinilla roja australiana en mandarina."],
        ["Biodegradable", "Base vegetal fácilmente biodegradable, sin halógenos orgánicos ni metales."]
      ],
      comoActua: {
        titulo: "La gota moja, se adhiere y penetra.",
        texto: "Al bajar la tensión superficial, la gota deja de rebotar o quedarse apoyada sobre pelos y ceras: se extiende sobre la hoja o el insecto, se evapora menos y el producto queda adherido más tiempo.",
        modo: "comparar",
        pasos: [
          ["Sin coadyuvante", "La gota queda apoyada sobre pelos y ceras, rebota o se evapora antes de actuar."],
          ["Con Natur'l Óleo", "Se forma una película continua que cubre, resiste lluvia y rocío y favorece la penetración."]
        ],
        nota: "Adhesivo antievaporante para herbicidas, insecticidas, acaricidas y fungicidas."
      },
      guia: [{
        titulo: "Dosis como coadyuvante",
        columnas: ["Plaguicida", "Natur'l Óleo", "Observación"],
        filas: [
          ["Glifosato (líquido)", "0,5 l/ha", "Cada 3 l de glifosato"],
          ["Glifosato (sólido) FG, WG, SL", "0,5–0,75 l/ha", "Cada 1,5 kg de glifosato"],
          ["Atrazina", "0,8–1,2 l/ha", "Para 2 y 4 l de atrazina, respectivamente"],
          ["Paraquat", "0,3–0,5 l/ha", "—"],
          ["Graminicidas (haloxifop, cletodim, etc.)", "0,5–1 l/ha", "—"],
          ["Acetoclor", "0,5 l/ha", "—"],
          ["Cipermetrina", "0,25 l/ha", "—"],
          ["Insecticidas (inhibidores de quitina)", "0,25–0,5 l/ha", "—"],
          ["Fungicidas", "0,5–1,5 l/ha", "—"]
        ],
        pie: "Dosis general: 0,5% v/v."
      }, {
        titulo: "Dosis como insecticida / acaricida",
        columnas: ["Cultivo", "Plaga", "Dosis", "Carencia"],
        colDosis: 2,                  // columna que se destaca como dosis (por defecto, la segunda)
        filas: [
          ["Manzano", "Arañuela roja europea (Panonychus ulmi)", "0,5–1 l / 100 l de agua", "No tiene"],
          ["Mandarina", "Cochinilla roja australiana (Aonidiella aurantii)", "0,5–1 l / 100 l de agua", "No tiene"]
        ],
        pie: "Caldo: 7–8 l por planta con pistola, según edad y tamaño, o 5–10 l por planta con turboatomizador, hasta punto de goteo. Cochinillas: comenzar con las formas jóvenes (fines de septiembre a principios de noviembre), antes de prefloración o después de la caída de pétalos, con 1 o 2 aplicaciones separadas 20 días. Al eliminar las cochinillas desaparecen también la fumagina y las hormigas."
      }],
      notas: [
        ["Con plaguicida líquido", ["Hacer una premezcla de Natur'l Óleo (0,3–0,5%) con el plaguicida y mezclar bien.", "Llenar el tanque del pulverizador con agua.", "Agregar la premezcla con el agitador en marcha.", "Mantener la agitación durante toda la pulverización."]],
        ["Con polvo mojable", ["Disolver el plaguicida en el agua justa para formar una pasta.", "Agregar la dosis de Natur'l Óleo y agitar bien.", "Volcar la mezcla al tanque con el agitador en marcha.", "Mantener la agitación durante toda la pulverización."]],
        ["No mezclar con azufre", "La mezcla daña gravemente el tejido vegetal y provoca caída de hojas, flores y frutos. Solo puede combinarse durante la dormancia, con 1 mes de intervalo entre ambos productos.", "alerta"],
        ["Al aplicar", "Nunca durante la floración. En horas frescas, mejor en días nublados. Sin viento fuerte ni contra el viento. Mantener el envase bien cerrado: el agua afecta la calidad."],
        ["Tiempo de carencia", "No posee. Usado como adhesivo, respetar la carencia del plaguicida que acompaña."]
      ],
      color: "#E8821E",
      imagen: "assets/img/productos/naturl-oleo.webp",
      documentos: [{ nombre: "Folleto Natur'l Óleo", url: "docs/naturl-oleo.pdf" }],
      relacionados: ["starter-plus", "mastermins-plus"],
      destacado: true
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
