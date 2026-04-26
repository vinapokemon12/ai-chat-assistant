const conversations = new Map();

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    
    if (request.method === 'POST' && url.pathname === '/api/chat') {
      try {
        const { message, userId = 'default-user' } = await request.json();
        
        let history = conversations.get(userId) || [];
        
        const messages = [
          { 
            role: 'system', 
            content: 'You are Nexus AI, an intelligent assistant with excellent memory. You remember everything from our conversation.'
          },
          ...history,
          { role: 'user', content: message }
        ];
        
        const response = await env.AI.run(
          '@cf/meta/llama-3-8b-instruct',
          { 
            messages: messages.slice(-10),
            max_tokens: 500 
          }
        );
        
        history.push(
          { role: 'user', content: message },
          { role: 'assistant', content: response.response }
        );
        
        conversations.set(userId, history.slice(-20));
        
        return new Response(JSON.stringify({
          response: response.response,
          userId: userId
        }), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Failed to process request',
          details: error.message 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return new Response(getModernHTML(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};

function getModernHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexus AI - Intelligent Assistant</title>
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --bg-primary: #ffffff;
            --bg-secondary: #f9fafb;
            --bg-tertiary: #f3f4f6;
            --text-primary: #111827;
            --text-secondary: #6b7280;
            --text-tertiary: #9ca3af;
            --border: #e5e7eb;
            --shadow: rgba(0, 0, 0, 0.1);
            --user-msg-bg: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            --user-msg-text: #ffffff;
            --ai-msg-bg: #ffffff;
            --ai-msg-text: #111827;
            --ai-msg-border: #e5e7eb;
        }
        
        [data-theme="dark"] {
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --bg-tertiary: #334155;
            --text-primary: #f1f5f9;
            --text-secondary: #cbd5e1;
            --text-tertiary: #94a3b8;
            --border: #334155;
            --shadow: rgba(0, 0, 0, 0.3);
            --ai-msg-bg: #1e293b;
            --ai-msg-text: #f1f5f9;
            --ai-msg-border: #334155;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: var(--bg-secondary);
            color: var(--text-primary);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background 0.3s, color 0.3s;
        }
        
        .container {
            width: 100%;
            max-width: 1000px;
            height: 90vh;
            max-height: 800px;
            background: var(--bg-primary);
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px var(--shadow);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: background 0.3s;
        }
        
        .header {
            padding: 20px 24px;
            background: var(--bg-primary);
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .status {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--text-secondary);
            font-size: 14px;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .header-right {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .icon-btn {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--bg-primary);
            color: var(--text-primary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            font-size: 18px;
        }
        
        .icon-btn:hover {
            background: var(--bg-tertiary);
            transform: scale(1.05);
        }
        
        .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            background: var(--bg-secondary);
            scroll-behavior: smooth;
        }
        
        .message {
            margin-bottom: 16px;
            display: flex;
            animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .user-message {
            justify-content: flex-end;
        }
        
        .message-content {
            max-width: 70%;
        }
        
        .message-bubble {
            padding: 12px 16px;
            border-radius: 16px;
            word-wrap: break-word;
            line-height: 1.5;
        }
        
        .user-message .message-bubble {
            background: var(--user-msg-bg);
            color: var(--user-msg-text);
            border-bottom-right-radius: 4px;
        }
        
        .ai-message .message-bubble {
            background: var(--ai-msg-bg);
            color: var(--ai-msg-text);
            border: 1px solid var(--ai-msg-border);
            border-bottom-left-radius: 4px;
        }
        
        .message-time {
            font-size: 12px;
            color: var(--text-tertiary);
            margin-top: 4px;
            padding: 0 8px;
        }
        
        .user-message .message-time {
            text-align: right;
        }
        
        .typing-indicator {
            display: none;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: var(--ai-msg-bg);
            border: 1px solid var(--ai-msg-border);
            border-radius: 16px;
            border-bottom-left-radius: 4px;
            width: fit-content;
        }
        
        .typing-indicator.show {
            display: flex;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--text-tertiary);
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }
        
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-15px);
            }
        }
        
        .input-container {
            padding: 20px 24px;
            background: var(--bg-primary);
            border-top: 1px solid var(--border);
        }
        
        .input-wrapper {
            display: flex;
            gap: 12px;
            align-items: center;
            background: var(--bg-tertiary);
            border-radius: 12px;
            padding: 8px 8px 8px 16px;
            transition: background 0.2s;
        }
        
        .input-wrapper:focus-within {
            background: var(--bg-secondary);
            box-shadow: 0 0 0 2px var(--primary);
        }
        
        #messageInput {
            flex: 1;
            background: transparent;
            border: none;
            color: var(--text-primary);
            font-size: 15px;
            outline: none;
            padding: 8px 0;
        }
        
        #messageInput::placeholder {
            color: var(--text-tertiary);
        }
        
        .send-btn {
            padding: 10px 20px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .send-btn:hover:not(:disabled) {
            background: var(--primary-dark);
            transform: scale(1.05);
        }
        
        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .counter {
            color: var(--text-secondary);
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .container {
                max-width: 100%;
                height: 100vh;
                border-radius: 0;
            }
            
            .message-content {
                max-width: 85%;
            }
            
            .header {
                padding: 16px;
            }
            
            .messages-container {
                padding: 16px;
            }
        }
    </style>
</head>
<body data-theme="light">
    <div class="container">
        <div class="header">
            <div class="header-left">
                <div class="logo">Nexus AI</div>
                <div class="status">
                    <div class="status-dot"></div>
                    <span>Online</span>
                </div>
            </div>
            <div class="header-right">
                <span class="counter" id="messageCounter">0 messages</span>
                <button class="icon-btn" onclick="toggleTheme()" title="Toggle theme">
                    <span id="themeIcon">🌙</span>
                </button>
                <button class="icon-btn" onclick="clearChat()" title="Clear chat">
                    <span>🗑</span>
                </button>
                <button class="icon-btn" onclick="exportChat()" title="Export chat">
                    <span>💾</span>
                </button>
            </div>
        </div>
        
        <div class="messages-container" id="messagesContainer">
            <div class="message ai-message">
                <div class="message-content">
                    <div class="message-bubble">
                        Welcome to Nexus AI! I'm your intelligent assistant with advanced memory capabilities. How can I help you today?
                    </div>
                    <div class="message-time">Just now</div>
                </div>
            </div>
        </div>
        
        <div class="input-container">
            <div class="input-wrapper">
                <input 
                    type="text" 
                    id="messageInput" 
                    placeholder="Type your message..."
                    autocomplete="off"
                    autofocus
                >
                <button class="send-btn" id="sendBtn" onclick="sendMessage()">
                    Send
                </button>
            </div>
        </div>
    </div>

    <script>
        const userId = 'user-' + Math.random().toString(36).substr(2, 9);
        let messageCount = 0;
        let isSending = false;
        
        const messagesContainer = document.getElementById('messagesContainer');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const messageCounter = document.getElementById('messageCounter');
        
        function toggleTheme() {
            const body = document.body;
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            document.getElementById('themeIcon').textContent = newTheme === 'light' ? '🌙' : '☀️';
            localStorage.setItem('theme', newTheme);
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        document.getElementById('themeIcon').textContent = savedTheme === 'light' ? '🌙' : '☀️';
        
        async function sendMessage() {
            if (isSending) return;
            
            const message = messageInput.value.trim();
            if (!message) return;
            
            isSending = true;
            messageCount++;
            updateCounter();
            
            // Add user message
            addMessage(message, 'user');
            
            // Clear input and disable button
            messageInput.value = '';
            sendBtn.disabled = true;
            
            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator show';
            typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            messagesContainer.appendChild(typingDiv);
            scrollToBottom();
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, userId })
                });
                
                const data = await response.json();
                
                // Remove typing indicator
                typingDiv.remove();
                
                // Add AI response
                if (data.error) {
                    addMessage('Sorry, I encountered an error. Please try again.', 'ai');
                } else {
                    addMessage(data.response, 'ai');
                }
            } catch (error) {
                typingDiv.remove();
                addMessage('Sorry, something went wrong. Please try again.', 'ai');
                console.error(error);
            } finally {
                sendBtn.disabled = false;
                messageInput.focus();
                isSending = false;
            }
        }
        
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + sender + '-message';
            
            const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            messageDiv.innerHTML = '<div class="message-content">' +
                '<div class="message-bubble">' + escapeHtml(text) + '</div>' +
                '<div class="message-time">' + time + '</div>' +
            '</div>';
            
            messagesContainer.appendChild(messageDiv);
            scrollToBottom();
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        function scrollToBottom() {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        function updateCounter() {
            messageCounter.textContent = messageCount + ' messages';
        }
        
        function clearChat() {
            if (confirm('Clear all messages?')) {
                messagesContainer.innerHTML = '<div class="message ai-message">' +
                    '<div class="message-content">' +
                        '<div class="message-bubble">Chat cleared. How can I help you?</div>' +
                        '<div class="message-time">Just now</div>' +
                    '</div>' +
                '</div>';
                messageCount = 0;
                updateCounter();
            }
        }
        
        function exportChat() {
            const messages = Array.from(document.querySelectorAll('.message-bubble'))
                .map(el => el.textContent)
                .join('\\n\\n');
            
            const blob = new Blob([messages], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'nexus-ai-chat-' + new Date().toISOString().split('T')[0] + '.txt';
            a.click();
            URL.revokeObjectURL(url);
        }
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Auto-resize based on content (optional)
        messageInput.addEventListener('input', () => {
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
        });
    </script>
</body>
</html>`;
}