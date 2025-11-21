<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>AI Overlay Settings</title>
  <style>
    body { font-family: Arial, sans-serif; width:260px; padding:12px; }
    input { width:100%; padding:8px; margin-top:6px; box-sizing:border-box; }
    button { margin-top:8px; padding:8px; width:100%; background:#2F80ED; color:white; border:none; border-radius:6px; cursor:pointer; }
    label { font-size:12px; color:#333; }
  </style>
</head>
<body>
  <h3>AI Overlay Assistant</h3>
  <label>Backend URL:</label>
  <input id="backendUrl" placeholder="http://localhost:5000" />
  <button id="save">Save</button>
  <p style="font-size:12px;color:#666;margin-top:8px;">Backend handles Gemini keys (keep them secret).</p>

  <script>
    const input = document.getElementById('backendUrl');
    const saveBtn = document.getElementById('save');
    // load stored
    chrome.storage.local.get({backendUrl: 'http://localhost:5000'}, (res) => {
      input.value = res.backendUrl || 'http://localhost:5000';
    });
    saveBtn.onclick = () => {
      const url = input.value.trim();
      if (!url) return alert("Enter backend URL");
      chrome.storage.local.set({ backendUrl: url }, () => {
        alert("Saved");
      });
    };
  </script>
</body>
</html>
