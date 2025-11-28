import { savePushToken } from "@/utils/pushNotifications";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function signInWithEmail() {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      Alert.alert("Email ou senha incorretos!", "Por favor, verifique novamente suas credenciais.")
    } else {
      await savePushToken(); 
      router.replace('/(tabs)')
    }
  }

  async function signUpWithEmail() {
    setLoading(true)

    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: email.split("@")[0],
          foto_url: null
        }
      }
    })

    setLoading(false)

    if (error) {
      Alert.alert('Erro', error.message)
      return
    }

    if (!session) {
      Alert.alert('Verifique seu e-mail para confirmar o cadastro!')
    }
    await savePushToken();
  router.replace('/(tabs)')
  }

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 50, fontWeight: 'bold', color: '#5C39BE', fontFamily: 'BukkariScript',marginBottom:60, lineHeight: 100, alignSelf: 'center' }}>Hysh</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="exemplo@hysh.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={signInWithEmail}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonOutline]}
        onPress={signUpWithEmail}
        disabled={loading}
      >
        <Text style={[styles.buttonText, styles.buttonOutlineText]}>
          Criar conta
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    padding: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5C39BE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5C39BE',
  },
  buttonOutlineText: {
    color: '#5C39BE',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
})
