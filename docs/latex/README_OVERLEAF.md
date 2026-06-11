# Informe LaTeX para Overleaf

## Archivo principal

`reporte_login_metricas.tex` — documento completo listo para compilar.

## Pasos en Overleaf

1. Crear proyecto nuevo → **Upload Project** (o subir carpeta completa `latex/`).
2. Subir `reporte_login_metricas.tex` y la carpeta **`imagenes/`** con `calidad1` … `calidad5` (PNG o JPG).
3. Compilador: **pdfLaTeX** (normal, sin shell escape).
4. La carátula ya incluye autores, docente y periodo (ULEAM).
5. Recompilar → descargar PDF.

## Contenido del informe

- Portada, resumen, índice
- Introducción y stack
- Arquitectura y CRUD GraphQL
- ISO/IEC 25023 (tablas + fórmulas + tests 29/29)
- ISO/IEC 25022 (tablas + protocolo de demo)
- Procedimiento de ejecución
- Preguntas del docente
- Conclusiones y referencias

## Si falla la compilación

- Asegúrate de usar **pdfLaTeX**, no solo LaTeX.
- Overleaf incluye `babel`, `booktabs`, `listings`, etc. por defecto.
- Si un listing da error, cambia `language=Python` por `language={}` en ese bloque.
