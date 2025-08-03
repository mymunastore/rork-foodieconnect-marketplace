import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from "react-native";
import { Stack } from "expo-router";
import { Colors } from "@/constants/colors";
import { MapPin, Plus, Edit3, Trash2 } from "lucide-react-native";
import Button from "@/components/Button";

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: "1",
    label: "Home",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    zipCode: "10001",
    isDefault: true,
  },
  {
    id: "2",
    label: "Work",
    address: "456 Business Ave, Suite 200",
    city: "New York",
    zipCode: "10002",
    isDefault: false,
  },
];

export default function AddressesScreen() {
  const handleAddAddress = () => {
    Alert.alert("Add Address", "This would open a form to add a new address.");
  };

  const handleEditAddress = (address: Address) => {
    Alert.alert("Edit Address", `This would edit the address: ${address.label}`);
  };

  const handleDeleteAddress = (address: Address) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete ${address.label}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive" },
      ]
    );
  };

  const handleSetDefault = (address: Address) => {
    Alert.alert("Set Default", `${address.label} is now your default address.`);
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressInfo}>
          <View style={styles.labelContainer}>
            <MapPin size={16} color={Colors.primary} />
            <Text style={styles.label}>{item.label}</Text>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          <Text style={styles.address}>{item.address}</Text>
          <Text style={styles.cityZip}>
            {item.city}, {item.zipCode}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditAddress(item)}
          >
            <Edit3 size={16} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteAddress(item)}
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
          title: "My Addresses",
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.text,
        }}
      />
      
      <FlatList
        data={mockAddresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Address"
          onPress={handleAddAddress}
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
  addressCard: {
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
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  addressInfo: {
    flex: 1,
    marginRight: 12,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.card,
  },
  address: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  cityZip: {
    fontSize: 14,
    color: Colors.textLight,
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