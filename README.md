# 🧠 Nexus AI — Intelligent Chat Assistant

A sleek, real-time AI chat assistant running entirely on the edge. Built with **Cloudflare Workers** and powered by **Meta's Llama 3 (8B)**, Nexus AI delivers fast, context-aware conversations with a clean, modern interface.


---

## ✨ Features

- **Edge-Powered AI** — Runs on Cloudflare Workers for ultra-low latency responses worldwide
- **Llama 3 Integration** — Uses Meta's Llama 3 (8B Instruct) via Cloudflare Workers AI
- **Conversation Memory** — Maintains session-based chat history for coherent, context-aware replies
- **Dark / Light Mode** — Toggle between themes with persistent preference via localStorage
- **Chat Export** — Download your full conversation as a `.txt` file
- **Responsive UI** — Optimized for desktop, tablet, and mobile screens
- **Typing Indicator** — Animated dots show when the AI is generating a response

---

## 🖼️ Screenshots

| Light Mode | Dark Mode |
|---|---|
| ![Light Mode](screenshots/light.png) | ![Dark Mode](screenshots/dark.png) |

> Add your own screenshots to a `screenshots/` folder in the repo.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Cloudflare Workers (Edge Computing) |
| AI Model | Meta Llama 3 8B Instruct via Workers AI |
| Frontend | Vanilla JavaScript, HTML5, CSS3 |
| Deployment | Wrangler CLI |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed globally

```bash
npm install -g wrangler
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/kanav1603/cf_ai_nexus_chat.git
cd cf_ai_nexus_chat
```

2. **Authenticate with Cloudflare**

```bash
wrangler login
```

3. **Run locally in development mode**

```bash
wrangler dev
```

The app will be available at `http://localhost:8787`.

4. **Deploy to production**

```bash
wrangler deploy
```

---

## 📁 Project Structure

```
cf_ai_nexus_chat/
├── src/
│   └── index.js          # Worker script — API routes + embedded HTML frontend
├── wrangler.toml          # Cloudflare Workers configuration
├── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ How It Works

1. The user sends a message through the chat interface
2. The frontend makes a `POST` request to `/api/chat` with the message and a unique user ID
3. The Worker retrieves the user's conversation history from an in-memory `Map`
4. The last 10 messages (plus a system prompt) are sent to **Llama 3 8B** via the Workers AI binding
5. The AI response is returned to the frontend and the history is updated (capped at 20 messages)

---

## 🔧 Configuration

In your `wrangler.toml`, ensure the AI binding is configured:

```toml
[ai]
binding = "AI"
```

---

## 📌 Limitations

- **In-memory storage** — Conversation history is stored in a `Map` inside the Worker. It resets on redeployment or when the isolate is recycled. For persistent memory, consider integrating **Cloudflare KV** or **D1**.
- **Context window** — Only the last 10 messages are sent to the model to stay within token limits.
- **Single model** — Currently uses Llama 3 8B Instruct. Can be swapped for other models available on Workers AI.

---

## 🗺️ Roadmap

- [ ] Persistent chat history with Cloudflare KV or D1
- [ ] Streaming responses (Server-Sent Events)
- [ ] Markdown rendering in AI responses
- [ ] Multi-conversation support (tabs / sidebar)
- [ ] File and image upload support

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

- GitHub: [@kanav1603](https://github.com/kanav1603)

---

<p align="center">Built with ⚡ Cloudflare Workers + 🦙 Llama 3</p>
