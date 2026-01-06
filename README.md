# AI-Advanced-chatbot
This project is an AI-powered chatbot . It allows users to ask questions and receive highly accurate, context-aware responses based on custom documents and data.

# Gemini API Setup Instructions

## How to Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## How to Configure the Chatbot

1. Open `script.js` file
2. Find line 14: `const API_KEY = 'YOUR_API_KEY';`
3. Replace `'YOUR_API_KEY'` with your actual API key from Google AI Studio
4. Save the file

Example:
```javascript
const API_KEY = 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

## Important Notes

- Keep your API key secure and never share it publicly
- The API key should be kept in a secure environment for production use
- For production, consider using environment variables or a backend server to hide the API key

## Testing

After setting up your API key:
1. Open `index.html` in your web browser
2. Type a message in the input field
3. Press Enter or click the submit button
4. The chatbot should now respond using Gemini AI

## Troubleshooting

If you're still having issues:
- Check that your API key is correct
- Ensure you have an active internet connection
- Check the browser console for any error messages
- Verify that the Gemini API is enabled in your Google Cloud project
