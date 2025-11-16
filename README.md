# 🏪 SmartShelf - AI-Powered Warehouse Inventory Management System

<div align="center">

![SmartShelf Banner](https://img.shields.io/badge/SmartShelf-Inventory_Management-blue?style=for-the-badge)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-orange?style=for-the-badge)](https://www.mongodb.com/mern-stack)

**A comprehensive warehouse management solution with real-time tracking, FEFO ordering, and demand forecasting**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Contributors](#-contributors)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🎯 About

**SmartShelf** is an intelligent warehouse inventory management system designed to optimize warehouse operations through automation, predictive analytics, and real-time monitoring. It addresses critical challenges in modern warehouse management including:

- ❌ Inventory discrepancies and manual errors
- ❌ Product expiry and waste management
- ❌ Inefficient task allocation
- ❌ Lack of predictive capabilities
- ❌ Limited real-time visibility



---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin, Manager, Worker)
- Password encryption using bcrypt
- Session management

### 📦 Inventory Management
- **Real-time tracking** of inventory items
- **CRUD operations** with full data validation
- **Category-based filtering** and search
- **Multi-field search** (product name, SKU, supplier)
- **Inventory analytics** with KPIs

### 📊 FEFO Ordering System
- **First Expired, First Out** algorithm implementation
- Automatic prioritization based on expiry dates
- **Urgency levels**: Critical (≤3 days), High (≤7 days), Medium (≤14 days), Low (>14 days)
- Visual indicators for quick identification

### 📈 Demand Forecasting
- **7-day demand projections** based on historical data
- Daily consumption rate calculations
- **Trend indicators**: Stable, Normal, Critical
- Product-wise forecast visualization
- Interactive forecast graphs

### 🔔 Alert System
- **Real-time notifications** for critical events
- **Live alert feed** with human-readable messages
- Alert categories:
  - 🔴 Expired items
  - 🟠 Expiring soon (within 7 days)
  - 🟡 Low stock (below threshold)
  - ⚫ Out of stock

### ✅ Task Management
- Task creation and assignment to workers
- **Status tracking**: Pending → In Progress → Completed
- Real-time task updates
- Task completion analytics
- Worker-specific task views

### 📱 Dashboard Analytics
- **Admin Dashboard**: System-wide overview and user management
- **Manager Dashboard**: Live alerts, forecasting, FEFO ordering, top products
- **Worker Dashboard**: Assigned tasks with quick status updates
- Responsive design with dark mode support

### 🎨 User Interface
- Modern, intuitive interface built with React + TypeScript
- **Tailwind CSS** for responsive design
- **Dark mode** support
- Mobile-friendly layouts
- Smooth animations and transitions

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)

- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **React Context API** - State management

### Backend
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens&logoColor=white)

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Development Tools
- **Git** - Version control
- **VS Code** - Code editor
- **Postman** - API testing
- **MongoDB Compass** - Database management

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         React + TypeScript Frontend (SPA)          │   │
│  │  • Component-based architecture                     │   │
│  │  • React Context for state management              │   │
│  │  • Tailwind CSS for styling                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION TIER                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Node.js + Express.js Backend (API)          │   │
│  │  • RESTful API endpoints                           │   │
│  │  • JWT authentication middleware                   │   │
│  │  • Role-based authorization                        │   │
│  │  • Business logic & algorithms                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                         DATA TIER                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MongoDB Database (NoSQL)              │   │
│  │  • Collections: Users, Inventory, Tasks            │   │
│  │  • Indexes for query optimization                  │   │
│  │  • Document-based storage                          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

### Clone Repository

```bash
git clone https://github.com/namish18/SmartShelf.git
cd SmartShelf
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Add MongoDB connection string and JWT secret

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with backend API URL

# Start development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/smartshelf
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartshelf

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRE=24h

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### MongoDB Setup

#### Option 1: Local MongoDB
```bash
# Start MongoDB service
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

---

## 💻 Usage


### User Roles & Permissions

| Feature | Admin | Manager | Worker |
|---------|-------|---------|--------|
| Dashboard Overview | ✅ | ✅ | ✅ |
| View Inventory | ✅ | ✅ | ✅ |
| Add/Edit Inventory | ✅ | ✅ | ❌ |
| Delete Inventory | ✅ | ✅ | ❌ |
| User Management | ✅ | ❌ | ❌ |
| Create Tasks | ✅ | ✅ | ❌ |
| View All Tasks | ✅ | ✅ | ❌ |
| View My Tasks | - | - | ✅ |
| Update Task Status | ✅ | ✅ | ✅ |
| View Analytics | ✅ | ✅ | ❌ |
| FEFO Ordering | ✅ | ✅ | ❌ |
| Demand Forecast | ✅ | ✅ | ❌ |

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints Overview

#### 🔐 Authentication APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user | ✅ |
| POST | `/auth/logout` | Logout user | ✅ |

#### 👥 User Management APIs
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/users` | Get all users | ✅ | Admin |
| POST | `/users` | Create user | ✅ | Admin |
| PUT | `/users/:id` | Update user | ✅ | Admin |
| DELETE | `/users/:id` | Delete user | ✅ | Admin |
| GET | `/users/workers` | Get all workers | ✅ | Manager/Admin |

#### 📦 Inventory Management APIs
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/inventory` | Get all items | ✅ | All |
| GET | `/inventory/:id` | Get item by ID | ✅ | All |
| POST | `/inventory` | Create item | ✅ | Manager/Admin |
| PUT | `/inventory/:id` | Update item | ✅ | Manager/Admin |
| DELETE | `/inventory/:id` | Delete item | ✅ | Manager/Admin |
| GET | `/inventory/analytics/summary` | Get inventory summary | ✅ | All |
| GET | `/inventory/analytics/by-category` | Get category analytics | ✅ | All |

#### ✅ Task Management APIs
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/tasks` | Get all tasks | ✅ | Manager/Admin |
| GET | `/tasks/my-tasks` | Get my tasks | ✅ | Worker |
| POST | `/tasks` | Create task | ✅ | Manager/Admin |
| PUT | `/tasks/:id` | Update task | ✅ | Manager/Admin |
| PATCH | `/tasks/:id/status` | Update status | ✅ | Worker/Manager/Admin |
| DELETE | `/tasks/:id` | Delete task | ✅ | Manager/Admin |

#### 🔔 Alert System APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/alerts/low-stock` | Get low stock alerts | ✅ |
| GET | `/alerts/expiring-soon` | Get expiring soon alerts | ✅ |
| GET | `/alerts/critical` | Get critical alerts | ✅ |
| GET | `/alerts/summary` | Get alert summary | ✅ |

#### 📈 Analytics & Forecast APIs
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/analytics/demand-forecast` | Get demand forecast | ✅ | Manager/Admin |
| GET | `/analytics/fefo-ordering` | Get FEFO ordering | ✅ | Manager/Admin |
| GET | `/analytics/top-selling` | Get top selling products | ✅ | Manager/Admin |
| GET | `/analytics/notification-alerts` | Get notification alerts | ✅ | Manager/Admin |

### Example API Requests

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Worker"
}
```

#### Create Inventory Item
```bash
POST /api/inventory
Authorization: Bearer <token>
Content-Type: application/json

{
  "productName": "Fresh Milk",
  "category": "Dairy",
  "sku": "DA-001",
  "quantity": 150,
  "purchaseDate": "2025-11-01",
  "expiryDate": "2025-11-15",
  "supplier": "Local Dairy Farm"
}
```

#### Create Task
```bash
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Inspect expired items in dairy section",
  "assignedTo": "673ab12c5f8e9a001234abcd"
}
```

For complete API documentation, refer to the [API Documentation Chapter](docs/API_DOCUMENTATION.md) in the project report.

---

## 📁 Project Structure

```
SmartShelf/
├── backend/
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── inventoryController.js
│   │   │   ├── taskController.js
│   │   │   ├── alertController.js
│   │   │   ├── forecastController.js
│   │   │   └── analyticsController.js
│   │   ├── models/                # Database models
│   │   │   ├── User.js
│   │   │   ├── Inventory.js
│   │   │   └── Task.js
│   │   ├── routes/                # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── inventoryRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── alertRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   ├── middlewares/           # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── utils/                 # Utility functions
│   │   │   ├── responseHelper.js
│   │   │   └── validators.js
│   │   ├── config/                # Configuration
│   │   │   └── database.js
│   │   └── app.js                 # Express app setup
│   ├── .env                       # Environment variables
│   ├── .env.example              # Example env file
│   ├── package.json
│   └── server.js                  # Entry point
│
├── frontend/
│   ├── components/                # Reusable components
│   │   └── Modal.tsx
│   ├── pages/                     # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegistrationPage.tsx
│   │   ├── MainLayout.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── ManagerDashboard.tsx
│   │   ├── WorkerDashboard.tsx
│   │   ├── InventoryPage.tsx
│   │   ├── UserManagementPage.tsx
│   │   └── TaskManagementPage.tsx
│   ├── contexts/                  # React contexts
│   │   └── ThemeContext.tsx
│   ├── services/                  # API services
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   ├── inventoryService.ts
│   │   ├── taskService.ts
│   │   ├── userService.ts
│   │   └── alertService.ts
│   ├── config/                    # Frontend config
│   │   └── api.ts
│   ├── types.ts                   # TypeScript types
│   ├── constants.tsx              # Constants & icons
│   ├── App.tsx                    # Main app component
│   ├── index.tsx                  # Entry point
│   ├── index.css                  # Global styles
│   ├── .env                       # Environment variables
│   ├── .env.example              # Example env file
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docs/                          # Documentation
│   ├── API_DOCUMENTATION.md
│   └── PROJECT_REPORT.docx
│
├── .gitignore
├── LICENSE
└── README.md
```

---



---

## 🤝 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/namish18">
        <img src="https://github.com/namish18.png" width="100px;" alt="Namish Kumar Sahu"/>
        <br />
        <sub><b>Namish Kumar Sahu</b></sub>
      </a>
      <br />
      <sub>Backend Development & API Design</sub>
    </td>
    <td align="center">
      <a href="https://github.com/turanya">
        <img src="https://github.com/turanya.png" width="100px;" alt="Turanya Mishra"/>
        <br />
        <sub><b>Turanya Mishra</b></sub>
      </a>
      <br />
      <sub>Frontend Development & UI/UX</sub>
    </td>
    <td align="center">
      <a href="https://github.com/shibaprasad11">
        <img src="https://github.com/shibaprasad11.png" width="100px;" alt="Shiba Prasad Gochhayat"/>
        <br />
        <sub><b>Shiba Prasad Gochhayat</b></sub>
      </a>
      <br />
      <sub>Database Design & Algorithms</sub>
    </td>
  </tr>
</table>


### Institution
**Biju Patnaik University of Technology (BPUT)**  
Department of Computer Science & Engineering  
Center for Under Graduate & Post Graduate Studies  
Rourkela, Odisha - 769015

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Namish Kumar Sahu, Turanya Mishra, Shiba Prasad Gochhayat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```



---

## 📞 Contact

For queries or feedback:


- **GitHub**: [@namish18](https://github.com/namish18)
- **Project Repository**: [SmartShelf](https://github.com/namish18/SmartShelf)

---

## 🚧 Future Enhancements

- [ ] IoT sensor integration (RFID, weight sensors)
- [ ] Advanced ML models (LSTM, Prophet) for forecasting
- [ ] Barcode/QR code scanning
- [ ] Native mobile applications (iOS/Android)
- [ ] Multi-warehouse support
- [ ] Supplier API integration
- [ ] Email/SMS notifications
- [ ] Blockchain for supply chain traceability
- [ ] Voice command interface
- [ ] Advanced reporting and analytics

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ by Team SmartShelf**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![BPUT](https://img.shields.io/badge/BPUT-2025-blue?style=for-the-badge)

</div>
