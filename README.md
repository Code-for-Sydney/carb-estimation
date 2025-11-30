# Carb Estimation App

AI-powered food analysis application for estimating carbohydrate content and glycemic index using Google Gemini AI.

## Project Structure

This repository contains two versions of the application:

### 📱 [carb-estimation-mobile](./carb-estimation-mobile)
React Native mobile app built with Expo
- iOS and Android support
- Camera and gallery image picker
- Native mobile UI/UX

### 🌐 [carb-estimation-web](./carb-estimation-web)
React web application built with Vite
- Modern web interface
- Drag-and-drop image upload
- Responsive design with Tailwind CSS

## Features

- 📸 Upload or capture food images
- 🤖 AI-powered food recognition using Google Gemini
- 📊 Carbohydrate content estimation
- 📈 Glycemic Index (GI) analysis
- 💾 Secure local API key storage

## Getting Started

### Mobile App
```bash
cd carb-estimation-mobile
npm install
npx expo start
```

### Web App
```bash
cd carb-estimation-web
npm install
npm run dev
```

## Requirements

- Node.js (v16 or higher)
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## Privacy

Your API key is stored locally and is never sent to any server other than Google's Gemini API for analysis.

## License

For informational purposes only. Always consult with a healthcare professional for medical advice.
