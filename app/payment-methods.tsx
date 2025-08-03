import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Image } from "react-native";
import { Stack } from "expo-router";
import { Colors } from "@/constants/colors";
import { CreditCard, Plus, Edit3, Trash2, Check } from "lucide-react-native";
import Button from "@/components/Button";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "apple-pay";
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  email?: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    last4: "8888",
    brand: "Mastercard",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
  },
  {
    id: "3",
    type: "paypal",
    email: "user@example.com",
    isDefault: false,
  },
];

export default function PaymentMethodsScreen() {
  const handleAddPaymentMethod = () => {
    Alert.alert("Add Payment Method", "This would open a form to add a new payment method.");
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    Alert.alert("Edit Payment Method", `This would edit the payment method ending in ${method.last4 || method.email}`);
  };

  const handleDeletePaymentMethod = (method: PaymentMethod) => {
    const identifier = method.last4 ? `ending in ${method.last4}` : method.email;
    Alert.alert(
      "Delete Payment Method",
      `Are you sure you want to delete the ${method.type} ${identifier}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive" },
      ]
    );
  };

  const handleSetDefault = (method: PaymentMethod) => {
    const identifier = method.last4 ? `ending in ${method.last4}` : method.email;
    Alert.alert("Set Default", `${method.brand || method.type} ${identifier} is now your default payment method.`);
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      case "amex":
        return "💳";
      default:
        return "💳";
    }
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <View style={styles.paymentTypeContainer}>
            {item.type === "card" ? (
              <>
                <Text style={styles.cardIcon}>{getCardIcon(item.brand || "")}</Text>
                <View>
                  <Text style={styles.cardBrand}>{item.brand}</Text>
                  <Text style={styles.cardNumber}>•••• •••• •••• {item.last4}</Text>
                  {item.expiryMonth && item.expiryYear && (
                    <Text style={styles.cardExpiry}>
                      Expires {item.expiryMonth.toString().padStart(2, '0')}/{item.expiryYear}
                    </Text>
                  )}
                </View>
              </>
            ) : item.type === "paypal" ? (
              <>
                <Text style={styles.paypalIcon}>💙</Text>
                <View>
                  <Text style={styles.paypalLabel}>PayPal</Text>
                  <Text style={styles.paypalEmail}>{item.email}</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.applePayIcon}>🍎</Text>
                <View>
                  <Text style={styles.applePayLabel}>Apple Pay</Text>
                </View>
              </>
            )}
            
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Check size={12} color={Colors.card} />
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditPaymentMethod(item)}
          >
            <Edit3 size={16} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeletePaymentMethod(item)}
          >
            <Trash2 size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      {!item.isDefault && (
        <Button
          title="Set as Default"
          onPress={() => handleSetDefault(item)}
          variant="outline"
          size="small"
          style={styles.defaultButton}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Payment Methods",
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.text,
        }}
      />
      
      <FlatList
        data={mockPaymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.addButtonContainer}>
        <Button
          title="Add Payment Method"
          onPress={handleAddPaymentMethod}
          variant="primary"
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
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  paymentCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
    marginRight: 12,
  },
  paymentTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 12,
    color: Colors.textLight,
  },
  paypalIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paypalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  paypalEmail: {
    fontSize: 14,
    color: Colors.textLight,
  },
  applePayIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  applePayLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  defaultBadge: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  defaultText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.card,
    marginLeft: 4,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  defaultButton: {
    alignSelf: "flex-start",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addButton: {
    width: "100%",
  },
});