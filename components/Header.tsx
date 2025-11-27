import { supabase } from '@/lib/supabase';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Header({ headerTitle, font }: { 
  headerTitle: string; 
  font?: string; 
}) {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'BukkariScript': require('@/assets/fonts/BukhariScript.ttf'),
  });
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoadingUser(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        const { data, error: profileError } = await supabase
          .from('usuarios')
          .select('usuario_foto_url')
          .eq('id', user.id)
          .single();

        if (!profileError && data) {
          setProfilePic(data.usuario_foto_url);
        }
      }
      setLoadingUser(false);
    };

    loadUser(); 
  }, []); 

  if (!fontsLoaded || loadingUser) {
    return (
      <View style={styles.bg}>
        <Text style={[styles.header, font ? { fontFamily: font } : null]}>
          {headerTitle}
        </Text>
        <View style={styles.placeholderAvatar} />
      </View>
    );
  }

  return (
    <View style={styles.bg}>
      <Text style={[styles.header, font ? { fontFamily: font } : null, {maxWidth:250}]} numberOfLines={1} ellipsizeMode="tail">
        {headerTitle}
      </Text>
      
      {userId ? (
        <Pressable 
          onPress={() => router.push(`/(profile)/${userId}`)} 
          style={{ marginRight: 10 }}
        >
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : { uri: 'https://img.icons8.com/?size=100&id=7819&format=png&color=5C39BE' }
            }
            style={styles.avatar}
            resizeMode="cover"
          />
        </Pressable>
      ) : (
        <View style={styles.placeholderAvatar} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#5C39BE', 
    fontFamily: 'BukkariScript', 
    lineHeight: 70, 
    paddingVertical: 5 
  },
  bg: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 30, 
    backgroundColor: '#ede5f7', 
    justifyContent: 'space-between', 
    maxHeight: 80, 
    marginBottom: -10, 
    marginTop: -10 
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
});