# Cumplimiento ISO/IEC 25022 - MVP GraphQL Authentication

## Introducción

ISO/IEC **25022:2016** define medidas de **calidad en uso**: el efecto del software cuando usuarios reales lo utilizan en un contexto concreto. Se complementa con ISO/IEC **25023** (calidad del producto). Ver `ISO_25023_COMPLIANCE.md`.

Las cinco características de calidad en uso (modelo 25010):

1. **Efectividad** – el usuario logra sus objetivos  
2. **Eficiencia** – recursos mínimos para lograrlo  
3. **Satisfacción** – experiencia agradable y clara  
4. **Libertad de riesgo** – seguridad y privacidad percibidas  
5. **Cobertura de contexto** – funciona en distintos dispositivos/contextos  

---

## Medidas de calidad en uso

| Característica | Medida | Cómo se evalúa en el MVP | Resultado | Evidencia |
|----------------|--------|--------------------------|-----------|-----------|
| **Efectividad** | Tasa de tareas completadas | Usuario registra cuenta, inicia sesión y edita perfil sin ayuda | **Alta** | Flujos en `LoginScreen`, `RegisterScreen`, `ProfileScreen` |
| **Efectividad** | Precisión de tareas | Validaciones evitan datos inválidos antes de enviar al servidor | **Alta** | Validación cliente + servidor |
| **Eficiencia** | Pasos para login | Campos requeridos: email + contraseña (2 campos, 1 acción) | **2 pasos** | `LoginScreen.js` |
| **Eficiencia** | Pasos para registro | 5 campos en una pantalla, confirmación incluida | **1 pantalla** | `RegisterScreen.js` |
| **Eficiencia** | Tiempo de feedback | Indicadores de carga en botones durante peticiones | **Inmediato** | `AppButton` con `loading` |
| **Satisfacción** | Claridad de errores | Mensajes en español, específicos y accionables | **Alta** | Alerts con mensaje del servidor |
| **Satisfacción** | Consistencia visual | Design system Impeccable (tokens, componentes) | **Alta** | `DESIGN.md`, `theme/tokens.js` |
| **Satisfacción** | Legibilidad | DM Sans, contraste papel cálido / texto cálido oscuro | **Alta** | Sin texto gris sobre fondos de color |
| **Libertad de riesgo** | Percepción de seguridad | Contraseña oculta, requisitos visibles, token en almacenamiento seguro | **Alta** | `expo-secure-store`, reglas de contraseña |
| **Libertad de riesgo** | Privacidad | Mensajes genéricos en login/reset (no revelan si email existe) | **OK** | `services.py` login y reset |
| **Libertad de riesgo** | Control de sesión | Logout limpia token; sesión restaurada solo si JWT válido | **OK** | `authStore.js` |
| **Cobertura de contexto** | Multi-dispositivo | React Native + Expo (iOS, Android, Web) | **3 plataformas** | `package.json` scripts |
| **Cobertura de contexto** | Roles de usuario | Admin gestiona usuarios; cliente gestiona su perfil | **OK** | `UsersScreen`, `HomeScreen` |

---

## Demostración en clase (protocolo 25022)

### Escenario 1: Efectividad + Eficiencia (Login)

1. Abrir app → pantalla login  
2. Ingresar `admin@admin.com` / `Admin123!`  
3. **Medir:** ¿llegó al Home en ≤ 3 interacciones? → **Sí**  
4. **Evidencia:** captura de Home con datos de usuario  

### Escenario 2: Satisfacción (Recuperación de contraseña)

1. Ir a "¿Olvidaste tu contraseña?"  
2. Ingresar email → mensaje claro de confirmación  
3. **Medir:** ¿el usuario entiende el siguiente paso sin documentación? → **Sí**  

### Escenario 3: Libertad de riesgo (Contraseña)

1. Intentar registrar con contraseña débil  
2. **Medir:** ¿el sistema bloquea y explica qué falta? → **Sí**  
3. **Evidencia:** validación en `RegisterScreen` + `UserService.validate_password`  

### Escenario 4: Cobertura de contexto (Admin)

1. Login como admin → "Gestionar usuarios"  
2. Listar, desactivar, reactivar o eliminar un usuario de prueba  
3. **Medir:** ¿admin completa gestión sin consola GraphQL? → **Sí**  

---

## Diseño orientado a calidad en uso (Impeccable)

El frontend aplica principios **Impeccable** para evitar patrones que degradan la experiencia:

| Anti-patrón evitado | Beneficio en uso (25022) |
|---------------------|--------------------------|
| Gradientes púrpura genéricos | Identidad clara → mayor satisfacción |
| Texto gris sobre color | Legibilidad → menor frustración |
| Tarjetas anidadas | Jerarquía clara → mayor efectividad |
| Botones sin estado loading | Feedback inmediato → mayor eficiencia percibida |

Ver `frontend/DESIGN.md` para decisiones completas.

---

## Tabla resumen

| Característica 25022 | Valoración MVP | Estado |
|----------------------|----------------|--------|
| Efectividad | Alta | ✅ |
| Eficiencia | Alta (flujos cortos) | ✅ |
| Satisfacción | Alta (UI consistente) | ✅ |
| Libertad de riesgo | Alta (auth segura) | ✅ |
| Cobertura de contexto | Multi-plataforma + roles | ✅ |

---

## Conclusión

El MVP demuestra **calidad en uso** mediante flujos completos, feedback claro, seguridad perceptible y soporte multi-rol. Las medidas de **producto** (25023) se documentan por separado para una evaluación SQuaRE completa.
