import { FlatList, Image, StyleSheet, Text, View, Alert } from "react-native";
import { Colors } from "@/constants/colors";
import { useCart } from "@/hooks/useCartStore";
import { restaurants } from "@/mocks/restaurants";
import Button from "@/components/Button";
import QuantitySelector from "@/components/QuantitySelector";
import { Trash2 } from "lucide-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

export default function CartScreen() {
  const { 
    cartItems, 
    getCartTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getRestaurantId
  } = useCart();
  const router = useRouter();
  
  const restaurantId = getRestaurantId();
  const restaurant = restaurants.find(r => r.id === restaurantId);
  
  const handleCheckout = () => {
    Alert.alert(
      "Checkout",
      "This would proceed to checkout in a real app.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Place Order",
          onPress: () => {
            Alert.alert(
              "Order Placed",
              "Your order has been placed successfully!",
              [
                {
                  text: "OK",
                  onPress: () => {
                    clearCart();
                    router.push("/");
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };
  
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1586074299757-dc655f18518c?q=80&w=400&auto=format&fit=crop" }} 
          style={styles.emptyImage} 
        />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add items to your cart to place an order</Text>
        <Button 
          title="Browse Restaurants" 
          onPress={() => router.push("/")} 
          style={styles.browseButton}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {restaurant && (
        <View style={styles.restaurantContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
          </View>
        </View>
      )}
      
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItemContainer}>
            <Image source={{ uri: item.menuItem.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.menuItem.name}</Text>
              
              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <View style={styles.optionsContainer}>
                  {item.selectedOptions.map((selectedOption) => {
                    const option = item.menuItem.options?.find(
                      (opt) => opt.id === selectedOption.optionId
                    );
                    if (!option) return null;
                    
                    const selectedChoices = option.choices.filter((choice) =>
                      selectedOption.choiceIds.includes(choice.id)
                    );
                    
                    return (
                      <Text key={selectedOption.optionId} style={styles.optionText}>
                        {option.name}: {selectedChoices.map((choice) => choice.name).join(", ")}
                      </Text>
                    );
                  })}
                </View>
              )}
              
              {item.specialInstructions && (
                <Text style={styles.specialInstructions}>
                  Note: {item.specialInstructions}
                </Text>
              )}
              
              <View style={styles.itemActions}>
                <Text style={styles.itemPrice}>
                  ${(item.menuItem.price * item.quantity).toFixed(2)}
                </Text>
                <View style={styles.quantityContainer}>
                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                    onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.cartItemsContainer}
      />
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${getCartTotal().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>$2.99</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>${(getCartTotal() * 0.08).toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${(getCartTotal() + 2.99 + getCartTotal() * 0.08).toFixed(2)}
          </Text>
        </View>
        
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          size="large"
          style={styles.checkoutButton}
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
  restaurantContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: Colors.textLight,
  },
  cartItemsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  cartItemContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  optionsContainer: {
    marginBottom: 4,
  },
  optionText: {
    fontSize: 13,
    color: Colors.textLight,
  },
  specialInstructions: {
    fontSize: 13,
    fontStyle: "italic",
    color: Colors.textLight,
    marginBottom: 4,
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeButton: {
    marginLeft: 12,
    padding: 4,
  },
  summaryContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  checkoutButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    width: "80%",
  },
});