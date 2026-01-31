# TaskFlow - Professional Task Management System

A full-stack task management application built with React, Node.js/Express, and MongoDB. Features include JWT authentication, task filtering, priority levels, due dates, and comprehensive CRUD operations.

## Features

### Authentication
- JWT-based authentication
- Secure user registration and login
- Protected routes
- Token expiration handling

### Task Management
- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Task Status**: Todo, In Progress, Completed
- **Priority Levels**: Low, Medium, High
- **Due Dates**: Set and track task deadlines
- **Search**: Full-text search across task titles and descriptions
- **Filters**: Filter by status, priority
- **Sorting**: Sort by date, priority, title
- **Statistics**: Real-time dashboard showing task counts, overdue tasks

### User Interface
- Modern, professional design with Manrope and Work Sans fonts
- Responsive layout for all devices
- Dark theme with glass-morphism effects
- Smooth animations and transitions
- Shadcn/UI component library
- Real-time toast notifications

## Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **Sonner** - Toast notifications
- **jwt-decode** - JWT token handling

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JSON Web Tokens (JWT)** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## Project Structure

```
/app/
├── backend/
│   ├── models/
│   │   ├── User.js          # User model
│   │   └── Task.js          # Task model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── tasks.js         # Task CRUD routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Express server setup
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── AuthPage.js  # Login/Register page
│   │   │   ├── Dashboard.js # Main dashboard
│   │   │   └── TaskDialog.js # Task create/edit dialog
│   │   ├── contexts/
│   │   │   └── AuthContext.js # Auth state management
│   │   ├── services/
│   │   │   └── api.js       # API service layer
│   │   ├── App.js           # Main app component
│   │   ├── App.css          # App styles
│   │   └── index.css        # Global styles
│   ├── package.json         # Frontend dependencies
│   └── .env                 # Environment variables
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd /app/backend
```

2. Install dependencies:
```bash
yarn install
```

3. Configure environment variables in `.env`:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="task_management_db"
CORS_ORIGINS="*"
JWT_SECRET="your_jwt_secret_key_change_in_production"
PORT=8001
```

4. Start the server:
```bash
node server.js
```

The backend will run on `http://localhost:8001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd /app/frontend
```

2. Install dependencies:
```bash
yarn install
```

3. Configure environment variables in `.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

4. Start the development server:
```bash
yarn start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks with filters (protected)
  - Query params: `status`, `priority`, `search`, `sortBy`, `order`
- `GET /api/tasks/:id` - Get single task (protected)
- `POST /api/tasks` - Create new task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `GET /api/tasks/stats/summary` - Get task statistics (protected)

### Health Check
- `GET /api/health` - Server health check

## Usage

### User Registration
1. Navigate to the application
2. Click on "Register" tab
3. Enter your name, email, and password (min 6 characters)
4. Click "Create Account"

### Creating a Task
1. Login to your account
2. Click "New Task" button
3. Fill in task details:
   - Title (required)
   - Description (optional)
   - Status (Todo/In Progress/Completed)
   - Priority (Low/Medium/High)
   - Due Date (optional)
4. Click "Create Task"

### Managing Tasks
- **View**: Tasks displayed in card grid with all details
- **Edit**: Click on any task card to edit
- **Delete**: Click delete button on task card
- **Filter**: Use status and priority filters
- **Search**: Type in search box to find tasks
- **Sort**: Sort by date, priority, or title

## Deployment

### Vercel Deployment (Frontend)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to frontend directory:
```bash
cd /app/frontend
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and set environment variables in Vercel dashboard:
   - `REACT_APP_BACKEND_URL`: Your backend URL

### Backend Deployment Options

#### Option 1: Heroku
1. Create a Heroku app
2. Add MongoDB addon (mLab or MongoDB Atlas)
3. Set environment variables
4. Deploy using Git

#### Option 2: Railway
1. Connect your GitHub repository
2. Add MongoDB database
3. Set environment variables
4. Deploy automatically

#### Option 3: DigitalOcean App Platform
1. Connect repository
2. Configure build settings
3. Add MongoDB cluster
4. Set environment variables
5. Deploy

### Environment Variables for Production

**Backend:**
```env
MONGO_URL=<your_mongodb_connection_string>
DB_NAME=task_management_db
CORS_ORIGINS=<your_frontend_url>
JWT_SECRET=<strong_random_secret>
PORT=8001
```

**Frontend:**
```env
REACT_APP_BACKEND_URL=<your_backend_url>
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication with 7-day expiration
- Protected API routes with middleware
- Input validation on all endpoints
- CORS configuration
- MongoDB injection prevention through Mongoose
- Secure HTTP-only token storage

## Testing

### Manual Testing

1. **Authentication Flow**
   - Register a new user
   - Login with credentials
   - Verify dashboard access
   - Test logout functionality

2. **Task Operations**
   - Create tasks with different priorities and statuses
   - Update task details
   - Delete tasks
   - Test all filters and search

3. **API Testing with curl**

```bash
# Register user
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}
'

# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Create task (replace <TOKEN> with actual token)
curl -X POST http://localhost:8001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Test Task","priority":"high","status":"todo"}'

# Get all tasks
curl -X GET http://localhost:8001/api/tasks \
  -H "Authorization: Bearer <TOKEN>"
```

## Performance Optimizations

- MongoDB indexes on userId and frequently queried fields
- Efficient query filtering at database level
- JWT token caching in localStorage
- React component memoization where applicable
- Lazy loading of routes
- Optimized re-renders with proper state management

## Future Enhancements

- Task categories/tags with color coding
- Subtasks and task dependencies
- File attachments for tasks
- Collaborative features (assign tasks to team members)
- Email notifications for due dates
- Calendar view for tasks
- Task templates
- Export tasks to CSV/PDF
- Dark/Light theme toggle
- Drag-and-drop task reordering
- Task comments and activity log
- Integration with third-party tools (Slack, Google Calendar)

## Code Quality

- Clean, modular architecture
- Separation of concerns (models, routes, controllers)
- Consistent naming conventions
- Comprehensive error handling
- Input validation on all user inputs
- Professional code comments where needed
- RESTful API design principles
- React best practices (hooks, context, components)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contact & Support

For questions or support, please create an issue in the repository.

## Acknowledgments

- Shadcn/UI for beautiful components
- Lucide for icon library
- Tailwind CSS for utility-first styling
- MongoDB team for excellent ODM
- Express.js community

---

**Built with ❤️ for professional task management**
