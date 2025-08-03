import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import { Colors } from "@/constants/colors";
import { menuItems } from "@/mocks/menuItems";
import { restaurants } from "@/mocks/restaurants";
import { ChevronLeft, Minus, Plus } from "lucide-react-native";
import Button from "@/components/Button";
import { useCart } from "@/hooks/useCartStore";

export default function MenuItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, canAddFromRestaurant } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  
  const menuItem = menuItems.find((item) => item.id === id);
  
  if (!menuItem) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Menu item not found</Text>
      </View>
    );
  }
  
  const restaurant = restaurants.find((r) => r.id === menuItem.restaurantId);
  
  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };
  
  const handleOptionSelect = (optionId: string, choiceId: string, multiple: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[optionId] || [];
      
      if (multiple) {
        // For multiple selection, toggle the choice
        const updated = current.includes(choiceId)
          ? current.filter((id) => id !== choiceId)
          : [...current, choiceId];
        
        return { ...prev, [optionId]: updated };
      } else {
        // For single selection, replace the choice
        return { ...prev, [optionId]: [choiceId] };
      }
    });
  };
  
  // Helper function to check if an option is required
  const checkOptionRequired = (optionId: string) => {
    const option = menuItem.options?.find((opt) => opt.id === optionId);
    return option?.required || false;
  };
  
  const isOptionSelected = (optionId: string) => {
    return (selectedOptions[optionId]?.length || 0) > 0;
  };
  
  const validateOptions = () => {
    if (!menuItem.options) return true;
    
    const requiredOptions = menuItem.options.filter((opt) => opt.required);
    
    for (const option of requiredOptions) {
      if (!isOptionSelected(option.id)) {
        Alert.alert(
          "Required Option",
          `Please select a ${option.name} option before adding to cart.`
        );
        return false;
      }
    }
    
    return true;
  };
  
  const handleAddToCart = () => {
    if (!validateOptions()) return;
    
    if (!canAddFromRestaurant(menuItem.restaurantId)) {
      Alert.alert(
        "Different Restaurant",
        "Your cart contains items from a different restaurant. Would you like to clear your cart and add this item?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Clear Cart & Add",
            onPress: () => {
              // This would clear the cart and add the item in a real app
              Alert.alert(
                "Cart Cleared",
                "Your cart has been cleared and the new item has been added."
              );
            },
          },
        ]
      );
      return;
    }
    
    // Convert selectedOptions to the format expected by addToCart
    const formattedOptions = Object.entries(selectedOptions).map(
      ([optionId, choiceIds]) => ({
        optionId,
        choiceIds,
      })
    );
    
    addToCart(
      menuItem,
      quantity,
      specialInstructions || undefined,
      formattedOptions.length > 0 ? formattedOptions : undefined
    );
    
    Alert.alert("Added to Cart", "Item has been added to your cart.");
    router.back();
  };
  
  // Calculate total price including options
  const calculateTotalPrice = () => {
    let total = menuItem.price;
    
    // Add option prices
    if (menuItem.options) {
      menuItem.options.forEach((option) => {
        const selectedChoiceIds = selectedOptions[option.id] || [];
        
        selectedChoiceIds.forEach((choiceId) => {
          const choice = option.choices.find((c) => c.id === choiceId);
          if (choice) {
            total += choice.price;
          }
        });
      });
    }
    
    return total * quantity;
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: menuItem.image }} style={styles.image} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={Colors.card} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.name}>{menuItem.name}</Text>
          
          {restaurant && (
            <TouchableOpacity 
              style={styles.restaurantContainer}
              onPress={() => router.push(`/restaurant/${restaurant.id}`)}
            >
              <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
            </TouchableOpacity>
          )}
          
          <Text style={styles.description}>{menuItem.description}</Text>
          
          <View style={styles.tagsContainer}>
            {menuItem.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          {menuItem.options && menuItem.options.length > 0 && (
            <View style={styles.optionsContainer}>
              <Text style={styles.optionsTitle}>Options</Text>
              
              {menuItem.options.map((option) => (
                <View key={option.id} style={styles.optionSection}>
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionName}>{option.name}</Text>
                    {option.required && (
                      <Text style={styles.requiredText}>Required</Text>
                    )}
                    {option.multiple && (
                      <Text style={styles.multipleText}>Select multiple</Text>
                    )}
                  </View>
                  
                  {option.choices.map((choice) => (
                    <TouchableOpacity
                      key={choice.id}
                      style={[
                        styles.choiceContainer,
                        selectedOptions[option.id]?.includes(choice.id) &&
                          styles.selectedChoiceContainer,
                      ]}
                      onPress={() =>
                        handleOptionSelect(option.id, choice.id, option.multiple)
                      }
                    >
                      <View style={styles.choiceInfo}>
                        <Text style={styles.choiceName}>{choice.name}</Text>
                        {choice.price > 0 && (
                          <Text style={styles.choicePrice}>
                            +${choice.price.toFixed(2)}
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.checkbox,
                          selectedOptions[option.id]?.includes(choice.id) &&
                            styles.checkedCheckbox,
                        ]}
                      >
                        {selectedOptions[option.id]?.includes(choice.id) && (
                          <View style={styles.checkboxInner} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.specialInstructionsContainer}>
            <Text style={styles.specialInstructionsTitle}>
              Special Instructions
            </Text>
            <TextInput
              style={styles.specialInstructionsInput}
              placeholder="Add notes (e.g. allergies, spice level, etc.)"
              placeholderTextColor={Colors.textLight}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              maxLength={200}
            />
          </View>
          
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityTitle}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus
                  size={20}
                  color={quantity <= 1 ? Colors.inactive : Colors.text}
                />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(quantity + 1)}
              >
                <Plus size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.price}>${calculateTotalPrice().toFixed(2)}</Text>
        </View>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          style={styles.addButton}
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
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    position: "relative",
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  restaurantContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  restaurantImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  restaurantName: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  tag: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 13,
    color: Colors.text,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  optionSection: {
    marginBottom: 20,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  optionName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginRight: 8,
  },
  requiredText: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: "rgba(255, 90, 95, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  multipleText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  choiceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedChoiceContainer: {
    borderColor: Colors.primary,
  },
  choiceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  choiceName: {
    fontSize: 15,
    color: Colors.text,
    marginRight: 8,
  },
  choicePrice: {
    fontSize: 14,
    color: Colors.textLight,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedCheckbox: {
    borderColor: Colors.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  specialInstructionsContainer: {
    marginBottom: 24,
  },
  specialInstructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  specialInstructionsInput: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    fontSize: 15,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: "top",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  quantityButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    width: 40,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
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
    flexDirection: "row",
    alignItems: "center",
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  addButton: {
    flex: 1,
    marginLeft: 16,
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