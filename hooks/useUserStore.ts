import { User, Address } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";

const USER_STORAGE_KEY = "foodMarketplace:user";

// Mock user data
const mockUser: User = {
  id: "u1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  addresses: [
    {
      id: "a1",
      title: "Home",
      address: "123 Main St, Anytown, USA",
      lat: 37.7749,
      lng: -122.4194,
      default: true,
    },
    {
      id: "a2",
      title: "Work",
      address: "456 Office Blvd, Anytown, USA",
      lat: 37.7833,
      lng: -122.4167,
      default: false,
    },
  ],
  favorites: ["1", "3"],
  profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Use mock user for demo purposes
          setUser(mockUser);
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        // Fallback to mock user
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user to storage whenever it changes
  useEffect(() => {
    const saveUser = async () => {
      if (user) {
        try {
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } catch (error) {
          console.error("Failed to save user:", error);
        }
      }
    };

    if (!loading && user) {
      saveUser();
    }
  }, [user, loading]);

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  const addAddress = (address: Omit<Address, "id">) => {
    if (user) {
      const newAddress: Address = {
        ...address,
        id: `a${Date.now()}`,
      };
      
      // If this is the first address or marked as default, update other addresses
      let updatedAddresses = [...user.addresses];
      if (address.default || updatedAddresses.length === 0) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          default: false,
        }));
      }
      
      setUser({
        ...user,
        addresses: [...updatedAddresses, newAddress],
      });
    }
  };

  const updateAddress = (addressId: string, updatedAddress: Partial<Address>) => {
    if (user) {
      let updatedAddresses = [...user.addresses];
      
      // If setting this address as default, update other addresses
      if (updatedAddress.default) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          default: false,
        }));
      }
      
      updatedAddresses = updatedAddresses.map(addr =>
        addr.id === addressId ? { ...addr, ...updatedAddress } : addr
      );
      
      setUser({
        ...user,
        addresses: updatedAddresses,
      });
    }
  };

  const removeAddress = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
      
      // If we removed the default address and there are other addresses, make the first one default
      if (
        user.addresses.find(addr => addr.id === addressId)?.default &&
        updatedAddresses.length > 0
      ) {
        updatedAddresses[0].default = true;
      }
      
      setUser({
        ...user,
        addresses: updatedAddresses,
      });
    }
  };

  const toggleFavorite = (restaurantId: string) => {
    if (user) {
      const favorites = [...user.favorites];
      const index = favorites.indexOf(restaurantId);
      
      if (index !== -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(restaurantId);
      }
      
      setUser({
        ...user,
        favorites,
      });
    }
  };

  const isFavorite = (restaurantId: string) => {
    return user?.favorites.includes(restaurantId) || false;
  };

  const getDefaultAddress = () => {
    if (!user) return null;
    return user.addresses.find(addr => addr.default) || user.addresses[0] || null;
  };

  return {
    user,
    loading,
    updateUser,
    addAddress,
    updateAddress,
    removeAddress,
    toggleFavorite,
    isFavorite,
    getDefaultAddress,
  };
});