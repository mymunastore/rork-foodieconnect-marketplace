import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/colors";
import { ShoppingBag } from "lucide-react-native";
import { useCart } from "@/hooks/useCartStore";
import { useRouter } from "expo-router";

export default function CartButton() {
  const { getItemCount, getCartTotal } = useCart();
  const router = useRouter();
  
  const itemCount = getItemCount();
  
  if (itemCount === 0) {
    return null;
  }
  
  const handlePress = () => {
    router.push("/(tabs)/cart" as any);
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.9}
      testID="cart-button"
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.countContainer}>
            <Text style={styles.count}>{itemCount}</Text>
          </View>
          <ShoppingBag size={20} color={Colors.card} />
        </View>
        <Text style={styles.text}>View Cart</Text>
        <Text style={styles.price}>${getCartTotal().toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  countContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  count: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  text: {
    color: Colors.card,
    fontWeight: "700",
    fontSize: 16,
  },
  price: {
    color: Colors.card,
    fontWeight: "700",
    fontSize: 16,
  },
});