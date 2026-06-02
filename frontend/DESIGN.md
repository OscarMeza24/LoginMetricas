# Design System — LoginMetricas Frontend

Decisiones de diseño inspiradas en [Impeccable](https://impeccable.style/), adaptadas a una app móvil de autenticación con React Native y Expo.

## Principios aplicados

### Lo que evitamos

- **Gradientes púrpura-azul** — Asociados al “AI slop”; reemplazados por fondo plano tipo papel cálido.
- **Inter** — Tipografía genérica de producto SaaS; usamos **DM Sans** como alternativa legible y con carácter.
- **Texto gris sobre color** — Baja legibilidad y contraste pobre; texto sobre fondos de color usa blanco (`#FFFFFF`) o tonos oscuros de tinta sobre superficies claras.
- **Anidación de tarjetas** — Tarjetas dentro de tarjetas generan ruido visual; usamos secciones planas con bordes sutiles sobre el fondo papel.

### Lo que priorizamos

- **Paleta cálida y editorial** — Fondo papel (`#F7F2EB`), tinta oscura (`#2C2416`), verde bosque como primario (`#2D5A3D`), terracota como acento (`#C4694A`).
- **Jerarquía tipográfica clara** — Títulos en DM Sans Bold, cuerpo en Regular, acciones en Medium.
- **Espaciado generoso** — Escala de 4/8/16/24/32 px para respiración entre bloques.
- **Componentes reutilizables** — `ScreenShell`, `AppButton`, `AppInput`, `FormField` centralizan estilo y comportamiento.

## Tokens (`src/theme/tokens.js`)

| Token | Valor | Uso |
|-------|-------|-----|
| `colors.paper` | `#F7F2EB` | Fondo de pantalla |
| `colors.surface` | `#FFFCF7` | Inputs, secciones elevadas |
| `colors.ink` | `#2C2416` | Texto principal |
| `colors.primary` | `#2D5A3D` | Botones primarios, enlaces |
| `colors.accent` | `#C4694A` | CTAs secundarios, enlaces de recuperación |
| `colors.success` / `error` | Verde / rojo tierra | Badges de estado |

## Componentes

### ScreenShell

Contenedor base con `SafeAreaView`, fondo papel, título/subtítulo opcionales y soporte para scroll o teclado (`KeyboardAwareScrollView`).

### AppButton

Variantes: `primary`, `accent`, `outline`, `ghost`, `danger`, `surface`. Estados de carga y deshabilitado integrados.

### AppInput / FormField

Input con borde sutil, placeholder en `inkLight`, label encima del campo (patrón formulario accesible).

## Navegación

- **Auth stack**: Login → Register → ForgotPassword (sin header nativo; acciones en pantalla).
- **App stack**: Home (sin header) → Profile, ChangePassword, Users (header con fondo papel y tinte verde bosque).

## Accesibilidad

- `accessibilityRole` en botones y enlaces.
- Contraste texto/fondo cumple lectura sobre superficies claras.
- Área táctil mínima ~48 px en botones e inputs.

## Demo

Credenciales admin para pruebas: `admin@admin.com` / `Admin123!`
