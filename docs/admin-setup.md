# Panel privado de visitas

URL: /admin. No tiene contraseña por defecto ni secretos en GitHub.

## Activación en Vercel

1. En micayadri-vercel > Storage, crear/conectar Upstash Redis mediante Marketplace. Elegir el plan gratuito si está disponible y revisar los límites antes de confirmar. Conectar a Production. El código acepta UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN, o KV_REST_API_URL y KV_REST_API_TOKEN.
2. En Settings > Environment Variables, agregar ADMIN_PASSWORD para Production. Usar una contraseña aleatoria de al menos 16 caracteres, por ejemplo la generada por un administrador de contraseñas. No usar NEXT_PUBLIC_, no guardar en GitHub.
3. Redeploy del último commit para aplicar variables. Abrir /admin e ingresar esa contraseña. Probar una visita en incógnito y actualizar el panel.

## Qué mide

Visitas por día y hora de Argentina, visitantes diarios estimados, países aproximados, tipo de dispositivo, apertura de lista de regalos y copias exitosas del alias. No prueba transferencias ni compras. Retención 90 días. Las personas estimadas no se suman como únicas entre días.

Sin cookies de seguimiento ni identificadores persistentes de visitantes. Se usa HMAC diario de IP y user agent para deduplicar el día, con conjuntos que expiran en 48 horas. No se guardan IP crudas. Se respeta Do Not Track y se filtran bots conocidos. Los administradores autenticados se excluyen. La cookie de administración es HttpOnly, SameSite Strict, Secure en producción y expira en 8 horas. Cambiar ADMIN_PASSWORD invalida sesiones anteriores. Cinco intentos de login por IP cada 15 minutos, límite de eventos 60 por minuto por IP. Las estadísticas son orientativas y pueden verse afectadas por bloqueadores o tráfico automatizado.

La web pública no depende del servicio: si no está configurado o falla, sigue funcionando. /api/stats no entrega estadísticas sin autenticación y no almacena nada hasta que se configuren ambos servicios. En entornos sin Vercel la limitación de IP comparte una clave local. No desplegar detrás de otro proxy sin adaptar la cabecera de IP confiable.

## Verificación de activación

Sin sesión, GET /api/stats devuelve 401 una vez configurado, o 503 antes. Con sesión devuelve datos reales, nunca cifras de demostración. El clic en la lista usa el enlace real, sin interceptar navegación. Alias solo se registra si se copió correctamente. El período se valida a 7/30/90 días. El panel no actualiza automáticamente, usar Actualizar.
