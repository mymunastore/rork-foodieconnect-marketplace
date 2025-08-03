import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { Stack } from "expo-router";
import { Colors } from "@/constants/colors";
import { Bell, Globe, Shield, HelpCircle, FileText, ChevronRight } from "lucide-react-native";
import { useState } from "react";

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const handleLanguage = () => {
    Alert.alert("Language", "This would open language selection.");
  };

  const handlePrivacy = () => {
    Alert.alert("Privacy Policy", "This would show the privacy policy.");
  };

  const handleTerms = () => {
    Alert.alert("Terms of Service", "This would show the terms of service.");
  };

  const handleHelp = () => {
    Alert.alert("Help & Support", "This would open help and support.");
  };

  const handleAbout = () => {
    Alert.alert("About", "Food Marketplace v1.0.0\n\nBuilt with React Native and Expo");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Settings",
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.text,
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={Colors.text} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive order updates and promotions</Text>
              </View>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: Colors.inactive, true: Colors.primary }}
              thumbColor={Colors.card}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={Colors.text} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive newsletters and offers</Text>
              </View>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: Colors.inactive, true: Colors.primary }}
              thumbColor={Colors.card}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={20} color={Colors.text} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Location Services</Text>
                <Text style={styles.settingDescription}>Allow location access for delivery</Text>
              </View>
            </View>
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{ false: Colors.inactive, true: Colors.primary }}
              thumbColor={Colors.card}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLanguage}>
            <View style={styles.settingLeft}>
              <Globe size={20} color={Colors.text} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Language</Text>
                <Text style={styles.settingDescription}>English</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleHelp}>
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color={Colors.text} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingDescription}>Get help with your orders</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacy}>
            <View style={styles.settingLeft}>
              <Shield size={20} color={Colors.text} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Privacy Policy</Text>
                <Text style={styles.settingDescription}>How we handle your data</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleTerms}>
            <View style={styles.settingLeft}>
              <FileText size={20} color={Colors.text} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Terms of Service</Text>
                <Text style={styles.settingDescription}>Our terms and conditions</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.aboutButton} onPress={handleAbout}>
          <Text style={styles.aboutText}>About Food Marketplace</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  aboutButton: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    alignItems: "center",
  },
  aboutText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.primary,
  },
});