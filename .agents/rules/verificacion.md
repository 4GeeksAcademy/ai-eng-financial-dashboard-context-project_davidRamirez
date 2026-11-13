## Verificación de resumen

  * Comprobacion de rutas clave  ✅
  * Se intenta correr el programa con los comandos que indica ❌
  * Se le indica al agente corregir puertos para poder visualizar el proyecto. ✅

  * Se consigue visualizar el frontend pero no el backend

## Patrones arriesgados que conviene vigilar

* Etiqueta de periodo fija frente a fechas dinámicas. El dashboard muestra 2024 - Full Year, pero el generador calcula fechas usando date.today() (App.tsx:49, routes.py:97). Es una discrepancia conocida: no “corregir” un lado por separado sin decidir qué periodo debe representar el producto.

* Semilla aplicada al RNG global. random.seed(seed) dentro de enerate_mock_movements reinicia el estado aleatorio global del proceso (routes.py:94). Si otros módulos usan random, el generador podría afectar su comportamiento; para aislarlos, sería preferible una instancia local de random.Random.

* Posible carrera al iniciar. Compose declara depends_on, pero no un healthcheck; el frontend hace una carga al montarse y muestra error si falla, sin reintento visible en ese flujo (docker-compose.yml:11, App.tsx:29). Si aparece un fallo intermitente al arrancar, comprueba primero si el backend ya estaba listo.

* CORS permisivo. La API permite todos los orígenes, métodos y encabezados, junto con credenciales (main.py:9). Puede ser una conveniencia de desarrollo; para desplegar, conviene configurar los orígenes autorizados explícitamente.
Estas son advertencias para orientar cambios futuros; no implican que haya que modificar ahora el comportamiento intencional del proyecto.

## Convenciones utiles.

- Respeta la frontera de servicios: solo frontend y backend; no agregues base de datos, autenticación ni otro servicio sin una petición explícita. two-service-boundary.md

- Mantén un contrato coherente: los movimientos usan campos snake_case; los KPI calculados en la interfaz, camelCase. No conviertas los campos de la API. api-field-contract.md

- Trata el generador del backend como fuente de datos: usa generate_mock_movements(seed=42). La UI no debe sustituirlo por mock-data.ts; conserva sus 360 movimientos salvo que actualices también las pruebas. mock-generator-is-source.md

- Conserva el flujo del dashboard: llama a GET /api/metrics y calcula KPI y series mensuales en el cliente con las utilidades existentes. dashboard-math-stays-client-side.md

- No elimines rutas porque la UI no las use. Las rutas adicionales de métricas también forman parte de la API y tienen pruebas. keep-unused-endpoints.md

- Preserva la red de Docker: el proxy de Vite apunta a http://backend:8000; ese nombre es interno a Compose, no lo reemplaces por localhost. Distingue el puerto publicado en el host del puerto del contenedor. 

- preserve-docker-wiring.md

- No sincronices la etiqueta y las fechas unilateralmente: la etiqueta visible está fija en 2024 - Full Year, mientras que el generador depende de la fecha actual. Si se decide unificarlas, cambia ambos lados y sus pruebas. do-not-sync-period-label.md

- Prueba junto al comportamiento modificado: usa pytest para cambios del backend y el test de Vitest correspondiente para las utilidades financieras del frontend; evita correr toda la suite para un cambio pequeño. test-beside-behavior.md

- Evita cambios de estilo ajenos a la tarea: conserva idioma y convenciones existentes; para componentes nuevos, usa el alias @ y el estilo shadcn configurado. no-drive-by-style.md.

## HALLAZGOS 

 * Arquitectura: - Respetar fronteras entre forntend y backend y no agregar
                   componentes mezclando responsabilidades.
                 - preservar red de docker para mantener la correcta 
                   comunicación entre backend y frontend.  
 
 * Naming:       - Usar alias @ para simplificar rutas de importacion.      
                 - Mantener idioma y convenciones existentes para mantener la    
                   coherencia. 

 * Testing:       - Usar pytest para el backend y vytest para modificaciones 
                    puntuales.

 * Documentación: - Se recomienda señirse a las guias existentes evitando
                    cambios no establecidos.

 * DX :            -Mantener coherencia en el flujo de trabajo y asegurar la 
                    cosistencia de desarrollo local para garantizar el entorno para el equipo.               
                                    

