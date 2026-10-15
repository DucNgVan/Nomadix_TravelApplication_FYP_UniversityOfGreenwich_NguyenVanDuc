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
  { key: 'danang', name: 'Đà Nẵng 🇻🇳', center: '16.0610, 108.2272' },
  { key: 'hoian', name: 'Hội An 🏮', center: '15.8770, 108.3262' },
  { key: 'hanoi', name: 'Hà Nội 🏛️', center: '21.0285, 105.8542' },
  { key: 'tokyo', name: 'Tokyo 🇯🇵', center: '35.6595, 139.7004' },
  { key: 'paris', name: 'Paris 🇫🇷', center: '48.8584, 2.2945' },
  { key: 'newyork', name: 'New York 🇺🇸', center: '40.7580, -73.9855' },
];

const CATEGORIES = [
  { key: 'all', label: 'Tất cả', icon: '🌟' },
  { key: 'landmark', label: 'Di tích', icon: '🏛️' },
  { key: 'beach', label: 'Biển', icon: '🏖️' },
  { key: 'food', label: 'Ẩm thực', icon: '🍜' },
  { key: 'nature', label: 'Thiên nhiên', icon: '🌿' },
];

const DEFAULT_GLOBAL_PLACES = [
  // Đà Nẵng
  {
    id: 'dn-01',
    name: 'Cầu Rồng Đà Nẵng',
    city: 'Đà Nẵng',
    lat: 16.061,
    lng: 108.2272,
    category: 'landmark',
    categoryName: 'Di tích & Biểu tượng',
    rating: 4.8,
    address: 'Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=500&q=80',
  },
  {
    id: 'dn-02',
    name: 'Bãi Biển Mỹ Khê',
    city: 'Đà Nẵng',
    lat: 16.0595,
    lng: 108.2464,
    category: 'beach',
    categoryName: 'Biển & Nghỉ dưỡng',
    rating: 4.7,
    address: 'Võ Nguyên Giáp, Sơn Trà, Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  },
  {
    id: 'dn-03',
    name: 'Bánh Xèo Bà Dưỡng',
    city: 'Đà Nẵng',
    lat: 16.0592,
    lng: 108.214,
    category: 'food',
    categoryName: 'Ẩm thực địa phương',
    rating: 4.6,
    address: 'K280/23 Hoàng Diệu, Hải Châu, Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80',
  },
  // Hội An
  {
    id: 'ha-01',
    name: 'Chùa Cầu Hội An',
    city: 'Hội An',
    lat: 15.8771,
    lng: 108.326,
    category: 'landmark',
    categoryName: 'Di tích Cổ',
    rating: 4.9,
    address: 'Nguyễn Thị Minh Khai, Phố Cổ Hội An',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&q=80',
  },
  {
    id: 'ha-02',
    name: 'Bánh Mì Phượng Hội An',
    city: 'Hội An',
    lat: 15.8795,
    lng: 108.332,
    category: 'food',
    categoryName: 'Ẩm thực Nổi tiếng',
    rating: 4.7,
    address: '2B Phan Châu Trinh, Cẩm Châu, Hội An',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&q=80',
  },
  // Hà Nội
  {
    id: 'hn-01',
    name: 'Hồ Gươm & Tháp Rùa',
    city: 'Hà Nội',
    lat: 21.0285,
    lng: 105.8542,
    category: 'landmark',
    categoryName: 'Di tích Lịch sử',
    rating: 4.8,
    address: 'Hàng Trống, Hoàn Kiếm, Hà Nội',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
  },
  {
    id: 'hn-02',
    name: 'Phở Thìn Lò Đúc',
    city: 'Hà Nội',
    lat: 21.0182,
    lng: 105.856,
    category: 'food',
    categoryName: 'Ẩm thực Phố Cổ',
    rating: 4.6,
    address: '13 Lò Đúc, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội',
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
    categoryName: 'Biểu tượng Tokyo',
    rating: 4.8,
    address: 'Shibuya, Tokyo, Nhật Bản',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500&q=80',
  },
  // Paris
  {
    id: 'prs-01',
    name: 'Tháp Eiffel Paris',
    city: 'Paris',
    lat: 48.8584,
    lng: 2.2945,
    category: 'landmark',
    categoryName: 'Kỳ quan Thế giới',
    rating: 4.9,
    address: 'Champ de Mars, 5 Av. Anatole France, Paris, Pháp',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500&q=80',
  },
  // New York
  {
    id: 'ny-01',
    name: 'Quảng trường Thời Đại (Times Square)',
    city: 'New York',
    lat: 40.758,
    lng: -73.9855,
    category: 'landmark',
    categoryName: 'Trái tim Manhattan',
    rating: 4.8,
    address: 'Manhattan, NY 10036, Hoa Kỳ',
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

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('danang');
  const [internalSelected, setInternalSelected] = useState(new Set());

  const effectiveSelectedIds = selectedPlaceIds || internalSelected;

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
          placeholder="Tìm kiếm địa điểm, quán ăn..."
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
        contentContainerStyle={styles.cityChipsContainer}
      >
        {CITIES.map((c) => {
          const isSelected = selectedCity === c.key;
          return (
            <TouchableOpacity
              key={c.key}
              style={[styles.cityChip, isSelected && styles.cityChipActive]}
              onPress={() => setSelectedCity(c.key)}
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

      {/* 4. Interactive Visual Map Canvas Frame */}
      <View style={styles.mapCanvasFrame}>
        <View style={styles.mapGridOverlay}>
          <Text style={styles.mapCanvasBadge}>
            🗺️ Mapbox Vector Engine • {selectedCity.toUpperCase()}
          </Text>
          <View style={styles.mapCenterPin}>
            <Text style={styles.mapPinDot}>📍</Text>
          </View>
        </View>
      </View>

      {/* 5. Places Cards List */}
      <ScrollView
        style={styles.placesList}
        contentContainerStyle={styles.placesListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredPlaces.map((place) => {
          const isSelected = effectiveSelectedIds.has(place.id);
          return (
            <View key={place.id} style={styles.placeCard}>
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
                    {place.categoryName || place.category || 'Địa điểm'}
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
                  {isSelected ? '✓ Đã chọn' : '+ Chọn'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* 6. Bottom Floating Selection Counter & AI Trigger Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.counterBadgeContainer}>
          <Text style={styles.counterBadgeText}>
            {effectiveSelectedIds.size} điểm đã chọn
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
          <Text style={styles.aiGenerateBtnText}>✨ AI Lên Lịch Trình</Text>
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
    cityChipsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 4,
      gap: 6,
    },
    cityChip: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 12,
      backgroundColor: themeColors.card,
      borderWidth: 1,
      borderColor: themeColors.border,
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
    categoryChipsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      gap: 6,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
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
      height: 110,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 14,
      backgroundColor: '#0F172A',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: themeColors.border,
      position: 'relative',
    },
    mapGridOverlay: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 8,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
    },
    mapCanvasBadge: {
      alignSelf: 'flex-start',
      fontSize: 9,
      fontWeight: '800',
      color: '#60A5FA',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    mapCenterPin: {
      alignSelf: 'center',
      marginBottom: 16,
    },
    mapPinDot: {
      fontSize: 24,
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
