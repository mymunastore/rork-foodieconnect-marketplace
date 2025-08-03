import { Tabs } from "expo-router";
import { Home, Search, ShoppingBag, User } from "lucide-react-native";
import React from "react";

import { Colors } from "@/constants/colors";
import { CartProvider } from "@/hooks/useCartStore";
import { UserProvider } from "@/hooks/useUserStore";

export default function TabLayout() {
  return (
    <UserProvider>
      <CartProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.inactive,
            headerShown: true,
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: Colors.border,
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => <Home color={color} size={24} />,
              headerTitle: "Food Marketplace",
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: "Search",
              tabBarIcon: ({ color }) => <Search color={color} size={24} />,
              headerTitle: "Search",
            }}
          />
          <Tabs.Screen
            name="cart"
            options={{
              title: "Cart",
              tabBarIcon: ({ color }) => <ShoppingBag color={color} size={24} />,
              headerTitle: "Your Cart",
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color }) => <User color={color} size={24} />,
              headerTitle: "Your Profile",
            }}
          />
        </Tabs>
      </CartProvider>
    </UserProvider>
  );
}