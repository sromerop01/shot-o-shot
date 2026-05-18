import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gameImages } from '@/src/images';
import { shuffle } from '@/src/shuffle';

export default function GameScreen() {
  const router = useRouter();

  // Mezcla las imágenes una sola vez por sesión de juego.
  const deck = useMemo(() => shuffle(gameImages), []);
  const [index, setIndex] = useState(0);

  const isFinished = index >= deck.length;

  const advance = () => {
    if (isFinished) return;
    setIndex((i) => i + 1);
  };

  if (isFinished) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.endContainer}>
          <Text style={styles.endText}>¡Fin del juego!</Text>

          <View style={styles.endButtons}>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
              onPress={() => setIndex(0)}
            >
              <Text style={styles.buttonText}>Volver a jugar</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.button, styles.buttonOutline, pressed && styles.pressed]}
              onPress={() => router.replace('/')}
            >
              <Text style={[styles.buttonText, styles.buttonTextOutline]}>Volver al menú</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Pressable style={styles.root} onPress={advance}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.imageWrap}>
          <Image source={deck[index]} style={styles.image} resizeMode="contain" />
        </View>

        <Text style={styles.counter}>
          {index + 1} / {deck.length}
        </Text>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  imageWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  counter: {
    color: '#FFF',
    textAlign: 'center',
    paddingBottom: 16,
    fontSize: 14,
    opacity: 0.6,
  },
  endContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  endText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 48,
  },
  endButtons: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonTextOutline: {
    color: '#FFF',
  },
});
