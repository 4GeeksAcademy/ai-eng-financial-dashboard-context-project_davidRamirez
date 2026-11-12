# Stack tecnológico

Dos servicios, definidos en `docker-compose.yml`. No hay base de datos ni autenticación.

## Frontend

Directorio `frontend/`.

- React 19 y TypeScript
- Vite 8, con alias `@` hacia `src`
- Tailwind CSS 4 y componentes shadcn `new-york` (`frontend/components.json`)
- Recharts para los gráficos
- Vitest para los tests de `frontend/src/lib/financial-utils.ts`
- ESLint con las reglas recomendadas de JavaScript, TypeScript, React Hooks y React Refresh. No fija el estilo de comillas.

Puerto publicado: `5173`. El proxy de Vite envía `/api` a `http://backend:8000`. La base de la API sale de `VITE_API_BASE_URL`; si no existe, queda vacía y se usa el proxy.

## Backend

Directorio `backend/`.

- Python 3.13
- FastAPI, sin versión fijada en `backend/requirements.txt`
- Uvicorn con `--reload`
- debugpy en `0.0.0.0:5678`
- pytest y `TestClient` en `backend/tests/`

Puertos publicados: `8000` (API) y `5678` (debug). La documentación interactiva queda en `http://localhost:8000/docs` por el comportamiento por defecto de FastAPI.

## Arranque

`docker compose up --build`.
