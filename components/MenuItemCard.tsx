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
    backgroundColor: Colors.cardDark,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 20,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    position: "relative",
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  popularText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: "700",
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 10,
    lineHeight: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.accent,
  },
  horizontalContainer: {
    backgroundColor: Colors.cardDark,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  horizontalContent: {
    flexDirection: "row",
    padding: 16,
  },
  horizontalInfo: {
    flex: 1,
    paddingRight: 16,
  },
  horizontalImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 12,
    overflow: "hidden",
  },
  horizontalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});