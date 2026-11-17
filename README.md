# Del carbón a la universidad

Una historia familiar de transformación económica en Colombia (1930–1970). Proyecto final de Historia Económica de Colombia, Mariana Nader.

Página publicada: https://mariananaderg-collab.github.io/proyecto-HEC/

## Pitch

**Una oración.** Reconstruyo cómo una rama de mi familia pasó de la tierra y el carbón del suroeste antioqueño a la vida urbana de Medellín y a la universidad, y la comparo con otra rama comerciante de Cúcuta, para entender cómo la industrialización, la urbanización y la expansión educativa de Colombia entre 1930 y 1970 se vivieron de forma desigual dentro de una misma familia.

**Un párrafo.** Ver `METODOLOGIA_Y_FUENTES.md`, sección 13.

## Estructura

```
index.html                 Página (contenido)
estilos.css                Estilos
js/app.js                  Mapa, gráficas, filtros e interacción
datos/*.csv                Datos crudos con su fuente
datos/fuentes.csv          Referencias completas de cada fuente
datos/diccionario_variables.csv
datos/indicadores_*.csv    Indicadores calculados (generados)
datos/datos.js             Datos para la página (generado)
scripts/procesar_datos.py  Cálculo reproducible de los indicadores
METODOLOGIA_Y_FUENTES.md   Pregunta, fuentes, métodos, limitaciones y correcciones
```

## Ver la página localmente

Abra `index.html` en el navegador o sirva la carpeta:

```bash
python3 -m http.server 8000
```

y visite http://localhost:8000. Para el mapa, las gráficas y las tipografías se necesita conexión a internet (Leaflet, Chart.js y Google Fonts se cargan desde CDN).

## Reproducir los resultados cuantitativos

Requiere Python 3 (solo biblioteca estándar).

```bash
python3 scripts/procesar_datos.py
```

El script lee los CSV de `datos/`, calcula índices, tasas anuales, porcentajes en cabecera y brechas de género, comprueba la consistencia de los datos y regenera `datos/indicadores_poblacion.csv`, `datos/indicadores_alfabetismo.csv` y `datos/datos.js`. Las gráficas y las cifras calculadas del texto se actualizan automáticamente.

## Publicación

El sitio es estático y funciona en GitHub Pages desde la raíz de la rama `main`. Todas las rutas son relativas.
