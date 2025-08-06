import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  StyleSheet,
  Animated,

} from 'react-native';
import { Stack } from 'expo-router';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Mic, Camera, Image as ImageIcon, Send, Sparkles, Brain, Zap, MessageCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
  tokens?: number;
  model?: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
};

type SmartSuggestion = {
  id: string;
  text: string;
  category: 'food' | 'recipe' | 'restaurant' | 'general';
  icon: string;
};

type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image'; image: string };

type CoreMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string | ContentPart[] }
  | { role: 'assistant'; content: string };



export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadConversations();
    generateSmartSuggestions();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  const loadConversations = async () => {
    try {
      const stored = await AsyncStorage.getItem('ai_conversations');
      if (stored) {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
        if (parsed.length > 0) {
          const latest = parsed[0];
          setCurrentConversationId(latest.id);
          setMessages(latest.messages);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const saveConversations = async (updatedConversations: Conversation[]) => {
    try {
      await AsyncStorage.setItem('ai_conversations', JSON.stringify(updatedConversations));
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  };

  const generateSmartSuggestions = () => {
    const suggestions: SmartSuggestion[] = [
      {
        id: '1',
        text: 'What\'s a healthy Nigerian breakfast?',
        category: 'food',
        icon: '🍳'
      },
      {
        id: '2', 
        text: 'Show me how to make jollof rice',
        category: 'recipe',
        icon: '👨‍🍳'
      },
      {
        id: '3',
        text: 'Best restaurants near me',
        category: 'restaurant', 
        icon: '🏪'
      },
      {
        id: '4',
        text: 'Generate a food image',
        category: 'general',
        icon: '🎨'
      },
      {
        id: '5',
        text: 'Nutritional facts about plantain',
        category: 'food',
        icon: '📊'
      },
      {
        id: '6',
        text: 'Quick 15-minute meal ideas',
        category: 'recipe',
        icon: '⏱️'
      }
    ];
    setSmartSuggestions(suggestions);
  };

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      lastUpdated: new Date(),
    };
    
    setCurrentConversationId(newConversation.id);
    setMessages([]);
    setShowSuggestions(true);
    
    const updatedConversations = [newConversation, ...conversations];
    saveConversations(updatedConversations);
  };

  const sendMessage = async (text?: string, imageUri?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim() && !imageUri) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      image: imageUri,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const coreMessages: CoreMessage[] = [
        {
          role: 'system',
          content: `You are an advanced AI assistant integrated into FoodieConnect, a premium Nigerian food delivery app. You have expertise in:
          
          🍽️ Nigerian cuisine, recipes, and cooking techniques
          🏪 Restaurant recommendations and food delivery
          🥗 Nutrition, dietary advice, and meal planning
          🎨 Food photography and presentation
          📱 App features and food ordering assistance
          
          Always be helpful, culturally aware, and provide actionable advice. When discussing Nigerian foods, include cultural context. For recipes, provide clear steps. For restaurants, consider location and preferences. Keep responses concise but informative.`
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        } as CoreMessage)),
      ];

      if (imageUri) {
        const lastMessage = coreMessages[coreMessages.length - 1];
        if (lastMessage && lastMessage.role === 'user') {
          lastMessage.content = [
            { type: 'text', text: messageText },
            { type: 'image', image: imageUri }
          ];
        }
      } else {
        coreMessages.push({
          role: 'user',
          content: messageText
        });
      }

      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: coreMessages }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.completion,
        timestamp: new Date(),
        model: 'gpt-4o',
        tokens: data.completion.length,
      };

      const updatedMessages = [...messages, assistantMessage];
      setMessages(updatedMessages);
      setShowSuggestions(false);
      
      // Update conversation
      if (currentConversationId) {
        const updatedConversations = conversations.map(conv => 
          conv.id === currentConversationId 
            ? { 
                ...conv, 
                messages: updatedMessages,
                title: updatedMessages.length === 2 ? messageText.slice(0, 30) + '...' : conv.title,
                lastUpdated: new Date()
              }
            : conv
        );
        saveConversations(updatedConversations);
      }


    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://toolkit.rork.com/images/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `Food-related image: ${prompt}`,
          size: '1024x1024'
        }),
      });

      const data = await response.json();
      const imageUri = `data:${data.image.mimeType};base64,${data.image.base64Data}`;
      
      const imageMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🎨 Generated: ${prompt}`,
        image: imageUri,
        timestamp: new Date(),
        model: 'dall-e-3',
      };

      setMessages(prev => [...prev, imageMessage]);
    } catch (error) {
      console.error('Error generating image:', error);
      Alert.alert('Error', 'Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not supported', 'Voice recording is not available on web.');
      return;
    }

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone permission.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    
    const uri = recording.getURI();
    if (!uri) return;

    setIsLoading(true);
    try {
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append('audio', {
        uri,
        name: `recording.${fileType}`,
        type: `audio/${fileType}`,
      } as any);

      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.text) {
        await sendMessage(data.text);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      Alert.alert('Error', 'Failed to transcribe audio.');
    } finally {
      setIsLoading(false);
      setRecording(null);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const base64Image = `data:image/jpeg;base64,${asset.base64}`;
      setSelectedImage(base64Image);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const base64Image = `data:image/jpeg;base64,${asset.base64}`;
      setSelectedImage(base64Image);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'AI Assistant',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '600' },
        }} 
      />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Sparkles size={48} color={Colors.primary} />
            <Animated.View style={[styles.welcomeHeader, { opacity: fadeAnim }]}>
              <View style={styles.aiIconContainer}>
                <Brain size={32} color={Colors.primary} />
                <Sparkles size={20} color="#FFD700" style={styles.sparkleIcon} />
              </View>
              <Text style={styles.welcomeTitle}>FoodieConnect AI</Text>
              <Text style={styles.welcomeSubtitle}>Powered by GPT-4o & DALL-E 3</Text>
              <Text style={styles.welcomeText}>
                Your intelligent food companion for Nigerian cuisine, recipes, and dining experiences
              </Text>
            </Animated.View>
            
            {showSuggestions && (
              <Animated.View style={[styles.suggestionsContainer, { opacity: fadeAnim }]}>
                <Text style={styles.suggestionsTitle}>✨ Try asking me about:</Text>
                <View style={styles.suggestionsGrid}>
                  {smartSuggestions.map((suggestion) => (
                    <TouchableOpacity 
                      key={suggestion.id}
                      style={styles.suggestionCard}
                      onPress={() => {
                        if (suggestion.category === 'general' && suggestion.text.includes('image')) {
                          generateImage('Delicious Nigerian jollof rice with grilled chicken and plantain');
                        } else {
                          sendMessage(suggestion.text);
                        }
                      }}
                    >
                      <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
                      <Text style={styles.suggestionText}>{suggestion.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            )}
          </View>
        )}
        
        {messages.map((message, index) => (
          <Animated.View 
            key={message.id} 
            style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
              { opacity: fadeAnim }
            ]}
          >
            <View style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.assistantBubble
            ]}>
              {message.role === 'assistant' && (
                <View style={styles.assistantHeader}>
                  <Brain size={16} color={Colors.primary} />
                  <Text style={styles.assistantLabel}>FoodieConnect AI</Text>
                  {message.model && (
                    <Text style={styles.modelBadge}>{message.model}</Text>
                  )}
                </View>
              )}
              {message.image && (
                <Image source={{ uri: message.image }} style={styles.messageImage} />
              )}
              <Text style={[
                styles.messageText,
                message.role === 'user' ? styles.userText : styles.assistantText
              ]}>
                {message.content}
              </Text>
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </Animated.View>
        ))}
        
        {isLoading && (
          <View style={[styles.messageContainer, styles.assistantMessage]}>
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <Text style={styles.assistantText}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {selectedImage && (
        <View style={styles.selectedImageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity 
            style={styles.removeImageButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.removeImageText}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <View style={styles.inputHeader}>
          <TouchableOpacity style={styles.newChatButton} onPress={startNewConversation}>
            <MessageCircle size={16} color={Colors.primary} />
            <Text style={styles.newChatText}>New Chat</Text>
          </TouchableOpacity>
          <View style={styles.conversationInfo}>
            <Text style={styles.conversationCount}>{messages.length} messages</Text>
          </View>
        </View>
        
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <ImageIcon size={20} color={Colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
            <Camera size={20} color={Colors.primary} />
          </TouchableOpacity>
          
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity 
              style={[styles.actionButton, isRecording && styles.recordingButton]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Mic size={20} color={isRecording ? 'white' : Colors.primary} />
            </TouchableOpacity>
          </Animated.View>
          
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about Nigerian food, recipes, restaurants..."
            multiline
            maxLength={1000}
            placeholderTextColor="#999"
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (isLoading || (!inputText.trim() && !selectedImage)) && styles.sendButtonDisabled
            ]}
            onPress={() => sendMessage(inputText, selectedImage || undefined)}
            disabled={isLoading || (!inputText.trim() && !selectedImage)}
          >
            {isLoading ? (
              <Animated.View style={{ transform: [{ rotate: '360deg' }] }}>
                <Zap size={20} color="white" />
              </Animated.View>
            ) : (
              <Send size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 32,
  },
  suggestionsContainer: {
    gap: 12,
  },
  suggestionButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  suggestionText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: Colors.primary,
  },
  assistantBubble: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  assistantText: {
    color: '#333',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedImageContainer: {
    position: 'relative',
    margin: 16,
    alignSelf: 'flex-end',
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: '#ff4444',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  aiIconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    fontWeight: '500',
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  suggestionCard: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  assistantLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  modelBadge: {
    fontSize: 10,
    color: '#888',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  newChatText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  conversationInfo: {
    alignItems: 'flex-end',
  },
  conversationCount: {
    fontSize: 12,
    color: '#888',
  },
});