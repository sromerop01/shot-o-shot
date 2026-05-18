# Plan de migración a React Native + Expo

## Objetivo

Reemplazar la app actual de Kivy (Python) por una versión nativa multiplataforma en **React Native** usando **Expo + TypeScript**, manteniendo la misma mecánica de juego y los mismos 74 assets, pero con tooling moderno, look & feel nativo y un flujo de publicación a App Store / Play Store mucho más limpio.

## Decisiones de stack

| Tema | Decisión | Por qué |
|---|---|---|
| Framework | **Expo (managed workflow)** | EAS Build resuelve la compilación nativa de iOS/Android sin abrir Xcode/Android Studio |
| Lenguaje | **TypeScript** | Tipos detectan errores tempranos, estándar en RN moderno |
| Routing | **Expo Router** | File-based routing, recomendado por Expo, escalable |
| Estado | **useState** local | La app no necesita Redux/Zustand para 3 pantallas |
| Build / Release | **EAS Build + EAS Submit** | Pipeline oficial de Expo, mucho más fácil que firmar a mano |
| UI | Componentes nativos + `StyleSheet` | Sin librería extra de UI para mantener bundle ligero |

## Fases

### Fase 1 — Prototipo funcional local (1 sesión)
- Bootstrap del proyecto Expo en TypeScript.
- Copiar los 74 assets.
- Replicar las 3 pantallas: menú, instrucciones, juego.
- Replicar la lógica: mezclar imágenes, mostrar una por toque, no repetir, mostrar fin de juego.
- Correr en simulador iOS y emulador Android con `npx expo start`.

**Entregable:** la app corriendo en ambos simuladores. *(Esta fase queda completada con el prototipo que acompaña este plan.)*

### Fase 2 — Pulido visual y UX (2-3 sesiones)
- **Icono y splash screen** propios usando `logo.png` (Expo los genera con `expo-asset` + `app.json`).
- Tipografía propia (cargar fuente custom con `expo-font` si quieres alejarte de la del sistema).
- Reemplazar los botones de texto crudo por algo con estilo (bordes redondeados, sombra, color de marca).
- Animación de transición entre imágenes (`react-native-reanimated` o `LayoutAnimation` de RN).
- Vibración háptica al cambiar imagen (`expo-haptics`).
- Bloqueo de orientación a portrait en `app.json`.
- Pantalla "Fin del juego" con opción "Volver a jugar" además de "Volver al menú".

### Fase 3 — Funcionalidad opcional (según ambición)
Ideas que pueden tener sentido para "Shot o Shot":
- **Modo cronometrado**: cuenta atrás entre imágenes para forzar ritmo.
- **Categorías / sets**: distintos packs de imágenes (clásico, fiesta, parejas, etc.).
- **Sonido**: efecto al cambiar imagen, música de fondo opcional (`expo-av`).
- **Compartir resultado**: capturar pantalla y compartir vía `expo-sharing`.
- **Analytics**: PostHog o Firebase Analytics para entender cuánto se usa.
- **Compra in-app** si en algún momento quieres monetizar packs (`expo-in-app-purchases` o RevenueCat).

### Fase 4 — Preparación para release (1-2 sesiones)
- Cuenta de **Apple Developer** (USD 99/año) y **Google Play Console** (USD 25 una vez).
- Configurar `app.json`: `name`, `slug`, `version`, `ios.bundleIdentifier`, `android.package`, `ios.buildNumber`, `android.versionCode`.
- Generar icono y splash en todas las resoluciones requeridas (Expo lo hace solo si subes los archivos base).
- Crear build con **EAS Build**:
  - `eas build --platform ios --profile production`
  - `eas build --platform android --profile production`
- Capturas de pantalla para las stores (mínimo 3 por plataforma, ideal en cada tamaño de dispositivo).
- Política de privacidad — Apple y Google la exigen aunque tu app no recoja datos. Puede ser una página simple en GitHub Pages o Notion público.
- Descripción de la app, palabras clave, categoría.
- Subir con **EAS Submit**:
  - `eas submit --platform ios`
  - `eas submit --platform android`
- Revisión de Apple (1-3 días típicamente) y Google (horas a días).

## Mapeo Kivy → React Native

| Kivy | React Native |
|---|---|
| `ScreenManager` + `Screen` | Expo Router (`app/_layout.tsx` con `<Stack>`) |
| `FloatLayout` | `<View>` con `position: 'absolute'` o flexbox |
| `Image(source=...)` | `<Image source={require(...)} />` |
| `Button(text=..., on_press=...)` | `<Pressable onPress={...}>` |
| `Label(text=...)` | `<Text>...</Text>` |
| `on_touch_down` | `<Pressable onPress>` en el contenedor |
| `Color(0,0,0,1) + Rectangle` (canvas) | `<View style={{ backgroundColor: '#000' }} />` |
| `os.listdir('./images')` | Lista estática de `require()` en `images.ts` |
| `random.sample` | `[...arr].sort(() => Math.random() - 0.5)` o Fisher-Yates |

### Sobre las imágenes (importante)

React Native **no** carga assets dinámicamente con un path como hace Python con `os.listdir`. El bundler (Metro) necesita resolver los `require()` en tiempo de build. Por eso el prototipo incluye un archivo `src/images.ts` que exporta un array con las 74 imágenes precargadas con `require()`. Si añades imágenes nuevas, hay que añadirlas a ese archivo manualmente (o autogenerarlo con un script).

## Riesgos y consideraciones

**Tamaño del bundle.** 74 imágenes JPG empaquetadas pueden engordar la app a varios MB. Para producción conviene:
- Comprimir las JPG (TinyJPG, ImageOptim) — fácilmente -50% sin pérdida visible.
- Considerar servirlas remotamente desde un CDN si crecen mucho — pero perderías el modo offline. Para una app tipo "fiesta sin internet" probablemente NO quieres esto.

**Rotación de pantalla.** El original es portrait fijo (`orientation = portrait`). Mantenerlo así en `app.json` (`"orientation": "portrait"`).

**Costos.** Apple Developer USD 99/año, Google Play USD 25 una vez, EAS Build tiene plan gratuito con 30 builds/mes. Para esta app, gratuito alcanza.

**Curva de Expo Router.** Si te resulta confuso el routing basado en archivos, se puede migrar fácilmente a React Navigation stack clásico — son ~30 líneas de código.

## Esfuerzo estimado

| Fase | Tiempo estimado (dev intermedio con JS/TS) |
|---|---|
| Fase 1 — Prototipo | 2-4 horas |
| Fase 2 — Pulido visual | 4-8 horas |
| Fase 3 — Features opcionales | Variable, 1-10 horas según ambición |
| Fase 4 — Release a stores | 4-8 horas (sin contar tiempos de revisión de Apple/Google) |

**Total mínimo para publicar:** ~10-15 horas de trabajo, más 1-3 días de espera en revisiones.

## Lo que NO hay que hacer

- **No mantener Kivy y React Native en paralelo** — divide esfuerzo y se desincronizan. Migra una vez y archiva el original (`git tag pre-rn-migration` antes de borrar).
- **No abrir Xcode/Android Studio si no es necesario.** Con managed workflow y EAS Build no lo necesitas para esta app.
- **No incluir las 74 imágenes en el repo público sin verificar derechos**. Si las descargaste de internet o son de terceros, revisa licencias antes de subir a App Store/Play Store — Apple es estricta con esto.
