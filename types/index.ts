export interface Restaurant {
  id: string;
  name: string;
  image: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  cuisineType: string;
  priceRange: string;
  deliveryTime: string;
  distance: string;
  address: string;
  description: string;
  isOpen: boolean;
  featured?: boolean;
  tags: string[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  tags: string[];
  options?: MenuItemOption[];
}

export interface MenuItemOption {
  id: string;
  name: string;
  choices: {
    id: string;
    name: string;
    price: number;
  }[];
  required: boolean;
  multiple: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  selectedOptions?: {
    optionId: string;
    choiceIds: string[];
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  favorites: string[];
  profileImage?: string;
}

export interface Address {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
  default: boolean;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
}