import ExcelJS from "exceljs";
import { getReporteGeneral } from "../../models/profesional-apoyo/profesionalApoyo.model.js";
import { getPromedios } from "../../models/profesional-apoyo/reporte.promedios.model.js";

const COLOR = {
  headerBg: "1F3864",
  claustro:  "C9A227",
  colab:     "2F5496",
  total:     "D9D9D9",
  wos:       "FFF2CC",
  white:     "FFFFFF",
  altRow:    "F2F7FF",
  black:     "000000",
};

const HEADERS = [
  "Nombre Académico",
  "Año ingreso\nal programa",
  "Total publ.\nWoS/SCOPUS (1)",
  "Artículos\nScielo/Latindex/ERIH",
  "Otros artículos",
  "Libros en editorial de relevancia en el área, referato externo y comité editorial",
  "Libro en otra editorial",
  "Capítulo de libro en editorial de relevancia en el área, referato externo y comité editorial",
  "Capítulo de libro en otra editorial",
  "Edición crítica y traducción anotada de un libro en editorial de relevancia en el área, referato externo y comité editorial",
  "Edición crítica y traducción anotada de un libro en otra editorial",
  "Proyectos FONDECYT, FONDEF, FONDAP, BASALES, CORFO, ANILLO, FONIS, FONIDE o Instituto Milenio como investigador responsable (2)",
  "Otros proyectos con:\n1) evaluación externa por pares.\n2) Financiamiento externo.\n3) investigación de carácter claramente disciplinar",
];

const COL_WIDTHS = [32, 12, 14, 22, 14, 24, 18, 28, 22, 36, 30, 40, 40];

const FIELDS = [
  "total_wos_scopus_5_anios",
  "total_scielo_5_anios",
  "otros_articulos",
  "libros_area",
  "libros_otro",
  "cap_area",
  "cap_otro",
  "edicion_area",
  "edicion_otro",
  "proyectos_fondecyt",
  "otros_proyectos",
];

function borderThin() {
  const s = { style: "thin", color: { argb: "FFAAAAAA" } };
  return { top: s, bottom: s, left: s, right: s };
}

function styleCell(cell, { bold = false, bg, fontColor = COLOR.black,
                            alignH = "center", wrap = true, size = 9 } = {}) {
  cell.font      = { name: "Arial", bold, color: { argb: `FF${fontColor}` }, size };
  cell.alignment = { horizontal: alignH, vertical: "middle", wrapText: wrap };
  cell.border    = borderThin();
  if (bg) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${bg}` } };
}

function writeGrupo(ws, startRow, titulo, bgTitulo, rows, wosValue) {
  let r = startRow;

  ws.getRow(r).height = 18;
  const titleCell = ws.getCell(r, 1);
  titleCell.value = titulo;
  styleCell(titleCell, { bold: true, bg: bgTitulo, fontColor: COLOR.white, alignH: "left", size: 11 });
  ws.mergeCells(r, 1, r, 13);
  r++;

  const dataStart = r;
  rows.forEach((row, idx) => {
    ws.getRow(r).height = 15;
    const altBg = idx % 2 === 0 ? COLOR.altRow : COLOR.white;

    const nc = ws.getCell(r, 1);
    nc.value = `${idx + 1}. ${row.primer_nombre} ${row.primer_apellido}`;
    styleCell(nc, { bg: altBg, alignH: "left" });

    const ac = ws.getCell(r, 2);
    ac.value = row.ano_ingreso || "-";
    styleCell(ac, { bg: altBg });

    FIELDS.forEach((field, fi) => {
      const c = ws.getCell(r, fi + 3);
      c.value = Number(row[field] ?? 0);
      styleCell(c, { bg: altBg });
    });

    r++;
  });

  const dataEnd = r - 1;

  // TOTAL con fórmulas SUM
  ws.getRow(r).height = 16;
  const tc = ws.getCell(r, 1);
  tc.value = "TOTAL";
  styleCell(tc, { bold: true, bg: COLOR.total, alignH: "left" });
  ws.mergeCells(r, 1, r, 2);
  for (let ci = 3; ci <= 13; ci++) {
    const colL = ws.getColumn(ci).letter;
    const fc   = ws.getCell(r, ci);
    fc.value   = { formula: `SUM(${colL}${dataStart}:${colL}${dataEnd})` };
    styleCell(fc, { bold: true, bg: COLOR.total });
  }
  r++;

  // WoS
  ws.getRow(r).height = 15;
  const wc = ws.getCell(r, 1);
  wc.value = "WoS";
  styleCell(wc, { bold: true, bg: COLOR.wos, alignH: "left" });
  ws.mergeCells(r, 1, r, 2);
  const wvc = ws.getCell(r, 3);
  wvc.value = Number(wosValue ?? 0);
  styleCell(wvc, { bold: true, bg: COLOR.wos });
  for (let ci = 4; ci <= 13; ci++) {
    styleCell(ws.getCell(r, ci), { bg: COLOR.wos });
  }
  r++;

  return r;
}

export async function exportReporteGeneralExcel(req, res) {
  try {
    const [allRows, promedios] = await Promise.all([getReporteGeneral(), getPromedios()]);

    const claustro      = allRows.filter(a => a.tipo_academico === "Claustro");
    const colaboradores = allRows.filter(a => a.tipo_academico === "Colaborador");

    const wosClaustro = claustro[0]?.total_wos_global     ?? 0;
    const wosColab    = colaboradores[0]?.total_wos_global ?? 0;

    const anioActual = new Date().getFullYear();
    const anioInicio = anioActual - 4;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Reporte General");

    COL_WIDTHS.forEach((w, i) => { ws.getColumn(i + 1).width = w; });

    ws.getRow(1).height = 100;
    HEADERS.forEach((h, i) => {
      const c = ws.getCell(1, i + 1);
      c.value = h;
      styleCell(c, { bold: true, bg: COLOR.headerBg, fontColor: COLOR.white, size: 8 });
    });

    let currentRow = 2;
    currentRow = writeGrupo(ws, currentRow, "CLAUSTRO",      COLOR.claustro, claustro,      wosClaustro);
    currentRow++;
    currentRow = writeGrupo(ws, currentRow, "COLABORADORES", COLOR.colab,    colaboradores, wosColab);

    currentRow++;
    const n1 = ws.getCell(currentRow, 1);
    n1.value = "(1) Sólo se registran artículos como primer autor.";
    n1.font  = { name: "Arial", size: 8, italic: true };
    ws.mergeCells(currentRow, 1, currentRow, 13);
    currentRow++;
    const n2 = ws.getCell(currentRow, 1);
    n2.value = `(2) Se registran los proyectos obtenidos desde ${anioInicio}, sin considerar los proyectos en curso.`;
    n2.font  = { name: "Arial", size: 8, italic: true };
    ws.mergeCells(currentRow, 1, currentRow, 13);
    currentRow += 2;
    ws.getRow(currentRow).height = 18;
    const ph1 = ws.getCell(currentRow, 1);
    ph1.value = "";
    styleCell(ph1, { bold: true, bg: COLOR.headerBg, fontColor: COLOR.white, alignH: "left" });
    const ph2 = ws.getCell(currentRow, 2);
    ph2.value = "Claustro";
    styleCell(ph2, { bold: true, bg: COLOR.headerBg, fontColor: COLOR.white });
    const ph3 = ws.getCell(currentRow, 3);
    ph3.value = "Cuerpo Académico";
    styleCell(ph3, { bold: true, bg: COLOR.headerBg, fontColor: COLOR.white });
    currentRow++;

    const promData = [
      {
        label:    `Promedio de publicaciones WOS, últimos 5 años (${anioInicio}-${anioActual})`,
        claustro: promedios.prom_wos_claustro,
        cuerpo:   promedios.prom_wos_cuerpo,
      },
      {
        label:    `Promedio de publicaciones WOS, por académico, últimos 5 años (${anioInicio}-${anioActual})`,
        claustro: promedios.prom_wos_acad_claustro,
        cuerpo:   promedios.prom_wos_acad_cuerpo,
      },
      {
        label:    `Promedio de Libros o capítulos de libros, últimos 5 años (${anioInicio}-${anioActual})`,
        claustro: promedios.prom_libros_claustro,
        cuerpo:   promedios.prom_libros_cuerpo,
      },
      {
        label:    `Promedio de Proyectos FONDECYT, en calidad de IP, últimos 5 años (${anioInicio}-${anioActual})`,
        claustro: promedios.prom_fondecyt_claustro,
        cuerpo:   promedios.prom_fondecyt_cuerpo,
      },
    ];

    promData.forEach((prom, i) => {
      ws.getRow(currentRow).height = 22;
      const altBg = i % 2 === 0 ? COLOR.altRow : COLOR.white;

      const lc = ws.getCell(currentRow, 1);
      lc.value = prom.label;
      lc.font      = { name: "Arial", size: 9 };
      lc.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
      lc.border    = borderThin();
      lc.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + altBg } };

      const cc = ws.getCell(currentRow, 2);
      cc.value = Number(prom.claustro);
      styleCell(cc, { bold: true, bg: altBg });

      const cu = ws.getCell(currentRow, 3);
      cu.value = Number(prom.cuerpo);
      styleCell(cu, { bold: true, bg: altBg });

      currentRow++;
    });

    res.setHeader("Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition",
      `attachment; filename=reporte_general_${anioActual}.xlsx`);

    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generando reporte Excel" });
  }
}