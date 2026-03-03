import ExcelJS from "exceljs";
import { getFichaByUsuario } from "../models/ficha.model.js";
import { getAcademicoFullProfile } from "../models/users/user.model.js";

export async function getFichaAcademica(req, res) {
  try {
    const { usuarioId } = req.params;

    const data = await getFichaByUsuario(usuarioId);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener ficha académica" });
  }
}

export async function exportFichaAcademicaExcel(req, res) {
  try {
    const { usuarioId } = req.params;

    const data = await getFichaByUsuario(usuarioId);
    const perfil = await getAcademicoFullProfile(usuarioId);

    if (!perfil) {
      return res.status(404).json({ message: "Académico no encontrado" });
    }

    const { usuario, grado_academico, titulaciones } = perfil;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Ficha Académica");

    sheet.columns = [
      { width: 25 }, { width: 25 }, { width: 20 },
      { width: 35 }, { width: 30 }, { width: 20 },
      { width: 20 }, { width: 40 }
    ];

    let row = 1;

    // =====================================================
    // 1. FICHA ACADÉMICA
    // =====================================================

    sheet.getCell(`A${row}`).value = "1. Ficha académica";
    sheet.getCell(`A${row}`).font = { bold: true };
    row += 2;

    sheet.getCell(`A${row}`).value = "Nombre del académico/a:";
    sheet.getCell(`B${row}`).value =
      `${usuario.primer_nombre} ${usuario.segundo_nombre || ""} ${usuario.primer_apellido} ${usuario.segundo_apellido || ""}`;
    row++;

    sheet.getCell(`A${row}`).value = "Tipo de vínculo:";
    sheet.getCell(`B${row}`).value = usuario.contrato || "";
    row++;

    // A5
    sheet.getCell(`A${row}`).value =
      "Título(s), institución, año y país:";

    if (titulaciones && titulaciones.length > 0) {
      const textoTitulos = titulaciones
        .map(t =>
          `${t.titulo} - ${t.institucion_titulacion || ""} (${t.ano_titulacion || ""}) - ${t.pais_titulacion || ""}`
        )
        .join(" | ");

      sheet.getCell(`B${row}`).value = textoTitulos;
    }

    row++;

    sheet.getCell(`A${row}`).value =
      "Grado académico máximo (área disciplinar, institución, año y país):";

    if (grado_academico) {
      sheet.getCell(`B${row}`).value =
        `${grado_academico.nombre_grado} - ${grado_academico.institucion_grado || ""} (${grado_academico.ano_grado || ""}) - ${grado_academico.pais_grado || ""}`;
    }
    row++;

    sheet.getCell(`A${row}`).value = "Línea(s) de investigación:";
    sheet.getCell(`B${row}`).value = usuario.lineas_investigacion || "";
    row += 2;

    // =====================================================
    // 2. TESIS MAGÍSTER
    // =====================================================

    sheet.getCell(`A${row}`).value =
      "2. Tesis de magíster dirigidas en los últimos 5 años (finalizadas)";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;

    const tesisMagister = (data.tesis || []).filter(
      t => t.nivel_programa === "MAGISTER"
    );

    // 2.1 GUIA
    sheet.getCell(`A${row}`).value = "2.1 Como guía de tesis";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;

    sheet.addRow(["Autor","Año","Título","Programa","Institución","Link"]);

    tesisMagister
      .filter(t => t.rol_guia === "GUIA")
      .forEach(t => {
        sheet.addRow([
          t.autor || "",
          t.ano || "",
          t.titulo_tesis || "",
          t.nombre_programa || "",
          t.institucion || "",
          t.link_verificacion || ""
        ]);
      });

    row = sheet.lastRow.number + 2;

    // 2.2 CO GUIA
    sheet.getCell(`A${row}`).value = "2.2 Como co-guía de tesis";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;

    sheet.addRow(["Autor","Año","Título","Programa","Institución","Link"]);

    tesisMagister
      .filter(t => t.rol_guia === "CO_GUIA")
      .forEach(t => {
        sheet.addRow([
          t.autor || "",
          t.ano || "",
          t.titulo_tesis || "",
          t.nombre_programa || "",
          t.institucion || "",
          t.link_verificacion || ""
        ]);
      });

    row = sheet.lastRow.number + 2;

    // =====================================================
    // 3. TESIS DOCTORADO
    // =====================================================

    sheet.getCell(`A${row}`).value =
      "3. Tesis de doctorado dirigidas en los últimos 5 años (finalizadas)";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;

    const tesisDoctorado = (data.tesis || []).filter(
      t => t.nivel_programa === "DOCTORADO"
    );

    // 3.1 GUIA
    sheet.getCell(`A${row}`).value = "3.1 Como guía de tesis";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;

    sheet.addRow(["Autor","Año","Título","Programa","Institución","Link"]);

    tesisDoctorado
      .filter(t => t.rol_guia === "GUIA")
      .forEach(t => {
        sheet.addRow([
          t.autor || "",
          t.ano || "",
          t.titulo_tesis || "",
          t.nombre_programa || "",
          t.institucion || "",
          t.link_verificacion || ""
        ]);
      });

    row = sheet.lastRow.number + 2;

    // 3.2 CO GUIA
    sheet.getCell(`A${row}`).value = "3.2 Como co-guía de tesis";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;

    sheet.addRow(["Autor","Año","Título","Programa","Institución","Dirigida en el mismo programa?","Link"]);

    tesisDoctorado
      .filter(t => t.rol_guia === "CO_GUIA")
      .forEach(t => {
        sheet.addRow([
          t.autor || "",
          t.ano || "",
          t.titulo_tesis || "",
          t.nombre_programa || "",
          t.institucion || "",
          t.tesis_dirigida || "",
          t.link_verificacion || ""
        ]);
      });

    row = sheet.lastRow.number + 2;

    // =====================================================
    // 4. PUBLICACIONES
    // =====================================================

    sheet.getCell(`A${row}`).value =
      "4. Listado de publicaciones en los últimos 5 años.";
    sheet.getCell(`A${row}`).font = { bold: true };
    row += 2;

    const categorias = [
      { titulo: "4.1 Publicaciones WoS", filtro: "WoS" },
      { titulo: "4.2 Publicaciones SCOPUS", filtro: "SCOPUS" },
      { titulo: "4.3 Publicaciones SCIELO", filtro: "SCIELO" },
      { titulo: "4.4 Otras indexadas (LATINDEX / ERIH)", filtro: ["LATINDEX","ERIH"] }
    ];

    for (const cat of categorias) {

      sheet.getCell(`A${row}`).value = cat.titulo;
      sheet.getCell(`A${row}`).font = { bold: true };
      row++;

      sheet.addRow(["Autores","Autor principal","Año","Título","Revista","Estado","ISSN","Link"]);
      row++;

      data.publicaciones
        .filter(p =>
          Array.isArray(cat.filtro)
            ? cat.filtro.includes(p.categoria)
            : p.categoria === cat.filtro
        )
        .forEach(p => {
          sheet.addRow([
            p.autores || "",
            p.autor_principal || "",
            p.ano || "",
            p.titulo_articulo || "",
            p.nombre_revista || "",
            p.estado || "",
            p.ISSN || "",
            p.link_verificacion || ""
          ]);
        });

      row = sheet.lastRow.number + 2;
    }

    // 4.5 LIBROS
    sheet.getCell(`A${row}`).value = "4.5 Publicaciones no indexadas - LIBROS";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;

    sheet.addRow(["Autor(es)","Autor principal","Año","Nombre libro","Lugar","Editorial","Estado","Link"]);
    row++;

    data.libros.forEach(l => {
      sheet.addRow([
        l.autores,
        l.autor_principal,
        l.ano,
        l.nombre_libro,
        l.lugar,
        l.editorial,
        l.estado,
        l.link_verificacion || ""
      ]);
    });

    row = sheet.lastRow.number + 2;

    // 4.6 CAPITULOS
    sheet.getCell(`A${row}`).value = "4.6 Publicaciones no indexadas - CAPÍTULOS DE LIBRO";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;

    sheet.addRow(["Autor(es)","Autor principal","Año","Nombre capítulo","Nombre libro","Lugar","Editorial","Estado","Link"]);
    row++;

    data.capitulos.forEach(c => {
      sheet.addRow([
        c.autores,
        c.autor_principal,
        c.ano,
        c.nombre_capitulo,
        c.nombre_libro,
        c.lugar,
        c.editorial,
        c.estado,
        c.link_verificacion || ""
      ]);
    });

    row = sheet.lastRow.number + 2;

    // 4.7 OTRAS NO INDEXADAS
    sheet.getCell(`A${row}`).value = "4.7 Otras publicaciones no indexadas";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;

    sheet.addRow(["Autores","Autor principal","Año","Título","Revista","Estado","ISSN","Link"]);
    row++;

    data.publicaciones
      .filter(p => p.categoria === "OTRA_NO_INDEXADA")
      .forEach(p => {
        sheet.addRow([
          p.autores,
          p.autor_principal,
          p.ano,
          p.titulo,
          p.revista,
          p.estado,
          p.issn,
          p.link_verificacion || ""
        ]);
      });
    
    // =====================================================
    // 4.8 PATENTES
    // =====================================================

    sheet.getCell(`A${row}`).value = "4.8 Patentes";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;

    sheet.addRow(["Inventores","Nombre patente","Fecha publicación","Registro","Estado","Link"]);

    (data.patentes || []).forEach(p => {
      sheet.addRow([
        p.inventores || "",
        p.nombre_patente || "",
        p.fecha_publicacion || "",
        p.num_registro || "",
        p.estado || "",
        p.link_verificacion || ""
      ]);
    });

    row = sheet.lastRow.number + 2;

    /* ============================================================
      5. PROYECTOS
    ============================================================ */

    sheet.getCell(`A${row}`).value =
      "5. Proyectos de investigación en los últimos 5 años";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;

    sheet.addRow(["Título","Fuente financiamiento","Periodo","Rol","Link"]);

    (data.investigaciones || []).forEach(inv => {
      sheet.addRow([
        inv.titulo || "",
        inv.fuente_financiamiento || "",
        inv.periodo_ejecucion || "",
        inv.rol_proyecto || "",
        inv.link_verificacion || ""
      ]);
    });

    row = sheet.lastRow.number + 2;

    // DESCARGA

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ficha_${usuarioId}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generando Excel" });
  }
}