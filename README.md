# IITI CalmConnect

A comprehensive Mental Health Wellness web application that connects users with certified doctors for consultations, live chat, and emotional support. The platform is designed with three distinct portals: **User**, **Doctor**, and **Admin**, supporting secure appointments, anonymous live chat, happiness tracking, and more.

---

##  Features

###  User Portal
- Browse available doctors and their time slots
- Book appointments only in doctors’ available slots
- Anonymous real-time chat with doctors using Socket.IO
- AI-powered chatbot for 24/7 support
- Happiness score tracking via ML model
- PWA support with push notifications

###  Doctor Portal
- View and accept/reject appointment requests
- Reschedule appointments
- Chat with users in real-time
- Get connected to users based on ML-driven recommendations
  
###  Admin Portal
- Add new doctors and manage doctor data
- Create and manage events or wellness sessions
- View detailed stats and trends for any doctor
- Filter appointment and user activity data (e.g., last 10 days)
- Monitor overall platform engagement and usage

---

## Machine Learning Integration

- **Chatbot Support**: AI-powered chatbot that helps users when doctors are unavailable.
- **Happiness Score**: Automatically calculated from user interactions to assess mental wellness trends over time.

---

##  Tech Stack

###  Backend
- **Node.js** + **Express.js**
- **Prisma ORM**
- **Neon DB (PostgreSQL)**
- **Socket.IO** for real-time communication
- **JWT Authentication**
- **ML Integration** (via Python or hosted model)

###  Frontend
- **React.js**
- **React Router**
- **Progressive Web App (PWA)** with Service Workers
- **Push Notifications**
- **Responsive UI** with modern design

##  Real-time Capabilities

- **Live Chat**: Instant messaging between users and doctors via Socket.IO.
- **Instant Notifications**: Real-time alerts for appointment updates, reschedules, and replies.
- **PWA Offline Support**: Users can open the app and receive push updates even without full connectivity.
- **Doctor Availability**: Dynamically updated slots visible to users based on current doctor status.

##  Workflows in Action

 **Booking Flow**  
User selects a doctor → Sees real-time available slots → Books → Request sent to doctor → Doctor accepts/rejects → Confirmation sent

 **Anonymous Chat Flow**  
User opens chat → Paired with doctor (or bot fallback) → Real-time messages exchanged → Chat saved anonymously

 **Happiness Score Feedback Loop**  
User sends messages → ML model processes sentiment → Score updated → Used for insights + doctor recommendations
