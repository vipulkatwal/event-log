# 📝 Event Logging System

![preview](/screenShot.png)


## 🌟 Overview
A decentralized, tamper-proof event logging platform for distributed applications. Designed to be scalable, secure, and user-friendly.

## ✨ Features

### 🔌 Event Logging API
- Stores events with metadata: Event Type, Timestamp, Source ID, and Payload
- Built-in pagination for large datasets
- MongoDB integration for efficient storage and retrieval
- Sharding and indexing for handling large volumes

### 🔒 Tamper-Proof Design
- Cryptographic hashing using Node.js crypto
- Blockchain-like structure for data integrity
- Each log links to previous log's hash

### ⚡ Real-Time Log Streaming
- Socket.IO integration for live updates
- No polling required for real-time data
- Instant client notifications

![preview](/search.png)
### 🔍 Search and Query
- Filter by:
  - 📅 Timestamp range
  - 🏷️ Event Type
  - 🎯 Source Application
- Pagination support for large datasets
- Advanced filtering capabilities

![preview](/dashboard.png)
### 🎨 Frontend Dashboard
- Built with React & Tailwind CSS
- Features include:
  - 📊 Event List
  - 🔄 Real-Time Updates
  - 🔎 Event Search
  - 📈 Dashboard Visualization

## 🛠️ Technologies Used

### Backend
- 🟢 Node.js
- 📦 Express
- 🍃 MongoDB
- 🔐 Crypto
- 🔌 Socket.IO

### Frontend
- ⚛️ React
- 🎨 Tailwind CSS
- 🔄 React Query
- 🌐 Axios
- 🎯 Lucide-React (icons)


## 💪 Strengths
- 🔒 Robust tamper-proof logging with blockchain-like implementation
- ⚡ Real-time updates for enhanced user experience
- 🎨 Clean, responsive frontend design
- 🛡️ Comprehensive error handling

## 🔄 Areas for Improvement
- 🌐 Enhance decentralization simulation
- 📊 Add more advanced visualization features
- 🔥 Implement comprehensive stress testing

## 🚀 Getting Started

1. **Clone the repository:**
```bash
git clone https://github.com/vipulkatwal/event-log.git
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
```

4. **Start the application:**
```bash
npm run dev
```

## 📝 License
This project is licensed under the MIT License.

---

## 📞 Support
For questions or support, please open an issue in the repository or contact the maintainers.

_Made with ❤️ by Vipul Katwal_