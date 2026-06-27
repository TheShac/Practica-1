import { useState, useEffect } from "react";

export function usePagination(data, perPage = 10) {
  const [page, setPage] = useState(1);

  // Volver a página 1 cuando cambian los datos (carga inicial o filtro)
  useEffect(() => {
    setPage(1);
  }, [data]);

  const total      = data.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start      = (page - 1) * perPage;
  const pageRows   = data.slice(start, start + perPage);

  return { pageRows, page, setPage, total, totalPages, perPage };
}
