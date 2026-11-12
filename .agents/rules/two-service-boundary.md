# Límite de dos servicios

## Regla

No añadas base de datos, autenticación ni un tercer servicio. El proyecto se compone solo de `frontend` y `backend`.

Si una tarea parece necesitar persistencia o login, detente y no lo introduzcas por tu cuenta.

## Hecho del repo

`docker-compose.yml` declara únicamente los servicios `frontend` y `backend`. No hay Postgres, Redis ni otro contenedor. El backend no importa librerías de base de datos ni de autenticación.
