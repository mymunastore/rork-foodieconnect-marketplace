import { Restaurant } from "@/types";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/colors";
import { Star } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/useUserStore";
import { Heart } from "lucide-react-native";

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
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  featuredContainer: {
    width: 280,
    marginRight: 16,
  },
  imageContainer: {
    position: "relative",
    height: 160,
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
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 8,
  },
  closedBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closedText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 13,
    color: Colors.textLight,
    marginLeft: 2,
  },
  cuisineType: {
    fontSize: 13,
    color: Colors.textLight,
  },
  priceRange: {
    fontSize: 13,
    color: Colors.textLight,
  },
  deliveryTime: {
    fontSize: 13,
    color: Colors.textLight,
  },
  distance: {
    fontSize: 13,
    color: Colors.textLight,
  },
  dot: {
    fontSize: 13,
    color: Colors.textLight,
    marginHorizontal: 4,
  },
});