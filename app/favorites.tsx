import { StyleSheet, Text, View, FlatList } from "react-native";
import { Colors } from "@/constants/colors";
import { useUser } from "@/hooks/useUserStore";
import { restaurants } from "@/mocks/restaurants";
import RestaurantCard from "@/components/RestaurantCard";
import { Stack } from "expo-router";
import CartButton from "@/components/CartButton";

export default function FavoritesScreen() {
  const { user } = useUser();
  
  const favoriteRestaurants = restaurants.filter((restaurant) =>
    user?.favorites.includes(restaurant.id)
  );
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Favorites",
        }}
      />
      
      {favoriteRestaurants.length > 0 ? (
        <FlatList
          data={favoriteRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RestaurantCard restaurant={item} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Tap the heart icon on any restaurant to add it to your favorites
          </Text>
        </View>
      )}
      
      <CartButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
  },
});