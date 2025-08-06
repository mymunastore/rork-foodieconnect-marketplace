import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import { categories } from "@/mocks/categories";
import { restaurants } from "@/mocks/restaurants";
import { menuItems } from "@/mocks/menuItems";
import CategoryCard from "@/components/CategoryCard";
import RestaurantCard from "@/components/RestaurantCard";
import MenuItemCard from "@/components/MenuItemCard";
import SectionHeader from "@/components/SectionHeader";
import SearchBar from "@/components/SearchBar";
import GradientBackground from "@/components/GradientBackground";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/useUserStore";
import CartButton from "@/components/CartButton";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  
  const featuredRestaurants = restaurants.filter(r => r.featured);
  const popularItems = menuItems.filter(item => item.popular);
  
  const handleSeeAllRestaurants = () => {
    router.push("/(tabs)/restaurants" as any);
  };
  
  const handleSeeAllCategories = () => {
    router.push("/(tabs)/categories" as any);
  };
  
  const handleFilterPress = () => {
    router.push("/filter" as any);
  };
  
  return (
    <GradientBackground colors={Colors.gradient.secondary}>
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {user && (
            <View style={styles.greeting}>
              <Text style={styles.greetingText}>Hello, {user.name.split(" ")[0]} ✨</Text>
              <Text style={styles.subtitle}>What would you like to eat today?</Text>
            </View>
          )}
          
          <SearchBar onFilterPress={handleFilterPress} />
          
          <SectionHeader 
            title="Categories" 
            onSeeAll={handleSeeAllCategories} 
          />
          <FlatList
            data={categories}
            renderItem={({ item }) => <CategoryCard category={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
          
          <SectionHeader 
            title="Featured Restaurants" 
            onSeeAll={handleSeeAllRestaurants} 
          />
          <FlatList
            data={featuredRestaurants}
            renderItem={({ item }) => <RestaurantCard restaurant={item} featured />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.restaurantsContainer}
          />
          
          <SectionHeader title="Popular Near You" />
          <FlatList
            data={restaurants}
            renderItem={({ item }) => <RestaurantCard restaurant={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.popularContainer}
          />
          
          <SectionHeader title="Popular Dishes" />
          <FlatList
            data={popularItems}
            renderItem={({ item }) => <MenuItemCard menuItem={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dishesContainer}
          />
        </ScrollView>
        
        <CartButton />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  greeting: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textLight,
    fontWeight: "500",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  restaurantsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  popularContainer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  dishesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
});