# 🤖 AI Helper Chrome Extension ~by vandan

A Chrome extension that provides instant AI-powered answers from any webpage with a single click. No more tab switching, copy-pasting, or waiting - just click the AI button and get your answer in seconds.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![Chrome](https://img.shields.io/badge/chrome-extension-green)

## ✨ Features

- 🎯 **One-Click Answers**: Floating AI button on every webpg
- ⚡ **Fast Response**: ~3 second response time
- 👁️ **Smart Extraction**: Only extracts visible text from your screen
- 🔄 **Reliable**: 3 API key fallback system
- 📝 **Plain Text**: Clean answers without markdown formatting
- 🎨 **Non-Intrusive**: Beautiful floating button with hover effects

## 🛠️ Tech Stack

- **Frontend**: Chrome Extension (Manifest V3), JavaScript
- **Backend**: Python Flask
- **AI**: Google Gemini 2.0 Flash API
- **APIs**: Chrome Extensions API, Fetch API

## 📋 Prerequisites

Before you begin, ensure you have:

- Python 3.8 or higher
- Google Chrome browser
- Google Gemini API Key (get it from [Google AI Studio](https://aistudio.google.com/app/apikey))

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/AI-Helper-Chrome-Extension.git
cd AI-Helper-Chrome-Extension
```

### Step 2: Set Up Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the `backend` directory:
```bash
# On Windows
echo. > .env

# On Mac/Linux
touch .env
```

4. Add your Google Gemini API keys to the `.env` file:
```env
GEMINI_KEY_1=your_first_api_key_here
GEMINI_KEY_2=your_second_api_key_here
GEMINI_KEY_3=your_third_api_key_here
PORT=5000
```

**Note**: You can use the same API key for all three if you only have one.

5. Start the backend server:
```bash
python app.py
```

You should see:
```
🚀 Backend starting on port 5000
 * Running on http://127.0.0.1:5000
```

### Step 3: Load Chrome Extension

1. Open Chrome and go to `chrome://extensions/`

2. Enable "Developer mode" (toggle in top-right corner)

3. Click "Load unpacked"

4. Navigate to and select the `vite-project/public` folder

5. The extension should now appear in your extensions list!

## 📖 How to Use

1. **Open any webpage** (works best on quiz sites, articles, or text-heavy pages)

2. **Look for the AI button** in the bottom-right corner (🤖 AI)

3. **Click the button** to get an AI answer based on visible content

4. **View the answer** in the popup overlay

5. **Close** by clicking the X or clicking outside the overlay

## ⚙️ Configuration

### Change Backend URL

If you're running the backend on a different port or machine:

1. Click the extension icon in Chrome toolbar
2. Enter your backend URL (e.g., `http://localhost:5000`)
3. Click Save

### Adjust Response Length

Edit `backend/app.py` and change `maxOutputTokens`:

```python
"maxOutputTokens": 1000,  # Change to 500 for shorter, 2000 for longer
```

## 🏗️ Project Structure

```
AI-Helper-Chrome-Extension/
├── backend/
│   ├── app.py              # Flask server
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # API keys (create this)
│   ├── list_models.py     # Test API keys
│   └── test_backend.py    # Test backend endpoint
├── vite-project/
│   └── public/
│       ├── manifest.json   # Extension configuration
│       ├── content.js      # Injected into webpages
│       ├── background.js   # Service worker
│       ├── popup.html      # Settings popup
│       ├── popup.js        # Settings logic
│       └── icons/          # Extension icons
├── .gitignore
└── README.md
```

## 🧪 Testing

### Test Backend API:
```bash
cd backend
python test_backend.py
```

Expected output:
```
Testing backend...
Status: 200
Response: {'answer': '...', 'success': True}
```

### Test Extension:
1. Open any webpage
2. Click the AI button
3. Check browser console (F12) for logs

## 🐛 Troubleshooting

### Backend Not Starting
- Check if port 5000 is already in use
- Verify Python 3.8+ is installed: `python --version`
- Ensure all dependencies are installed: `pip install -r requirements.txt`

### Extension Not Working
- Reload the extension in `chrome://extensions/`
- Check that backend is running on http://localhost:5000
- Open browser console (F12) and check for errors

### "Cannot connect to backend" Error
- Ensure backend is running: `python backend/app.py`
- Check backend URL in extension settings
- Verify firewall isn't blocking port 5000

### "All API keys failed" Error
- Verify API keys are valid in `.env` file
- Check API quota at [Google AI Studio](https://aistudio.google.com/)
- Test API keys with: `python backend/list_models.py`

### API Rate Limit (429 Error)
- The extension automatically tries all 3 API keys
- Add more API keys to `.env` file
- Wait a few minutes for quota to reset

## 🎯 Use Cases

- ✅ Quick answers on quiz websites
- ✅ Summarize long articles
- ✅ Get explanations of complex topics
- ✅ Fast research and fact-checking
- ✅ Learning assistance

## ⚠️ Disclaimer

This extension is built as a learning project to demonstrate:
- Chrome Extension development
- API integration
- Flask backend architecture
- Smart text extraction algorithms

**Please use responsibly and ethically.** The best way to learn is still to study and understand the material yourself.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Chrome Extensions documentation
- Flask framework

## 📧 Contact

Have questions or suggestions? Feel free to open an issue or reach out!

---

**⭐ If you find this project helpful, please give it a star on GitHub!**

Made with ❤️ by Vandan
