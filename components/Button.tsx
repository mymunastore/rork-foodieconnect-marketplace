import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from "react-native";
import { Colors } from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const getContainerStyle = () => {
    const containerStyle: ViewStyle[] = [styles.container];
    
    // Add variant styles
    if (variant === "primary") {
      containerStyle.push(styles.primaryContainer);
    } else if (variant === "secondary") {
      containerStyle.push(styles.secondaryContainer);
    } else if (variant === "outline") {
      containerStyle.push(styles.outlineContainer);
    }
    
    // Add size styles
    if (size === "small") {
      containerStyle.push(styles.smallContainer);
    } else if (size === "medium") {
      containerStyle.push(styles.mediumContainer);
    } else if (size === "large") {
      containerStyle.push(styles.largeContainer);
    }
    
    // Add disabled style
    if (disabled) {
      containerStyle.push(styles.disabledContainer);
    }
    
    // Add custom style
    if (style) {
      containerStyle.push(style);
    }
    
    return containerStyle;
  };
  
  const getTextStyle = () => {
    let textStyleArray = [styles.text];
    
    // Add variant text styles
    if (variant === "primary") {
      textStyleArray.push(styles.primaryText);
    } else if (variant === "secondary") {
      textStyleArray.push(styles.secondaryText);
    } else if (variant === "outline") {
      textStyleArray.push(styles.outlineText);
    }
    
    // Add size text styles
    if (size === "small") {
      textStyleArray.push(styles.smallText);
    } else if (size === "large") {
      textStyleArray.push(styles.largeText);
    }
    
    // Add disabled text style
    if (disabled) {
      textStyleArray.push(styles.disabledText);
    }
    
    // Add custom text style
    if (textStyle) {
      textStyleArray.push(textStyle);
    }
    
    return textStyleArray;
  };
  
  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === "outline" ? Colors.primary : Colors.card} 
          size="small" 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  primaryContainer: {
    backgroundColor: Colors.primary,
  },
  secondaryContainer: {
    backgroundColor: Colors.secondary,
  },
  outlineContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  smallContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  largeContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabledContainer: {
    backgroundColor: Colors.inactive,
    borderColor: Colors.inactive,
  },
  text: {
    fontWeight: "600" as const,
  },
  primaryText: {
    color: Colors.card,
    fontWeight: "600" as const,
  },
  secondaryText: {
    color: Colors.card,
    fontWeight: "600" as const,
  },
  outlineText: {
    color: Colors.primary,
    fontWeight: "600" as const,
  },
  smallText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  largeText: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  disabledText: {
    color: Colors.card,
    fontWeight: "600" as const,
  },
});