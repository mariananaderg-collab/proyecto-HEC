/* =====================================================================
   Del carbón a la universidad · interacción, mapa y gráficas
   Los datos vienen de datos/datos.js (generado por scripts/procesar_datos.py)
   ===================================================================== */
(function () {
  "use strict";
  const D = window.DATOS_PROYECTO;
  if (!D) { console.error("No se encontró datos/datos.js"); return; }

  const COLOR = { "Medellín": "#a4512b", "Amagá": "#33302d", "Titiribí": "#4f6b47", "Cúcuta": "#7a5a9a" };
  const C_HOMBRES = "#33302d", C_MUJERES = "#a4512b";
  const fmt = (n, dec = 0) => n == null ? "s. d." : Number(n).toLocaleString("es-CO", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const fmt1 = n => fmt(n, 1);

  /* ---------- Cifras calculadas dentro del texto ---------- */
  const K = D.claves;
  const valores = {
    medellin_multiplo_1938_1973: fmt(K.medellin_multiplo_1938_1973, 1),
    medellin_aumento_1951_1964: fmt(K.medellin_aumento_1951_1964),
    amaga_crec_pct_1938_1973: fmt(K.amaga_crec_pct_1938_1973),
    titiribi_cambio_pct_1938_1973: fmt1(K.titiribi_cambio_pct_1938_1973),
    titiribi_perdida_1964_1973: fmt(Math.abs(K.titiribi_cambio_1964_1973)),
    ajuste_1964: fmt1(K.efecto_ajuste_medellin_pct["1964"]),
    ajuste_1973: fmt1(K.efecto_ajuste_medellin_pct["1973"]),
    importaciones_caida_pct_1928_1932: fmt(Math.abs(K.importaciones_caida_pct_1928_1932)),
    exportaciones_caida_pct_1928_1933: fmt(Math.abs(K.exportaciones_caida_pct_1928_1933)),
    brecha_1964: fmt1(K.brecha_alfabetismo["1964"]),
    brecha_1973: fmt1(K.brecha_alfabetismo["1973"]),
    presupuesto_rural: fmt1(K.presupuesto_rural_promedio_1932_1936)
  };
  document.querySelectorAll("[data-clave]").forEach(el => {
    const v = valores[el.dataset.clave];
    el.textContent = v != null ? v : "s. d.";
  });

  /* ---------- Utilidades ---------- */
  function tabla(contenedorId, cabeceras, filas, numCols = []) {
    const c = document.getElementById(contenedorId);
    if (!c) return;
    const th = cabeceras.map((h, i) => `<th scope="col"${numCols.includes(i) ? ' class="num"' : ""}>${h}</th>`).join("");
    const tr = filas.map(f => "<tr>" + f.map((v, i) => `<td${numCols.includes(i) ? ' class="num"' : ""}>${v}</td>`).join("") + "</tr>").join("");
    c.innerHTML = `<table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
  }
  function grupoBotones(selector, alCambiar) {
    const bs = [...document.querySelectorAll(selector)];
    bs.forEach(b => b.addEventListener("click", () => {
      bs.forEach(x => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      alCambiar(b);
    }));
  }

  /* =====================================================================
     MAPA
     ===================================================================== */
  const LUGARES = [
    { nombre: "Titiribí", coords: [6.0636, -75.7928],
      texto: "Economía rural y minera; la mina de oro El Zancudo fue una de las grandes empresas antioqueñas del siglo XIX. Su población casi no creció entre 1938 y 1973.",
      familia: "Uno de los lugares de origen de los antepasados maternos: tierras, agricultura y ganado (testimonio)." },
    { nombre: "Amagá", coords: [6.0397, -75.7031],
      texto: "Cuenca carbonífera del suroeste. El Ferrocarril de Amagá llegó al municipio en 1914.",
      familia: "Minería de carbón «sobre todo en el municipio de Amagá» (testimonio). No sabemos si la familia era dueña, socia o trabajaba en una mina." },
    { nombre: "Medellín", coords: [6.2442, -75.5812],
      texto: "Centro industrial, comercial, administrativo y educativo de Antioquia. Concentraba el 22,8 % de la población del departamento en 1951 y el 36,9 % en 1973 (DANE).",
      familia: "Mi abuela nació aquí en 1947 y vivió en Laureles. Un antepasado trabajó en cargos públicos; los dos hijos hombres fueron a la universidad (testimonio)." }
  ];
  const CUCUTA = { nombre: "Cúcuta", coords: [7.8939, -72.5078],
    texto: "Plaza comercial de frontera. En el siglo XIX, dos tercios de las mercancías extranjeras que entraban a Santander llegaban por Cúcuta, vía Maracaibo, y los textiles estaban entre las principales (Arévalo Meneses).",
    familia: "Un antepasado fue comerciante de telas hacia 1910–1920 (fechas aproximadas). Siete hijos universitarios, incluidas mujeres (testimonio). No hay migración documentada entre esta rama y la antioqueña." };

  const RELATO = [
    { titulo: "Cuatro lugares, dos ramas", vista: "antioquia",
      texto: "Tres municipios antioqueños a menos de 40 km en línea recta, separados por montañas: la finca, la mina y la ciudad. La rama de Cúcuta aparece como contraste en la vista nacional." },
    { titulo: "Titiribí: la tierra", lugar: "Titiribí", zoom: 12,
      texto: "La familia recuerda tierras, agricultura y ganado. Mi mamá habla de «tierras feudales», una expresión de la memoria familiar, no una categoría jurídica." },
    { titulo: "Amagá: el carbón", lugar: "Amagá", zoom: 12,
      texto: "La minería de carbón es el recuerdo más fuerte. Según mi abuela, «la mina la dejaron». El carbón de la cuenca alimentaba ferrocarriles e industrias de Medellín." },
    { titulo: "El ferrocarril", centro: [6.12, -75.64], zoom: 11,
      texto: "El Ferrocarril de Amagá (obras desde 1909, en Amagá en 1914, incorporado al de Antioquia en 1927) unió la cuenca con Medellín. El trazado del mapa es aproximado." },
    { titulo: "Medellín: la ciudad", lugar: "Medellín", zoom: 12,
      texto: "La familia ya vivía en Medellín en 1947. Entre 1951 y 1964 la ciudad sumaría más de 400.000 habitantes: mi familia llegó antes de esa ola." },
    { titulo: "Cúcuta: el comercio", lugar: "Cúcuta", zoom: 8, vista: "colombia",
      texto: "La otra rama: un comerciante de telas en una ciudad de frontera conectada con el exterior por Maracaibo. El mapa no traza ninguna ruta entre las dos ramas." }
  ];

  (function mapa() {
    if (typeof L === "undefined" || !document.getElementById("mapa")) return;
    const mapa = L.map("mapa", { scrollWheelZoom: false, zoomSnap: .5 }).setView([6.14, -75.68], 11);
    const esriAttr = 'Teselas &copy; Esri &mdash; Esri, HERE, Garmin, USGS, NGA, EPA, NPS';
    const claro = L.layerGroup([
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", { attribution: esriAttr, maxZoom: 16 }),
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16 })
    ]).addTo(mapa);
    const relieve = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", { attribution: esriAttr, maxZoom: 18 });
    const satelite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Teselas &copy; Esri &mdash; Maxar, Earthstar Geographics", maxZoom: 18 });

    // Ferrocarril de Amagá: trazado APROXIMADO a partir de las estaciones descritas en las fuentes
    const estaciones = [
      ["Medellín", [6.2470, -75.5700], "Primer riel en 1911"], ["Envigado", [6.1710, -75.5870], ""], ["Itagüí", [6.1719, -75.6114], ""],
      ["La Estrella", [6.1576, -75.6430], ""], ["Caldas", [6.0911, -75.6357], "Servicio desde 1911"], ["Amagá", [6.0397, -75.7031], "Llega en 1914"],
      ["Bolombolo", [5.9800, -75.8400], "En servicio desde 1928"], ["La Pintada (estación Alejandro López)", [5.7470, -75.6060], "Hacia 1933; empalme con el Pacífico en 1942"]
    ];
    const ferrocarril = L.layerGroup([
      L.polyline([[6.2470, -75.5700], [6.2100, -75.5800], [6.1710, -75.5870], [6.1719, -75.6114], [6.1576, -75.6430], [6.0911, -75.6357],
                  [6.0650, -75.6650], [6.0397, -75.7031], [6.0100, -75.7700], [5.9800, -75.8400], [5.8700, -75.7300], [5.7470, -75.6060]],
        { color: "#33302d", weight: 3, opacity: .75, dashArray: "2 7", lineCap: "round" })
        .bindTooltip("Ferrocarril de Amagá (trazado aproximado)", { sticky: true })
    ]);
    estaciones.forEach(([n, c, nota]) => L.circleMarker(c, { radius: 4, color: "#33302d", weight: 1.5, fillColor: "#fffdf9", fillOpacity: 1 })
      .bindTooltip(`${n}${nota ? " · " + nota : ""}`, { direction: "top" }).addTo(ferrocarril));
    ferrocarril.addTo(mapa);

    const icono = txt => L.divIcon({ className: "", html: `<span role="img" aria-label="${txt}" style="font-size:18px">⛏️</span>`, iconSize: [20, 20] });
    const minas = L.layerGroup([
      L.marker([6.0830, -75.7700], { icon: icono("Mina El Zancudo"), title: "Mina El Zancudo (ubicación aproximada)" })
        .bindPopup("<h4>Mina El Zancudo</h4><p>Mina de oro y plata de Titiribí, una de las grandes empresas mineras antioqueñas del siglo XIX. <strong>Ubicación aproximada.</strong></p>"),
      L.marker([6.0250, -75.7150], { icon: icono("Cuenca carbonífera de Amagá"), title: "Cuenca carbonífera de Amagá (ubicación aproximada)" })
        .bindPopup("<h4>Cuenca carbonífera de Amagá</h4><p>Zona de minas de carbón del suroeste antioqueño. <strong>Ubicación aproximada</strong>; no corresponde a una mina de la familia.</p>")
    ]).addTo(mapa);

    let anio = 2;
    const pobMax = Math.max(...D.poblacion["Medellín"].map(p => p.valor));
    const radio = v => 6 + 34 * Math.sqrt(v / pobMax);
    const popup = l => {
      const filas = D.indicadoresPoblacion.filter(r => r.municipio === l.nombre).map(r => {
        const marca = r.tipo_cifra === "ajustada" ? " ▲" : r.tipo_cifra === "censada_secundaria" ? " ○" : "";
        const cab = r.pct_cabecera !== "" ? ` · ${fmt1(r.pct_cabecera)} % cab.` : "";
        return `<div class="fila-mini"><span>${r.censo}</span><span>${fmt(r.poblacion)} hab.${marca}${cab}</span></div>`;
      }).join("");
      return `<h4>${l.nombre}</h4><p>${l.texto}</p><div class="tabla-mini">${filas}</div>
        <p style="font-size:12px;color:#5b4f46;margin-top:.3rem">▲ ajustada por cobertura · ○ fuente secundaria</p>
        <p><strong>Mi familia:</strong> ${l.familia}</p>`;
    };
    const circulos = {};
    LUGARES.forEach(l => {
      circulos[l.nombre] = L.circleMarker(l.coords, { radius: 10, color: "#fffdf9", weight: 3, fillColor: COLOR[l.nombre], fillOpacity: .88 })
        .addTo(mapa).bindPopup(popup(l), { maxWidth: 310, autoPanPaddingTopLeft: [20, 20] })
        .bindTooltip(l.nombre, { permanent: true, direction: "right", offset: [14, 0] });
    });
    const actualizar = () => LUGARES.forEach(l => {
      const p = D.poblacion[l.nombre][anio];
      circulos[l.nombre].setRadius(radio(p.valor));
      circulos[l.nombre].setTooltipContent(`${l.nombre} · ${fmt(p.valor)} hab. (${p.censo})`);
    });
    actualizar();
    grupoBotones("[data-i]", b => { anio = +b.dataset.i; actualizar(); });

    // Cúcuta: marcador cuadrado, distinto de la ruta antioqueña
    const marcaCucuta = L.marker(CUCUTA.coords, { title: "Cúcuta", icon: L.divIcon({ className: "",
      html: '<div style="width:18px;height:18px;background:#7a5a9a;border:3px solid #fffdf9;box-shadow:0 0 0 1px #7a5a9a"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }) })
      .addTo(mapa).bindPopup(`<h4>Cúcuta</h4><p>${CUCUTA.texto}</p><p><strong>Mi familia:</strong> ${CUCUTA.familia}</p>`, { maxWidth: 310 })
      .bindTooltip("Cúcuta (rama comerciante)", { permanent: true, direction: "right", offset: [12, 0] });
    circulos["Cúcuta"] = marcaCucuta;

    // Trayectoria recordada (no exacta)
    const pts = LUGARES.map(l => l.coords);
    const flecha = (a, b) => {
      const ang = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI;
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      return L.marker(m, { interactive: false, keyboard: false, icon: L.divIcon({ className: "",
        html: `<div style="transform:rotate(${-ang}deg);color:#a4512b;font-size:22px;line-height:1">➤</div>`, iconSize: [22, 22], iconAnchor: [11, 11] }) });
    };
    const trayectoria = L.layerGroup([
      L.polyline(pts, { color: "#a4512b", weight: 3, dashArray: "8 8", opacity: .9 }).bindTooltip("Trayectoria familiar recordada (no exacta)", { sticky: true }),
      ...pts.slice(1).map((p, i) => flecha(pts[i], p))
    ]).addTo(mapa);

    L.control.layers({ "Mapa claro": claro, "Relieve": relieve, "Satélite": satelite },
      { "Trayectoria familiar (recordada)": trayectoria, "Ferrocarril de Amagá (aprox.)": ferrocarril, "Minas (aprox.)": minas },
      { collapsed: true }).addTo(mapa);
    L.control.scale({ imperial: false }).addTo(mapa);
    const leyenda = L.control({ position: "bottomleft" });
    leyenda.onAdd = () => {
      const d = L.DomUtil.create("div", "leyenda-mapa");
      d.innerHTML = '<i style="border-color:#a4512b;border-top-style:dashed"></i>Trayectoria recordada<br>' +
        '<i style="border-color:#33302d;border-top-style:dotted"></i>Ferrocarril (aprox.)<br>' +
        '<b style="background:#7a5a9a"></b>Rama de Cúcuta<br>⛏️ Minas (aprox.)';
      return d;
    };
    leyenda.addTo(mapa);

    const vistaAntioquia = () => mapa.flyToBounds(pts, { padding: [70, 70], duration: 1 });
    const vistaColombia = () => mapa.flyToBounds([...pts, CUCUTA.coords], { padding: [60, 60], duration: 1 });
    mapa.fitBounds(pts, { padding: [70, 70] });
    const marcarVista = v => document.querySelectorAll("[data-vista]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.vista === v)));
    document.querySelectorAll("[data-vista]").forEach(b => b.addEventListener("click", () => {
      marcarVista(b.dataset.vista);
      b.dataset.vista === "colombia" ? vistaColombia() : vistaAntioquia();
    }));

    const panel = document.getElementById("relato");
    let paso = 0;
    const mostrar = i => {
      paso = (i + RELATO.length) % RELATO.length;
      const r = RELATO[paso];
      panel.innerHTML = `<span class="paso-n">Paso ${paso + 1} de ${RELATO.length}</span><h4>${r.titulo}</h4><p>${r.texto}</p>
        <div class="botones"><button type="button" data-d="-1">← Anterior</button><button type="button" data-d="1">Siguiente →</button></div>`;
      panel.querySelectorAll("button").forEach(b => b.addEventListener("click", () => mostrar(paso + +b.dataset.d)));
      mapa.closePopup();
      if (r.lugar) {
        marcarVista(r.lugar === "Cúcuta" ? "colombia" : "antioquia");
        const destino = r.lugar === "Cúcuta" ? CUCUTA.coords : LUGARES.find(l => l.nombre === r.lugar).coords;
        mapa.once("moveend", () => circulos[r.lugar].openPopup());
        mapa.flyTo(destino, r.zoom, { duration: 1.1 });
      } else if (r.centro) {
        marcarVista("antioquia");
        mapa.flyTo(r.centro, r.zoom, { duration: 1.1 });
      } else {
        marcarVista(r.vista || "antioquia");
        r.vista === "colombia" ? vistaColombia() : vistaAntioquia();
      }
    };
    mostrar(0);
  })();

  /* =====================================================================
     GRÁFICAS
     ===================================================================== */
  if (typeof Chart === "undefined") return;
  Chart.defaults.font.family = "'Source Sans 3', sans-serif";
  Chart.defaults.font.size = 14;
  Chart.defaults.color = "#5b4f46";
  const base = (extra = {}) => Object.assign({
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { position: "bottom", labels: { usePointStyle: true } } }
  }, extra);

  // Franja para resaltar un intervalo en el eje x (por etiqueta)
  const franja = (desde, hasta, texto, color = "rgba(184,137,46,.14)") => ({
    id: "franja" + desde,
    beforeDatasetsDraw(chart) {
      const x = chart.scales.x, a = chart.chartArea, c = chart.ctx;
      const etiquetas = chart.data.labels.map(String);
      const i0 = etiquetas.indexOf(String(desde)), i1 = etiquetas.indexOf(String(hasta));
      if (i0 < 0) return;
      const paso = etiquetas.length > 1 ? (x.getPixelForValue(1) - x.getPixelForValue(0)) / 2 : 0;
      const x0 = x.getPixelForValue(i0) - (chart.config.type === "bar" ? paso : 0);
      const x1 = i1 < 0 ? a.right : x.getPixelForValue(i1) + (chart.config.type === "bar" ? paso : 0);
      c.save(); c.fillStyle = color; c.fillRect(x0, a.top, x1 - x0, a.bottom - a.top);
      c.fillStyle = "#6b4e0f"; c.font = "600 12px 'Source Sans 3'"; c.fillText(texto, x0 + 6, a.top + 14); c.restore();
    }
  });

  /* ---------- 1. Población ---------- */
  (function poblacion() {
    const el = document.getElementById("graficaPoblacion"); if (!el) return;
    const estilo = t => t === "ajustada" ? "triangle" : "circle";
    const relleno = (t, col) => t === "censada_secundaria" ? "#fffdf9" : col;
    const municipios = ["Medellín", "Amagá", "Titiribí"];
    let modo = "indice";
    const valor = (serie, p) => modo === "indice" ? +(p.valor / serie[0].valor * 100).toFixed(1) : p.valor;
    const conjuntos = () => {
      const ds = municipios.map(m => {
        const s = D.poblacion[m];
        return { label: m, data: s.map(p => valor(s, p)), borderColor: COLOR[m], backgroundColor: COLOR[m],
          pointStyle: s.map(p => estilo(p.tipo)), pointBackgroundColor: s.map(p => relleno(p.tipo, COLOR[m])),
          pointBorderColor: COLOR[m], pointBorderWidth: 2, pointRadius: 6, pointHoverRadius: 8, borderWidth: 3, tension: .15,
          tipos: s.map(p => p.tipo) };
      });
      if (document.getElementById("verAjustada").checked) {
        const s = D.poblacion["Medellín"];
        ds.push({ label: "Medellín (ajustada)", data: s.map(p => p.ajustada ? (modo === "indice" ? +(p.ajustada / s[0].valor * 100).toFixed(1) : p.ajustada) : null),
          borderColor: COLOR["Medellín"], backgroundColor: COLOR["Medellín"], borderDash: [6, 5], borderWidth: 2,
          pointStyle: "triangle", pointRadius: 6, spanGaps: false, tipos: s.map(() => "ajustada") });
      }
      return ds;
    };
    const etiquetaTipo = { censada: "censada", censada_secundaria: "censada, fuente secundaria", ajustada: "ajustada por cobertura" };
    const g = new Chart(el, {
      type: "line",
      data: { labels: D.censos, datasets: conjuntos() },
      options: base({
        plugins: {
          legend: { position: "bottom", labels: { usePointStyle: true, pointStyle: "line" } },
          tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmt(c.parsed.y, modo === "indice" ? 1 : 0)}${modo === "indice" ? "" : " hab."} (${etiquetaTipo[c.dataset.tipos[c.dataIndex]] || ""})` } }
        },
        scales: { y: { beginAtZero: modo !== "indice", title: { display: true, text: "Índice (1938 = 100)" }, ticks: { callback: v => fmt(v) } }, x: { grid: { display: false } } }
      }),
      plugins: [franja(1951, 1964, "1951–1964: mayor crecimiento absoluto de Medellín")]
    });
    const redibujar = () => {
      g.data.datasets = conjuntos();
      g.options.scales.y.title.text = modo === "indice" ? "Índice (1938 = 100)" : "Habitantes";
      g.options.scales.y.beginAtZero = modo !== "indice";
      g.update();
    };
    grupoBotones("#caja-poblacion [data-modo]", b => { modo = b.dataset.modo; redibujar(); });
    document.getElementById("verAjustada").addEventListener("change", redibujar);

    tabla("tabla-poblacion", ["Municipio", "Censo", "Población", "Tipo de cifra", "Índice 1938 = 100", "Tasa anual desde el censo anterior (%)", "% en cabecera"],
      D.indicadoresPoblacion.map(r => [r.municipio, r.censo, fmt(r.poblacion), etiquetaTipo[r.tipo_cifra], fmt1(r.indice_1938_100),
        r.tasa_anual_pct === "" ? "—" : fmt(r.tasa_anual_pct, 2), r.pct_cabecera === "" ? "—" : fmt1(r.pct_cabecera)]), [2, 4, 5, 6]);
  })();

  /* ---------- 2. Urbanización ---------- */
  (function urbana() {
    const el = document.getElementById("graficaUrbana"); if (!el) return;
    const censos = [1964, 1973], municipios = ["Medellín", "Amagá", "Titiribí"];
    const dato = (m, c) => D.indicadoresPoblacion.find(r => r.municipio === m && r.censo === c).pct_cabecera;
    const patrones = { "Medellín": undefined, "Amagá": undefined, "Titiribí": undefined };
    new Chart(el, {
      type: "bar",
      data: { labels: censos, datasets: municipios.map(m => ({ label: m, data: censos.map(c => dato(m, c)), backgroundColor: COLOR[m], borderRadius: 4, patron: patrones[m] })) },
      options: base({
        plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmt1(c.parsed.y)} % en cabecera` } } },
        scales: { y: { min: 0, max: 100, title: { display: true, text: "% en cabecera" }, ticks: { callback: v => v + " %" } }, x: { grid: { display: false } } }
      }),
      plugins: [{ id: "etiquetas", afterDatasetsDraw(ch) {
        const c = ch.ctx; c.save(); c.font = "600 12px 'Source Sans 3'"; c.fillStyle = "#2a231e"; c.textAlign = "center";
        ch.data.datasets.forEach((ds, i) => ch.getDatasetMeta(i).data.forEach((bar, j) => c.fillText(fmt1(ds.data[j]) + " %", bar.x, bar.y - 5)));
        c.restore(); } }]
    });
    tabla("tabla-urbano", ["Municipio", "Censo", "% en cabecera"],
      municipios.flatMap(m => censos.map(c => [m, c, fmt1(dato(m, c))])), [2]);
  })();

  /* ---------- 3. Macroeconomía (Ocampo, 2023) ---------- */
  (function macro() {
    const el = document.getElementById("graficaMacro"); if (!el) return;
    const M = D.macro, anios = M.map(r => r.anio);
    const vistas = {
      comercio: { tipo: "line", y: "Millones de dólares", ds: [
        { label: "Exportaciones", data: M.map(r => r.exportaciones_musd), borderColor: "#4f6b47", backgroundColor: "#4f6b47", pointStyle: "circle" },
        { label: "Importaciones", data: M.map(r => r.importaciones_musd), borderColor: "#a4512b", backgroundColor: "#a4512b", pointStyle: "rect", borderDash: [6, 4] }] },
      pib: { tipo: "bar", y: "Porcentaje anual", ds: [
        { type: "bar", label: "Crecimiento del PIB", data: M.map(r => r.pib_crecimiento_pct), backgroundColor: M.map(r => r.pib_crecimiento_pct < 0 ? "#a4512b" : "#33302d"), pointStyle: "rect" },
        { type: "line", label: "Inflación", data: M.map(r => r.inflacion_pct), borderColor: "#b8892e", backgroundColor: "#b8892e", borderWidth: 2.5, pointStyle: "circle", pointRadius: 3 }] },
      reservas: { tipo: "line", y: "Millones de dólares", ds: [
        { label: "Reservas internacionales brutas", data: M.map(r => r.reservas_musd), borderColor: "#33302d", backgroundColor: "rgba(51,48,45,.12)", fill: true, pointStyle: "circle" }] }
    };
    const preparar = v => vistas[v].ds.map(d => Object.assign({ borderWidth: 2.5, pointRadius: 3, tension: .15 }, d));
    const g = new Chart(el, {
      type: "line",
      data: { labels: anios, datasets: preparar("comercio") },
      options: base({
        plugins: { legend: { position: "bottom", labels: { usePointStyle: true } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmt1(c.parsed.y)}` } } },
        scales: { y: { title: { display: true, text: "Millones de dólares" }, ticks: { callback: v => fmt(v) } }, x: { grid: { display: false } } }
      }),
      plugins: [franja(1929, 1932, "Gran Depresión")]
    });
    grupoBotones("#caja-macro [data-modo]", b => {
      g.data.datasets = preparar(b.dataset.modo);
      g.options.scales.y.title.text = vistas[b.dataset.modo].y;
      g.update();
    });
    tabla("tabla-macro", ["Año", "PIB (%)", "Inflación (%)", "Exportaciones (MUSD)", "Importaciones (MUSD)", "Reservas (MUSD)"],
      M.map(r => [r.anio, fmt1(r.pib_crecimiento_pct), fmt1(r.inflacion_pct), fmt1(r.exportaciones_musd), fmt1(r.importaciones_musd), fmt1(r.reservas_musd)]), [1, 2, 3, 4, 5]);
  })();

  /* ---------- 4. Alfabetismo por sexo (Colombia) ---------- */
  (function educacion() {
    const el = document.getElementById("graficaEducacion"); if (!el) return;
    const A = D.alfabetismo;
    let modo = "periodo";
    const filas = () => modo === "periodo" ? A.filter(r => r.censo <= 1973) : A;
    const conjuntos = () => {
      const f = filas();
      if (modo === "brecha") return [{ type: "bar", label: "Brecha: hombres − mujeres (puntos porcentuales)", data: f.map(r => r.brecha_h_menos_m_pp),
        backgroundColor: f.map(r => r.brecha_h_menos_m_pp >= 0 ? "#33302d" : "#a4512b"), borderRadius: 4 }];
      return [
        { label: "Hombres", data: f.map(r => r.hombres_pct), borderColor: C_HOMBRES, backgroundColor: C_HOMBRES, pointStyle: "rect", pointRadius: 6, borderWidth: 3 },
        { label: "Mujeres", data: f.map(r => r.mujeres_pct), borderColor: C_MUJERES, backgroundColor: C_MUJERES, pointStyle: "circle", pointRadius: 6, borderWidth: 3, borderDash: [6, 4] }
      ];
    };
    const g = new Chart(el, {
      type: "line",
      data: { labels: filas().map(r => r.censo), datasets: conjuntos() },
      options: base({
        plugins: { legend: { position: "bottom", labels: { usePointStyle: true } },
          tooltip: { callbacks: { label: c => modo === "brecha" ? `Brecha: ${fmt1(c.parsed.y)} puntos` : `${c.dataset.label}: ${fmt1(c.parsed.y)} %` } } },
        scales: { y: { min: 60, max: 100, title: { display: true, text: "% que sabe leer y escribir" }, ticks: { callback: v => v + " %" } }, x: { grid: { display: false } } }
      }),
      plugins: [franja(1985, 2005, "Después del periodo estudiado", "rgba(91,79,70,.08)")]
    });
    grupoBotones("#caja-educacion [data-modo]", b => {
      modo = b.dataset.modo;
      g.config.type = modo === "brecha" ? "bar" : "line";
      g.data.labels = filas().map(r => r.censo);
      g.data.datasets = conjuntos();
      const y = g.options.scales.y;
      if (modo === "brecha") { y.min = -1; y.max = 5; y.title.text = "Puntos porcentuales"; y.ticks.callback = v => fmt1(v); }
      else { y.min = 60; y.max = 100; y.title.text = "% que sabe leer y escribir"; y.ticks.callback = v => v + " %"; }
      g.update();
    });
    tabla("tabla-educacion", ["Censo", "Hombres (%)", "Mujeres (%)", "Total (%)", "Brecha H − M (pp)"],
      A.map(r => [r.censo, fmt1(r.hombres_pct), fmt1(r.mujeres_pct), fmt1(r.total_pct), fmt1(r.brecha_h_menos_m_pp)]), [1, 2, 3, 4]);
  })();

  /* ---------- 5. Presupuesto de primaria en Antioquia ---------- */
  (function presupuesto() {
    const el = document.getElementById("graficaPresupuesto"); if (!el) return;
    const P = D.presupuestoEducacionAntioquia;
    new Chart(el, {
      type: "bar",
      data: { labels: P.map(r => r.anio), datasets: [
        { label: "Zona rural", data: P.map(r => r.rural_pct), backgroundColor: "#4f6b47" },
        { label: "Zona urbana", data: P.map(r => r.urbano_pct), backgroundColor: "#d9c7a6", borderColor: "#8a6620", borderWidth: 1 }] },
      options: base({
        indexAxis: "y",
        plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmt(c.parsed.x, 2)} %` } } },
        scales: { x: { stacked: true, min: 0, max: 100, ticks: { callback: v => v + " %" } }, y: { stacked: true, grid: { display: false } } }
      }),
      plugins: [{ id: "etq", afterDatasetsDraw(ch) {
        const c = ch.ctx; c.save(); c.font = "600 12px 'Source Sans 3'"; c.textAlign = "center"; c.textBaseline = "middle";
        ch.getDatasetMeta(0).data.forEach((bar, j) => { c.fillStyle = "#fff"; c.fillText(fmt1(P[j].rural_pct) + " %", (bar.base + bar.x) / 2, bar.y); });
        ch.getDatasetMeta(1).data.forEach((bar, j) => { c.fillStyle = "#2a231e"; c.fillText(fmt1(P[j].urbano_pct) + " %", (bar.base + bar.x) / 2, bar.y); });
        c.restore(); } }]
    });
    tabla("tabla-presupuesto", ["Año", "Rural (%)", "Urbano (%)"], P.map(r => [r.anio, fmt(r.rural_pct, 2), fmt(r.urbano_pct, 2)]), [1, 2]);
  })();

  /* ---------- 6. Pictograma familiar ---------- */
  (function pictograma() {
    const c = document.getElementById("pictograma"); if (!c) return;
    const figura = (tipo, estudio) => {
      const col = tipo === "h" ? C_HOMBRES : tipo === "m" ? C_MUJERES : "#7a5a9a";
      const cuerpo = tipo === "m" ? `<path d="M20 22 L8 46 H32 Z" fill="${col}"/>` : `<rect x="11" y="22" width="18" height="24" rx="4" fill="${col}"/>`;
      const birrete = estudio ? `<path d="M8 6 L20 1 L32 6 L20 11 Z" fill="#b8892e"/><rect x="18.5" y="8" width="3" height="5" fill="#b8892e"/>` : "";
      return `<svg viewBox="0 0 40 52" aria-hidden="true">${birrete}<circle cx="20" cy="15" r="6" fill="${col}"/>${cuerpo}</svg>`;
    };
    const persona = (tipo, estudio, rot) => `<div class="persona" role="listitem">${figura(tipo, estudio)}<span>${rot}</span></div>`;
    const ant = [persona("h", true, "Hijo · universidad"), persona("h", true, "Hijo · universidad"), persona("m", false, "Hija · hogar (mi abuela)"), persona("m", false, "Hija · hogar")].join("");
    const cuc = Array.from({ length: 7 }, () => persona("x", true, "Universidad")).join("");
    const fam = D.familiaEducacion;
    c.innerHTML = `
      <div class="rama-picto" style="border-top:4px solid #a4512b">
        <h4>Rama antioqueña</h4><div class="sub">${fam[0].universitarios} de ${fam[0].hijos} hijos universitarios</div>
        <div class="personas" role="list" aria-label="Cuatro hijos: dos hombres universitarios y dos mujeres dedicadas al hogar">${ant}</div>
        <p>${fam[0].nota}</p></div>
      <div class="rama-picto" style="border-top:4px solid #7a5a9a">
        <h4>Rama cucuteña</h4><div class="sub">${fam[1].universitarios} de ${fam[1].hijos} hijos universitarios</div>
        <div class="personas" role="list" aria-label="Siete hijos universitarios, hombres y mujeres en proporción desconocida">${cuc}</div>
        <p>${fam[1].nota}</p></div>`;
    const ley = document.createElement("div");
    ley.className = "leyenda-puntos"; ley.style.gridColumn = "1 / -1";
    ley.innerHTML = `<span><svg width="16" height="20" viewBox="0 0 40 52" aria-hidden="true">${figura("h", false)}</svg>Hombre</span>
      <span><svg width="16" height="20" viewBox="0 0 40 52" aria-hidden="true">${figura("m", false)}</svg>Mujer</span>
      <span><svg width="16" height="20" viewBox="0 0 40 52" aria-hidden="true">${figura("x", false)}</svg>Sexo no especificado en el testimonio</span>
      <span><svg width="16" height="20" viewBox="0 0 40 52" aria-hidden="true">${figura("x", true)}</svg>Con birrete: estudios universitarios</span>`;
    c.appendChild(ley);
  })();
})();

/* ---------- Línea de tiempo: filtros ---------- */
(function () {
  const bs = [...document.querySelectorAll("[data-filtro]")];
  const hitos = [...document.querySelectorAll("#lineaTiempo .hito")];
  bs.forEach(b => b.addEventListener("click", () => {
    bs.forEach(x => x.setAttribute("aria-pressed", "false"));
    b.setAttribute("aria-pressed", "true");
    const f = b.dataset.filtro;
    hitos.forEach(h => { h.hidden = f !== "todos" && !h.classList.contains(f); });
  }));
})();

/* ---------- Progreso, menú activo y aparición ---------- */
(function () {
  const barra = document.getElementById("progreso");
  const enlaces = [...document.querySelectorAll("nav a")];
  const secciones = enlaces.map(a => document.querySelector(a.getAttribute("href")));
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    barra.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
    let actual = -1;
    secciones.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 140) actual = i; });
    enlaces.forEach((a, i) => {
      const activo = i === actual;
      a.classList.toggle("activo", activo);
      if (activo) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }, { passive: true });
  if (!("IntersectionObserver" in window)) { document.querySelectorAll(".aparecer").forEach(e => e.classList.add("visible")); return; }
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
  }), { threshold: .02 });
  document.querySelectorAll(".aparecer").forEach(el => obs.observe(el));
})();
