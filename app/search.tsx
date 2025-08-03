import { useLocalSearchParams, Stack } from "expo-router";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Colors } from "@/constants/colors";
import { restaurants } from "@/mocks/restaurants";
import { menuItems } from "@/mocks/menuItems";
import RestaurantCard from "@/components/RestaurantCard";
import MenuItemCard from "@/components/MenuItemCard";
import SectionHeader from "@/components/SectionHeader";
import SearchBar from "@/components/SearchBar";
import CartButton from "@/components/CartButton";

export default function SearchResultsScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const query = q || "";
  
  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.cuisineType.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.tags.some((tag) =>
        tag.toLowerCase().includes(query.toLowerCase())
      )
  );
  
  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(query.toLowerCase())
      )
  );
  
  const hasResults =
    filteredRestaurants.length > 0 || filteredMenuItems.length > 0;
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Search: ${query}`,
        }}
      />
      
      <View style={styles.searchContainer}>
        <SearchBar />
      </View>
      
      {hasResults ? (
        <FlatList
          data={[{ key: "results" }]}
          renderItem={() => (
            <>
              {filteredRestaurants.length > 0 && (
                <View>
                  <SectionHeader title="Restaurants" />
                  <View style={styles.restaurantsContainer}>
                    {filteredRestaurants.map((restaurant) => (
                      <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                      />
                    ))}
                  </View>
                </View>
              )}
              
              {filteredMenuItems.length > 0 && (
                <View>
                  <SectionHeader title="Menu Items" />
                  <View style={styles.menuItemsContainer}>
                    {filteredMenuItems.map((item) => (
                      <MenuItemCard key={item.id} menuItem={item} horizontal />
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.resultsContainer}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            No results found for &quot;{query}&quot;
          </Text>
          <Text style={styles.noResultsSubtext}>
            Try a different search term or browse categories
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
  searchContainer: {
    paddingTop: 16,
  },
  resultsContainer: {
    paddingBottom: 100,
  },
  restaurantsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  menuItemsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
  },
});