# IMF Gadget Management System

## 🌐 Live Demo

- **Web Application**: [GitHub Pages Deployment](https://yadnyeshkolte.github.io/imf-gadgets-dashboards/)
- **API Backend**: [GitHub Repo](https://github.com/yadnyeshkolte/imf-gadgets-api)
- **Demo Video**: [Watch Full Demo](your-video-url)
#### Prerequisites
```bash
node.js >= 14.0.0
npm >= 6.0.0
```

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/imf-gadget-management.git
cd imf-gadget-management
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
VITE_API_URL=your_render_api_url
```

4. Start the development server:
```bash
npm run dev
```

### 📡 API Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

#### Gadget Management
- `GET /gadgets` - List all gadgets
- `POST /gadgets` - Create new gadget
- `PATCH /gadgets/:id` - Update gadget status
- `POST /gadgets/:id/request-destruction` - Request self-destruct code
- `POST /gadgets/:id/self-destruct` - Execute self-destruct with confirmation

### 🔐 Security Features

- Secure password hashing
- JWT token validation
- Two-step self-destruct confirmation
- Status-based access control
- Session management

### 🎥 Demo Video Highlights

1. User Registration & Login
2. Adding New Gadgets
3. Status Management
4. Filtering System
5. Self-Destruct Mechanism
6. Mobile Responsiveness

### 💾 Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Gadgets Table
```sql
CREATE TABLE gadgets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    codename VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Available',
    mission_success_probability INTEGER,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Configuration

#### Environment Variables
- `VITE_API_URL`: Backend API URL
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3000)

#### Authentication & Security
- Secure user registration and login system
- JWT-based authentication
- Protected API endpoints
- Persistent session management

#### Gadget Management
- Real-time gadget status tracking
- Multiple status states: Available, Deployed, Destroyed, Decommissioned
- Mission success probability monitoring
- Secure self-destruct mechanism with confirmation codes

#### User Interface
- Modern, responsive design using Tailwind CSS
- Interactive filtering system for gadget status
- Real-time status updates
- Mobile-friendly layout
- Intuitive controls and status indicators

### 🛠 Technology Stack

#### Frontend
- React.js
- Tailwind CSS
- Lucide React Icons
- Radix UI Primitives

#### Backend
- Node.js/Express.js
- PostgreSQL Database
- JWT Authentication
- RESTful API Architecture

#### Deployment
- Frontend: GitHub Pages
- Backend: Render.com
- Database: Render.com PostgreSQL

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
