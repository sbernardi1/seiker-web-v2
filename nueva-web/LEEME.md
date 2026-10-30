# Seiker: nueva web

Sitio estático (HTML, CSS y JavaScript, sin instalar nada). La estructura sigue la de una web corporativa del agro como corteva.com/ar: encabezado con megamenú, hero en carrusel, buscador de productos con filtros, una ficha para cada producto y un pie en columnas. Los colores y el logo son los de Seiker.

## Cómo verla

Abrí `index.html` con doble clic. Para publicarla, subí **todo el contenido de esta carpeta** a la raíz del hosting (Hostinger, FTP, etc.).

## Páginas

| Archivo | Qué es |
|---|---|
| `index.html` | Inicio |
| `productos.html` | Buscador de productos (filtros por línea, cultivo y aplicación) |
| `producto.html?id=...` | Ficha de cada producto (se arma sola desde el catálogo) |
| `fertilizantes.html` | Página de la línea de fertilizantes líquidos (NITROMIX) |
| `linea.html?id=...` | Página de las líneas sin página propia (Soluciones nutricionales, Coadyuvantes y las que se sumen) |
| `caudalimetros.html` | Página de la línea de caudalímetros, con el simulador "Cómo funciona" |
| `agronomia.html` | Notas técnicas y preguntas frecuentes |
| `quienes-somos.html` | Empresa |
| `contacto.html` | Formulario y datos de contacto |
| `privacidad.html` | Política de privacidad |

## Cargar o editar productos

Todo sale de **`assets/js/catalogo.js`**. Si agregás un producto ahí, aparece solo en:
el megamenú, el menú del celular, el buscador de productos, la página de su línea,
la tabla comparativa, el pie de página y la búsqueda (lupa).

1. Copiá un bloque `{ ... }` de un producto parecido.
2. Cambiá el `id` (sin espacios ni tildes): será su dirección, `producto.html?id=ese-id`.
3. Completá los campos. Si no tenés un dato, dejalo vacío (`""` o `[]`) y la ficha lo oculta.
4. Para usar una foto real, guardala en `assets/img/productos/` y escribí la ruta en `imagen`.
   Mientras no haya foto, se dibuja un envase con el nombre del producto.
5. Para sumar una línea nueva (por ejemplo, "Semillas"), agregá un bloque en `lineas`.

Campos de un producto:

| Campo | Ejemplo |
|---|---|
| `linea` | `"fertilizantes"` |
| `nombre`, `bajada`, `tipo` | `"NITROMIX NS"`, `"Nitrógeno + Azufre"`, `"Fertilizante líquido"` |
| `resumen` | Una o dos oraciones para la tarjeta |
| `descripcion` | Párrafos de la ficha: `["...", "..."]` |
| `composicion` | `[["N", "26%"], ["S", "8%"]]` |
| `dosis` | `"100 – 300 l/ha"` |
| `cultivos`, `aplicacion` | Alimentan los filtros del buscador |
| `beneficios` | Lista con tildes de la ficha |
| `color` | Color de la etiqueta del envase dibujado |
| `documentos` | `[{ nombre: "Folleto", url: "docs/folleto.pdf" }]`: los PDF van en la carpeta `docs/` |
| `destacado` | `true` lo muestra en el carrusel del inicio |

Campos opcionales para fichas completas (los usan Starter Plus, Mastermins Plus,
Nitrate Balancer, Harvest More y Natur'l Óleo; copiá uno de esos como modelo):

| Campo | Qué muestra |
|---|---|
| `beneficios` como pares | `[["Macollaje", "Favorece el macollaje..."]]`: grilla de beneficios con título |
| `frase` | Frase destacada en una franja verde |
| `composicion` con detalle | `[["Zinc (Zn)", "5%", "≈ 65 g/L"]]`: el tercer dato va en letra chica |
| `propiedades` | Densidad, pH, formulación, envase, etc. |
| `presentacion` | Envase, en los datos clave de la ficha |
| `envase` | `"bolsa"` dibuja una bolsa en lugar de un bidón (si no hay foto) |
| `comoActua` | Título, texto y 2 tarjetas (`modo: "comparar"`) o 3 pasos (`modo: "flujo"`) |
| `guia` | Tablas de dosis por cultivo. Una fila con un solo texto, como `["Frutales"]`, es un subtítulo |
| `notas` | Recuadros de preparación, importante, almacenamiento. Agregá `"alerta"` como tercer dato para marcarlo en rojo |
| `relacionados` | Ids de productos que se sugieren al final de la ficha |

Las fotos de producto con fondo transparente van en `assets/img/productos/`
(formato `.webp` o `.png`). Las fotos de cada línea, en `assets/img/lineas/`.

## Datos de la empresa

Teléfono, email, dirección, horario, WhatsApp y redes sociales se cambian en
**`assets/js/config.js`**. Los valores marcados `PENDIENTE` vienen de la web anterior
y hay que confirmarlos antes de publicar.

## Formulario de contacto

No hay servidor detrás. Al enviar, se abre el programa de correo del visitante con la
consulta ya escrita para `info@...`. Si más adelante querés que llegue sin pasar por el
correo del visitante, se puede conectar a un servicio de formularios.

## Después de cambiar algo

Si el hosting muestra la versión vieja, cambiá el número `?v=20261030` de los
`<script>` y del `<link>` de estilos en las páginas (por ejemplo, a la fecha del día).
