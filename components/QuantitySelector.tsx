import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/colors";
import { Minus, Plus } from "lucide-react-native";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
  maxQuantity = 99,
}: QuantitySelectorProps) {
  const isDecrementDisabled = quantity <= minQuantity;
  const isIncrementDisabled = quantity >= maxQuantity;

  return (
    <View style={styles.container} testID="quantity-selector">
      <TouchableOpacity
        style={[styles.button, isDecrementDisabled && styles.disabledButton]}
        onPress={onDecrease}
        disabled={isDecrementDisabled}
        testID="decrease-button"
      >
        <Minus
          size={16}
          color={isDecrementDisabled ? Colors.inactive : Colors.text}
        />
      </TouchableOpacity>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantity}>{quantity}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, isIncrementDisabled && styles.disabledButton]}
        onPress={onIncrease}
        disabled={isIncrementDisabled}
        testID="increase-button"
      >
        <Plus
          size={16}
          color={isIncrementDisabled ? Colors.inactive : Colors.text}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  disabledButton: {
    backgroundColor: Colors.background,
  },
  quantityContainer: {
    width: 40,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.card,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});