import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { Colors } from "@/constants/colors";
import { useUser } from "@/hooks/useUserStore";
import Button from "@/components/Button";
import { ChevronRight, CreditCard, Heart, LogOut, MapPin, Settings, ShoppingBag, User as UserIcon } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user, loading } = useUser();
  const router = useRouter();
  
  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const handleEditProfile = () => {
    Alert.alert(
      "Edit Profile",
      "This would allow you to edit your profile in a real app."
    );
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // In a real app, this would handle logout logic
            Alert.alert("Logged Out", "You have been logged out successfully.");
          },
        },
      ]
    );
  };
  
  const handleFavorites = () => {
    router.push("/favorites");
  };
  
  const handleOrders = () => {
    router.push("/orders");
  };
  
  const handleAddresses = () => {
    router.push("/addresses");
  };
  
  const handlePaymentMethods = () => {
    router.push("/payment-methods");
  };
  
  const handleSettings = () => {
    router.push("/settings");
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <UserIcon size={40} color={Colors.textLight} />
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>
        <Button 
          title="Edit Profile" 
          onPress={handleEditProfile} 
          variant="outline" 
          size="small" 
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleFavorites}>
          <View style={styles.menuItemLeft}>
            <Heart size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Favorites</Text>
          </View>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleOrders}>
          <View style={styles.menuItemLeft}>
            <ShoppingBag size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Orders</Text>
          </View>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleAddresses}>
          <View style={styles.menuItemLeft}>
            <MapPin size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Addresses</Text>
          </View>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handlePaymentMethods}>
          <View style={styles.menuItemLeft}>
            <CreditCard size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Payment Methods</Text>
          </View>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
          <View style={styles.menuItemLeft}>
            <Settings size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: Colors.card,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textLight,
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.error,
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 24,
  },
});