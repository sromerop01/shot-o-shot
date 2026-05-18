# Shot o Shot — Prototipo React Native + Expo

Migración del proyecto Kivy original a React Native usando Expo Router y TypeScript.
Replica las tres pantallas (menú, instrucciones, juego) y la mecánica de mostrar
las 74 imágenes en orden aleatorio sin repetir.

## Estructura

```
ShotoShotRN/
├── app/
│   ├── _layout.tsx        # Stack navigator (sin headers, fondo negro)
│   ├── index.tsx          # Pantalla principal (botones Iniciar / Instrucciones)
│   ├── instructions.tsx   # Pantalla de instrucciones
│   └── game.tsx           # Pantalla de juego (toque para avanzar)
├── src/
│   ├── images.ts          # Manifiesto estático de los 74 require()
│   └── shuffle.ts         # Fisher-Yates shuffle
├── assets/
│   ├── images/            # recurso1.jpg … recurso74.jpg
│   ├── default_image.jpg
│   ├── instructions.jpg
│   ├── logo.png
│   ├── icon.png           # placeholder, reemplazar antes de release
│   └── splash.png         # placeholder, reemplazar antes de release
├── app.json               # config de Expo
├── package.json
├── tsconfig.json
└── babel.config.js
```

## Requisitos

- Node.js 20 LTS o superior
- npm o pnpm
- Para iOS: macOS con Xcode (solo para abrir el simulador; con Expo Go en
  iPhone físico no hace falta Xcode)
- Para Android: Android Studio (solo para el emulador) o un dispositivo con Expo Go

## Arranque

```bash
cd ShotoShotRN
npm install
npx expo start
```

Luego:
- Pulsa `i` para abrir el simulador de iOS
- Pulsa `a` para abrir el emulador de Android
- O escanea el QR con la app **Expo Go** en tu teléfono

## Comprobar tipos

```bash
npm run typecheck
```

## Build de producción

Configura cuenta de Expo y EAS CLI:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Luego para iOS / Android:

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

Y para enviar a las stores:

```bash
eas submit --platform ios
eas submit --platform android
```

## Pendientes antes de release

- Reemplazar `assets/icon.png` y `assets/splash.png` con versiones diseñadas
  (Expo recomienda 1024×1024 para icon y 1284×2778 para splash en iOS).
- Revisar `ios.bundleIdentifier` y `android.package` en `app.json`
  — ahora mismo están como `com.santiago.shotoshot`.
- Comprimir las JPG en `assets/images/` (TinyJPG o ImageOptim) para reducir
  el tamaño del bundle.
- Verificar licencias de las imágenes si vas a publicar.

## Notas técnicas

**Sobre el manifiesto de imágenes (`src/images.ts`).** React Native usa Metro
como bundler y resuelve los `require()` en tiempo de build, no en runtime.
Por eso no se puede listar archivos dinámicamente como en Python con
`os.listdir`. El archivo `src/images.ts` mantiene la lista completa. Si añades
imágenes nuevas, hay que añadirlas a este archivo (o regenerarlo con un
script).

**Sobre el `counter` en GameScreen.** Es un detalle que el original Kivy no
tenía — muestra "12 / 74" mientras juegas. Si prefieres replicar exactamente
el comportamiento del original (sin contador), borra el `<Text style={styles.counter}>`
en `app/game.tsx`.
