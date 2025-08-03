import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { Stack } from "expo-router";
import { Colors } from "@/constants/colors";
import { Clock, MapPin } from "lucide-react-native";

interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  items: string[];
  total: number;
  status: "preparing" | "on-the-way" | "delivered";
  orderDate: string;
  estimatedDelivery?: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    restaurantName: "Bella Italia",
    restaurantImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    items: ["Margherita Pizza", "Caesar Salad"],
    total: 24.99,
    status: "on-the-way",
    orderDate: "2024-01-15T18:30:00Z",
    estimatedDelivery: "20-30 min"
  },
  {
    id: "2",
    restaurantName: "Sushi Master",
    restaurantImage: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    items: ["California Roll", "Salmon Sashimi", "Miso Soup"],
    total: 32.50,
    status: "delivered",
    orderDate: "2024-01-14T19:15:00Z"
  }
];

export default function OrdersScreen() {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "preparing":
        return Colors.warning;
      case "on-the-way":
        return Colors.primary;
      case "delivered":
        return Colors.success;
      default:
        return Colors.textLight;
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "preparing":
        return "Preparing";
      case "on-the-way":
        return "On the way";
      case "delivered":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Image source={{ uri: item.restaurantImage }} style={styles.restaurantImage} />
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.orderDate).toLocaleDateString()}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
            {item.estimatedDelivery && (
              <>
                <Clock size={12} color={Colors.textLight} style={styles.clockIcon} />
                <Text style={styles.estimatedTime}>{item.estimatedDelivery}</Text>
              </>
            )}
          </View>
        </View>
        <Text style={styles.total}>${item.total.toFixed(2)}</Text>
      </View>
      
      <View style={styles.itemsList}>
        <Text style={styles.itemsLabel}>Items:</Text>
        {item.items.map((itemName, index) => (
          <Text key={index} style={styles.itemName}>
            • {itemName}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Orders",
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.text,
        }}
      />
      
      <FlatList
        data={mockOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  clockIcon: {
    marginRight: 4,
  },
  estimatedTime: {
    fontSize: 12,
    color: Colors.textLight,
  },
  total: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  itemsList: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  itemsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 2,
  },
});