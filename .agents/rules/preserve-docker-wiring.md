# Conservar el cableado de Docker

## Regla

No "limpies" la configuración de desarrollo.

- El proxy de Vite para `/api` debe seguir apuntando a `http://backend:8000`.
- El contenedor del backend debe seguir escuchando la API en el puerto `8000` y `debugpy` en `0.0.0.0:5678`, con Uvicorn en `--reload`.
- No cambies el proxy a `localhost` para que funcione fuera de Compose, salvo que la tarea lo pida.

## Hecho del repo

`frontend/vite.config.ts` define `server.proxy['/api'].target` como `http://backend:8000`. `backend/Dockerfile` expone `8000` y `5678`, y su `CMD` arranca `debugpy --listen 0.0.0.0:5678` más `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`. `docker-compose.yml` publica esos mismos puertos.
