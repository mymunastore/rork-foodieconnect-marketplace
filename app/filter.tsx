import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/colors";
import { Stack, useRouter } from "expo-router";
import Button from "@/components/Button";
import { X } from "lucide-react-native";

export default function FilterScreen() {
  const router = useRouter();
  
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("recommended");
  
  const cuisineOptions = [
    "Italian",
    "American",
    "Japanese",
    "Mexican",
    "Chinese",
    "Indian",
    "Thai",
    "Mediterranean",
    "Vegan",
    "Fast Food",
  ];
  
  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Halal",
    "Kosher",
    "Organic",
  ];
  
  const priceOptions = ["$", "$$", "$$$", "$$$$"];
  
  const sortOptions = [
    { id: "recommended", label: "Recommended" },
    { id: "rating", label: "Rating (High to Low)" },
    { id: "delivery_time", label: "Delivery Time" },
    { id: "distance", label: "Distance" },
  ];
  
  const toggleCuisine = (cuisine: string) => {
    setCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };
  
  const toggleDietary = (option: string) => {
    setDietary((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };
  
  const togglePriceRange = (price: string) => {
    setPriceRange((prev) =>
      prev.includes(price)
        ? prev.filter((p) => p !== price)
        : [...prev, price]
    );
  };
  
  const handleReset = () => {
    setCuisines([]);
    setDietary([]);
    setPriceRange([]);
    setSortBy("recommended");
  };
  
  const handleApply = () => {
    // In a real app, this would apply filters and navigate back
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Filters",
          headerRight: () => (
            <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.sortOptions}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  sortBy === option.id && styles.selectedSortOption,
                ]}
                onPress={() => setSortBy(option.id)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === option.id && styles.selectedSortOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.priceOptions}>
            {priceOptions.map((price) => (
              <TouchableOpacity
                key={price}
                style={[
                  styles.priceOption,
                  priceRange.includes(price) && styles.selectedPriceOption,
                ]}
                onPress={() => togglePriceRange(price)}
              >
                <Text
                  style={[
                    styles.priceOptionText,
                    priceRange.includes(price) && styles.selectedPriceOptionText,
                  ]}
                >
                  {price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuisines</Text>
          <View style={styles.tagOptions}>
            {cuisineOptions.map((cuisine) => (
              <TouchableOpacity
                key={cuisine}
                style={[
                  styles.tagOption,
                  cuisines.includes(cuisine) && styles.selectedTagOption,
                ]}
                onPress={() => toggleCuisine(cuisine)}
              >
                <Text
                  style={[
                    styles.tagOptionText,
                    cuisines.includes(cuisine) && styles.selectedTagOptionText,
                  ]}
                >
                  {cuisine}
                </Text>
                {cuisines.includes(cuisine) && (
                  <X size={12} color={Colors.card} style={styles.tagIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <View style={styles.tagOptions}>
            {dietaryOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.tagOption,
                  dietary.includes(option) && styles.selectedTagOption,
                ]}
                onPress={() => toggleDietary(option)}
              >
                <Text
                  style={[
                    styles.tagOptionText,
                    dietary.includes(option) && styles.selectedTagOptionText,
                  ]}
                >
                  {option}
                </Text>
                {dietary.includes(option) && (
                  <X size={12} color={Colors.card} style={styles.tagIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Apply Filters"
          onPress={handleApply}
          size="large"
          style={styles.applyButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resetText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  sortOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
    marginBottom: 12,
  },
  selectedSortOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedSortOptionText: {
    color: Colors.card,
  },
  priceOptions: {
    flexDirection: "row",
  },
  priceOption: {
    width: 60,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
  },
  selectedPriceOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  priceOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  selectedPriceOptionText: {
    color: Colors.card,
  },
  tagOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
    marginBottom: 12,
  },
  selectedTagOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedTagOptionText: {
    color: Colors.card,
  },
  tagIcon: {
    marginLeft: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 16,
  },
  applyButton: {
    width: "100%",
  },
});