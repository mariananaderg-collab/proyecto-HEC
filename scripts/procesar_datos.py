#!/usr/bin/env python3
"""Procesa los datos crudos de datos/ y produce los indicadores que usa la página.

Uso (desde la raíz del repositorio):
    python3 scripts/procesar_datos.py

Entradas (datos/):
    censos_poblacion.csv, participacion_medellin_antioquia.csv,
    alfabetismo_colombia_15mas.csv, alfabetismo_colombia_7mas_dnp.csv,
    macro_colombia_1925_1945.csv, empresas_industriales_1945.csv,
    industria_ciudades_1945.csv, empleo_textil_antioquia.csv,
    presupuesto_educacion_primaria_antioquia.csv, familia_educacion.csv,
    fuentes.csv

Salidas (datos/):
    indicadores_poblacion.csv  – índices, crecimiento y % en cabecera por municipio
    indicadores_alfabetismo.csv – brecha de género en alfabetismo
    datos.js                    – todos los datos y los indicadores para la página

Solo usa la biblioteca estándar de Python. Las cifras de la página se generan
a partir de este archivo: si se corrige un dato crudo, basta volver a correr el
script para que gráficas, tablas y textos calculados se actualicen.
"""
import csv
import json
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DATOS = RAIZ / "datos"
MUNICIPIOS = ["Medellín", "Amagá", "Titiribí"]
CENSOS = [1938, 1951, 1964, 1973]


def leer(nombre):
    with open(DATOS / nombre, encoding="utf-8") as f:
        return list(csv.DictReader(f))


def num(x):
    return None if x in ("", None) else float(x)


def anios_entre(f0, f1):
    """Años transcurridos entre dos fechas de censo (para tasas anuales exactas)."""
    d0, d1 = date.fromisoformat(f0), date.fromisoformat(f1)
    return (d1 - d0).days / 365.25


def main():
    censos = leer("censos_poblacion.csv")
    fechas = {int(r["censo"]): r["fecha_censo"] for r in censos}

    # --- Serie principal de población total por municipio -------------------
    # Regla: se usa la población censada (sin ajuste) cuando existe; si no,
    # la cifra ajustada por cobertura, y se marca el tipo de cada punto.
    serie = {}
    for m in MUNICIPIOS:
        filas = [r for r in censos if r["municipio"] == m]
        puntos = []
        for c in CENSOS:
            cens = [r for r in filas if int(r["censo"]) == c and r["variable"] == "poblacion_total"]
            ajus = [r for r in filas if int(r["censo"]) == c and r["variable"] == "poblacion_total_ajustada"]
            r = cens[0] if cens else (ajus[0] if ajus else None)
            puntos.append({
                "censo": c,
                "valor": int(r["valor"]) if r else None,
                "tipo": r["tipo_cifra"] if r else None,
                "fuente": r["fuente_id"] if r else None,
                "ajustada": int(ajus[0]["valor"]) if ajus else None,
            })
        serie[m] = puntos

    # --- Indicadores de población -------------------------------------------
    filas_ind = []
    for m in MUNICIPIOS:
        base = serie[m][0]["valor"]
        for i, p in enumerate(serie[m]):
            fila = {
                "municipio": m, "censo": p["censo"], "poblacion": p["valor"],
                "tipo_cifra": p["tipo"], "fuente_id": p["fuente"],
                "indice_1938_100": round(p["valor"] / base * 100, 1),
                "cambio_absoluto": "", "tasa_anual_pct": "", "anios_intervalo": "",
                "pct_cabecera": "",
            }
            if i > 0:
                q = serie[m][i - 1]
                t = anios_entre(fechas[q["censo"]], fechas[p["censo"]])
                fila["cambio_absoluto"] = p["valor"] - q["valor"]
                fila["tasa_anual_pct"] = round(((p["valor"] / q["valor"]) ** (1 / t) - 1) * 100, 2)
                fila["anios_intervalo"] = round(t, 2)
            cab = [r for r in censos if r["municipio"] == m and int(r["censo"]) == p["censo"]
                   and r["variable"] == "poblacion_cabecera_ajustada"]
            tot = [r for r in censos if r["municipio"] == m and int(r["censo"]) == p["censo"]
                   and r["variable"] == "poblacion_total_ajustada"]
            if cab and tot:
                # Numerador y denominador vienen de la MISMA fuente (ajustada)
                fila["pct_cabecera"] = round(int(cab[0]["valor"]) / int(tot[0]["valor"]) * 100, 1)
            filas_ind.append(fila)

    with open(DATOS / "indicadores_poblacion.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(filas_ind[0].keys()))
        w.writeheader()
        w.writerows(filas_ind)

    # Efecto del ajuste de cobertura en Medellín (ajustada / censada - 1)
    efecto_ajuste = {}
    for p in serie["Medellín"]:
        if p["ajustada"] and p["tipo"] == "censada":
            efecto_ajuste[p["censo"]] = round((p["ajustada"] / p["valor"] - 1) * 100, 1)

    # --- Alfabetismo -------------------------------------------------------
    alf = leer("alfabetismo_colombia_15mas.csv")
    filas_alf = []
    for r in alf:
        h, mu = float(r["hombres_pct"]), float(r["mujeres_pct"])
        filas_alf.append({"censo": int(r["censo"]), "hombres_pct": h, "mujeres_pct": mu,
                          "total_pct": float(r["total_pct"]),
                          "brecha_h_menos_m_pp": round(h - mu, 1),
                          "universo": r["universo"], "ambito": r["ambito"], "fuente_id": r["fuente_id"]})
    with open(DATOS / "indicadores_alfabetismo.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(filas_alf[0].keys()))
        w.writeheader()
        w.writerows(filas_alf)

    macro = [{k: (int(v) if k == "anio" else num(v)) for k, v in r.items() if k != "fuente_id"}
             for r in leer("macro_colombia_1925_1945.csv")]
    presu = [{k: (int(v) if k == "anio" else num(v)) for k, v in r.items() if k != "fuente_id"}
             for r in leer("presupuesto_educacion_primaria_antioquia.csv")]
    part = [{k: (int(v) if k == "censo" else num(v)) for k, v in r.items() if k != "fuente_id"}
            for r in leer("participacion_medellin_antioquia.csv")]
    familia = leer("familia_educacion.csv")

    # --- Alfabetismo 1951-1964 (DNP, población mayor de siete años) ---------
    alf_dnp = []
    for r in leer("alfabetismo_colombia_7mas_dnp.csv"):
        h, mu = float(r["hombres_pct"]), float(r["mujeres_pct"])
        alf_dnp.append({"censo": int(r["censo"]), "zona": r["zona"], "hombres_pct": h, "mujeres_pct": mu,
                        "brecha_pp": round(h - mu, 1)})

    # --- Industria 1945 --------------------------------------------------------
    empresas = [{"departamento": r["departamento"], "periodo": r["periodo_fundacion"], "orden": int(r["orden"]),
                 "empresas": int(r["empresas"])} for r in leer("empresas_industriales_1945.csv")]
    total_dep = {}
    for r in empresas:
        total_dep[r["departamento"]] = total_dep.get(r["departamento"], 0) + r["empresas"]
    for r in empresas:
        r["pct_del_departamento"] = round(r["empresas"] / total_dep[r["departamento"]] * 100, 1)
    ciudades = [{k: (v if k in ("ciudad", "fuente_id") else float(v)) for k, v in r.items() if k != "fuente_id"}
                for r in leer("industria_ciudades_1945.csv")]
    textil = [{"anio": int(r["anio"]), "pct": float(r["pct_empleo_textil_nacional_en_antioquia"])}
              for r in leer("empleo_textil_antioquia.csv")]
    fuentes = {r["fuente_id"]: r for r in leer("fuentes.csv")}

    # --- Cifras clave para el texto (se imprimen para revisión) ---------------
    def pob(m, c):
        return next(p["valor"] for p in serie[m] if p["censo"] == c)

    m1928 = next(r for r in macro if r["anio"] == 1928)
    m1932 = next(r for r in macro if r["anio"] == 1932)
    m1933 = next(r for r in macro if r["anio"] == 1933)
    claves = {
        "medellin_multiplo_1938_1973": round(pob("Medellín", 1973) / pob("Medellín", 1938), 2),
        "medellin_aumento_1951_1964": pob("Medellín", 1964) - pob("Medellín", 1951),
        "amaga_crec_pct_1938_1973": round((pob("Amagá", 1973) / pob("Amagá", 1938) - 1) * 100, 1),
        "titiribi_cambio_1964_1973": pob("Titiribí", 1973) - pob("Titiribí", 1964),
        "titiribi_cambio_pct_1938_1973": round((pob("Titiribí", 1973) / pob("Titiribí", 1938) - 1) * 100, 1),
        "efecto_ajuste_medellin_pct": efecto_ajuste,
        "importaciones_caida_pct_1928_1932": round((m1932["importaciones_musd"] / m1928["importaciones_musd"] - 1) * 100, 1),
        "exportaciones_caida_pct_1928_1933": round((m1933["exportaciones_musd"] / m1928["exportaciones_musd"] - 1) * 100, 1),
        "reservas_caida_pct_1928_1931": round((14.0 / m1928["reservas_musd"] - 1) * 100, 1),
        "presupuesto_rural_promedio_1932_1936": round(sum(r["rural_pct"] for r in presu) / len(presu), 2),
        "brecha_alfabetismo": {r["censo"]: r["brecha_h_menos_m_pp"] for r in filas_alf},
        "brecha_dnp_nacional": {r["censo"]: r["brecha_pp"] for r in alf_dnp if r["zona"] == "Total nacional"},
        "empresas_antioquia_1931_1945_pct": round(sum(r["empresas"] for r in empresas if r["departamento"] == "Antioquia" and r["orden"] >= 6) / total_dep["Antioquia"] * 100, 1),
        "empresas_nds_1931_1945_pct": round(sum(r["empresas"] for r in empresas if r["departamento"] == "Norte de Santander" and r["orden"] >= 6) / total_dep["Norte de Santander"] * 100, 1),
        "empresas_total": total_dep,
    }

    salida = {
        "generado": "scripts/procesar_datos.py",
        "censos": CENSOS,
        "fechasCenso": {str(k): v for k, v in fechas.items()},
        "poblacion": serie,
        "indicadoresPoblacion": filas_ind,
        "participacionMedellin": part,
        "alfabetismo": filas_alf,
        "macro": macro,
        "presupuestoEducacionAntioquia": presu,
        "familiaEducacion": familia,
        "alfabetismoDNP": alf_dnp,
        "empresas1945": empresas,
        "industriaCiudades1945": ciudades,
        "empleoTextilAntioquia": textil,
        "creditosFotos": json.loads((RAIZ / "assets" / "lugares" / "creditos.json").read_text(encoding="utf-8")),
        "fuentes": fuentes,
        "claves": claves,
    }
    js = ("// Archivo generado automáticamente por scripts/procesar_datos.py. No editar a mano.\n"
          "window.DATOS_PROYECTO = " + json.dumps(salida, ensure_ascii=False, indent=1) + ";\n")
    (DATOS / "datos.js").write_text(js, encoding="utf-8")

    # --- Comprobaciones -----------------------------------------------------
    for m in MUNICIPIOS + ["Antioquia"]:
        for c in (1964, 1973):
            g = {r["variable"]: int(r["valor"]) for r in censos if r["municipio"] == m and int(r["censo"]) == c}
            if "poblacion_cabecera_ajustada" in g:
                assert g["poblacion_cabecera_ajustada"] < g["poblacion_total_ajustada"], (m, c)
    for r in filas_alf:
        assert min(r["hombres_pct"], r["mujeres_pct"]) <= r["total_pct"] <= max(r["hombres_pct"], r["mujeres_pct"]), r
    for e in [r for r in empresas if r["departamento"] != "Colombia"]:
        assert e["empresas"] <= next(c["empresas"] for c in empresas if c["departamento"] == "Colombia" and c["orden"] == e["orden"]), e
    for r in presu:
        assert abs(r["rural_pct"] + r["urbano_pct"] - 100) < 0.05, r

    print(json.dumps(claves, ensure_ascii=False, indent=1))
    for r in filas_ind:
        print(r)


if __name__ == "__main__":
    main()
