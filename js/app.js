/* =====================================================================
   Del carbón a la universidad · interacción, mapa, gráficas y archivo
   Los datos vienen de datos/datos.js (generado por scripts/procesar_datos.py)
   ===================================================================== */
(function () {
  "use strict";
  const D = window.DATOS_PROYECTO;

  const C = { bosque: "#284A40", terracota: "#A65F43", ocre: "#C49B58", ocreOsc: "#8A6A2F", tinta: "#252A27", oliva: "#5f655c", linea: "#ddd3c2" };
  const COLOR = { "Medellín": C.terracota, "Amagá": C.tinta, "Titiribí": C.bosque, "Cúcuta": C.ocre };
  const fmt = (n, d = 0) => n == null || n === "" ? "—" : Number(n).toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmt1 = n => fmt(n, 1);

  /* =====================================================================
     ARCHIVO FOTOGRÁFICO: datos de cada imagen para el visor y los créditos
     ===================================================================== */
  const FOTOS = {
    gloria: { src: "assets/archivo-familiar/03-gloria-retrato.jpeg", titulo: "Gloria", tipo: "Archivo familiar",
      desc: "Gloria, mi abuela, nacida en Medellín en 1947. Su historia familiar conecta Amagá y Titiribí con la transformación urbana de Medellín.",
      autor: "Desconocido", fecha: "Por confirmar", licencia: "Archivo familiar, publicada con autorización", fuente: "Familia de la autora" },
    miguel: { src: "assets/archivo-familiar/02-miguel-retrato.jpeg", titulo: "Miguel", tipo: "Archivo familiar",
      desc: "Miguel, mi abuelo, nacido en Cúcuta en 1943.", autor: "Desconocido", fecha: "Por confirmar",
      licencia: "Archivo familiar, publicada con autorización", fuente: "Familia de la autora" },
    padremiguel: { src: "assets/archivo-familiar/01-padre-de-miguel-nino.jpeg", titulo: "El padre de Miguel", tipo: "Archivo familiar",
      desc: "El padre de mi abuelo Miguel, retratado durante su infancia. Es mi bisabuelo por la rama de Cúcuta. No se presenta como prueba de que fuera el comerciante de telas.",
      autor: "Estudio fotográfico desconocido", fecha: "Por confirmar", licencia: "Archivo familiar, publicada con autorización", fuente: "Familia de la autora" },
    nieta: { src: "assets/archivo-familiar/04-miguel-gloria-nieta.jpeg", titulo: "Miguel y Gloria con una de sus nietas", tipo: "Archivo familiar",
      desc: "Miguel y Gloria con una de sus nietas.", autor: "Desconocido", fecha: "Por confirmar",
      licencia: "Archivo familiar, publicada con autorización", fuente: "Familia de la autora" }
  };
  const COMMONS = {
    "assets/lugares/estacion-medellin-1920.jpg": "portada",
    "assets/lugares/amaga-desde-angelopolis-2020.jpg": "amaga",
    "assets/lugares/titiribi-panoramica-2010.jpg": "titiribi",
    "assets/lugares/locomotora-ferrocarril-antioquia-1936.jpg": "locomotora",
    "assets/lugares/fabricato-bello-1920.jpg": "fabricato",
    "assets/lugares/plano-medellin-1932.jpg": "plano",
    "assets/lugares/carrera-junin-1923.jpg": "junin",
    "assets/lugares/feria-ganado-medellin-1920.jpg": "feria",
    "assets/lugares/bus-cucuta-1920.jpg": "bus",
    "assets/lugares/universidad-antioquia-1928.jpg": "udea"
  };
  (D && D.creditosFotos || []).forEach(r => {
    const k = COMMONS[r.archivo]; if (!k) return;
    FOTOS[k] = { src: r.archivo, titulo: r.descripcion, tipo: r.tipo === "actual" ? "Fotografía actual" : "Fotografía histórica regional",
      desc: r.descripcion, autor: r.autor, fecha: r.fecha, licencia: r.licencia, fuente: r.pagina_commons, procedencia: r.procedencia };
  });

  // Visor (galería ampliable)
  const visor = document.getElementById("visor");
  if (visor) {
    const img = document.getElementById("visor-img"), info = document.getElementById("visor-info");
    const enlace = u => u && u.startsWith("http") ? `<a href="${u}" target="_blank" rel="noopener">${u.replace(/^https?:\/\//, "").slice(0, 60)}…</a>` : (u || "—");
    let origen = null;
    document.querySelectorAll("[data-foto]").forEach(b => b.addEventListener("click", () => {
      const f = FOTOS[b.dataset.foto]; if (!f) return;
      origen = b;
      img.src = f.src; img.alt = b.querySelector("img") ? b.querySelector("img").alt : f.titulo;
      info.innerHTML = `<span class="etiqueta-archivo ${f.tipo.includes("actual") ? "actual" : f.tipo.includes("regional") ? "regional" : ""}">${f.tipo}</span>
        <h4>${f.titulo}</h4><p>${f.desc}</p>
        <dl><dt>Autor</dt><dd>${f.autor || "—"}</dd><dt>Fecha</dt><dd>${f.fecha || "—"}</dd>
        <dt>Licencia</dt><dd>${f.licencia}</dd><dt>Fuente</dt><dd>${enlace(f.fuente)}</dd>
        ${f.procedencia ? `<dt>Procedencia original</dt><dd>${enlace(f.procedencia)}</dd>` : ""}</dl>`;
      if (typeof visor.showModal === "function") visor.showModal(); else visor.setAttribute("open", "");
    }));
    const cerrar = () => { visor.close ? visor.close() : visor.removeAttribute("open"); if (origen) origen.focus(); };
    document.getElementById("visor-cerrar").addEventListener("click", cerrar);
    visor.addEventListener("click", e => { if (e.target === visor) cerrar(); });
  }

  // Tabla de créditos fotográficos
  const tc = document.querySelector("#tabla-creditos tbody");
  if (tc) {
    const filas = Object.values(FOTOS).map(f => `<tr><td>${f.titulo}</td><td>${f.tipo}</td><td>${f.autor || "—"} · ${f.fecha || "—"}</td><td>${f.licencia}</td><td>${f.fuente && f.fuente.startsWith("http") ? `<a href="${f.fuente}">Wikimedia Commons</a>` : f.fuente}</td></tr>`);
    tc.innerHTML = filas.join("");
  }

  if (!D) { console.error("No se encontró datos/datos.js"); return; }

  /* ---------- Cifras calculadas dentro del texto ---------- */
  const K = D.claves;
  const valores = {
    medellin_multiplo_1938_1973: fmt(K.medellin_multiplo_1938_1973, 1),
    medellin_aumento_1951_1964: fmt(K.medellin_aumento_1951_1964),
    amaga_crec_pct_1938_1973: fmt(K.amaga_crec_pct_1938_1973),
    titiribi_perdida_1964_1973: fmt(Math.abs(K.titiribi_cambio_1964_1973)),
    ajuste_1964: fmt1(K.efecto_ajuste_medellin_pct["1964"]),
    ajuste_1973: fmt1(K.efecto_ajuste_medellin_pct["1973"]),
    importaciones_caida_pct_1928_1932: fmt(Math.abs(K.importaciones_caida_pct_1928_1932)),
    exportaciones_caida_pct_1928_1933: fmt(Math.abs(K.exportaciones_caida_pct_1928_1933)),
    brecha_dnp_1951: fmt1(K.brecha_dnp_nacional["1951"]),
    brecha_dnp_1964: fmt1(K.brecha_dnp_nacional["1964"]),
    presupuesto_rural: fmt1(K.presupuesto_rural_promedio_1932_1936),
    empresas_antioquia_1931_1945_pct: fmt(K.empresas_antioquia_1931_1945_pct),
    empresas_ant: fmt(K.empresas_total["Antioquia"]),
    empresas_nds: fmt(K.empresas_total["Norte de Santander"])
  };
  document.querySelectorAll("[data-clave]").forEach(el => { el.textContent = valores[el.dataset.clave] ?? "—"; });

  const tabla = (id, cab, filas, num = []) => {
    const c = document.getElementById(id); if (!c) return;
    c.innerHTML = `<table><thead><tr>${cab.map((h, i) => `<th scope="col"${num.includes(i) ? ' class="num"' : ""}>${h}</th>`).join("")}</tr></thead><tbody>${
      filas.map(f => "<tr>" + f.map((v, i) => `<td${num.includes(i) ? ' class="num"' : ""}>${v}</td>`).join("") + "</tr>").join("")}</tbody></table>`;
  };
  const grupo = (sel, fn) => {
    const bs = [...document.querySelectorAll(sel)];
    bs.forEach(b => b.addEventListener("click", () => { bs.forEach(x => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); fn(b); }));
  };

  /* =====================================================================
     MAPA
     ===================================================================== */
  const LUGARES = [
    { nombre: "Titiribí", coords: [6.0636, -75.7928], texto: "Pueblo minero del siglo XIX (mina El Zancudo) y municipio rural. Su población casi no cambió entre 1938 y 1964 y luego cayó.", familia: "Uno de los lugares de origen de la rama antioqueña: tierras, agricultura y ganado." },
    { nombre: "Amagá", coords: [6.0397, -75.7031], texto: "Cuenca carbonífera del suroeste. El Ferrocarril de Amagá llegó al municipio en 1914.", familia: "Minería de carbón, «sobre todo en el municipio de Amagá», según mi mamá." },
    { nombre: "Medellín", coords: [6.2442, -75.5812], texto: "Primer centro industrial del país por empleo en 1945. Pasó del 22,8 % al 36,9 % de la población de Antioquia entre 1951 y 1973.", familia: "Gloria nació aquí en 1947 y creció en Laureles. Un antepasado trabajó en cargos públicos; los hijos hombres fueron a la universidad." }
  ];
  const CUCUTA = { nombre: "Cúcuta", coords: [7.8939, -72.5078], texto: "Plaza comercial de frontera, conectada con el exterior por Maracaibo. Los textiles estaban entre sus principales importaciones.", familia: "Miguel nació aquí en 1943. Un antepasado comerciaba telas hacia 1910–1920; siete hijos de esa rama fueron a la universidad." };
  const RELATO = [
    { t: "Cuatro lugares, dos ramas", x: "Tres municipios antioqueños a menos de 40 km en línea recta, separados por montañas: la finca, la mina y la ciudad. Cúcuta, la otra rama, aparece en la vista con Cúcuta." },
    { t: "Titiribí", lugar: "Titiribí", z: 12, x: "Tierras, agricultura y ganado. Mi mamá habla de «tierras feudales»: familias propietarias con trabajadores." },
    { t: "Amagá", lugar: "Amagá", z: 12, x: "El carbón, el recuerdo más fuerte. El combustible de los trenes y de las fábricas de vapor del valle de Aburrá." },
    { t: "El ferrocarril", centro: [6.12, -75.64], z: 11, x: "El Ferrocarril de Amagá empezó en 1909, llegó a Amagá en 1914 y se integró al de Antioquia en 1927. El trazado del mapa es aproximado." },
    { t: "Medellín", lugar: "Medellín", z: 12, x: "Gloria nació aquí en 1947, con la familia ya instalada. Entre 1951 y 1964 la ciudad sumaría más de 400.000 habitantes." },
    { t: "Cúcuta", lugar: "Cúcuta", z: 8, x: "Miguel nació aquí en 1943. La otra rama: comercio de telas en una ciudad de frontera." }
  ];
  (function () {
    if (typeof L === "undefined" || !document.getElementById("mapa")) return;
    const m = L.map("mapa", { scrollWheelZoom: false, zoomSnap: .5 }).setView([6.14, -75.68], 11);
    const at = "Teselas &copy; Esri &mdash; Esri, HERE, Garmin, USGS, NGA, EPA, NPS";
    const claro = L.layerGroup([
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", { attribution: at, maxZoom: 16 }),
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16 })]).addTo(m);
    const relieve = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", { attribution: at, maxZoom: 18 });
    const sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Teselas &copy; Esri &mdash; Maxar", maxZoom: 18 });

    const est = [["Medellín", [6.2470, -75.5700], "primer riel en 1911"], ["Envigado", [6.1710, -75.5870], ""], ["Itagüí", [6.1719, -75.6114], ""], ["La Estrella", [6.1576, -75.6430], ""],
      ["Caldas", [6.0911, -75.6357], "en servicio desde 1911"], ["Amagá", [6.0397, -75.7031], "1914"], ["Bolombolo", [5.9800, -75.8400], "1928"], ["La Pintada (Alejandro López)", [5.7470, -75.6060], "c. 1933"]];
    const fc = L.layerGroup([L.polyline([[6.2470, -75.5700], [6.2100, -75.5800], [6.1710, -75.5870], [6.1719, -75.6114], [6.1576, -75.6430], [6.0911, -75.6357], [6.0650, -75.6650], [6.0397, -75.7031], [6.0100, -75.7700], [5.9800, -75.8400], [5.8700, -75.7300], [5.7470, -75.6060]],
      { color: C.tinta, weight: 3, opacity: .7, dashArray: "2 7", lineCap: "round" }).bindTooltip("Ferrocarril de Amagá (trazado aproximado)", { sticky: true })]);
    est.forEach(([n, c, t]) => L.circleMarker(c, { radius: 4, color: C.tinta, weight: 1.5, fillColor: "#FFFCF6", fillOpacity: 1 }).bindTooltip(n + (t ? " · " + t : ""), { direction: "top" }).addTo(fc));
    fc.addTo(m);
    const carbon = L.circle([6.025, -75.715], { radius: 3500, color: C.tinta, weight: 1, dashArray: "4 4", fillColor: C.tinta, fillOpacity: .08 })
      .bindPopup("<h4>Zona carbonífera de Amagá</h4><p>Área aproximada de la cuenca del carbón. No señala una mina de la familia.</p>").addTo(m);

    let anio = 2;
    const pmax = Math.max(...D.poblacion["Medellín"].map(p => p.valor));
    const radio = v => 6 + 34 * Math.sqrt(v / pmax);
    const popup = l => {
      const f = D.indicadoresPoblacion.filter(r => r.municipio === l.nombre).map(r => `<div class="fila-mini"><span>${r.censo}</span><span>${fmt(r.poblacion)}${r.tipo_cifra === "ajustada" ? " ▲" : r.tipo_cifra === "censada_secundaria" ? " ○" : ""}${r.pct_cabecera !== "" ? " · " + fmt1(r.pct_cabecera) + " % cab." : ""}</span></div>`).join("");
      return `<h4>${l.nombre}</h4><p>${l.texto}</p>${f}<p style="font-size:11px;color:#5f655c;margin-top:.3rem">▲ ajustada · ○ fuente secundaria</p><p><strong>La familia:</strong> ${l.familia}</p>`;
    };
    const marcas = {};
    LUGARES.forEach(l => {
      marcas[l.nombre] = L.circleMarker(l.coords, { radius: 10, color: "#FFFCF6", weight: 3, fillColor: COLOR[l.nombre], fillOpacity: .9 }).addTo(m)
        .bindPopup(popup(l), { maxWidth: 300, autoPanPaddingTopLeft: [20, 20] }).bindTooltip(l.nombre, { permanent: true, direction: "right", offset: [14, 0] });
    });
    const act = () => LUGARES.forEach(l => { const p = D.poblacion[l.nombre][anio]; marcas[l.nombre].setRadius(radio(p.valor)); marcas[l.nombre].setTooltipContent(`${l.nombre} · ${fmt(p.valor)} (${p.censo})`); });
    act();
    grupo("[data-i]", b => { anio = +b.dataset.i; act(); });

    marcas["Cúcuta"] = L.marker(CUCUTA.coords, { title: "Cúcuta", icon: L.divIcon({ className: "", html: `<div style="width:18px;height:18px;background:${C.ocre};border:3px solid #FFFCF6;box-shadow:0 0 0 1px ${C.ocreOsc}"></div>`, iconSize: [18, 18], iconAnchor: [9, 9] }) })
      .addTo(m).bindPopup(`<h4>Cúcuta</h4><p>${CUCUTA.texto}</p><p><strong>La familia:</strong> ${CUCUTA.familia}</p>`, { maxWidth: 300 })
      .bindTooltip("Cúcuta · rama de Miguel", { permanent: true, direction: "right", offset: [12, 0] });

    const pts = LUGARES.map(l => l.coords);
    const flecha = (a, b) => { const ang = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI; return L.marker([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], { interactive: false, keyboard: false, icon: L.divIcon({ className: "", html: `<div style="transform:rotate(${-ang}deg);color:${C.terracota};font-size:20px;line-height:1">➤</div>`, iconSize: [20, 20], iconAnchor: [10, 10] }) }); };
    const tray = L.layerGroup([L.polyline(pts, { color: C.terracota, weight: 3, dashArray: "8 8" }).bindTooltip("Recorrido recordado por la familia", { sticky: true }), ...pts.slice(1).map((p, i) => flecha(pts[i], p))]).addTo(m);

    L.control.layers({ "Mapa claro": claro, "Relieve": relieve, "Satélite": sat }, { "Recorrido familiar": tray, "Ferrocarril de Amagá (aprox.)": fc, "Zona carbonífera (aprox.)": carbon }, { collapsed: true }).addTo(m);
    L.control.scale({ imperial: false }).addTo(m);
    const ley = L.control({ position: "bottomleft" });
    ley.onAdd = () => { const d = L.DomUtil.create("div", "leyenda-mapa"); d.innerHTML = `<i style="border-color:${C.terracota};border-top-style:dashed"></i>Recorrido familiar<br><i style="border-color:${C.tinta};border-top-style:dotted"></i>Ferrocarril (aprox.)<br><b style="background:${C.ocre}"></b>Rama de Cúcuta`; return d; };
    ley.addTo(m);
    m.fitBounds(pts, { padding: [70, 70] });

    const vA = () => m.flyToBounds(pts, { padding: [70, 70], duration: 1 });
    const vC = () => m.flyToBounds([...pts, CUCUTA.coords], { padding: [50, 50], duration: 1 });
    const marcar = v => document.querySelectorAll("[data-vista]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.vista === v)));
    document.querySelectorAll("[data-vista]").forEach(b => b.addEventListener("click", () => { marcar(b.dataset.vista); b.dataset.vista === "colombia" ? vC() : vA(); }));

    const panel = document.getElementById("relato"); let paso = 0;
    const mostrar = i => {
      paso = (i + RELATO.length) % RELATO.length; const r = RELATO[paso];
      panel.innerHTML = `<span class="paso">${String(paso + 1).padStart(2, "0")} / ${String(RELATO.length).padStart(2, "0")}</span><h4>${r.t}</h4><p>${r.x}</p><div class="botones"><button type="button" data-d="-1">← Anterior</button><button type="button" data-d="1">Siguiente →</button></div>`;
      panel.querySelectorAll("button").forEach(b => b.addEventListener("click", () => mostrar(paso + +b.dataset.d)));
      m.closePopup();
      if (r.lugar) {
        marcar(r.lugar === "Cúcuta" ? "colombia" : "antioquia");
        const dest = r.lugar === "Cúcuta" ? CUCUTA.coords : LUGARES.find(l => l.nombre === r.lugar).coords;
        m.once("moveend", () => marcas[r.lugar].openPopup()); m.flyTo(dest, r.z, { duration: 1.1 });
      } else if (r.centro) { marcar("antioquia"); m.flyTo(r.centro, r.z, { duration: 1.1 }); }
      else { marcar("antioquia"); vA(); }
    };
    mostrar(0);
  })();

  /* =====================================================================
     GRÁFICAS
     ===================================================================== */
  const tablaPoblacion = () => tabla("tabla-poblacion", ["Municipio", "Censo", "Población", "Tipo de cifra", "Índice 1938 = 100", "Tasa anual (%)", "% en cabecera"],
    D.indicadoresPoblacion.map(r => [r.municipio, r.censo, fmt(r.poblacion), { censada: "Censada", censada_secundaria: "Censada (fuente secundaria)", ajustada: "Ajustada por cobertura" }[r.tipo_cifra], fmt1(r.indice_1938_100), r.tasa_anual_pct === "" ? "—" : fmt(r.tasa_anual_pct, 2), r.pct_cabecera === "" ? "—" : fmt1(r.pct_cabecera)]), [2, 4, 5, 6]);
  tablaPoblacion();
  tabla("tabla-urbano", ["Municipio", "Censo", "% en cabecera"], D.indicadoresPoblacion.filter(r => r.pct_cabecera !== "").map(r => [r.municipio, r.censo, fmt1(r.pct_cabecera)]), [2]);
  tabla("tabla-macro", ["Año", "PIB (%)", "Inflación (%)", "Exportaciones", "Importaciones", "Reservas"], D.macro.map(r => [r.anio, fmt1(r.pib_crecimiento_pct), fmt1(r.inflacion_pct), fmt1(r.exportaciones_musd), fmt1(r.importaciones_musd), fmt1(r.reservas_musd)]), [1, 2, 3, 4, 5]);
  tabla("tabla-presupuesto", ["Año", "Rural (%)", "Urbano (%)"], D.presupuestoEducacionAntioquia.map(r => [r.anio, fmt(r.rural_pct, 2), fmt(r.urbano_pct, 2)]), [1, 2]);
  tabla("tabla-alfabetismo", ["Censo", "Zona", "Hombres (%)", "Mujeres (%)", "Brecha (pp)"], D.alfabetismoDNP.map(r => [r.censo, r.zona, fmt1(r.hombres_pct), fmt1(r.mujeres_pct), fmt1(r.brecha_pp)]), [2, 3, 4]);
  tabla("tabla-industria", ["Departamento", "Fundadas en", "Empresas en 1945", "% del departamento"], D.empresas1945.map(r => [r.departamento, r.periodo, fmt(r.empresas), fmt1(r.pct_del_departamento)]), [2, 3]);

  // Ramas familiares (pictograma)
  (function () {
    const c = document.getElementById("ramas"); if (!c) return;
    const fig = (t, u) => { const col = t === "h" ? C.bosque : t === "m" ? C.terracota : C.oliva;
      const cuerpo = t === "m" ? `<path d="M20 22 L8 46 H32 Z" fill="${col}"/>` : t === "h" ? `<rect x="11" y="22" width="18" height="24" rx="3" fill="${col}"/>` : `<rect x="11" y="22" width="18" height="24" rx="9" fill="${col}"/>`;
      const bir = u ? `<path d="M8 6 L20 1 L32 6 L20 11 Z" fill="${C.ocre}"/><rect x="18.5" y="8" width="3" height="5" fill="${C.ocre}"/>` : "";
      return `<svg viewBox="0 0 40 52" aria-hidden="true">${bir}<circle cx="20" cy="15" r="6" fill="${col}"/>${cuerpo}</svg>`; };
    const p = (t, u, r) => `<div class="persona" role="listitem">${fig(t, u)}<span>${r}</span></div>`;
    const F = D.familiaEducacion;
    c.innerHTML = `<div class="rama ant"><span class="lugar">Rama antioqueña · Medellín</span><h4>La casa de Gloria</h4>
      <div class="resumen">${F[0].universitarios} <small>de ${F[0].hijos} hijos universitarios</small></div>
      <div class="personas" role="list" aria-label="Dos hijos con universidad y dos hijas dedicadas al hogar">${p("h", 1, "Hijo")}${p("h", 1, "Hijo")}${p("m", 0, "Gloria")}${p("m", 0, "Hija")}</div>
      <p>Los dos hombres fueron a la universidad. Gloria y su hermana se dedicaron al hogar; el testimonio no habla de estudios universitarios para ellas, ni dice nada sobre el colegio.</p></div>
      <div class="rama cuc"><span class="lugar">Rama cucuteña · Cúcuta</span><h4>La familia de Miguel</h4>
      <div class="resumen">${F[1].universitarios} <small>de ${F[1].hijos} hijos universitarios</small></div>
      <div class="personas" role="list" aria-label="Siete hijos universitarios, hombres y mujeres">${Array.from({ length: 7 }, () => p("x", 1, "Universidad")).join("")}</div>
      <p>Todos fueron a la universidad, también las mujeres: hay contadoras y tres abogadas. El testimonio no dice cuántos eran hombres y cuántas mujeres, así que no los distingo.</p></div>
      <div class="leyenda-personas"><span><svg width="16" height="21" viewBox="0 0 40 52" aria-hidden="true">${fig("h", 0)}</svg>Hombre</span><span><svg width="16" height="21" viewBox="0 0 40 52" aria-hidden="true">${fig("m", 0)}</svg>Mujer</span><span><svg width="16" height="21" viewBox="0 0 40 52" aria-hidden="true">${fig("x", 0)}</svg>Sexo no especificado</span><span><svg width="16" height="21" viewBox="0 0 40 52" aria-hidden="true">${fig("x", 1)}</svg>Con birrete: estudios universitarios</span><span>Recuentos de los testimonios, no estadísticas regionales.</span></div>`;
  })();

  if (typeof Chart === "undefined") return;
  Chart.defaults.font.family = "'Source Sans 3', sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.color = C.oliva;
  Chart.defaults.borderColor = "rgba(37,42,39,.08)";
  const opciones = (x = {}) => Object.assign({ responsive: true, maintainAspectRatio: false, interaction: { mode: "index", intersect: false },
    plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 10, padding: 16 } } } }, x);
  const franja = (desde, hasta, texto) => ({ id: "f" + desde + hasta, beforeDatasetsDraw(ch) {
    const x = ch.scales.x, a = ch.chartArea, c = ch.ctx, et = ch.data.labels.map(String);
    const i0 = et.indexOf(String(desde)), i1 = et.indexOf(String(hasta)); if (i0 < 0 || i1 < 0) return;
    const x0 = x.getPixelForValue(i0), x1 = x.getPixelForValue(i1);
    c.save(); c.fillStyle = "rgba(196,155,88,.15)"; c.fillRect(x0, a.top, x1 - x0, a.bottom - a.top);
    c.fillStyle = C.ocreOsc; c.font = "500 11px 'IBM Plex Mono'"; c.fillText(texto, x0 + 6, a.top + 14); c.restore(); } });

  // 1. Macro
  (function () {
    const el = document.getElementById("graficaMacro"); if (!el) return;
    const M = D.macro;
    const V = {
      comercio: { y: "Millones de dólares", ds: [
        { label: "Exportaciones", data: M.map(r => r.exportaciones_musd), borderColor: C.bosque, backgroundColor: C.bosque, pointStyle: "circle" },
        { label: "Importaciones", data: M.map(r => r.importaciones_musd), borderColor: C.terracota, backgroundColor: C.terracota, pointStyle: "rect", borderDash: [6, 4] }] },
      pib: { y: "% anual", ds: [
        { type: "bar", label: "Crecimiento del PIB", data: M.map(r => r.pib_crecimiento_pct), backgroundColor: M.map(r => r.pib_crecimiento_pct < 0 ? C.terracota : C.bosque), pointStyle: "rect" },
        { type: "line", label: "Inflación", data: M.map(r => r.inflacion_pct), borderColor: C.ocre, backgroundColor: C.ocre, pointStyle: "circle" }] },
      reservas: { y: "Millones de dólares", ds: [{ label: "Reservas internacionales", data: M.map(r => r.reservas_musd), borderColor: C.tinta, backgroundColor: "rgba(37,42,39,.08)", fill: true }] }
    };
    const prep = v => V[v].ds.map(d => Object.assign({ type: "line", borderWidth: 2.5, pointRadius: 3, tension: .15 }, d));
    const g = new Chart(el, { type: "line", data: { labels: M.map(r => r.anio), datasets: prep("comercio") },
      options: opciones({ plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 10, padding: 16 } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmt1(c.parsed.y)}` } } },
        scales: { y: { title: { display: true, text: "Millones de dólares" } }, x: { grid: { display: false } } } }),
      plugins: [franja(1929, 1932, "Gran Depresión")] });
    grupo("#caja-macro [data-modo]", b => { g.data.datasets = prep(b.dataset.modo); g.options.scales.y.title.text = V[b.dataset.modo].y; g.update(); });
  })();

  // 2. Industria 1945
  (function () {
    const el = document.getElementById("graficaIndustria"); if (!el) return;
    const E = D.empresas1945, per = [...new Set(E.map(r => r.periodo))];
    let modo = "numero";
    const serie = dep => per.map(p => { const r = E.find(x => x.departamento === dep && x.periodo === p); return modo === "numero" ? r.empresas : r.pct_del_departamento; });
    const ds = () => [
      { label: "Antioquia", data: serie("Antioquia"), backgroundColor: C.terracota },
      { label: "Norte de Santander", data: serie("Norte de Santander"), backgroundColor: C.ocre }];
    const g = new Chart(el, { type: "bar", data: { labels: per, datasets: ds() },
      options: opciones({ plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${modo === "numero" ? fmt(c.parsed.y) + " empresas" : fmt1(c.parsed.y) + " %"}` } } },
        scales: { y: { title: { display: true, text: "Empresas existentes en 1945" } }, x: { grid: { display: false }, title: { display: true, text: "Periodo de fundación" } } } }),
      plugins: [{ id: "marca1930", beforeDatasetsDraw(ch) { const x = ch.scales.x, a = ch.chartArea, c = ch.ctx; const x0 = (x.getPixelForValue(4) + x.getPixelForValue(5)) / 2;
        c.save(); c.strokeStyle = C.ocreOsc; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x0, a.top); c.lineTo(x0, a.bottom); c.stroke(); c.fillStyle = C.ocreOsc; c.font = "500 11px 'IBM Plex Mono'"; c.fillText(ch.width < 500 ? "Desde 1931 →" : "Después de la crisis de 1929 →", x0 + 6, a.top + 14); c.restore(); } }] });
    grupo("#caja-industria [data-modo]", b => { modo = b.dataset.modo; g.data.datasets = ds(); g.options.scales.y.title.text = modo === "numero" ? "Empresas existentes en 1945" : "% de las empresas del departamento"; g.update(); });
  })();

  // 3. Población
  (function () {
    const el = document.getElementById("graficaPoblacion"); if (!el) return;
    const mun = ["Medellín", "Amagá", "Titiribí"]; let modo = "indice";
    const tipoTxt = { censada: "censada", censada_secundaria: "fuente secundaria", ajustada: "ajustada por cobertura" };
    const val = (s, v) => modo === "indice" ? +(v / s[0].valor * 100).toFixed(1) : v;
    const ds = () => {
      const r = mun.map(n => { const s = D.poblacion[n]; return { label: n, data: s.map(p => val(s, p.valor)), tipos: s.map(p => p.tipo), borderColor: COLOR[n], backgroundColor: COLOR[n],
        pointStyle: s.map(p => p.tipo === "ajustada" ? "triangle" : "circle"), pointBackgroundColor: s.map(p => p.tipo === "censada_secundaria" ? "#FFFCF6" : COLOR[n]), pointBorderColor: COLOR[n], pointBorderWidth: 2, pointRadius: 6, borderWidth: 3, tension: .15 }; });
      if (document.getElementById("verAjustada").checked) { const s = D.poblacion["Medellín"];
        r.push({ label: "Medellín, serie ajustada", data: s.map(p => p.ajustada ? val(s, p.ajustada) : null), tipos: s.map(() => "ajustada"), borderColor: C.terracota, backgroundColor: C.terracota, borderDash: [6, 5], borderWidth: 2, pointStyle: "triangle", pointRadius: 6 }); }
      return r; };
    const g = new Chart(el, { type: "line", data: { labels: D.censos, datasets: ds() },
      options: opciones({ plugins: { legend: { position: "bottom", labels: { usePointStyle: true, pointStyle: "line", padding: 16 } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmt(c.parsed.y, modo === "indice" ? 1 : 0)} (${tipoTxt[c.dataset.tipos[c.dataIndex]]})` } } },
        scales: { y: { title: { display: true, text: "Índice (1938 = 100)" }, ticks: { callback: v => fmt(v) } }, x: { grid: { display: false } } } }),
      plugins: [franja(1951, 1964, "Mayor crecimiento absoluto")] });
    const re = () => { g.data.datasets = ds(); g.options.scales.y.title.text = modo === "indice" ? "Índice (1938 = 100)" : "Habitantes"; g.update(); };
    grupo("#caja-poblacion [data-modo]", b => { modo = b.dataset.modo; re(); });
    document.getElementById("verAjustada").addEventListener("change", re);
  })();

  // 4. Cabecera
  (function () {
    const el = document.getElementById("graficaUrbana"); if (!el) return;
    const mun = ["Medellín", "Amagá", "Titiribí"], cs = [1964, 1973];
    const v = (m, c) => D.indicadoresPoblacion.find(r => r.municipio === m && r.censo === c).pct_cabecera;
    new Chart(el, { type: "bar", data: { labels: cs, datasets: mun.map(m => ({ label: m, data: cs.map(c => v(m, c)), backgroundColor: COLOR[m] })) },
      options: opciones({ plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmt1(c.parsed.y)} %` } } },
        scales: { y: { min: 0, max: 100, ticks: { callback: x => x + " %" } }, x: { grid: { display: false } } } }),
      plugins: [{ id: "et", afterDatasetsDraw(ch) { const c = ch.ctx; c.save(); c.font = "500 11px 'IBM Plex Mono'"; c.fillStyle = C.tinta; c.textAlign = "center";
        ch.data.datasets.forEach((d, i) => ch.getDatasetMeta(i).data.forEach((b, j) => c.fillText(fmt1(d.data[j]) + " %", b.x, b.y - 5))); c.restore(); } }] });
  })();

  // 5. Alfabetismo DNP
  (function () {
    const el = document.getElementById("graficaAlfabetismo"); if (!el) return;
    const A = D.alfabetismoDNP; let zona = "Total nacional";
    const f = () => A.filter(r => r.zona === zona);
    const ds = () => [
      { label: "Hombres", data: f().map(r => r.hombres_pct), backgroundColor: C.bosque },
      { label: "Mujeres", data: f().map(r => r.mujeres_pct), backgroundColor: C.terracota }];
    const g = new Chart(el, { type: "bar", data: { labels: f().map(r => r.censo), datasets: ds() },
      options: opciones({ plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmt1(c.parsed.y)} %`, footer: it => `Brecha: ${fmt1(f()[it[0].dataIndex].brecha_pp)} puntos` } } },
        scales: { y: { min: 0, max: 100, title: { display: true, text: "% que sabe leer y escribir" }, ticks: { callback: x => x + " %" } }, x: { grid: { display: false } } } }),
      plugins: [{ id: "brecha", afterDatasetsDraw(ch) { const c = ch.ctx; c.save(); c.font = "500 11px 'IBM Plex Mono'"; c.textAlign = "center";
        ch.data.datasets.forEach((d, i) => ch.getDatasetMeta(i).data.forEach((b, j) => { c.fillStyle = C.tinta; c.fillText(fmt1(d.data[j]) + " %", b.x, b.y - 6); }));
        const m0 = ch.getDatasetMeta(0).data, m1 = ch.getDatasetMeta(1).data;
        f().forEach((r, j) => { c.fillStyle = C.ocreOsc; c.fillText(`brecha ${fmt1(r.brecha_pp)} pp`, (m0[j].x + m1[j].x) / 2, ch.chartArea.top + 12); });
        c.restore(); } }] });
    grupo("#caja-alfabetismo [data-zona]", b => { zona = b.dataset.zona; g.data.datasets = ds(); g.update(); });
  })();

  // 6. Presupuesto educativo
  (function () {
    const el = document.getElementById("graficaPresupuesto"); if (!el) return;
    const P = D.presupuestoEducacionAntioquia;
    new Chart(el, { type: "bar", data: { labels: P.map(r => r.anio), datasets: [
      { label: "Zona rural", data: P.map(r => r.rural_pct), backgroundColor: C.bosque },
      { label: "Zona urbana", data: P.map(r => r.urbano_pct), backgroundColor: "#e4d5b4" }] },
      options: opciones({ indexAxis: "y", plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmt(c.parsed.x, 2)} %` } } },
        scales: { x: { stacked: true, min: 0, max: 100, ticks: { callback: x => x + " %" } }, y: { stacked: true, grid: { display: false } } } }),
      plugins: [{ id: "et", afterDatasetsDraw(ch) { const c = ch.ctx; c.save(); c.font = "500 11px 'IBM Plex Mono'"; c.textAlign = "center"; c.textBaseline = "middle";
        ch.getDatasetMeta(0).data.forEach((b, j) => { c.fillStyle = "#fff"; c.fillText(fmt1(P[j].rural_pct) + " %", (b.base + b.x) / 2, b.y); });
        ch.getDatasetMeta(1).data.forEach((b, j) => { c.fillStyle = C.tinta; c.fillText(fmt1(P[j].urbano_pct) + " %", (b.base + b.x) / 2, b.y); }); c.restore(); } }] });
  })();
})();

/* ---------- Navegación, progreso y aparición ---------- */
(function () {
  const barra = document.getElementById("progreso");
  const enlaces = [...document.querySelectorAll(".barra a.cap")];
  const secs = enlaces.map(a => document.querySelector(a.getAttribute("href")));
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    barra.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
    let act = -1; secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 120) act = i; });
    enlaces.forEach((a, i) => i === act ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"));
  }, { passive: true });
  const els = document.querySelectorAll(".revelar");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("visible")); return; }
  const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); o.unobserve(e.target); } }), { threshold: .05, rootMargin: "0px 0px -40px 0px" });
  els.forEach(e => o.observe(e));
})();
