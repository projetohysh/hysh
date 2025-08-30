import Header from '@/components/Header';
import NewPostButton from '@/components/NewPostButton';
import PostCard, { PostCardProps } from '@/components/PostCard';
import React, { useState } from 'react';
import { FlatList, Platform, RefreshControl, SafeAreaView, StyleSheet } from 'react-native';

export default function HomeScreen() {

const [refreshing, setRefreshing] = useState(false);

const onRefresh = () => {
  setRefreshing(true);
  setTimeout(() => setRefreshing(false), 2000); // Simula loading
};

const feed: PostCardProps[] = [
 { id: '1', postOwner: 'Allan Kennedy', content: 'Javascript é uma linguagem muito legal', profPic: 'https://pbs.twimg.com/profile_images/1951145033362468864/QZaHayVH_400x400.jpg', username: 'allan_kennedy', postTime: '2h' },
  { id: '2', postOwner: 'Açucena Grande', content: 'to ouvindo taylor swift', profPic: 'https://pbs.twimg.com/profile_images/1904882959951208448/L2Pn91zU_400x400.jpg', username: 'acwcena', postTime: '1h' },
  { id: '3', postOwner: 'Murilo Ribeiro', content: 'mas ele não entende... no tempo dele não havia paredão. casa de praia só quem tinha era barão :/', profPic: 'https://pbs.twimg.com/media/GS9kHJXXQAAanoY?format=jpg&name=large', username: 'muriloribs33', postTime: '30m' },
  { id: '4', postOwner: 'Dani Psi', content: 'Eu sei o caminho pra minha casa, viu?', profPic: 'https://img.freepik.com/vetores-gratis/simbolo-de-psicologia-de-design-plano_23-2151089339.jpg', username: 'danipsico', postTime: '15m' },
  { id: '5', postOwner: 'Patrick Shark', content: 'Vei, achei um microprocessador bem baratinho e bom.', profPic: 'https://pbs.twimg.com/profile_images/1585808015806046208/zE0y52Qu_400x400.jpg', username: 'patrick_shark', postTime: '5m' },
  { id: '6', postOwner: 'GG Gatinho', content: 'vou orientar o tcc de ngm', profPic: require('@/assets/images/logo hysh.png'), username: 'gggatinho', postTime: '2m' },
  { id: '7', postOwner: 'Jamilly', content: 'queria mt saber oq esse povo faz entre 11 da noite e 5 da manhã', profPic: require('@/assets/images/logo hysh.png'), username: 'jamilly_123', postTime: '1m' },
  { id: '8', postOwner: 'Lucas Kevyn', content: 'vou passando pela prova dando glória a Deus.', profPic: 'https://avatars.githubusercontent.com/u/145145831?s=130&v=4', username: 'kevyndart', postTime: '30s' },
  { id: '9', postOwner: 'Felipe Kenickie', content: 'queria trabalhar com php pro resto da vida, pense numa linguagem boa', profPic: 'https://avatars.githubusercontent.com/u/109770489?s=130&v=4', username: 'felpsants', postTime: '10s' },
  { id: '10', postOwner: 'Coreano Safado', content: 'As vezes eu fico pensando e se Mas ai eu lembro que é todo mundo do mesmo grupo de amigos da faculdade e falo a probabilidade de dar merda é grande, mas a de da bom tbm é mt grande ai eu n sei oq fazer', profPic: 'https://pbs.twimg.com/profile_images/1910677195955027968/EPHL-Hy4_400x400.jpg', username: 'rico', postTime: '10s' },
];

  return (
    <SafeAreaView style={styles.container}>
      
      <Header headerTitle='Hysh'/>
      <FlatList
 refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#5C39BE']}
      tintColor='#5C39BE'
    />
  }     
        data={feed}
        renderItem={({ item }) => <PostCard {...item} />}
        keyExtractor={(item) => item.id}
        style={{ marginBottom: Platform.OS === 'ios' ? 30 : 0 }}
      />
      <NewPostButton/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding:Platform.OS === 'android' ? 0 : 16, backgroundColor: '#ede5f7', paddingTop: Platform.OS === 'android' ? 25 : 0, },
});
