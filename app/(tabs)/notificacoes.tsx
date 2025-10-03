import Header from '@/components/Header';
import NotificationCard from '@/components/NotificationCard';
import { Platform, SafeAreaView, StyleSheet, Text } from 'react-native';
export default function Notificacoes() {
  return (
  <SafeAreaView style={styles.container}>
      <Header headerTitle='Hysh'/>
      <Text style={{color: '#636363', fontWeight: 'semibold', fontSize: 24, alignSelf: 'center', marginBottom: 20}}>Notificações</Text>
        <NotificationCard tipo='Novo comentário de Ricardo' content='Eu acho Yanes o melhor professor da UNIFAN.'/>
        <NotificationCard tipo='Nova comentário de Jamilly' content='Melhores alunos do mundo.'/>
        <NotificationCard tipo='Nova curtida em seu post' content='Encerrando o semestre com muita satisfação...'/>     
        <NotificationCard tipo='Novo post de Gean em Turma BD 25.2' content='Pessoal, aqui está o material de apoio!'/>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#ede5f7', flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0},
});
