# NutriLens

AI-powered food analysis mobile application for estimating carbohydrate content and glycemic index using Google Gemini AI.

## Features

- 📸 Take photos or select from gallery
- 🤖 AI-powered food recognition using Google Gemini
- 📊 Carbohydrate and calorie estimation
- 📈 Glycemic Index (GI) analysis
- 💾 Secure local API key storage
- 📱 iOS and Android support
- 🍽️ Meal logging and history tracking
- 📉 Weekly carbohydrate intake charts
- ⚙️ Customizable energy unit display (kcal or kJ)
- 🎯 Daily nutritional needs tracking (male/female)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on your device:
   - Install the Expo Go app on your iOS or Android device
   - Scan the QR code from the terminal

### Building a Native Application

For Android:
```bash
eas build --platform android --profile preview
```

For iOS:
```bash
eas build --platform ios --profile preview
```

### Running on Simulators/Emulators

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal

## Usage

1. Enter your Google Gemini API key when prompted (or configure it in Settings)
2. Take a photo or select an image from your gallery
3. Optionally add a description for better accuracy
4. Tap "Analyze Food" to get results
5. View carbohydrate content, calories, and GI for each identified food item
6. Save meals to your log for tracking
7. View your meal history and weekly trends

## Tech Stack

- **React Native** with Expo
- **TypeScript**
- **Google Gemini AI** (gemini-2.5-flash) for image analysis
- **expo-image-picker** for camera/gallery access
- **AsyncStorage** for local data persistence
- **@google/generative-ai** for Gemini API integration

## Privacy

Your API key is stored locally on your device and is never sent to any server other than Google's Gemini API for analysis. All meal data is stored locally on your device.

## License

For informational purposes only. Always consult with a healthcare professional for medical advice.
