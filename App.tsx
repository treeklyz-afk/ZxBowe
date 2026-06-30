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
  ActivityIndicator,
  Switch
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

// 1. Offline/Local Data Feed
const OFFLINE_POSTS = [
  {
    id: '1',
    title: 'React Native Advanced Performance Optimization Guide 2026',
    description: 'Learn how to handle high-density layouts, custom multi-threaded animations, and optimize native bundle sizes for heavy high-end production applications.',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Sample video link for playback
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
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    author: 'Real Tech Learn',
    views: '85K views',
    time: '1 week ago',
    externalLink: 'https://reactnative.dev'
  }
];

// 2. Simulated Live API Server Data Feed
const LIVE_SERVER_POSTS = [
  {
    id: 'api-1',
    title: '[LIVE API] Cloud Native Architecture & Microservices Mastery',
    description: 'Streaming directly from the Live API endpoint. Comprehensive system architecture design for scalable web frameworks.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    author: 'API Core Server',
    views: '9.4M streams',
    time: 'Just Now',
    externalLink: 'https://google.com'
  }
];

export default function App() {
  // Navigation & Modal Controllers
  const [screen, setScreen] = useState<'splash' | 'home'>('splash');
  const [selectedPost, setSelectedPost] = useState<typeof OFFLINE_POSTS[0] | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [inAppBrowserUrl, setInAppBrowserUrl] = useState<string | null>(null);

  // App Functional States (iOS System Settings Switches)
  const [isInAppLinkEnabled, setIsInAppLinkEnabled] = useState(true);
  const [isPlayerModeEnabled, setIsPlayerModeEnabled] = useState(true);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Content System Feed State
  const [posts, setPosts] = useState(OFFLINE_POSTS);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Initial App Launch Splash Control
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('home');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic Content Trigger when API Connection Mode toggled
  useEffect(() => {
    setIsLocalLoading(true);
    const delayTimer = setTimeout(() => {
      if (isApiConnected) {
        setPosts(LIVE_SERVER_POSTS);
      } else {
        setPosts(OFFLINE_POSTS);
      }
      setIsLocalLoading(false);
    }, 1500);

    return () => clearTimeout(delayTimer);
  }, [isApiConnected]);

  // Comprehensive URL Forwarder / Action Handler
  const handleLinkPress = (url: string) => {
    if (isInAppLinkEnabled) {
      setInAppBrowserUrl(url); // App ke andar hi WebView panel me page open karega
    } else {
      Linking.openURL(url); // App se bahar phone browser pe redirect karega
    }
  };

  // --- 1. PREMIUM SPLASH SCREEN ---
  if (screen === 'splash') {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <Image 
          source={{ uri: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmtkM3MzdDR2a2I1cWN5NmU0amE1bWd5aDJuZzdyMnpyNW9id3JjNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3RsPTE/13FrpeVH8TOqlc/giphy.gif' }} 
          style={styles.splashGif}
          resizeMode="contain"
        />
        <Text style={styles.splashText}>Real Tech Learn</Text>
      </View>
    );
  }

  // --- 2. HOME INTERFACE LAYOUT ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Pure Black Pitch Header matching user profile request */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Real Tech Learn</Text>
        <TouchableOpacity style={styles.avatarWrapper} onPress={() => setSettingsVisible(true)}>
          <View style={styles.iosAvatarInside}>
            <View style={styles.avatarHead} />
            <View style={styles.avatarBody} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Conditional Custom Pretty GIF Loading Interface */}
      {isLocalLoading ? (
        <View style={styles.loaderContainer}>
          <Image 
            source={{ uri: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmskM3MzdDR2a2I1cWN5NmU0amE1bWd5aDJuZzdyMnpyNW9id3JjNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3RsPTE/13FrpeVH8TOqlc/giphy.gif' }}
            style={styles.loadingProgressGif}
          />
          <Text style={styles.loadingSubtext}>Fetching Secure Server Sync...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Latest Tutorials</Text>

          {posts.map((post) => (
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
      )}

      {/* --- 3. DETAIL MEDIA SCREEN (MODAL VIEWPORT) --- */}
      {selectedPost && (
        <Modal animationType="slide" transparent={false} visible={!!selectedPost}>
          <SafeAreaView style={styles.detailContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={() => setSelectedPost(null)} style={styles.backButton}>
                <Text style={styles.backButtonText}>✕ Close</Text>
              </TouchableOpacity>
              <Text style={styles.detailHeaderTitle} numberOfLines={1}>Tutorial Details</Text>
            </View>

            <ScrollView bounces={false}>
              {/* Complex Conditional Engine for Video Playback System */}
              {isPlayerModeEnabled && selectedPost.videoUrl ? (
                <View style={styles.videoPlayerFrame}>
                  <WebView 
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsFullscreenVideo={true}
                    mediaPlaybackRequiresUserAction={false}
                    source={{ uri: selectedPost.videoUrl }} 
                    style={{ flex: 1, backgroundColor: '#000000' }}
                  />
                </View>
              ) : (
                <Image source={{ uri: selectedPost.thumbnail }} style={styles.detailBigThumbnail} />
              )}
              
              <View style={styles.detailBody}>
                <Text style={styles.detailTitle}>{selectedPost.title}</Text>
                <Text style={styles.detailMeta}>{selectedPost.views} • {selectedPost.time}</Text>
                <View style={styles.divider} />
                <Text style={styles.detailDescription}>{selectedPost.description}</Text>

                {selectedPost.externalLink ? (
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => handleLinkPress(selectedPost.externalLink)}
                  >
                    <Text style={styles.actionButtonText}>Access Source Files</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      {/* --- 4. ADVANCED IN-APP WEBBROWSER LAYER --- */}
      {inAppBrowserUrl && (
        <Modal animationType="fade" visible={!!inAppBrowserUrl}>
          <SafeAreaView style={styles.browserContainer}>
            <View style={styles.browserHeader}>
              <TouchableOpacity onPress={() => setInAppBrowserUrl(null)} style={styles.backButton}>
                <Text style={styles.backButtonText}>✕ Return to App</Text>
              </TouchableOpacity>
              <Text style={styles.browserHeaderTitle} numberOfLines={1}>{inAppBrowserUrl}</Text>
            </View>
            <WebView source={{ uri: inAppBrowserUrl }} style={{ flex: 1 }} />
          </SafeAreaView>
        </Modal>
      )}

      {/* --- 5. HIGH INTEGRITY iOS STYLE SETTINGS ROW SHEET --- */}
      <Modal animationType="pageSheet" transparent={true} visible={settingsVisible} onRequestClose={() => setSettingsVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.iosPanel}>
            <View style={styles.iosDragIndicator} />
            <View style={styles.iosPanelHeader}>
              <Text style={styles.iosPanelTitle}>App Core Configuration</Text>
              <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                <Text style={styles.iosDoneButton}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.iosMenuScroll}>
              <View style={styles.iosProfileSection}>
                <View style={styles.iosProfileAvatar} />
                <Text style={styles.iosProfileName}>Developer Suite Console</Text>
                <Text style={styles.iosProfileEmail}>system@realtechlearn.com</Text>
              </View>

              <Text style={styles.iosGroupLabel}>PREFERENCES SYSTEM</Text>
              <View style={styles.iosMenuSection}>
                {/* Switch Row 1: In App URL Interceptor */}
                <View style={styles.iosRow}>
                  <View>
                    <Text style={styles.iosRowText}>Enable In-App Links</Text>
                    <Text style={styles.iosRowSubtext}>Render external hyperlinks natively</Text>
                  </View>
                  <Switch 
                    value={isInAppLinkEnabled} 
                    onValueChange={setIsInAppLinkEnabled}
                    trackColor={{ false: '#2c2c2e', true: '#34c759' }}
                    thumbColor="#ffffff"
                  />
                </View>

                {/* Switch Row 2: In App Inline Video Control */}
                <View style={styles.iosRow}>
                  <View>
                    <Text style={styles.iosRowText}>Player Mode System</Text>
                    <Text style={styles.iosRowSubtext}>Load internal multi-media layers</Text>
                  </View>
                  <Switch 
                    value={isPlayerModeEnabled} 
                    onValueChange={setIsPlayerModeEnabled}
                    trackColor={{ false: '#2c2c2e', true: '#34c759' }}
                    thumbColor="#ffffff"
                  />
                </View>

                {/* Switch Row 3: API Pipeline Connector */}
                <View style={[styles.iosRow, { borderBottomWidth: 0 }]}>
                  <View>
                    <Text style={styles.iosRowText}>Connect API Server</Text>
                    <Text style={styles.iosRowSubtext}>Fetch live dynamic cloud objects</Text>
                  </View>
                  <Switch 
                    value={isApiConnected} 
                    onValueChange={setIsApiConnected}
                    trackColor={{ false: '#2c2c2e', true: '#34c759' }}
                    thumbColor="#ffffff"
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' },
  splashGif: { width: 120, height: 120 },
  splashText: { fontFamily: 'San Francisco', fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginTop: 15, letterSpacing: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' },
  loadingProgressGif: { width: 70, height: 70 },
  loadingSubtext: { fontFamily: 'San Francisco', color: '#8e8e93', fontSize: 13, marginTop: 12 },
  header: { height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 0.5, borderColor: '#1c1c1e', backgroundColor: '#000000' },
  headerTitle: { fontFamily: 'San Francisco', fontSize: 24, fontWeight: '800', color: '#ffffff', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  avatarWrapper: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1c1c1e', justifyContent: 'center', alignItems: 'center' },
  iosAvatarInside: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  avatarHead: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#aeaeae', marginBottom: 1 },
  avatarBody: { width: 14, height: 7, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: '#aeaeae' },
  scrollArea: { padding: 16, backgroundColor: '#000000' },
  sectionTitle: { fontFamily: 'San Francisco', fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 16 },
  postCard: { width: '100%', backgroundColor: '#0a0a0c', borderRadius: 14, overflow: 'hidden', marginBottom: 20, borderWidth: 0.5, borderColor: '#1c1c1e' },
  thumbnail: { width: '100%', height: width * 0.54, backgroundColor: '#1c1c1e' },
  cardDetails: { flexDirection: 'row', padding: 12, backgroundColor: '#0a0a0c' },
  channelBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#bf5af2', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  badgeText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  textContainer: { flex: 1 },
  postTitle: { fontFamily: 'San Francisco', fontSize: 15, fontWeight: '600', color: '#ffffff', lineHeight: 20 },
  metadata: { fontFamily: 'San Francisco', fontSize: 12, color: '#8e8e93', marginTop: 4 },
  detailContainer: { flex: 1, backgroundColor: '#000000' },
  detailHeader: { height: 55, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 0.5, borderColor: '#1c1c1e', backgroundColor: '#000000' },
  backButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#1c1c1e', borderRadius: 16 },
  backButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 13, fontFamily: 'San Francisco' },
  detailHeaderTitle: { color: '#8e8e93', marginLeft: 14, fontSize: 13, fontWeight: '500', width: width * 0.6, fontFamily: 'San Francisco' },
  detailBigThumbnail: { width: '100%', height: width * 0.56 },
  videoPlayerFrame: { width: '100%', height: width * 0.56, backgroundColor: '#000000' },
  detailBody: { padding: 16 },
  detailTitle: { fontFamily: 'San Francisco', fontSize: 19, fontWeight: '700', color: '#ffffff', lineHeight: 26 },
  detailMeta: { fontFamily: 'San Francisco', fontSize: 13, color: '#8e8e93', marginTop: 6 },
  divider: { height: 0.5, backgroundColor: '#1c1c1e', marginVertical: 14 },
  detailDescription: { fontFamily: 'San Francisco', fontSize: 14, color: '#eaeaea', lineHeight: 22 },
  actionButton: { backgroundColor: '#bf5af2', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  actionButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600', fontFamily: 'San Francisco' },
  browserContainer: { flex: 1, backgroundColor: '#ffffff' },
  browserHeader: { height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#000000' },
  browserHeaderTitle: { color: '#8e8e93', fontSize: 12, marginLeft: 12, flex: 1, fontFamily: 'San Francisco' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  iosPanel: { height: '82%', backgroundColor: '#000000', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  iosDragIndicator: { width: 36, height: 5, backgroundColor: '#2c2c2e', borderRadius: 3, alignSelf: 'center', marginTop: 8 },
  iosPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5, borderColor: '#1c1c1e' },
  iosPanelTitle: { fontSize: 17, fontWeight: 'bold', color: '#ffffff', fontFamily: 'San Francisco' },
  iosDoneButton: { fontSize: 16, color: '#bf5af2', fontWeight: '600', fontFamily: 'San Francisco' },
  iosMenuScroll: { padding: 16 },
  iosProfileSection: { alignItems: 'center', marginVertical: 12 },
  iosProfileAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#1c1c1e', borderWidth: 1.5, borderColor: '#bf5af2' },
  iosProfileName: { color: '#ffffff', fontSize: 16, fontWeight: '600', marginTop: 8, fontFamily: 'San Francisco' },
  iosProfileEmail: { color: '#8e8e93', fontSize: 12, marginTop: 1, fontFamily: 'San Francisco' },
  iosGroupLabel: { color: '#8e8e93', fontSize: 11, fontWeight: '500', marginLeft: 6, marginBottom: 6, marginTop: 14, fontFamily: 'San Francisco' },
  iosMenuSection: { backgroundColor: '#0a0a0c', borderRadius: 10, paddingHorizontal: 14, borderWidth: 0.5, borderColor: '#1c1c1e' },
  iosRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderColor: '#1c1c1e' },
  iosRowText: { fontSize: 14, color: '#ffffff', fontFamily: 'San Francisco', fontWeight: '500' },
  iosRowSubtext: { fontSize: 11, color: '#8e8e93', fontFamily: 'San Francisco', marginTop: 2 },
  iosRowValue: { fontSize: 14, color: '#8e8e93', fontFamily: 'San Francisco' }
});
