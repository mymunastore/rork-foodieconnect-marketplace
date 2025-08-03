import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Animated,
  Platform,
  Dimensions
} from "react-native";
import { Colors } from "@/constants/colors";
import { restaurants } from "@/mocks/restaurants";
import { menuItems } from "@/mocks/menuItems";
import { reviews } from "@/mocks/reviews";
import { Heart, MapPin, Star, Clock, ChevronLeft } from "lucide-react-native";
import MenuItemCard from "@/components/MenuItemCard";
import ReviewCard from "@/components/ReviewCard";
import SectionHeader from "@/components/SectionHeader";
import { useUser } from "@/hooks/useUserStore";
import CartButton from "@/components/CartButton";

const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useUser();
  
  const [activeCategory, setActiveCategory] = useState<string>("");
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const categoryRefs = useRef<Record<string, { y: number }>>({});
  
  const restaurant = restaurants.find((r) => r.id === id);
  const restaurantMenuItems = menuItems.filter((item) => item.restaurantId === id);
  const restaurantReviews = reviews.filter((review) => review.restaurantId === id);
  
  // Get unique categories from menu items
  const categories = Array.from(
    new Set(restaurantMenuItems.map((item) => item.category))
  );
  
  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [HEADER_SCROLL_DISTANCE - 20, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
    
    if (categoryRefs.current[category] && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: categoryRefs.current[category].y - HEADER_MIN_HEIGHT - 10,
        animated: true,
      });
    }
  };
  
  const handleFavoritePress = () => {
    if (restaurant) {
      toggleFavorite(restaurant.id);
    }
  };
  
  if (!restaurant) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Restaurant not found</Text>
      </View>
    );
  }
  
  const isFav = isFavorite(restaurant.id);
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={{ uri: restaurant.coverImage }}
          style={[styles.headerImage, { opacity: headerImageOpacity }]}
        />
        <Animated.View style={[styles.headerOverlay, { opacity: headerImageOpacity }]} />
        
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={Colors.card} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
          >
            <Heart
              size={24}
              color={Colors.card}
              fill={isFav ? Colors.primary : "transparent"}
            />
          </TouchableOpacity>
        </View>
        
        <Animated.View
          style={[
            styles.headerTitleContainer,
            { opacity: headerTitleOpacity },
          ]}
        >
          <Text style={styles.headerTitle} numberOfLines={1}>
            {restaurant.name}
          </Text>
        </Animated.View>
      </Animated.View>
      
      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.restaurantInfoContainer}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.rating} fill={Colors.rating} />
            <Text style={styles.rating}>{restaurant.rating}</Text>
            <Text style={styles.reviewCount}>({restaurant.reviewCount} reviews)</Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <MapPin size={16} color={Colors.textLight} />
              <Text style={styles.detailText}>{restaurant.distance}</Text>
            </View>
            <View style={styles.dot} />
            <View style={styles.detailItem}>
              <Clock size={16} color={Colors.textLight} />
              <Text style={styles.detailText}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.dot} />
            <Text style={styles.detailText}>{restaurant.priceRange}</Text>
          </View>
          
          <Text style={styles.description}>{restaurant.description}</Text>
          
          <View style={styles.tagsContainer}>
            {restaurant.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  activeCategory === category && styles.activeCategoryButton,
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === category && styles.activeCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {categories.map((category) => {
          const categoryItems = restaurantMenuItems.filter(
            (item) => item.category === category
          );
          
          return (
            <View
              key={category}
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                categoryRefs.current[category] = { y: layout.y };
              }}
            >
              <SectionHeader title={category} />
              <View style={styles.menuItemsContainer}>
                {categoryItems.map((item) => (
                  <MenuItemCard key={item.id} menuItem={item} horizontal />
                ))}
              </View>
            </View>
          );
        })}
        
        <SectionHeader title="Reviews" />
        <View style={styles.reviewsContainer}>
          {restaurantReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </View>
        
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Location</Text>
          <View style={styles.addressRow}>
            <MapPin size={20} color={Colors.textLight} />
            <Text style={styles.addressText}>{restaurant.address}</Text>
          </View>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Map would be displayed here</Text>
          </View>
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      <CartButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary,
    overflow: "hidden",
    zIndex: 10,
  },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: HEADER_MAX_HEIGHT,
    resizeMode: "cover",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerButtons: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.card,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  scrollContent: {
    paddingTop: HEADER_MAX_HEIGHT,
    paddingBottom: 100,
  },
  restaurantInfoContainer: {
    backgroundColor: Colors.card,
    padding: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textLight,
    marginHorizontal: 8,
  },
  description: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: Colors.text,
  },
  categoriesContainer: {
    backgroundColor: Colors.card,
    paddingVertical: 12,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeCategoryButton: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  activeCategoryText: {
    color: Colors.card,
  },
  menuItemsContainer: {
    paddingHorizontal: 20,
  },
  reviewsContainer: {
    paddingHorizontal: 20,
  },
  addressContainer: {
    backgroundColor: Colors.card,
    padding: 20,
    marginTop: 16,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  addressText: {
    fontSize: 15,
    color: Colors.text,
    marginLeft: 8,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: Colors.background,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  bottomPadding: {
    height: 100,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.text,
  },
});