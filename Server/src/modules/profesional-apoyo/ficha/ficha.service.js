import ExcelJS from 'exceljs';
import { getFichaByUsuario, getFichaByUsuarioMagister } from './ficha.model.js';
import { getAcademicoFullProfile, getProgramasDeUsuario } from '../../users/user/user.model.js';

// ── Helpers de estilo (privados al módulo) ─────────────────────────────────

const GRAY_FILL  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
const THIN_BORDER = {
  top: { style: 'thin' }, left:   { style: 'thin' },
  bottom: { style: 'thin' }, right: { style: 'thin' },
};

function writeSectionTitle(sheet, rowNum, text, numCols = 8) {
  sheet.getCell(rowNum, 1).value     = text;
  sheet.getCell(rowNum, 1).font      = { bold: true };
  sheet.getCell(rowNum, 1).fill      = GRAY_FILL;
  sheet.getCell(rowNum, 1).alignment = { wrapText: false, vertical: 'middle' };
  for (let c = 2; c <= numCols; c++) sheet.getCell(rowNum, c).fill = GRAY_FILL;
  sheet.getRow(rowNum).height = 15;
}

function writeSubTitle(sheet, rowNum, text) {
  sheet.getCell(rowNum, 1).value = text;
  sheet.getCell(rowNum, 1).font  = { bold: true };
  sheet.getRow(rowNum).height    = 15;
}

function writeTableHeader(sheet, rowNum, headers) {
  headers.forEach((h, i) => {
    const cell     = sheet.getCell(rowNum, i + 1);
    cell.value     = h;
    cell.fill      = GRAY_FILL;
    cell.border    = THIN_BORDER;
    cell.alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
  });
  sheet.getRow(rowNum).height = 45;
}

function writeEmptyDataRow(sheet, rowNum, numCols) {
  for (let c = 1; c <= numCols; c++) {
    const cell     = sheet.getCell(rowNum, c);
    cell.border    = THIN_BORDER;
    cell.alignment = { wrapText: true, vertical: 'top' };
  }
  sheet.getRow(rowNum).height = 15;
}

function writeDataRow(sheet, rowNum, values) {
  values.forEach((v, i) => {
    const cell     = sheet.getCell(rowNum, i + 1);
    cell.value     = v ?? '';
    cell.border    = THIN_BORDER;
    cell.alignment = { wrapText: true, vertical: 'top' };
  });
  sheet.getRow(rowNum).height = 15;
}

// ── Helpers de contrato ────────────────────────────────────────────────────

// Obtiene el tipo_academico del académico para un programa específico
// programa: 'MAGISTER' | 'DOCTORADO'
async function getContratoParaPrograma(usuarioId, programa) {
  const programas = await getProgramasDeUsuario(usuarioId);
  const match = programas.find(p => p.programa?.toUpperCase() === programa.toUpperCase());
  return match?.tipo_academico || null;
}

// ── Secciones de contenido ─────────────────────────────────────────────────

function buildBaseSheet(sheet, perfil, contrato, anos = 5) {
  const { usuario, grado_academico, titulaciones } = perfil;

  sheet.columns = [
    { width: 62.5 }, { width: 25 }, { width: 20 },
    { width: 35 },   { width: 30 }, { width: 20 },
    { width: 20 },   { width: 40 },
  ];

  sheet.getCell('A1').value     = `Ficha académica de los últimos ${anos} años`;
  sheet.getCell('A1').font      = { bold: true, size: 12 };
  sheet.getCell('A1').fill      = GRAY_FILL;
  sheet.getCell('A1').alignment = { wrapText: true, vertical: 'middle' };
  for (let c = 2; c <= 8; c++) sheet.getCell(1, c).fill = GRAY_FILL;
  sheet.getRow(1).height = 20;

  writeSectionTitle(sheet, 3, '1. Ficha académica por cada uno de los integrantes del cuerpo académico (utilizar únicamente este formato) [1]');

  const infoRows = [
    ['Nombre del académico o académica',
      `${usuario.primer_nombre} ${usuario.segundo_nombre || ''} ${usuario.primer_apellido} ${usuario.segundo_apellido || ''}`.trim()],
    ['Tipo de vínculo (claustro o colaborador/a)', contrato || 'No definido'],
    ['Título, institución, año de titulación y país',
      titulaciones?.length
        ? titulaciones.map(t => `${t.titulo} - ${t.institucion_titulacion || ''} (${t.ano_titulacion || ''}) - ${t.pais_titulacion || ''}`).join(' | ')
        : ''],
    ['Grado académico máximo (especificar área disciplinar), institución, año de graduación y país [2]',
      grado_academico
        ? `${grado_academico.nombre_grado} - ${grado_academico.institucion_grado || ''} (${grado_academico.ano_grado || ''}) - ${grado_academico.pais_grado || ''}`
        : ''],
    ['Línea(s) de investigación', usuario.lineas_investigacion || ''],
  ];

  infoRows.forEach(([label, value], i) => {
    const r  = 5 + i;
    const lc = sheet.getCell(r, 1);
    lc.value = label; lc.fill = GRAY_FILL; lc.border = THIN_BORDER;
    lc.alignment = { wrapText: true, vertical: 'middle' };
    const vc = sheet.getCell(r, 2);
    vc.value = value; vc.border = THIN_BORDER;
    vc.alignment = { wrapText: true, vertical: 'middle' };
    sheet.getRow(r).height = i === 3 ? 30 : 15;
  });

  return 11;
}

function addTesisSection(sheet, data, row, anos = 5) {
  const tesisMagister  = (data.tesis || []).filter(t => t.nivel_programa === 'MAGISTER');
  const tesisDoctorado = (data.tesis || []).filter(t => t.nivel_programa === 'DOCTORADO');
  const hMag = ['Autor', 'Año', 'Título de la Tesis', 'Nombre del programa', 'Institución', 'Link de acceso o medio de verificación electrónico'];
  const hDoc = [...hMag.slice(0, 5), '¿La tesis fue dirigida en el mismo programa? Si/No', hMag[5]];

  const writeSubGroup = (titulo, headers, tesisList, extraField = null) => {
    writeSubTitle(sheet, row, titulo); row++;
    writeTableHeader(sheet, row, headers); row++;
    if (!tesisList.length) { writeEmptyDataRow(sheet, row, headers.length); row++; }
    else tesisList.forEach(t => {
      const vals = [t.autor, t.ano, t.titulo_tesis, t.nombre_programa, t.institucion];
      if (extraField) vals.push(t[extraField]);
      vals.push(t.link_verificacion);
      writeDataRow(sheet, row, vals); row++;
    });
  };

  writeSectionTitle(sheet, row, `2. Tesis de magíster dirigidas en los últimos ${anos} años (finalizadas)`); row++;
  writeSubGroup('2.1 Como guía de tesis',    hMag, tesisMagister.filter(t => t.rol_guia === 'GUIA'));
  writeSubGroup('2.2 Como co-guía de tesis', hMag, tesisMagister.filter(t => t.rol_guia === 'CO_GUIA'));

  writeSectionTitle(sheet, row, `3. Tesis de doctorado dirigidas en los últimos ${anos} años (finalizadas)`); row++;
  writeSubGroup('3.1 Como guía de tesis',    hDoc, tesisDoctorado.filter(t => t.rol_guia === 'GUIA'),    'tesis_dirigida');
  writeSubGroup('3.2 Como co-guía de tesis', hDoc, tesisDoctorado.filter(t => t.rol_guia === 'CO_GUIA'), 'tesis_dirigida');

  return row;
}

function addPublicacionesSection(sheet, data, row, anos = 5) {
  const hPub = ['Autor(es)', 'Autor/a principal', 'Año', 'Título del artículo', 'Nombre revista', 'Estado', 'ISSN', 'Link de acceso o medio de verificación electrónico'];
  writeSectionTitle(sheet, row, `4. Listado de publicaciones en los últimos ${anos} años. En caso de publicaciones con más de un autor, indicar el autor/a principal [3]`); row++;

  const categorias = [
    { titulo: '4.1 Publicaciones indexadas WoS',                                                             filtro: 'WoS' },
    { titulo: '4.2 Publicaciones indexadas SCOPUS',                                                          filtro: 'SCOPUS' },
    { titulo: '4.3 Publicaciones indexadas SCIELO',                                                          filtro: 'SCIELO' },
    { titulo: '4.4. Otras publicaciones indexadas (identificar tipo de indexación: LATINDEX u otra)',         filtro: ['LATINDEX', 'ERIH'] },
  ];

  for (const cat of categorias) {
    writeSubTitle(sheet, row, cat.titulo); row++;
    writeTableHeader(sheet, row, hPub); row++;
    const pubs = data.publicaciones.filter(p =>
      Array.isArray(cat.filtro) ? cat.filtro.includes(p.categoria) : p.categoria === cat.filtro
    );
    if (!pubs.length) { writeEmptyDataRow(sheet, row, hPub.length); row++; }
    else { pubs.forEach(p => { writeDataRow(sheet, row, [p.autores, p.autor_principal, p.ano, p.titulo_articulo, p.nombre_revista, p.estado, p.ISSN, p.link_verificacion]); row++; }); }
  }

  const hLib = ['Autor(es)', 'Autor/a principal', 'Año', 'Nombre libro', 'Lugar', 'Editorial', 'Estado', 'Link de acceso o medio de verificación electrónico'];
  writeSubTitle(sheet, row, '4.5 Publicaciones no indexadas LIBRO'); row++;
  writeTableHeader(sheet, row, hLib); row++;
  if (!data.libros.length) { writeEmptyDataRow(sheet, row, hLib.length); row++; }
  else { data.libros.forEach(l => { writeDataRow(sheet, row, [l.autores, l.autor_principal, l.ano, l.nombre_libro, l.lugar, l.editorial, l.estado, l.link_verificacion]); row++; }); }

  const hCap = ['Autor(es)', 'Autor/a principal', 'Año', 'Nombre capítulo', 'Nombre libro', 'Lugar', 'Editorial', 'Estado', 'Link de acceso o medio de verificación electrónico'];
  writeSubTitle(sheet, row, '4.6 Publicaciones no indexadas CAPÍTULOS DE LIBRO'); row++;
  writeTableHeader(sheet, row, hCap); row++;
  if (!data.capitulos.length) { writeEmptyDataRow(sheet, row, hCap.length); row++; }
  else { data.capitulos.forEach(c => { writeDataRow(sheet, row, [c.autores, c.autor_principal, c.ano, c.nombre_capitulo, c.nombre_libro, c.lugar, c.editorial, c.estado, c.link_verificacion]); row++; }); }

  writeSubTitle(sheet, row, '4.7. Otras publicaciones no indexadas (identificar tipo, revistas con referato u otro)'); row++;
  writeTableHeader(sheet, row, hPub); row++;
  const otras = data.publicaciones.filter(p => !['WoS', 'SCOPUS', 'SCIELO', 'LATINDEX', 'ERIH'].includes(p.categoria));
  if (!otras.length) { writeEmptyDataRow(sheet, row, hPub.length); row++; }
  else { otras.forEach(p => { writeDataRow(sheet, row, [p.autores, p.autor_principal, p.ano, p.titulo_articulo, p.nombre_revista, p.estado, p.ISSN, p.link_verificacion]); row++; }); }

  const hPat = ['Inventor(es)', 'Nombre patente', 'Fecha de solicitud', 'Fecha de publicación', 'N° de registro', 'Estado', 'Link de acceso o medio de verificación electrónico'];
  writeSubTitle(sheet, row, '4.8 Patentes'); row++;
  writeTableHeader(sheet, row, hPat); row++;
  const patentes = data.patentes || [];
  if (!patentes.length) { writeEmptyDataRow(sheet, row, hPat.length); row++; }
  else { patentes.forEach(p => { writeDataRow(sheet, row, [p.inventores, p.nombre_patente, p.fecha_solicitud, p.fecha_publicacion, p.num_registro, p.estado, p.link_verificacion]); row++; }); }

  const hInv = ['Título', 'Fuente de financiamiento', 'Año de adjudicación', 'Período de ejecución', 'Rol en el proyecto: investigador responsable/director, co-investigador, etc.', 'Link de acceso o medio de verificación electrónico'];
  writeSectionTitle(sheet, row, `5. Listado de proyectos de investigación, últimos ${anos} años`); row++;
  writeTableHeader(sheet, row, hInv); row++;
  const investigaciones = data.investigaciones || [];
  if (!investigaciones.length) { writeEmptyDataRow(sheet, row, hInv.length); row++; }
  else { investigaciones.forEach(inv => { writeDataRow(sheet, row, [inv.titulo, inv.fuente_financiamiento, inv.ano_adjudicacion, inv.periodo_ejecucion, inv.rol_proyecto, inv.link_verificacion]); row++; }); }

  return row;
}

function addIntervencionesSection(sheet, data, row) {
  const hInt = ['Título', 'Fuente de financiamiento', 'Año de adjudicación', 'Período de ejecución', 'Rol en el proyecto', 'Link de acceso o medio de verificación electrónico'];
  writeSectionTitle(sheet, row, '6. Listado de proyectos de intervención, innovación y/o desarrollo tecnológico, últimos 10 años'); row++;
  writeTableHeader(sheet, row, hInt); row++;
  const intervenciones = data.intervenciones || [];
  if (!intervenciones.length) { writeEmptyDataRow(sheet, row, hInt.length); row++; }
  else { intervenciones.forEach(i => { writeDataRow(sheet, row, [i.titulo, i.fuente_financiamiento, i.ano_adjudicacion, i.periodo_ejecucion, i.rol_proyecto, i.link_verificacion]); row++; }); }
  return row;
}

function addConsultoriasSection(sheet, data, row) {
  const hCon = ['Título', 'Institución contratante', 'Año de adjudicación', 'Período de ejecución', 'Objetivo', 'Link de acceso o medio de verificación electrónico'];
  writeSectionTitle(sheet, row, '7. Listado de consultorías y/o asistencias técnicas, en calidad de responsable, últimos 10 años'); row++;
  writeTableHeader(sheet, row, hCon); row++;
  const consultorias = data.consultorias || [];
  if (!consultorias.length) { writeEmptyDataRow(sheet, row, hCon.length); row++; }
  else { consultorias.forEach(c => { writeDataRow(sheet, row, [c.titulo, c.institucion_contratante, c.ano_adjudicacion, c.periodo_ejecucion, c.objetivo, c.link_verificacion]); row++; }); }
  return row;
}

function addNotas(sheet, row) {
  writeSectionTitle(sheet, row, 'Notas'); row++;
  const notas = [
    '[1] No es obligatorio incluir fichas de académicos visitantes.',
    '[2] Si se estima necesario, indicar todos los grados académicos obtenidos o equivalentes.',
    '[3] Para efectos de contabilizar la productividad académica de mujeres en claustros, se tendrá en consideración los períodos de licencia por descanso de maternidad (pre y post-natal), adopción o tuición legal según lo detallado en Resolución Exenta DJ N°233-4 del 13 de enero de 2021.',
  ];
  notas.forEach(nota => {
    sheet.getCell(row, 1).value     = nota;
    sheet.getCell(row, 1).fill      = GRAY_FILL;
    sheet.getCell(row, 1).alignment = { wrapText: false, vertical: 'top' };
    for (let c = 2; c <= 8; c++) sheet.getCell(row, c).fill = GRAY_FILL;
    sheet.getRow(row).height = 15;
    row++;
  });
}

// ── Servicios públicos ─────────────────────────────────────────────────────

export async function getFichaAcademicaService(usuarioId) {
  return getFichaByUsuario(usuarioId);
}

export async function buildFichaExcel(usuarioId) {
  const [data, perfil, contrato] = await Promise.all([
    getFichaByUsuario(usuarioId),
    getAcademicoFullProfile(usuarioId),
    getContratoParaPrograma(usuarioId, 'DOCTORADO'),
  ]);
  if (!perfil) {
    const err = new Error('Académico no encontrado');
    err.status = 404;
    throw err;
  }
  const wb    = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet('Ficha Académica');
  let row = buildBaseSheet(sheet, perfil, contrato, 5);
  row = addTesisSection(sheet, data, row);
  row = addPublicacionesSection(sheet, data, row);
  addNotas(sheet, row);
  return wb;
}

export async function buildFichaMagisterExcel(usuarioId) {
  const [data, perfil, contrato] = await Promise.all([
    getFichaByUsuarioMagister(usuarioId),
    getAcademicoFullProfile(usuarioId),
    getContratoParaPrograma(usuarioId, 'MAGISTER'),
  ]);
  if (!perfil) {
    const err = new Error('Académico no encontrado');
    err.status = 404;
    throw err;
  }
  const wb    = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet('Ficha Académica');
  let row = buildBaseSheet(sheet, perfil, contrato, 10);
  row = addTesisSection(sheet, data, row, 10);
  row = addPublicacionesSection(sheet, data, row, 10);
  row = addIntervencionesSection(sheet, data, row);
  row = addConsultoriasSection(sheet, data, row);
  addNotas(sheet, row);
  return wb;
}