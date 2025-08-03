import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import SearchBar from "@/components/SearchBar";
import { restaurants } from "@/mocks/restaurants";
import { menuItems } from "@/mocks/menuItems";
import { categories } from "@/mocks/categories";
import RestaurantCard from "@/components/RestaurantCard";
import MenuItemCard from "@/components/MenuItemCard";
import CategoryCard from "@/components/CategoryCard";
import SectionHeader from "@/components/SectionHeader";
import { useRouter } from "expo-router";
import CartButton from "@/components/CartButton";

export default function SearchScreen() {
  const [searchQuery] = useState("");
  const router = useRouter();
  
  const handleFilterPress = () => {
    router.push("/filter");
  };
  
  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisineType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );
  
  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );
  
  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const hasResults =
    filteredRestaurants.length > 0 ||
    filteredMenuItems.length > 0 ||
    filteredCategories.length > 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar onFilterPress={handleFilterPress} />
      </View>
      
      {searchQuery ? (
        hasResults ? (
          <FlatList
            data={[{ key: "results" }]}
            renderItem={() => (
              <>
                {filteredCategories.length > 0 && (
                  <View>
                    <SectionHeader title="Categories" />
                    <FlatList
                      data={filteredCategories}
                      renderItem={({ item }) => <CategoryCard category={item} />}
                      keyExtractor={(item) => item.id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.categoriesContainer}
                    />
                  </View>
                )}
                
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
                        <MenuItemCard
                          key={item.id}
                          menuItem={item}
                          horizontal
                        />
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
              No results found for &quot;{searchQuery}&quot;
            </Text>
            <Text style={styles.noResultsSubtext}>
              Try a different search term or browse categories
            </Text>
          </View>
        )
      ) : (
        <View style={styles.initialContainer}>
          <Text style={styles.initialText}>
            Search for restaurants, cuisines, or dishes
          </Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => <CategoryCard category={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.initialCategoriesContainer}
          />
          <Text style={styles.popularText}>Popular Searches</Text>
          <View style={styles.popularTagsContainer}>
            {["Pizza", "Burgers", "Sushi", "Vegan", "Fast Food", "Dessert"].map(
              (tag) => (
                <View key={tag} style={styles.tagContainer}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              )
            )}
          </View>
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
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  initialContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  initialText: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 24,
  },
  initialCategoriesContainer: {
    marginBottom: 32,
  },
  popularText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  popularTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagContainer: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    marginBottom: 12,
  },
  tagText: {
    fontSize: 14,
    color: Colors.text,
  },
});