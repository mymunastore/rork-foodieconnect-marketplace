import { Restaurant } from "@/types";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/colors";
import { Star, Heart } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/useUserStore";

interface RestaurantCardProps {
  restaurant: Restaurant;
  featured?: boolean;
}

export default function RestaurantCard({ restaurant, featured }: RestaurantCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useUser();
  const isFav = isFavorite(restaurant.id);

  const handlePress = () => {
    router.push(`/restaurant/${restaurant.id}` as any);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(restaurant.id);
  };

  return (
    <TouchableOpacity
      style={[styles.container, featured && styles.featuredContainer]}
      onPress={handlePress}
      activeOpacity={0.8}
      testID={`restaurant-card-${restaurant.id}`}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={handleFavoritePress}
          activeOpacity={0.8}
        >
          <Heart 
            size={20} 
            color={isFav ? Colors.primary : Colors.card} 
            fill={isFav ? Colors.primary : "transparent"} 
          />
        </TouchableOpacity>
        {!restaurant.isOpen && (
          <View style={styles.closedBadge}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        <View style={styles.detailsRow}>
          <View style={styles.ratingContainer}>
            <Star size={14} color={Colors.rating} fill={Colors.rating} />
            <Text style={styles.rating}>{restaurant.rating}</Text>
            <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
          </View>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.cuisineType}>{restaurant.cuisineType}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.deliveryTime}>{restaurant.deliveryTime}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.distance}>{restaurant.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardDark,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featuredContainer: {
    width: 300,
    marginRight: 16,
  },
  imageContainer: {
    position: "relative",
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 24,
    padding: 10,
    backdropFilter: "blur(10px)",
  },
  closedBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closedText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: "700",
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 2,
  },
  cuisineType: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: "500",
  },
  priceRange: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "600",
  },
  deliveryTime: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: "500",
  },
  distance: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: "500",
  },
  dot: {
    fontSize: 14,
    color: Colors.textMuted,
    marginHorizontal: 6,
  },
});