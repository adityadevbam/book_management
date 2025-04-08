## :test_tube: Getting Started
### Prerequisites
- Node.js
- MongoDB
- npm or yarn
### Setup
1. Clone the repository
   ```bash
   git clone https://github.com/adityadevbam/book_management
   ```

2. Install dependencies for both frontend and backend
   ```bash
   cd backend
   npm install

   cd ../frontend
   npm install
   ```

**Add `.env` files** in both `frontend/` and `backend/` directories using the example provided below

4. **Start both servers**
   - In two separate terminals:
     ```bash
     # Terminal 1 - Backend
     cd backend
     npm run start
     ```

     ```bash
     # Terminal 2 - Frontend
     cd frontend
     npm run start
     ```

---

## :cog: Environment Variables
The app uses a `.env` file to manage environment-specific variables and secrets.
### :closed_lock_with_key: Authentication & Security
| Variable | Description |
|---------|-------------|
| `JWT_SECRET` | Secret key used to sign JWT tokens. This is crucial for secure user session management. |
| `RESET_TOKEN_EXPIRY` | Token/OTP expiry duration (in milliseconds) for forgot password functionality. e.g., `3600000` = 1 hour |
### :computer: Server Configuration
| Variable | Description |
|---------|-------------|
| `PORT` | Port on which the backend server runs (default: 5000) |
| `NODE_ENV` | Environment type (`development`, `production`) |
### :oil_drum: Database
| Variable | Description |
|---------|-------------|
| `MONGODB_URI` | MongoDB connection string used by Mongoose to connect to the database |
### :email: Email (SMTP)
These variables are used to send OTP emails during the Forgot Password workflow.
| Variable | Description |
|---------|-------------|
| `SMTP_HOST` | SMTP server host (e.g., `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP server port (e.g., `587`) |
| `EMAIL_USER` | Sender email address used to send OTP emails |
| `EMAIL_PASS` | Email account password or app-specific password (secured) |
---
## :repeat: OTP Workflow Summary
1. User clicks "Forgot Password"
2. Server generates a secure OTP and stores it temporarily
3. OTP is emailed using the SMTP credentials
4. OTP is valid only for the duration set in `RESET_TOKEN_EXPIRY`
5. User submits OTP for verification → reset password upon success
---
