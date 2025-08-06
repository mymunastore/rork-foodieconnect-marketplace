import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/colors";
import { Search, Sliders } from "lucide-react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

interface SearchBarProps {
  onFilterPress?: () => void;
}

export default function SearchBar({ onFilterPress }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  
  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}` as any);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Search size={22} color={Colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search for restaurants, cuisines..."
          placeholderTextColor={Colors.textLight}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          testID="search-input"
        />
      </View>
      {onFilterPress && (
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={onFilterPress}
          testID="filter-button"
        >
          <Sliders size={22} color={Colors.card} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardDark,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  filterButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});