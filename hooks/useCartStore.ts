import { CartItem, MenuItem } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const CART_STORAGE_KEY = "foodMarketplace:cart";

export const [CartProvider, useCart] = createContextHook(() => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart:", error);
      }
    };

    if (!loading) {
      saveCart();
    }
  }, [cartItems, loading]);

  const addToCart = (
    menuItem: MenuItem,
    quantity: number = 1,
    specialInstructions?: string,
    selectedOptions?: { optionId: string; choiceIds: string[] }[]
  ) => {
    // Check if the item is already in the cart
    const existingItemIndex = cartItems.findIndex(
      (item) => 
        item.menuItem.id === menuItem.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        id: `${menuItem.id}-${Date.now()}`,
        menuItem,
        quantity,
        specialInstructions,
        selectedOptions,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      // Ask for confirmation before removing
      Alert.alert(
        "Remove Item",
        "Do you want to remove this item from your cart?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Remove",
            onPress: () => removeFromCart(cartItemId),
            style: "destructive",
          },
        ]
      );
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      let itemPrice = item.menuItem.price;
      
      // Add any additional costs from selected options
      if (item.selectedOptions) {
        item.selectedOptions.forEach(option => {
          option.choiceIds.forEach(choiceId => {
            const menuItemOption = item.menuItem.options?.find(opt => opt.id === option.optionId);
            if (menuItemOption) {
              const choice = menuItemOption.choices.find(c => c.id === choiceId);
              if (choice) {
                itemPrice += choice.price;
              }
            }
          });
        });
      }
      
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getRestaurantId = () => {
    if (cartItems.length === 0) return null;
    return cartItems[0].menuItem.restaurantId;
  };

  const canAddFromRestaurant = (restaurantId: string) => {
    const currentRestaurantId = getRestaurantId();
    return currentRestaurantId === null || currentRestaurantId === restaurantId;
  };

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    getRestaurantId,
    canAddFromRestaurant,
  };
});