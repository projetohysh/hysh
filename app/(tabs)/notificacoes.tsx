import Header from '@/components/Header';
import NotificationCard from '@/components/NotificationCard';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Notificacao = {
  notificacao_id: number;
  notificacao_tipo: string;
  notificacao_criado_em: string;
  notificacao_lida: boolean;
  notificacao_origem_usuario_id: string | null;
  usuarios_origem?: { usuario_nome: string }[] | null;
};


export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: any = null;

    async function init() {
      await loadNotificacoes();

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      channel = supabase
        .channel('notificacoes-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notificacoes',
            filter: `usuario_id=eq.${userId}`
          },
          () => loadNotificacoes()
        )
        .subscribe();
    }

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  async function loadNotificacoes() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

const { data, error } = await supabase
  .from('notificacoes')
  .select(`
    notificacao_id,
    notificacao_tipo,
    notificacao_criado_em,
    notificacao_lida,
    notificacao_origem_usuario_id,
    usuarios_origem:usuarios!notificacoes_notificacao_origem_usuario_id_fkey (
      usuario_nome
    )
  `)
  .eq('usuario_id', userId)
  .order('notificacao_criado_em', { ascending: false });



    if (error) {
      console.log("Erro ao carregar notificações:", error);
    } else {
      setNotificacoes(data || []);
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle="Hysh" />
      <Text
        style={{
          color: '#636363',
          fontWeight: '600',
          fontSize: 24,
          alignSelf: 'center',
          marginBottom: 20,
        }}
      >
        Notificações
      </Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : notificacoes.length === 0 ? (
        <View style={{ marginTop: 50, alignItems: 'center' }}>
          <Text style={{ color: '#7c7c7c', fontSize: 16 }}>Nenhuma notificação ainda.</Text>
        </View>
      ) : (
        <ScrollView style={{ paddingHorizontal: 10 }}>
          {notificacoes.map((n) => (
            <NotificationCard 
              key={n.notificacao_id}
              tipo={n.notificacao_tipo}
              content={`Enviado em: ${new Date(n.notificacao_criado_em).toLocaleString()}`}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ede5f7',
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
