import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fab,
  Collapse,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

// Mock responses for demonstration
const BOT_RESPONSES = {
  greeting: [
    "Hello! I'm your AI shopping assistant. How can I help you today?",
    "Hi there! I can help you find products, compare prices, and answer questions about our inventory.",
    "Welcome to QKart! I'm here to assist you with your shopping needs.",
    "Hey! Need help finding the perfect product? Just ask me!",
    "Greetings! I'm your personal shopping assistant. What would you like to know?"
  ],
  product: [
    "We have a wide range of products including smartphones, health products, and more. What specific category are you interested in?",
    "Our product catalog includes premium smartphones, health supplements, and various other items. What would you like to explore?",
    "I can help you find products in categories like phones, health, electronics, and more. What interests you?",
    "We offer products from top brands. Would you like to see our latest arrivals or specific categories?",
    "Our inventory includes everything from smartphones to health products. What type of product are you looking for?"
  ],
  price: [
    "Our prices are competitive and we often have special offers. Would you like to know about any specific product's price?",
    "We offer various price ranges to suit different budgets. Which product's price would you like to know about?",
    "Prices vary by product category. I can help you find products within your budget. What's your price range?",
    "We have products starting from ₹499. What price range are you interested in?",
    "I can help you compare prices across different products. What are you looking for?"
  ],
  phone: [
    "The OnePlus 6 is a great choice! It features a 6.28-inch display, Snapdragon 845 processor, and dual cameras. Would you like to know more about its specifications?",
    "The OnePlus 6 offers excellent value for money with its premium features. It comes with 6GB/8GB RAM options and up to 256GB storage. Would you like to know about its current price?",
    "The OnePlus 6 has received great reviews for its performance and camera quality. It's available in Mirror Black, Midnight Black, and Silk White. Which color interests you?",
    "The OnePlus 6 is known for its fast charging capability and long battery life. Would you like to know about its battery specifications?",
    "The OnePlus 6 comes with Android 8.1 Oreo out of the box and is upgradeable to newer versions. Would you like to know about its software features?"
  ],
  health: [
    "We offer a variety of health products including supplements, vitamins, and fitness equipment. What specific health product are you interested in?",
    "Our health category includes products for fitness, wellness, and nutrition. Would you like to explore any specific health category?",
    "We have health products from trusted brands. Are you looking for supplements, vitamins, or fitness equipment?",
    "Our health products are carefully selected for quality and effectiveness. What type of health product are you looking for?",
    "We offer health products at various price points. Would you like to see our best-selling health items?"
  ],
  toothbrush: [
    "Our electric toothbrush is a premium oral care device with multiple cleaning modes and a long-lasting battery. Would you like to know more about its features?",
    "The electric toothbrush comes with replaceable brush heads and a charging stand. It's perfect for maintaining excellent oral hygiene. Would you like to know its price?",
    "Our electric toothbrush features a 2-minute timer and pressure sensor to ensure optimal cleaning. Would you like to know about its specifications?",
    "The electric toothbrush is waterproof and comes with a travel case. Would you like to know about its battery life?",
    "Our electric toothbrush is designed for sensitive teeth and gums. Would you like to know about its cleaning modes?"
  ],
  toothpaste: [
    "Our toothpaste is specially formulated for sensitive teeth and provides long-lasting protection. Would you like to know more about its benefits?",
    "The toothpaste contains fluoride and natural ingredients for effective cleaning. Would you like to know about its ingredients?",
    "Our toothpaste comes in a convenient tube with a flip-top cap. Would you like to know about its price?",
    "The toothpaste is clinically proven to reduce sensitivity. Would you like to know about its usage instructions?",
    "Our toothpaste is available in refreshing mint flavor. Would you like to know about other available flavors?"
  ],
  default: [
    "I'm here to help! You can ask me about products, prices, or any other shopping-related questions.",
    "I can help you find products, compare prices, or answer questions about our services. What would you like to know?",
    "Feel free to ask me about our products, prices, or any other shopping-related information.",
    "I'm your shopping assistant! Ask me about products, prices, or shopping help.",
    "How can I assist you with your shopping today?"
  ]
};

// Mock AI thinking delay
const TYPING_DELAY = 1000;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: "Hello! I'm your AI shopping assistant. Here's how I can help you:\n\n" +
                "1. Ask about products: 'Tell me about phones' or 'What health products do you have?'\n" +
                "2. Ask about prices: 'How much is the OnePlus 6?' or 'What's the price range?'\n" +
                "3. Ask about specific items: 'Tell me about the OnePlus 6' or 'What health supplements do you offer?'\n\n" +
                "Feel free to ask any shopping-related questions!",
          sender: "bot",
        },
      ]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      // Generate mock response based on keywords
      let response;
      const input = inputMessage.toLowerCase();
      
      if (input.includes('phone') || input.includes('oneplus') || input.includes('mobile')) {
        response = BOT_RESPONSES.phone[Math.floor(Math.random() * BOT_RESPONSES.phone.length)];
      } else if (input.includes('health') || input.includes('supplement') || input.includes('vitamin')) {
        response = BOT_RESPONSES.health[Math.floor(Math.random() * BOT_RESPONSES.health.length)];
      } else if (input.includes('toothbrush') || input.includes('electric toothbrush')) {
        response = BOT_RESPONSES.toothbrush[Math.floor(Math.random() * BOT_RESPONSES.toothbrush.length)];
      } else if (input.includes('toothpaste')) {
        response = BOT_RESPONSES.toothpaste[Math.floor(Math.random() * BOT_RESPONSES.toothpaste.length)];
      } else if (input.includes('product') || input.includes('buy')) {
        response = BOT_RESPONSES.product[Math.floor(Math.random() * BOT_RESPONSES.product.length)];
      } else if (input.includes('price') || input.includes('cost') || input.includes('₹') || input.includes('rs')) {
        response = BOT_RESPONSES.price[Math.floor(Math.random() * BOT_RESPONSES.price.length)];
      } else {
        response = BOT_RESPONSES.default[Math.floor(Math.random() * BOT_RESPONSES.default.length)];
      }

      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      setIsTyping(false);
    }, TYPING_DELAY);
  };

  return (
    <>
      {/* Chat toggle button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* Chat window */}
      <Collapse in={isOpen}>
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: 320,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
        >
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar src="/logo_light.svg" sx={{ mr: 1 }} />
            <Typography variant="h6">QKart Assistant</Typography>
          </Box>

          {/* Messages area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ alignSelf: 'flex-start' }}>
                <Paper elevation={1} sx={{ p: 1, bgcolor: 'grey.100' }}>
                  <Typography variant="body2">typing...</Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input area */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              InputProps={{
                endAdornment: (
                  <IconButton color="primary" onClick={handleSend}>
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default ChatBot; 