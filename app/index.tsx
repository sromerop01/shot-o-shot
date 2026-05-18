import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { defaultImage } from '../src/images';

export default function MainScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill}>
        <Image source={defaultImage} style={styles.background} resizeMode="contain" />
      </View>

      <View style={[styles.buttonRow, { paddingBottom: insets.bottom + 24 }]}>
        <Link href="/game" asChild>
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Iniciar</Text>
          </Pressable>
        </Link>

        <Link href="/instructions" asChild>
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Instrucciones</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
    width: '100%',
  },
  buttonRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
