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
        <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
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
          <Sliders size={20} color={Colors.text} />
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
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});