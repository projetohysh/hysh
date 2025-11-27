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
        backgroundColor: '#fc000088',
        padding: 6,
        borderRadius: 8,
        alignItems: 'center',
        width: 100,
        alignSelf: "center",
        marginVertical:10
      }}
    >
      <Text style={{ color: 'white' }}>Sair</Text>
    </TouchableOpacity>
  );
}
