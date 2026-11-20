# Verificar los servicios en ejecución

## Alcance
Arranque y comprobación del frontend y backend con Docker Compose, incluidos sus puertos publicados y la conexión interna entre servicios.

## Justificación
El frontend puede estar visible aunque el backend no esté disponible. Compose declara `depends_on`, pero no configura una comprobación de salud del backend. Los puertos publicados también pueden diferir de las URLs del entorno remoto.

## Guía específica
- Arranca con `docker compose up --build`.
- Comprueba estado y puertos con `docker compose ps`; consulta errores con `docker compose logs backend`.
- Verifica `/health` y `/docs` usando la dirección que muestre el reenvío del puerto del backend.
- Abre el frontend con la dirección que muestre el reenvío de su puerto y confirma que carga los datos.
- No asumas que `localhost` es accesible desde el navegador del usuario.
- No cambies el proxy interno de Vite (`backend:8000`) para resolver un problema de publicación de puertos.

# Aislar la aleatoriedad del generador mock

## Alcance
Cambios en `generate_mock_movements` y en las funciones que construyen sus movimientos.

## Justificación
El generador usa `random.seed(seed)`, que modifica el estado aleatorio global del proceso. Otro código que use el módulo `random` podría depender accidentalmente de ese estado.

## Guía específica
- Conserva el contrato del generador: semilla `42`, 360 movimientos y orden por fecha, salvo petición explícita.
- No añadas usos de `random` fuera del generador que dependan de su estado global.
- Si se introduce aleatoriedad independiente, aísla su estado y prueba que las llamadas repetidas con la misma semilla sigan siendo deterministas.
- Ejecuta las pruebas del backend relacionadas con el generador después de cambiarlo.

# Configurar CORS según el entorno

## Alcance
Configuración de `CORSMiddleware` en `backend/app/main.py`.

## Justificación
La configuración actual permite cualquier origen, método y encabezado, además de credenciales. Puede servir para desarrollo, pero no debe asumirse apropiada para un despliegue.

## Guía específica
- No cambies la configuración de desarrollo como parte de una tarea ajena a CORS.
- Si se prepara un despliegue, define explícitamente los orígenes permitidos para ese entorno.
- No uses el comodín de orígenes junto con credenciales en una configuración de producción.
- Prueba el acceso desde el origen autorizado y confirma que los no autorizados no reciben permiso.

## Test de CORS

* Se ejecutó el comando: 

curl -i  https://glorious-journey-j4jvw65prwgcqrjp-8000.app.github.dev/

Respuesta:

@Steban687 ➜ /workspaces/ai-eng-financial-dashboard-context-project_davidRamirez2.0 (main) $ curl -i ht
tps://glorious-journey-j4jvw65prwgcqrjp-8000.app.github.dev/
HTTP/2 302 
date: Fri, 13 Nov 2026 16:57:00 GMT
content-length: 0
location: https://github.dev/pf-signin?id=new-mountain-vpzjw1t&cluster=uks1&name=glorious-journey-j4jvw65prwgcqrjp&port=8000&pb=https%3A%2F%2Fglorious-journey-j4jvw65prwgcqrjp-8000.app.github.dev%2Fauth%2Fpostback%2Ftunnel%3Ftunnel%3D1
x-content-type-options: nosniff
ratelimit-limit: HttpRequestRatePerPort:1500/m
ratelimit-remaining: HttpRequestRatePerPort:1499
ratelimit-reset: HttpRequestRatePerPort:58s
vssaas-request-id: 068d4b01-6400-435c-8b5d-f92637f48f72


Para la revisión del acceso protegido.
se deja constancia de verificacion de seguridad de acceso.




