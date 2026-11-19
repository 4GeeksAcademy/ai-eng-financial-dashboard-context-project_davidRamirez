# Progreso

## Skills del ecosistema

- `addyosmani/web-quality-skills@accessibility` se eligió para auditar el dashboard con WCAG 2.2, Lighthouse y pruebas de teclado. Es la skill aplicada a las correcciones de accesibilidad.
- `vercel-labs/agent-skills@vercel-react-best-practices` se eligió porque el frontend está construido con React y sus pautas cubren componentes, renderizado y rendimiento. Quedó instalada para futuras tareas React; no se usó como criterio de estas correcciones de accesibilidad.

## Cambios relacionados y verificados

- Se añadió un enlace para saltar al contenido, foco visible, anuncios accesibles para errores y estado de alertas, encabezados semánticos y respeto a `prefers-reduced-motion` en los skeletons.
- Se ajustó el color primario del tema oscuro tras detectar bajo contraste en Lighthouse.
- Se añadieron `title` y `desc` a los tres gráficos Recharts. Chromium confirmó sus nombres en el árbol accesible y la navegación con flechas muestra tooltips.
- La navegación por teclado recorrió los controles y ambas vistas; labels, roles y estados se verificaron. No hay imágenes `<img>`; los iconos Lucide decorativos tienen `aria-hidden="true"`.
- Lighthouse de accesibilidad terminó con puntuación 1.00 y sin auditorías fallidas. ESLint, build y `git diff --check` pasaron.

## Skills internas instaladas

- `.agents/skills/accessibility/SKILL.md`: skill de accesibilidad de Addy Osmani, copiada al workspace para GitHub Copilot.
- `.agents/skills/vercel-react-best-practices/SKILL.md`: skill de buenas prácticas React de Vercel, copiada al workspace para GitHub Copilot.

Ambas se instalaron con `npx skills add`; no se redactaron desde cero.
