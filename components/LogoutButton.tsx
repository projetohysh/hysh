import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Erro ao sair: ' + error.message);
    } else {
      router.replace('/(auth)/Login'); 
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={{
        backgroundColor: '#E74C3C',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sair</Text>
    </TouchableOpacity>
  );
}
