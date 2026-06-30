import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Switch,
  RefreshControl,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import Haptic from 'react-native-haptic-feedback';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// ---------- Data ----------
const OFFLINE_POSTS = [
  {
    id: '1',
    title: 'React Native Advanced Performance Optimization Guide 2026',
    description: 'Learn how to handle high-density layouts, custom multi-threaded animations, and optimize native bundle sizes for heavy high-end production applications.',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    author: 'Real Tech Learn',
    views: '120K views',
    time: '2 days ago',
    externalLink: 'https://github.com',
    price: 49.99,
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
    externalLink: 'https://reactnative.dev',
    price: 39.99,
  },
];

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
    externalLink: 'https://google.com',
    price: 99.99,
  },
];

// ---------- Haptic Helper ----------
const triggerHaptic = (type = 'selection') => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  Haptic.trigger(type, options);
};

// ---------- Storage Keys ----------
const STORAGE_KEYS = {
  IN_APP_LINK: '@realtechlearn_inAppLink',
  PLAYER_MODE: '@realtechlearn_playerMode',
  API_CONNECT: '@realtechlearn_apiConnect',
  SHOP_MODE: '@realtechlearn_shopMode',
};

export default function App() {
  // --- Navigation & UI ---
  const [screen, setScreen] = useState('splash');
  const [selectedPost, setSelectedPost] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [inAppBrowserUrl, setInAppBrowserUrl] = useState(null);

  // --- Settings (persisted) ---
  const [isInAppLinkEnabled, setIsInAppLinkEnabled] = useState(true);
  const [isPlayerModeEnabled, setIsPlayerModeEnabled] = useState(true);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isShopModeEnabled, setIsShopModeEnabled] = useState(false);

  // --- Content ---
  const [posts, setPosts] = useState(OFFLINE_POSTS);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Shop State ---
  const [cartItems, setCartItems] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', address: '', card: '' });

  // --- Reanimated values for modal gestures ---
  const translateY = useSharedValue(0);
  const detailModalOpacity = useSharedValue(0);

  // ---------- Load persisted settings ----------
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const inApp = await AsyncStorage.getItem(STORAGE_KEYS.IN_APP_LINK);
        const player = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_MODE);
        const api = await AsyncStorage.getItem(STORAGE_KEYS.API_CONNECT);
        const shop = await AsyncStorage.getItem(STORAGE_KEYS.SHOP_MODE);
        if (inApp !== null) setIsInAppLinkEnabled(inApp === 'true');
        if (player !== null) setIsPlayerModeEnabled(player === 'true');
        if (api !== null) setIsApiConnected(api === 'true');
        if (shop !== null) setIsShopModeEnabled(shop === 'true');
      } catch (e) {
        console.warn('Failed to load settings', e);
      }
    };
    loadSettings();
  }, []);

  // ---------- Persist settings ----------
  useEffect(() => {
    const persist = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.IN_APP_LINK, String(isInAppLinkEnabled));
        await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_MODE, String(isPlayerModeEnabled));
        await AsyncStorage.setItem(STORAGE_KEYS.API_CONNECT, String(isApiConnected));
        await AsyncStorage.setItem(STORAGE_KEYS.SHOP_MODE, String(isShopModeEnabled));
      } catch (e) {
        console.warn('Failed to save settings', e);
      }
    };
    persist();
  }, [isInAppLinkEnabled, isPlayerModeEnabled, isApiConnected, isShopModeEnabled]);

  // ---------- Splash delay ----------
  useEffect(() => {
    const timer = setTimeout(() => setScreen('home'), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ---------- Feed switching (API / Offline) ----------
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

  // ---------- Refresh handler ----------
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      triggerHaptic('impactLight');
    }, 1500);
  }, []);

  // ---------- Filter posts ----------
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ---------- Link handler ----------
  const handleLinkPress = (url) => {
    triggerHaptic('selection');
    if (isInAppLinkEnabled) {
      setInAppBrowserUrl(url);
    } else {
      Linking.openURL(url);
    }
  };

  // ---------- Share handler ----------
  const handleShare = async (post) => {
    triggerHaptic('impactMedium');
    try {
      await Share.open({
        title: post.title,
        message: `${post.title}\n\n${post.description}`,
        url: post.externalLink || post.thumbnail,
      });
    } catch (error) {
      if (error.message !== 'User cancelled') {
        Alert.alert('Share failed', 'Could not share this post.');
      }
    }
  };

  // ---------- Cart operations ----------
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    triggerHaptic('impactLight');
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    triggerHaptic('selection');
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    triggerHaptic('impactMedium');
  };

  // ---------- Checkout ----------
  const handleCheckout = () => {
    if (!checkoutForm.name || !checkoutForm.address || !checkoutForm.card) {
      Alert.alert('Incomplete', 'Please fill all fields.');
      return;
    }
    // Simulate payment
    setPaymentSuccess(true);
    triggerHaptic('impactHeavy');
    setTimeout(() => {
      Alert.alert('Payment Successful', 'Thank you for your purchase!');
      clearCart();
      setCheckoutVisible(false);
      setPaymentSuccess(false);
      setCheckoutForm({ name: '', address: '', card: '' });
    }, 1500);
  };

  // ---------- Animated detail modal ----------
  const detailAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: detailModalOpacity.value,
  }));

  const openDetailModal = (post) => {
    setSelectedPost(post);
    triggerHaptic('impactLight');
    translateY.value = withSpring(0, { damping: 20 });
    detailModalOpacity.value = withSpring(1, { damping: 15 });
  };

  const closeDetailModal = () => {
    'worklet';
    translateY.value = withSpring(height, { damping: 20 }, () => {
      runOnJS(setSelectedPost)(null);
    });
    detailModalOpacity.value = withSpring(0, { damping: 15 });
  };

  const onGestureEvent = useCallback((event) => {
    'worklet';
    const { translationY } = event;
    if (translationY > 0) {
      translateY.value = translationY;
    }
  }, []);

  const onHandlerStateChange = useCallback((event) => {
    'worklet';
    if (event.state === 5) { // END
      if (translateY.value > 200) {
        closeDetailModal();
      } else {
        translateY.value = withSpring(0);
      }
    }
  }, []);

  // ---------- Splash ----------
  if (screen === 'splash') {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Image
          source={{ uri: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmtkM3MzdDR2a2I1cWN5NmU0amE1bWd5aDJuZzdyMnpyNW9id3JjNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3RsPTE/13FrpeVH8TOqlc/giphy.gif' }}
          style={styles.splashGif}
          resizeMode="contain"
        />
        <Text style={styles.splashText}>Real Tech Learn</Text>
      </View>
    );
  }

  // ========== MAIN HOME ==========
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {/* -------- HEADER -------- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isShopModeEnabled ? 'Shop' : 'Real Tech Learn'}
          </Text>
          <View style={styles.headerRight}>
            {isShopModeEnabled && (
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => {
                  triggerHaptic('impactLight');
                  setCartVisible(true);
                }}
              >
                <Text style={styles.cartIcon}>🛒</Text>
                {cartItems.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => triggerHaptic('selection')}
            >
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => {
                triggerHaptic('impactLight');
                setSettingsVisible(true);
              }}
            >
              <View style={styles.iosAvatarInside}>
                <View style={styles.avatarHead} />
                <View style={styles.avatarBody} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* -------- SEARCH BAR -------- */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={isShopModeEnabled ? 'Search products...' : 'Search tutorials...'}
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>

        {/* -------- MAIN CONTENT -------- */}
        {isLocalLoading ? (
          <View style={styles.loaderContainer}>
            <Image
              source={{ uri: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmskM3MzdDR2a2I1cWN5NmU0amE1bWd5aDJuZzdyMnpyNW9id3JjNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3RsPTE/13FrpeVH8TOqlc/giphy.gif' }}
              style={styles.loadingProgressGif}
            />
            <Text style={styles.loadingSubtext}>
              {isShopModeEnabled ? 'Loading Shop...' : 'Fetching Secure Server Sync...'}
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#bf5af2"
                colors={['#bf5af2']}
              />
            }
          >
            <Text style={styles.sectionTitle}>
              {isShopModeEnabled ? 'Featured Products' : 'Latest Tutorials'}
            </Text>

            {filteredPosts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {isShopModeEnabled ? 'No products found' : 'No tutorials found'}
                </Text>
              </View>
            ) : (
              filteredPosts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postCard}
                  activeOpacity={0.9}
                  onPress={() => openDetailModal(post)}
                >
                  <Image source={{ uri: post.thumbnail }} style={styles.thumbnail} />
                  <View style={styles.cardDetails}>
                    <View style={styles.channelBadge}>
                      <Text style={styles.badgeText}>RT</Text>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.postTitle} numberOfLines={2}>{post.title}</Text>
                      {isShopModeEnabled && (
                        <Text style={styles.productPrice}>${post.price.toFixed(2)}</Text>
                      )}
                      <Text style={styles.metadata}>
                        {isShopModeEnabled ? post.author : `${post.author} • ${post.views} • ${post.time}`}
                      </Text>
                    </View>
                    {isShopModeEnabled && (
                      <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={() => addToCart(post)}
                      >
                        <Text style={styles.addToCartText}>+</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

        {/* -------- DETAIL MODAL (shared) -------- */}
        {selectedPost && (
          <Modal
            animationType="none"
            transparent={true}
            visible={!!selectedPost}
            onRequestClose={() => {
              closeDetailModal();
              triggerHaptic('selection');
            }}
          >
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
            >
              <Animated.View style={[styles.detailContainer, detailAnimatedStyle]}>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
                  <StatusBar barStyle="light-content" backgroundColor="#000" />

                  <View style={styles.detailHeader}>
                    <TouchableOpacity
                      onPress={() => {
                        closeDetailModal();
                        triggerHaptic('selection');
                      }}
                      style={styles.backButton}
                    >
                      <Text style={styles.backButtonText}>✕ Close</Text>
                    </TouchableOpacity>
                    {!isShopModeEnabled && (
                      <TouchableOpacity
                        onPress={() => handleShare(selectedPost)}
                        style={styles.shareButton}
                      >
                        <Text style={styles.shareButtonText}>Share</Text>
                      </TouchableOpacity>
                    )}
                    {isShopModeEnabled && (
                      <TouchableOpacity
                        onPress={() => {
                          addToCart(selectedPost);
                          triggerHaptic('impactMedium');
                          Alert.alert('Added to Cart', `${selectedPost.title} added.`);
                        }}
                        style={styles.addToCartDetailButton}
                      >
                        <Text style={styles.addToCartDetailText}>Add to Cart</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <ScrollView bounces={false}>
                    {isPlayerModeEnabled && selectedPost.videoUrl && !isShopModeEnabled ? (
                      <View style={styles.videoPlayerFrame}>
                        <WebView
                          javaScriptEnabled
                          domStorageEnabled
                          allowsFullscreenVideo
                          mediaPlaybackRequiresUserAction={false}
                          source={{ uri: selectedPost.videoUrl }}
                          style={{ flex: 1, backgroundColor: '#000' }}
                          onError={() => Alert.alert('Error', 'Could not load video.')}
                        />
                      </View>
                    ) : (
                      <Image source={{ uri: selectedPost.thumbnail }} style={styles.detailBigThumbnail} />
                    )}

                    <View style={styles.detailBody}>
                      <Text style={styles.detailTitle}>{selectedPost.title}</Text>
                      {isShopModeEnabled && (
                        <Text style={styles.detailPrice}>${selectedPost.price.toFixed(2)}</Text>
                      )}
                      <Text style={styles.detailMeta}>
                        {isShopModeEnabled ? selectedPost.author : `${selectedPost.views} • ${selectedPost.time}`}
                      </Text>
                      <View style={styles.divider} />
                      <Text style={styles.detailDescription}>{selectedPost.description}</Text>

                      {selectedPost.externalLink && !isShopModeEnabled && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleLinkPress(selectedPost.externalLink)}
                        >
                          <Text style={styles.actionButtonText}>Access Source Files</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </ScrollView>
                </SafeAreaView>
              </Animated.View>
            </PanGestureHandler>
          </Modal>
        )}

        {/* -------- IN-APP BROWSER -------- */}
        {inAppBrowserUrl && (
          <Modal animationType="fade" visible={!!inAppBrowserUrl}>
            <SafeAreaView style={styles.browserContainer}>
              <View style={styles.browserHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setInAppBrowserUrl(null);
                    triggerHaptic('selection');
                  }}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>✕ Return to App</Text>
                </TouchableOpacity>
                <Text style={styles.browserHeaderTitle} numberOfLines={1}>{inAppBrowserUrl}</Text>
              </View>
              <WebView source={{ uri: inAppBrowserUrl }} style={{ flex: 1 }} />
            </SafeAreaView>
          </Modal>
        )}

        {/* -------- CART MODAL (Shop Mode only) -------- */}
        {isShopModeEnabled && (
          <Modal
            animationType="slide"
            transparent={false}
            visible={cartVisible}
            onRequestClose={() => setCartVisible(false)}
          >
            <SafeAreaView style={styles.cartModalContainer}>
              <View style={styles.cartHeader}>
                <TouchableOpacity onPress={() => setCartVisible(false)}>
                  <Text style={styles.cartClose}>✕ Close</Text>
                </TouchableOpacity>
                <Text style={styles.cartTitle}>Your Cart</Text>
                <TouchableOpacity onPress={clearCart}>
                  <Text style={styles.cartClear}>Clear</Text>
                </TouchableOpacity>
              </View>
              {cartItems.length === 0 ? (
                <View style={styles.emptyCart}>
                  <Text style={styles.emptyCartText}>Your cart is empty</Text>
                </View>
              ) : (
                <>
                  <ScrollView style={styles.cartList}>
                    {cartItems.map((item) => (
                      <View key={item.id} style={styles.cartItem}>
                        <Image source={{ uri: item.thumbnail }} style={styles.cartItemImage} />
                        <View style={styles.cartItemInfo}>
                          <Text style={styles.cartItemTitle} numberOfLines={1}>{item.title}</Text>
                          <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
                          <View style={styles.cartQuantity}>
                            <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                              <Text style={styles.qtyButton}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyText}>{item.quantity}</Text>
                            <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                              <Text style={styles.qtyButton}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                          <Text style={styles.removeItem}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                  <View style={styles.cartFooter}>
                    <Text style={styles.cartTotal}>Total: ${getCartTotal().toFixed(2)}</Text>
                    <TouchableOpacity
                      style={styles.checkoutButton}
                      onPress={() => {
                        setCartVisible(false);
                        setCheckoutVisible(true);
                        triggerHaptic('impactLight');
                      }}
                    >
                      <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </SafeAreaView>
          </Modal>
        )}

        {/* -------- CHECKOUT MODAL (Shop Mode only) -------- */}
        {isShopModeEnabled && (
          <Modal
            animationType="slide"
            transparent={false}
            visible={checkoutVisible}
            onRequestClose={() => {
              if (!paymentSuccess) setCheckoutVisible(false);
            }}
          >
            <SafeAreaView style={styles.checkoutContainer}>
              <View style={styles.checkoutHeader}>
                <TouchableOpacity onPress={() => setCheckoutVisible(false)}>
                  <Text style={styles.cartClose}>✕ Close</Text>
                </TouchableOpacity>
                <Text style={styles.cartTitle}>Checkout</Text>
                <View style={{ width: 50 }} />
              </View>
              {paymentSuccess ? (
                <View style={styles.paymentSuccessContainer}>
                  <Text style={styles.paymentSuccessText}>✅ Payment Successful!</Text>
                  <Text style={styles.paymentSuccessSub}>Thank you for your order.</Text>
                </View>
              ) : (
                <ScrollView style={styles.checkoutForm}>
                  <Text style={styles.checkoutLabel}>Full Name</Text>
                  <TextInput
                    style={styles.checkoutInput}
                    placeholder="John Doe"
                    placeholderTextColor="#8e8e93"
                    value={checkoutForm.name}
                    onChangeText={text => setCheckoutForm({ ...checkoutForm, name: text })}
                  />
                  <Text style={styles.checkoutLabel}>Address</Text>
                  <TextInput
                    style={styles.checkoutInput}
                    placeholder="123 Main St, City"
                    placeholderTextColor="#8e8e93"
                    value={checkoutForm.address}
                    onChangeText={text => setCheckoutForm({ ...checkoutForm, address: text })}
                  />
                  <Text style={styles.checkoutLabel}>Card Number</Text>
                  <TextInput
                    style={styles.checkoutInput}
                    placeholder="4111 1111 1111 1111"
                    placeholderTextColor="#8e8e93"
                    keyboardType="numeric"
                    value={checkoutForm.card}
                    onChangeText={text => setCheckoutForm({ ...checkoutForm, card: text })}
                  />
                  <TouchableOpacity style={styles.payButton} onPress={handleCheckout}>
                    <Text style={styles.payButtonText}>Pay ${getCartTotal().toFixed(2)}</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </SafeAreaView>
          </Modal>
        )}

        {/* -------- SETTINGS PANEL (with Shop Mode toggle) -------- */}
        <Modal
          animationType="none"
          transparent={true}
          visible={settingsVisible}
          onRequestClose={() => setSettingsVisible(false)}
        >
          <Animated.View style={[styles.modalOverlay, { opacity: settingsVisible ? 1 : 0 }]}>
            <View style={styles.iosPanel}>
              <View style={styles.iosDragIndicator} />
              <View style={styles.iosPanelHeader}>
                <Text style={styles.iosPanelTitle}>App Core Configuration</Text>
                <TouchableOpacity
                  onPress={() => {
                    setSettingsVisible(false);
                    triggerHaptic('selection');
                  }}
                >
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
                  <View style={styles.iosRow}>
                    <View>
                      <Text style={styles.iosRowText}>Enable In-App Links</Text>
                      <Text style={styles.iosRowSubtext}>Render external hyperlinks natively</Text>
                    </View>
                    <Switch
                      value={isInAppLinkEnabled}
                      onValueChange={(val) => {
                        setIsInAppLinkEnabled(val);
                        triggerHaptic('impactLight');
                      }}
                      trackColor={{ false: '#2c2c2e', true: '#34c759' }}
                      thumbColor="#fff"
                    />
                  </View>

                  <View style={styles.iosRow}>
                    <View>
                      <Text style={styles.iosRowText}>Player Mode System</Text>
                      <Text style={styles.iosRowSubtext}>Load internal multi-media layers</Text>
                    </View>
                    <Switch
                      value={isPlayerModeEnabled}
                      onValueChange={(val) => {
                        setIsPlayerModeEnabled(val);
                        triggerHaptic('impactLight');
                      }}
                      trackColor={{ false: '#2c2c2e', true: '#34c759' }}
                      thumbColor="#fff"
                    />
                  </View>

                  <View style={styles.iosRow}>
                    <View>
                      <Text style={styles.iosRowText}>Connect API Server</Text>
                      <Text style={styles.iosRowSubtext}>Fetch live dynamic cloud objects</Text>
                    </View>
                    <Switch
                      value={isApiConnected}
                      onValueChange={(val) => {
                        setIsApiConnected(val);
                        triggerHaptic('impactLight');
                      }}
                      trackColor={{ false: '#2c2c2e', true: '#34c759' }}
                      thumbColor="#fff"
                    />
                  </View>

                  <View style={[styles.iosRow, { borderBottomWidth: 0 }]}>
                    <View>
                      <Text style={styles.iosRowText}>Shop Mode</Text>
                      <Text style={styles.iosRowSubtext}>Turn app into an e‑commerce store</Text>
                    </View>
                    <Switch
                      value={isShopModeEnabled}
                      onValueChange={(val) => {
                        setIsShopModeEnabled(val);
                        triggerHaptic('impactLight');
                        // Reset cart when toggling
                        if (val) {
                          setCartItems([]);
                        }
                      }}
                      trackColor={{ false: '#2c2c2e', true: '#34c759' }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => {
                    triggerHaptic('impactMedium');
                    Alert.alert(
                      'Reset Settings',
                      'This will restore all preferences to default.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Reset',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await AsyncStorage.multiRemove([
                                STORAGE_KEYS.IN_APP_LINK,
                                STORAGE_KEYS.PLAYER_MODE,
                                STORAGE_KEYS.API_CONNECT,
                                STORAGE_KEYS.SHOP_MODE,
                              ]);
                              setIsInAppLinkEnabled(true);
                              setIsPlayerModeEnabled(true);
                              setIsApiConnected(false);
                              setIsShopModeEnabled(false);
                              setCartItems([]);
                            } catch (e) {
                              Alert.alert('Error', 'Could not reset settings.');
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.resetButtonText}>Reset All Settings</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </Animated.View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  splashGif: { width: 120, height: 120 },
  splashText: { fontFamily: 'San Francisco', fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 15, letterSpacing: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  loadingProgressGif: { width: 70, height: 70 },
  loadingSubtext: { fontFamily: 'San Francisco', color: '#8e8e93', fontSize: 13, marginTop: 12 },
  header: { height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 0.5, borderColor: '#1c1c1e', backgroundColor: '#000' },
  headerTitle: { fontFamily: 'San Francisco', fontSize: 24, fontWeight: '800', color: '#fff', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  searchButton: { marginRight: 12, padding: 4 },
  searchIcon: { fontSize: 20, color: '#8e8e93' },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#1c1c1e' },
  searchInput: { height: 36, backgroundColor: '#2c2c2e', borderRadius: 8, paddingHorizontal: 12, color: '#fff', fontSize: 14 },
  avatarWrapper: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1c1c1e', justifyContent: 'center', alignItems: 'center' },
  iosAvatarInside: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  avatarHead: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#aeaeae', marginBottom: 1 },
  avatarBody: { width: 14, height: 7, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: '#aeaeae' },
  scrollArea: { padding: 16, backgroundColor: '#000' },
  sectionTitle: { fontFamily: 'San Francisco', fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 16 },
  postCard: { width: '100%', backgroundColor: '#0a0a0c', borderRadius: 14, overflow: 'hidden', marginBottom: 20, borderWidth: 0.5, borderColor: '#1c1c1e' },
  thumbnail: { width: '100%', height: width * 0.54, backgroundColor: '#1c1c1e' },
  cardDetails: { flexDirection: 'row', padding: 12, backgroundColor: '#0a0a0c', alignItems: 'center' },
  channelBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#bf5af2', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  textContainer: { flex: 1 },
  postTitle: { fontFamily: 'San Francisco', fontSize: 15, fontWeight: '600', color: '#fff', lineHeight: 20 },
  productPrice: { fontFamily: 'San Francisco', fontSize: 14, fontWeight: 'bold', color: '#bf5af2', marginTop: 4 },
  metadata: { fontFamily: 'San Francisco', fontSize: 12, color: '#8e8e93', marginTop: 4 },
  addToCartButton: { backgroundColor: '#bf5af2', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  addToCartText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyStateText: { color: '#8e8e93', fontSize: 14 },
  detailContainer: { flex: 1, backgroundColor: '#000' },
  detailHeader: { height: 55, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 0.5, borderColor: '#1c1c1e', backgroundColor: '#000' },
  backButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#1c1c1e', borderRadius: 16 },
  backButtonText: { color: '#fff', fontWeight: '600', fontSize: 13, fontFamily: 'San Francisco' },
  shareButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#1c1c1e', borderRadius: 16 },
  shareButtonText: { color: '#bf5af2', fontWeight: '600', fontSize: 13, fontFamily: 'San Francisco' },
  addToCartDetailButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#bf5af2', borderRadius: 16 },
  addToCartDetailText: { color: '#fff', fontWeight: '600', fontSize: 13, fontFamily: 'San Francisco' },
  detailBigThumbnail: { width: '100%', height: width * 0.56 },
  videoPlayerFrame: { width: '100%', height: width * 0.56, backgroundColor: '#000' },
  detailBody: { padding: 16 },
  detailTitle: { fontFamily: 'San Francisco', fontSize: 19, fontWeight: '700', color: '#fff', lineHeight: 26 },
  detailPrice: { fontFamily: 'San Francisco', fontSize: 17, fontWeight: 'bold', color: '#bf5af2', marginTop: 6 },
  detailMeta: { fontFamily: 'San Francisco', fontSize: 13, color: '#8e8e93', marginTop: 6 },
  divider: { height: 0.5, backgroundColor: '#1c1c1e', marginVertical: 14 },
  detailDescription: { fontFamily: 'San Francisco', fontSize: 14, color: '#eaeaea', lineHeight: 22 },
  actionButton: { backgroundColor: '#bf5af2', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  actionButtonText: { color: '#fff', fontSize: 14, fontWeight: '600', fontFamily: 'San Francisco' },
  browserContainer: { flex: 1, backgroundColor: '#fff' },
  browserHeader: { height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#000' },
  browserHeaderTitle: { color: '#8e8e93', fontSize: 12, marginLeft: 12, flex: 1, fontFamily: 'San Francisco' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  iosPanel: { height: '82%', backgroundColor: '#000', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  iosDragIndicator: { width: 36, height: 5, backgroundColor: '#2c2c2e', borderRadius: 3, alignSelf: 'center', marginTop: 8 },
  iosPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5, borderColor: '#1c1c1e' },
  iosPanelTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff', fontFamily: 'San Francisco' },
  iosDoneButton: { fontSize: 16, color: '#bf5af2', fontWeight: '600', fontFamily: 'San Francisco' },
  iosMenuScroll: { padding: 16 },
  iosProfileSection: { alignItems: 'center', marginVertical: 12 },
  iosProfileAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#1c1c1e', borderWidth: 1.5, borderColor: '#bf5af2' },
  iosProfileName: { color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 8, fontFamily: 'San Francisco' },
  iosProfileEmail: { color: '#8e8e93', fontSize: 12, marginTop: 1, fontFamily: 'San Francisco' },
  iosGroupLabel: { color: '#8e8e93', fontSize: 11, fontWeight: '500', marginLeft: 6, marginBottom: 6, marginTop: 14, fontFamily: 'San Francisco' },
  iosMenuSection: { backgroundColor: '#0a0a0c', borderRadius: 10, paddingHorizontal: 14, borderWidth: 0.5, borderColor: '#1c1c1e' },
  iosRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderColor: '#1c1c1e' },
  iosRowText: { fontSize: 14, color: '#fff', fontFamily: 'San Francisco', fontWeight: '500' },
  iosRowSubtext: { fontSize: 11, color: '#8e8e93', fontFamily: 'San Francisco', marginTop: 2 },
  resetButton: { marginTop: 20, backgroundColor: '#1c1c1e', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  resetButtonText: { color: '#ff453a', fontSize: 14, fontWeight: '600', fontFamily: 'San Francisco' },
  cartButton: { marginRight: 12, position: 'relative' },
  cartIcon: { fontSize: 22, color: '#fff' },
  cartBadge: { position: 'absolute', top: -4, right: -6, backgroundColor: '#bf5af2', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  // Cart Modal
  cartModalContainer: { flex: 1, backgroundColor: '#000' },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderColor: '#1c1c1e' },
  cartClose: { color: '#bf5af2', fontSize: 16 },
  cartTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cartClear: { color: '#ff453a', fontSize: 14 },
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyCartText: { color: '#8e8e93', fontSize: 16 },
  cartList: { flex: 1, padding: 16 },
  cartItem: { flexDirection: 'row', backgroundColor: '#0a0a0c', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 0.5, borderColor: '#1c1c1e' },
  cartItemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#1c1c1e' },
  cartItemInfo: { flex: 1, marginLeft: 12 },
  cartItemTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  cartItemPrice: { color: '#bf5af2', fontSize: 13, fontWeight: 'bold', marginTop: 4 },
  cartQuantity: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  qtyButton: { color: '#bf5af2', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 8 },
  qtyText: { color: '#fff', fontSize: 16, marginHorizontal: 8 },
  removeItem: { color: '#ff453a', fontSize: 18, fontWeight: 'bold', padding: 8 },
  cartFooter: { padding: 16, borderTopWidth: 0.5, borderColor: '#1c1c1e' },
  cartTotal: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginBottom: 12 },
  checkoutButton: { backgroundColor: '#bf5af2', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  // Checkout Modal
  checkoutContainer: { flex: 1, backgroundColor: '#000' },
  checkoutHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderColor: '#1c1c1e' },
  checkoutForm: { padding: 16 },
  checkoutLabel: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 16 },
  checkoutInput: { backgroundColor: '#1c1c1e', borderRadius: 8, padding: 12, color: '#fff', fontSize: 14, marginTop: 6 },
  payButton: { backgroundColor: '#34c759', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  payButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  paymentSuccessContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  paymentSuccessText: { color: '#34c759', fontSize: 24, fontWeight: 'bold' },
  paymentSuccessSub: { color: '#8e8e93', fontSize: 16, marginTop: 8 },
});