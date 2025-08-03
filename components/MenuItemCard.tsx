import { MenuItem } from "@/types";
import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import { Colors } from "@/constants/colors";
import { useRouter } from "expo-router";

interface MenuItemCardProps {
  menuItem: MenuItem;
  horizontal?: boolean;
}

export default function MenuItemCard({ menuItem, horizontal }: MenuItemCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/menu-item/${menuItem.id}` as any);
  };

  if (horizontal) {
    return (
      <TouchableOpacity 
        style={styles.horizontalContainer} 
        onPress={handlePress}
        activeOpacity={0.8}
        testID={`menu-item-card-${menuItem.id}`}
      >
        <View style={styles.horizontalContent}>
          <View style={styles.horizontalInfo}>
            <Text style={styles.name} numberOfLines={1}>{menuItem.name}</Text>
            <Text style={styles.description} numberOfLines={2}>{menuItem.description}</Text>
            <Text style={styles.price}>${menuItem.price.toFixed(2)}</Text>
            {menuItem.popular && <View style={styles.popularBadge}><Text style={styles.popularText}>Popular</Text></View>}
          </View>
          <View style={styles.horizontalImageContainer}>
            <Image source={{ uri: menuItem.image }} style={styles.horizontalImage} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.8}
      testID={`menu-item-card-${menuItem.id}`}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: menuItem.image }} style={styles.image} />
        {menuItem.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{menuItem.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{menuItem.description}</Text>
        <Text style={styles.price}>${menuItem.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  popularBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  popularText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  horizontalContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  horizontalContent: {
    flexDirection: "row",
    padding: 12,
  },
  horizontalInfo: {
    flex: 1,
    paddingRight: 12,
  },
  horizontalImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
  horizontalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});