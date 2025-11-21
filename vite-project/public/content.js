// content.js - Runs on every webpage and injects the AI helper button
(function () {
  // Prevent multiple injections
  if (window.__aiHelperInjected) return;
  window.__aiHelperInjected = true;

  console.log("AI Helper: Content script loaded!");
  console.log("AI Helper: chrome.runtime available:", !!chrome?.runtime);
  console.log("AI Helper: Extension ID:", chrome?.runtime?.id);

  function injectButton() {
    // Check if body exists
    if (!document.body) {
      console.log("AI Helper: Body not ready, waiting...");
      setTimeout(injectButton, 100);
      return;
    }

    console.log("AI Helper: Injecting button...");

    // Create floating button
    const btn = document.createElement("button");
    btn.id = "ai-helper-button";
    btn.innerHTML = "🤖 AI";
    btn.title = "Click to get AI answer from page content";
    
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "2147483647",
      padding: "12px 18px",
      borderRadius: "50px",
      background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
      color: "white",
      border: "2px solid #4CAF50",
      cursor: "pointer",
      boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(76,175,80,0.3)",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      fontFamily: "Arial, sans-serif"
    });

    // Hover effect
    btn.onmouseenter = () => {
      btn.style.transform = "scale(1.1)";
      btn.style.boxShadow = "0 6px 25px rgba(76,175,80,0.6), 0 0 0 2px rgba(76,175,80,0.5)";
      btn.style.background = "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)";
    };
    btn.onmouseleave = () => {
      btn.style.transform = "scale(1)";
      btn.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(76,175,80,0.3)";
      btn.style.background = "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)";
    };

    document.body.appendChild(btn);
    console.log("AI Helper: Button added to page!");

  // Create overlay for showing AI response
  const overlay = document.createElement("div");
  overlay.id = "ai-helper-overlay";
  
  Object.assign(overlay.style, {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    zIndex: "2147483646",
    width: "400px",
    maxHeight: "500px",
    overflowY: "auto",
    background: "white",
    color: "#333",
    padding: "20px",
    borderRadius: "12px",
    display: "none",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    fontSize: "14px",
    lineHeight: "1.6",
    fontFamily: "Arial, sans-serif"
  });

  // Create close button for overlay
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✕";
  closeBtn.title = "Close";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#999",
    padding: "0",
    width: "30px",
    height: "30px"
  });
  closeBtn.onclick = () => hideOverlay();
  
  overlay.appendChild(closeBtn);

  // Content container
  const content = document.createElement("div");
  content.id = "ai-helper-content";
  overlay.appendChild(content);

  document.body.appendChild(overlay);

  function showOverlay(html) {
    content.innerHTML = html;
    overlay.style.display = "block";
  }

  function hideOverlay() {
    overlay.style.display = "none";
  }

  function showLoading() {
    showOverlay(`
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 24px; margin-bottom: 10px;">⚡</div>
        <div style="color: #666; font-weight: 500;">Processing...</div>
        <div style="color: #999; font-size: 12px; margin-top: 5px;">Getting AI answer</div>
      </div>
    `);
  }

  function showError(message) {
    showOverlay(`
      <div style="padding: 10px;">
        <div style="color: #e74c3c; font-weight: bold; margin-bottom: 10px;">❌ Error</div>
        <div>${message}</div>
      </div>
    `);
  }

  // Extract ONLY VISIBLE text from the screen - OPTIMIZED FOR SPEED
  function extractPageText() {
    let visibleText = "";
    
    // Get all text nodes that are actually visible on screen
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip if parent is not visible
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const style = window.getComputedStyle(parent);
          if (style.display === 'none' || 
              style.visibility === 'hidden' || 
              style.opacity === '0') {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Check if element is in viewport
          const rect = parent.getBoundingClientRect();
          const inViewport = (
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0
          );
          
          if (!inViewport) return NodeFilter.FILTER_REJECT;
          
          // Get text content
          const text = node.textContent.trim();
          if (text.length > 0) return NodeFilter.FILTER_ACCEPT;
          
          return NodeFilter.FILTER_REJECT;
        }
      }
    );
    
    // Collect visible text
    let node;
    while (node = walker.nextNode()) {
      visibleText += node.textContent + " ";
      // Stop if we have enough text - reduced for faster processing
      if (visibleText.length > 1500) break;
    }
    
    // Cleanup text
    visibleText = visibleText
      .replace(/\s+/g, " ")
      .replace(/[^\w\s.,!?-]/g, '')
      .trim()
      .substring(0, 1500);  // Maximum 1500 chars for faster response
    
    return visibleText;
  }

  // Handle button click
  btn.addEventListener("click", async () => {
    showLoading();

    try {
      // Check if chrome.runtime is available
      if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
        showError("Extension error: chrome.runtime not available. Try refreshing the extension.");
        console.error("chrome.runtime is not available:", chrome);
        return;
      }

      // Extract text from page
      const pageText = extractPageText();

      if (!pageText || pageText.length < 50) {
        showError("Could not extract enough text from this page.");
        return;
      }

      console.log("Extracted text length:", pageText.length);

      // Send only visible text (already limited to 2000 chars)
      let textToSend = pageText;

      console.log("Sending message to background script...");

      // Send to background script
      chrome.runtime.sendMessage(
        {
          action: "getAIAnswer",
          text: textToSend
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Runtime error:", chrome.runtime.lastError);
            showError("Connection error: " + chrome.runtime.lastError.message + ". Try reloading the extension.");
            return;
          }

          console.log("Received response:", response);

          if (response && response.success) {
            showOverlay(`
              <div style="padding: 10px 0;">
                <div style="color: #4CAF50; font-weight: bold; margin-bottom: 15px; font-size: 16px;">
                  ✨ AI Answer
                </div>
                <div style="line-height: 1.8; white-space: pre-wrap;">${response.answer}</div>
              </div>
            `);
          } else {
            showError(response?.error || "Failed to get AI answer. Check backend is running on http://localhost:5000");
          }
        }
      );
    } catch (error) {
      console.error("AI Helper Error:", error);
      showError("Unexpected error: " + error.message);
    }
  });

    // Click outside overlay to close
    document.addEventListener("click", (e) => {
      if (!overlay.contains(e.target) && e.target !== btn) {
        hideOverlay();
      }
    });

    console.log("AI Helper: All UI elements ready!");
  }

  // Start injection when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectButton);
  } else {
    injectButton();
  }
})();
