import { useLocalSearchParams, Stack } from "expo-router";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Colors } from "@/constants/colors";
import { categories } from "@/mocks/categories";
import { restaurants } from "@/mocks/restaurants";
import RestaurantCard from "@/components/RestaurantCard";
import CartButton from "@/components/CartButton";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const category = categories.find((c) => c.id === id);
  
  // Filter restaurants by category (using tags or cuisineType)
  const categoryRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.cuisineType.toLowerCase() === category?.name.toLowerCase() ||
      restaurant.tags.some(
        (tag) => tag.toLowerCase() === category?.name.toLowerCase()
      )
  );
  
  if (!category) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Category not found</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: category.name,
        }}
      />
      
      {categoryRestaurants.length > 0 ? (
        <FlatList
          data={categoryRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RestaurantCard restaurant={item} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No restaurants found in this category
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
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.text,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
  },
});