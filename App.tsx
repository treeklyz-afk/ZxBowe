import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Mock Data: Bilkul Real YouTube style content feed ke liye
const DUMMY_POSTS = [
  {
    id: '1',
    title: 'React Native Advanced Performance Optimization Guide 2026',
    description: 'Learn how to handle high-density layouts, custom multi-threaded animations, and optimize native bundle sizes for heavy high-end production applications.',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop',
    author: 'Real Tech Learn',
    views: '120K views',
    time: '2 days ago',
    externalLink: 'https://github.com'
  },
  {
    id: '2',
    title: 'Mastering GitHub Actions for Android & iOS CI/CD Pipelines',
    description: 'Build, test, auto-sign, and automatically release high-grade production applications directly to Play Store and App Store using clean automated runners.',
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop',
    author: 'Real Tech Learn',
    views: '85K views',
    time: '1 week ago',
    externalLink: '' // Isme link nahi hai, toh button auto-hide ho jayega
  }
];

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'home'>('splash');
  const [selectedPost, setSelectedPost] = useState<typeof DUMMY_POSTS[0] | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Splash Screen Display Timer (3 Seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('home');
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Custom iOS Styled Vector Avatar/Icon Component
  const AccountIcon = () => (
    <TouchableOpacity style={styles.avatarWrapper} onPress={() => setSettingsVisible(true)}>
      <View style={styles.iosAvatarInside}>
        <View style={styles.avatarHead} />
        <View style={styles.avatarBody} />
      </View>
    </TouchableOpacity>
  );

  // --- 1. SPLASH SCREEN LAYOUT ---
  if (screen === 'splash') {
    return (
      <LinearGradient colors={['#070514', '#0f0c29', '#1b1236']} style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#070514" />
        <View style={styles.splashContent}>
          {/* Splash Animation Placeholder GIF Link */}
          <Image 
            source={{ uri: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmtkM3MzdDR2a2I1cWN5NmU0amE1bWd5aDJuZzdyMnpyNW9id3JjNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3RsPTE/13FrpeVH8TOqlc/giphy.gif' }} 
            style={styles.splashGif}
            resizeMode="contain"
          />
          <Text style={styles.splashText}>Real Tech Learn</Text>
          <ActivityIndicator size="small" color="#9d4edd" style={{ marginTop: 20 }} />
        </View>
      </LinearGradient>
    );
  }

  // --- 2. HOME SCREEN LAYOUT ---
  return (
    <LinearGradient colors={['#09070f', '#120e24', '#09070f']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09070f" />
      
      {/* Premium Header Layout */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Real Tech Learn</Text>
        <AccountIcon />
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Latest Tutorials</Text>

        {/* Dynamic Card Generation */}
        {DUMMY_POSTS.map((post) => (
          <TouchableOpacity 
            key={post.id} 
            style={styles.postCard} 
            activeOpacity={0.9} 
            onPress={() => setSelectedPost(post)}
          >
            <Image source={{ uri: post.thumbnail }} style={styles.thumbnail} />
            <View style={styles.cardDetails}>
              <View style={styles.channelBadge}>
                <Text style={styles.badgeText}>RT</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.postTitle} numberOfLines={2}>{post.title}</Text>
                <Text style={styles.metadata}>{post.author} • {post.views} • {post.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* --- 3. DYNAMIC DETAIL VIEW SCREEN (MODAL STACK) --- */}
      {selectedPost && (
        <Modal animationType="slide" transparent={false} visible={!!selectedPost}>
          <View style={styles.detailContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#09070f" />
            
            {/* Detail Screen Navigation bar */}
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={() => setSelectedPost(null)} style={styles.backButton}>
                <Text style={styles.backButtonText}>✕ Close</Text>
              </TouchableOpacity>
              <Text style={styles.detailHeaderTitle} numberOfLines={1}>Tutorial Details</Text>
            </View>

            <ScrollView>
              <Image source={{ uri: selectedPost.thumbnail }} style={styles.detailBigThumbnail} />
              
              <View style={styles.detailBody}>
                <Text style={styles.detailTitle}>{selectedPost.title}</Text>
                <Text style={styles.detailMeta}>{selectedPost.views} • {selectedPost.time}</Text>
                <View style={styles.divider} />
                <Text style={styles.detailDescription}>{selectedPost.description}</Text>

                {/* Conditional Rendering Logic: Link hoga tabhi button dikhega */}
                {selectedPost.externalLink ? (
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => Linking.openURL(selectedPost.externalLink)}
                  >
                    <Text style={styles.actionButtonText}>Access Source Files</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* --- 4. iOS STYLED USER SETTINGS MODAL --- */}
      <Modal animationType="pageSheet" transparent={true} visible={settingsVisible} onRequestClose={() => setSettingsVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.iosPanel}>
            <View style={styles.iosDragIndicator} />
            <View style={styles.iosPanelHeader}>
              <Text style={styles.iosPanelTitle}>Account Settings</Text>
              <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                <Text style={styles.iosDoneButton}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.iosMenuScroll}>
              <View style={styles.iosProfileSection}>
                <View style={styles.iosProfileAvatar} />
                <Text style={styles.iosProfileName}>Developer Account</Text>
                <Text style={styles.iosProfileEmail}>premium@realtechlearn.com</Text>
              </View>

              {/* iOS Stack Menu System Layout */}
              <View style={styles.iosMenuSection}>
                <View style={styles.iosRow}>
                  <Text style={styles.iosRowText}>App Version</Text>
                  <Text style={styles.iosRowValue}>v2.0.26</Text>
                </View>
                <View style={[styles.iosRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.iosRowText}>Dark Mode System</Text>
                  <Text style={styles.iosRowValue}>Pure Black</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  splashContent: { alignItems: 'center' },
  splashGif: { width: 140, height: 140 },
  splashText: { fontSize: 30, fontWeight: 'bold', color: '#ffffff', marginTop: 15, letterSpacing: 1.5, textShadowColor: 'rgba(157, 78, 221, 0.4)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 12 },
  header: { height: 65, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(9, 7, 15, 0.8)' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#ffffff', textShadowColor: 'rgba(0, 0, 0, 0.6)', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 6 },
  avatarWrapper: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255, 255, 255, 0.08)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' },
  iosAvatarInside: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  avatarHead: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#a0a0ab', marginBottom: 1 },
  avatarBody: { width: 14, height: 7, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: '#a0a0ab' },
  scrollArea: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#e2e2e9', marginBottom: 16, letterSpacing: 0.5 },
  postCard: { width: '100%', backgroundColor: '#17142b', borderRadius: 16, overflow: 'hidden', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)' },
  thumbnail: { width: '100%', height: width * 0.52, backgroundColor: '#1f1c38' },
  cardDetails: { flexDirection: 'row', padding: 14 },
  channelBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#7b2cbf', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  badgeText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  textContainer: { flex: 1 },
  postTitle: { fontSize: 15, fontWeight: '700', color: '#ffffff', lineHeight: 21 },
  metadata: { fontSize: 12, color: '#9a9aae', marginTop: 5 },
  detailContainer: { flex: 1, backgroundColor: '#09070f' },
  detailHeader: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  backButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20 },
  backButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 13 },
  detailHeaderTitle: { color: '#a0a0ab', marginLeft: 16, fontSize: 14, fontWeight: '500', width: width * 0.6 },
  detailBigThumbnail: { width: '100%', height: width * 0.56 },
  detailBody: { padding: 20 },
  detailTitle: { fontSize: 20, fontWeight: '800', color: '#ffffff', lineHeight: 28 },
  detailMeta: { fontSize: 13, color: '#88889d', marginTop: 8 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', marginVertical: 16 },
  detailDescription: { fontSize: 15, color: '#d1d1db', lineHeight: 24 },
  actionButton: { backgroundColor: '#9d4edd', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 28, shadowColor: '#9d4edd', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  actionButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  iosPanel: { height: '80%', backgroundColor: '#161426', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingtop: 8 },
  iosDragIndicator: { width: 40, height: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, alignSelf: 'center', marginTop: 10 },
  iosPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iosPanelTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  iosDoneButton: { fontSize: 16, color: '#9d4edd', fontWeight: '600' },
  iosMenuScroll: { padding: 18 },
  iosProfileSection: { alignItems: 'center', marginVertical: 15 },
  iosProfileAvatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#211d3b', borderWidth: 2, borderColor: '#9d4edd' },
  iosProfileName: { color: '#ffffff', fontSize: 17, fontWeight: '700', marginTop: 10 },
  iosProfileEmail: { color: '#88889d', fontSize: 13, marginTop: 2 },
  iosMenuSection: { backgroundColor: '#1e1b33', borderRadius: 12, marginTop: 20, paddingHorizontal: 16, overflow: 'hidden' },
  iosRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iosRowText: { fontSize: 15, color: '#ffffff' },
  iosRowValue: { fontSize: 14, color: '#88889d' }
});
