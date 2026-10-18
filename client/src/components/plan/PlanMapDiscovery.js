import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

const CITIES = [
  { key: 'danang', name: 'Da Nang 🇻🇳', center: '16.0610, 108.2272', lat: 16.0610, lng: 108.2272, zoom: 12 },
  { key: 'hoian', name: 'Hoi An 🏮', center: '15.8770, 108.3262', lat: 15.8770, lng: 108.3262, zoom: 13 },
  { key: 'hanoi', name: 'Hanoi 🏛️', center: '21.0285, 105.8542', lat: 21.0285, lng: 105.8542, zoom: 12 },
  { key: 'tokyo', name: 'Tokyo 🇯🇵', center: '35.6595, 139.7004', lat: 35.6595, lng: 139.7004, zoom: 12 },
  { key: 'paris', name: 'Paris 🇫🇷', center: '48.8584, 2.2945', lat: 48.8584, lng: 2.2945, zoom: 12 },
  { key: 'newyork', name: 'New York 🇺🇸', center: '40.7580, -73.9855', lat: 40.7580, lng: -73.9855, zoom: 12 },
];

const CATEGORIES = [
  { key: 'all', label: 'All', icon: '🌟' },
  { key: 'landmark', label: 'Attractions', icon: '🏛️' },
  { key: 'beach', label: 'Beaches', icon: '🏖️' },
  { key: 'food', label: 'Food & Dining', icon: '🍜' },
  { key: 'nature', label: 'Nature', icon: '🌿' },
];

const DEFAULT_GLOBAL_PLACES = [
  // Da Nang
  {
    id: 'dn-01',
    name: 'Dragon Bridge Da Nang',
    city: 'Da Nang',
    lat: 16.061,
    lng: 108.2272,
    category: 'landmark',
    categoryName: 'Landmarks & Icons',
    rating: 4.8,
    address: 'Nguyen Van Linh, Hai Chau, Da Nang',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=500&q=80',
  },
  {
    id: 'dn-02',
    name: 'My Khe Beach',
    city: 'Da Nang',
    lat: 16.0595,
    lng: 108.2464,
    category: 'beach',
    categoryName: 'Beach & Resort',
    rating: 4.7,
    address: 'Vo Nguyen Giap, Son Tra, Da Nang',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  },
  {
    id: 'dn-03',
    name: 'Ba Duong Local Pancakes',
    city: 'Da Nang',
    lat: 16.0592,
    lng: 108.214,
    category: 'food',
    categoryName: 'Local Dining',
    rating: 4.6,
    address: 'K280/23 Hoang Dieu, Hai Chau, Da Nang',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80',
  },
  // Hoi An
  {
    id: 'ha-01',
    name: 'Japanese Covered Bridge',
    city: 'Hoi An',
    lat: 15.8771,
    lng: 108.326,
    category: 'landmark',
    categoryName: 'Ancient Heritage',
    rating: 4.9,
    address: 'Nguyen Thi Minh Khai, Hoi An Ancient Town',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&q=80',
  },
  {
    id: 'ha-02',
    name: 'Banh Mi Phuong Hoi An',
    city: 'Hoi An',
    lat: 15.8795,
    lng: 108.332,
    category: 'food',
    categoryName: 'Famous Street Food',
    rating: 4.7,
    address: '2B Phan Chau Trinh, Cam Chau, Hoi An',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&q=80',
  },
  // Hanoi
  {
    id: 'hn-01',
    name: 'Sword Lake & Turtle Tower',
    city: 'Hanoi',
    lat: 21.0285,
    lng: 105.8542,
    category: 'landmark',
    categoryName: 'Historical Heritage',
    rating: 4.8,
    address: 'Hang Trong, Hoan Kiem, Hanoi',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
  },
  {
    id: 'hn-02',
    name: 'Pho Thin Lo Duc',
    city: 'Hanoi',
    lat: 21.0182,
    lng: 105.856,
    category: 'food',
    categoryName: 'Traditional Dining',
    rating: 4.6,
    address: '13 Lo Duc, Pham Dinh Ho, Hai Ba Trung, Hanoi',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&q=80',
  },
  // Tokyo
  {
    id: 'tky-01',
    name: 'Shibuya Crossing & Hachiko',
    city: 'Tokyo',
    lat: 35.6595,
    lng: 139.7004,
    category: 'landmark',
    categoryName: 'Tokyo Landmark',
    rating: 4.8,
    address: 'Shibuya, Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500&q=80',
  },
  // Paris
  {
    id: 'prs-01',
    name: 'Eiffel Tower',
    city: 'Paris',
    lat: 48.8584,
    lng: 2.2945,
    category: 'landmark',
    categoryName: 'World Wonder',
    rating: 4.9,
    address: 'Champ de Mars, 5 Av. Anatole France, Paris, France',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500&q=80',
  },
  // New York
  {
    id: 'ny-01',
    name: 'Times Square',
    city: 'New York',
    lat: 40.758,
    lng: -73.9855,
    category: 'landmark',
    categoryName: 'Heart of Manhattan',
    rating: 4.8,
    address: 'Manhattan, NY 10036, USA',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=500&q=80',
  },
];

export default function PlanMapDiscovery({
  places = [],
  selectedPlaceIds = null,
  onTogglePlace = null,
  onGenerateAiPlan = null,
}) {
  const { colors: themeColors } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);

  const mapboxToken =
    process.env.EXPO_PUBLIC_MAPBOX_TOKEN ||
    'pk.eyJ1Ijoibm9tYWRpeCIsImEiOiJjbTFub21hZGl4ZGVtb3Rva2VuIn0.demo_token';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('danang');
  const [internalSelected, setInternalSelected] = useState(new Set());
  const [activePlaceId, setActivePlaceId] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' (Map Focus + Horizontal Carousel) | 'list' (Vertical list)

  const activeCityObj = CITIES.find((c) => c.key === selectedCity) || CITIES[0];
  const mapStyle = themeColors.card === '#1E293B' ? 'dark-v11' : 'streets-v12';
  const effectiveSelectedIds = React.useMemo(() => {
    if (selectedPlaceIds instanceof Set) return selectedPlaceIds;
    if (Array.isArray(selectedPlaceIds)) return new Set(selectedPlaceIds);
    return internalSelected;
  }, [selectedPlaceIds, internalSelected]);

  const handleToggle = (placeId) => {
    if (onTogglePlace) {
      onTogglePlace(placeId);
    }
    setInternalSelected((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) {
        next.delete(placeId);
      } else {
        next.add(placeId);
      }
      return next;
    });
  };

  const placesList = places && places.length > 0 ? places : DEFAULT_GLOBAL_PLACES;

  const filteredPlaces = placesList.filter((p) => {
    const matchCategory =
      activeCategory === 'all' ||
      (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());

    const matchSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (p.address && p.address.toLowerCase().includes(searchQuery.toLowerCase().trim()));

    const matchCity =
      !selectedCity ||
      !p.city ||
      (selectedCity === 'danang' && /đà nẵng|da nang/i.test(p.city)) ||
      (selectedCity === 'hoian' && /hội an|hoi an/i.test(p.city)) ||
      (selectedCity === 'hanoi' && /hà nội|ha noi/i.test(p.city)) ||
      (selectedCity === 'tokyo' && /tokyo/i.test(p.city)) ||
      (selectedCity === 'paris' && /paris/i.test(p.city)) ||
      (selectedCity === 'newyork' && /new york/i.test(p.city));

    return matchCategory && matchSearch && matchCity;
  });

  // Compile multi-pin markers for Mapbox Static API
  const pinMarkers = filteredPlaces.map((p, index) => {
    const pinNumber = (index + 1).toString();
    const isSelected = effectiveSelectedIds.has(p.id);
    const isActive = (activePlaceId || filteredPlaces[0]?.id) === p.id;
    const pinColor = isActive ? 'EF4444' : isSelected ? '10B981' : '3B82F6';
    const lng = Number(p.lng || activeCityObj.lng).toFixed(4);
    const lat = Number(p.lat || activeCityObj.lat).toFixed(4);
    return `pin-s-${pinNumber}+${pinColor}(${lng},${lat})`;
  });

  const pinsParam = pinMarkers.length > 0
    ? pinMarkers.join(',')
    : `pin-s-star+3B82F6(${activeCityObj.lng},${activeCityObj.lat})`;

  const mapHeight = viewMode === 'map' ? 280 : 130;
  const mapboxImageUrl = mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/static/${pinsParam}/auto/${Math.min(600, Math.round(width - 32))}x${mapHeight}@2x?access_token=${mapboxToken}`
    : null;

  const handleAiPlanPress = () => {
    const selectedList = placesList.filter((p) => effectiveSelectedIds.has(p.id));
    if (onGenerateAiPlan) {
      onGenerateAiPlan(selectedList);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Floating Map Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="e.g. Ba Na Hills, Eiffel Tower, Cafe..."
          placeholderTextColor={themeColors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Global Multi-City Switcher Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cityChipsScroll}
        contentContainerStyle={styles.cityChipsContainer}
      >
        {CITIES.map((c) => {
          const isSelected = selectedCity === c.key;
          return (
            <TouchableOpacity
              key={c.key}
              style={[styles.cityChip, isSelected && styles.cityChipActive]}
              onPress={() => {
                setSelectedCity(c.key);
                setActivePlaceId(null);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.cityChipText, isSelected && styles.cityChipTextActive]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 3. Category Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryChipsScroll}
        contentContainerStyle={styles.categoryChipsContainer}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 4. Interactive Visual Map Canvas Frame with Floating Marker Layer */}
      <View style={[styles.mapCanvasFrame, viewMode === 'map' && styles.mapCanvasFrameExpanded]}>
        {mapboxImageUrl ? (
          <Image
            source={{ uri: mapboxImageUrl }}
            style={[styles.mapCanvasImage, viewMode === 'map' && styles.mapCanvasImageExpanded]}
            resizeMode="cover"
            testID="mapbox-canvas-image"
          />
        ) : null}

        {/* Top Header Overlay with Badge and View Mode Toggle */}
        <View style={styles.mapHeaderOverlay}>
          <View style={styles.mapCanvasBadge}>
            <Text style={styles.mapCanvasBadgeText}>
              🗺️ Mapbox Vector Engine • {selectedCity.toUpperCase()} ({filteredPlaces.length} places)
            </Text>
          </View>
          <TouchableOpacity
            testID="map-view-mode-toggle"
            style={styles.viewModeToggleBtn}
            onPress={() => setViewMode((prev) => (prev === 'map' ? 'list' : 'map'))}
            activeOpacity={0.8}
          >
            <Text style={styles.viewModeToggleText}>
              {viewMode === 'map' ? '📋 List View' : '🗺️ Map View'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Place Markers Layer Floating directly on Map */}
        <View style={styles.mapPinsOverlay}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mapPinsScrollContent}
          >
            {filteredPlaces.map((place, index) => {
              const isSelected = effectiveSelectedIds.has(place.id);
              const isActive = (activePlaceId || filteredPlaces[0]?.id) === place.id;
              return (
                <TouchableOpacity
                  key={place.id}
                  testID={`map-pin-marker-${place.id}`}
                  style={[
                    styles.mapPinMarker,
                    isActive && styles.mapPinMarkerActive,
                    isSelected && styles.mapPinMarkerSelected,
                  ]}
                  onPress={() => {
                    setActivePlaceId(place.id);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.mapPinNumberBadge, isActive && styles.mapPinNumberBadgeActive]}>
                    <Text style={styles.mapPinNumberText}>{index + 1}</Text>
                  </View>
                  <Text
                    style={[
                      styles.mapPinMarkerText,
                      isActive && styles.mapPinMarkerTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    Stop {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* 5A. Horizontal Places Carousel (Map Focus Mode) */}
      {viewMode === 'map' && (
        <View testID="places-horizontal-carousel" style={styles.carouselContainer}>
          <View style={styles.carouselHeaderRow}>
            <Text style={styles.carouselSectionTitle}>
              📍 Recommended Places ({filteredPlaces.length})
            </Text>
            <Text style={styles.carouselSubtitle}>Tap pin to view details</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScrollContent}
          >
            {filteredPlaces.map((place, index) => {
              const isSelected = effectiveSelectedIds.has(place.id);
              const isActive = (activePlaceId || filteredPlaces[0]?.id) === place.id;
              return (
                <View
                  key={place.id}
                  testID={`carousel-place-card-${place.id}`}
                  style={[
                    styles.carouselCard,
                    isActive && styles.carouselCardActive,
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setActivePlaceId(place.id)}
                    style={styles.carouselCardTouch}
                  >
                    {place.image ? (
                      <Image source={{ uri: place.image }} style={styles.carouselImage} />
                    ) : (
                      <View style={styles.carouselImagePlaceholder}>
                        <Text style={{ fontSize: 28 }}>📍</Text>
                      </View>
                    )}
                    <View style={styles.carouselIndexBadge}>
                      <Text style={styles.carouselIndexText}>{index + 1}</Text>
                    </View>
                    <View style={styles.carouselInfo}>
                      <View style={styles.placeHeaderRow}>
                        <Text style={styles.placeCategory}>
                          {place.categoryName || place.category || 'Attraction'}
                        </Text>
                        <Text style={styles.placeRating}>★ {place.rating || '4.8'}</Text>
                      </View>
                      <Text style={styles.carouselPlaceName} numberOfLines={1}>
                        {place.name}
                      </Text>
                      <Text style={styles.carouselPlaceAddress} numberOfLines={1}>
                        {place.address}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.selectButton, isSelected && styles.selectButtonActive]}
                    onPress={() => handleToggle(place.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.selectButtonText,
                        isSelected && styles.selectButtonTextActive,
                      ]}
                    >
                      {isSelected ? '✓ Selected' : '+ Select'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* 5B. Vertical Places List (List Focus Mode) */}
      {viewMode === 'list' && (
        <ScrollView
          testID="places-vertical-list"
          style={styles.placesList}
          contentContainerStyle={styles.placesListContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredPlaces.map((place, index) => {
            const isSelected = effectiveSelectedIds.has(place.id);
            const isActive = (activePlaceId || filteredPlaces[0]?.id) === place.id;
            return (
              <View
                key={place.id}
                testID={`vertical-place-card-${place.id}`}
                style={[styles.placeCard, isActive && styles.placeCardActive]}
              >
                <View style={styles.placeIndexBadge}>
                  <Text style={styles.placeIndexBadgeText}>{index + 1}</Text>
                </View>
                {place.image ? (
                  <Image source={{ uri: place.image }} style={styles.placeImage} />
                ) : (
                  <View style={styles.placeImagePlaceholder}>
                    <Text style={{ fontSize: 24 }}>📍</Text>
                  </View>
                )}

                <View style={styles.placeInfo}>
                  <View style={styles.placeHeaderRow}>
                    <Text style={styles.placeCategory}>
                      {place.categoryName || place.category || 'Attraction'}
                    </Text>
                    <Text style={styles.placeRating}>★ {place.rating || '4.8'}</Text>
                  </View>
                  <Text style={styles.placeName} numberOfLines={1}>
                    {place.name}
                  </Text>
                  <Text style={styles.placeAddress} numberOfLines={1}>
                    {place.address}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.selectButton, isSelected && styles.selectButtonActive]}
                  onPress={() => handleToggle(place.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      isSelected && styles.selectButtonTextActive,
                    ]}
                  >
                    {isSelected ? '✓ Selected' : '+ Select'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* 6. Bottom Floating Selection Counter & AI Trigger Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.counterBadgeContainer}>
          <Text style={styles.counterBadgeText}>
            {effectiveSelectedIds.size} {effectiveSelectedIds.size === 1 ? 'place selected' : 'places selected'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.aiGenerateBtn,
            effectiveSelectedIds.size === 0 && styles.aiGenerateBtnDisabled,
          ]}
          onPress={handleAiPlanPress}
          activeOpacity={0.85}
        >
          <Text style={styles.aiGenerateBtnText}>✨ AI Itinerary Planning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const getStyles = (themeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.card,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 6,
      borderRadius: 14,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: themeColors.border,
      height: 44,
    },
    searchIcon: {
      fontSize: 14,
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 13,
      color: themeColors.text,
      paddingVertical: 0,
    },
    clearBtn: {
      padding: 4,
    },
    clearBtnText: {
      color: themeColors.textMuted,
      fontSize: 14,
    },
    cityChipsScroll: {
      flexGrow: 0,
      height: 38,
      marginBottom: 4,
    },
    cityChipsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 6,
    },
    cityChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: themeColors.card,
      borderWidth: 1,
      borderColor: themeColors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cityChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    cityChipText: {
      fontSize: 11,
      fontWeight: '700',
      color: themeColors.textMuted,
    },
    cityChipTextActive: {
      color: '#FFFFFF',
    },
    categoryChipsScroll: {
      flexGrow: 0,
      height: 36,
      marginBottom: 6,
    },
    categoryChipsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 6,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor: themeColors.card,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    categoryChipActive: {
      backgroundColor: 'rgba(0, 122, 255, 0.15)',
      borderColor: colors.primary,
    },
    categoryIcon: {
      fontSize: 11,
    },
    categoryChipText: {
      fontSize: 11,
      fontWeight: '600',
      color: themeColors.textMuted,
    },
    categoryChipTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    mapCanvasFrame: {
      height: 130,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 14,
      backgroundColor: '#0F172A',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: themeColors.border,
      position: 'relative',
    },
    mapCanvasFrameExpanded: {
      height: 280,
    },
    mapCanvasImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    mapCanvasImageExpanded: {
      height: '100%',
    },
    mapHeaderOverlay: {
      position: 'absolute',
      top: 8,
      left: 8,
      right: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10,
    },
    mapCanvasBadge: {
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    mapCanvasBadgeText: {
      fontSize: 10,
      fontWeight: '800',
      color: '#60A5FA',
    },
    viewModeToggleBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    viewModeToggleText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    mapPinsOverlay: {
      position: 'absolute',
      bottom: 8,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    mapPinsScrollContent: {
      paddingHorizontal: 8,
      gap: 6,
    },
    mapPinMarker: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      borderRadius: 20,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: themeColors.border,
      gap: 5,
    },
    mapPinMarkerActive: {
      backgroundColor: '#EF4444',
      borderColor: '#FFFFFF',
      transform: [{ scale: 1.05 }],
    },
    mapPinMarkerSelected: {
      borderColor: '#10B981',
      borderWidth: 1.5,
    },
    mapPinNumberBadge: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapPinNumberBadgeActive: {
      backgroundColor: '#FFFFFF',
    },
    mapPinNumberText: {
      fontSize: 10,
      fontWeight: '900',
      color: '#FFFFFF',
    },
    mapPinMarkerText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#F8FAFC',
      maxWidth: 110,
    },
    mapPinMarkerTextActive: {
      color: '#FFFFFF',
      fontWeight: '800',
    },
    carouselContainer: {
      flex: 1,
      paddingTop: 4,
    },
    carouselHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 6,
    },
    carouselSectionTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: themeColors.text,
    },
    carouselSubtitle: {
      fontSize: 10,
      color: themeColors.textMuted,
    },
    carouselScrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 85,
      gap: 10,
    },
    carouselCard: {
      width: 220,
      backgroundColor: themeColors.card,
      borderRadius: 14,
      padding: 10,
      borderWidth: 1,
      borderColor: themeColors.border,
      position: 'relative',
      justifyContent: 'space-between',
    },
    carouselCardActive: {
      borderColor: '#EF4444',
      borderWidth: 2,
    },
    carouselCardTouch: {
      marginBottom: 8,
    },
    carouselImage: {
      width: '100%',
      height: 90,
      borderRadius: 10,
      marginBottom: 6,
    },
    carouselImagePlaceholder: {
      width: '100%',
      height: 90,
      borderRadius: 10,
      backgroundColor: 'rgba(0,0,0,0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    carouselIndexBadge: {
      position: 'absolute',
      top: 6,
      left: 6,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    carouselIndexText: {
      fontSize: 11,
      fontWeight: '900',
      color: '#FFFFFF',
    },
    carouselInfo: {
      flex: 1,
    },
    carouselPlaceName: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.text,
      marginBottom: 2,
    },
    carouselPlaceAddress: {
      fontSize: 10,
      color: themeColors.textMuted,
    },
    placesList: {
      flex: 1,
      paddingHorizontal: 16,
    },
    placesListContent: {
      paddingBottom: 85,
      gap: 8,
    },
    placeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.card,
      borderRadius: 14,
      padding: 8,
      borderWidth: 1,
      borderColor: themeColors.border,
      gap: 10,
    },
    placeCardActive: {
      borderColor: '#EF4444',
      borderWidth: 1.5,
    },
    placeIndexBadge: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeIndexBadgeText: {
      fontSize: 10,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    placeImage: {
      width: 54,
      height: 54,
      borderRadius: 10,
    },
    placeImagePlaceholder: {
      width: 54,
      height: 54,
      borderRadius: 10,
      backgroundColor: 'rgba(0,0,0,0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeInfo: {
      flex: 1,
    },
    placeHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    placeCategory: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.primary,
    },
    placeRating: {
      fontSize: 10,
      fontWeight: '700',
      color: '#F59E0B',
    },
    placeName: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.text,
      marginBottom: 2,
    },
    placeAddress: {
      fontSize: 10,
      color: themeColors.textMuted,
    },
    selectButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: colors.primary,
    },
    selectButtonActive: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    selectButtonText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    selectButtonTextActive: {
      color: '#EF4444',
    },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: themeColors.card,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
      paddingHorizontal: 16,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    counterBadgeContainer: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
    },
    counterBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
    },
    aiGenerateBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 18,
      paddingVertical: 9,
      borderRadius: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    aiGenerateBtnDisabled: {
      opacity: 0.6,
    },
    aiGenerateBtnText: {
      fontSize: 13,
      fontWeight: '800',
      color: '#FFFFFF',
    },
  });

