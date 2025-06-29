# 🎯 TaskFlow - Modern Todo Application

A comprehensive task management application built with vanilla JavaScript, HTML5, and CSS3. TaskFlow features age verification, user registration, and a complete todo management system with three distinct task stages.

## 🚀 Features

### Landing Page (Age Verification)
- **Age Verification System**: Users must be over 10 years old to access the application
- **User Registration**: Name and date of birth collection with validation
- **Form Validation**: Real-time validation with user-friendly error messages
- **Data Persistence**: User data stored in localStorage for automatic login
- **Responsive Design**: Mobile-first approach with elegant UI

### Main Todo Application
- **User Profile**: Display user's name and avatar generated from UI Avatars API
- **Three Task Stages**: Todo, Completed, and Archived with distinct management
- **Task Management**: Add, move, and manage tasks between different stages
- **Dynamic Counters**: Real-time task count updates for each stage
- **Timestamp Tracking**: Last modified timestamps for all tasks
- **API Integration**: Initial tasks loaded from DummyJSON API
- **Persistent Storage**: All data saved to localStorage

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with smooth animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Card-based Design**: Organized task display with visual hierarchy
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## 🛠️ Technical Implementation

### Architecture
- **Vanilla JavaScript**: No external frameworks - pure modern JavaScript
- **Class-based Structure**: Organized code with proper separation of concerns
- **Event-driven Programming**: Efficient event handling and delegation
- **Modular Design**: Clean, maintainable code structure

### APIs Used
- **UI Avatars API**: `https://ui-avatars.com/api/` for generating user avatars
- **DummyJSON API**: `https://dummyjson.com/todos` for initial task data

### Data Management
- **localStorage**: Client-side persistence for user data and tasks
- **JSON Serialization**: Proper data structure management
- **State Management**: Consistent application state across sessions

## 📁 Project Structure

```
TaskFlow/
├── index.html          # Landing page with age verification
├── app.html           # Main todo application
├── package.json       # Project configuration
├── README.md         # Project documentation
├── js/
│   ├── app.js        # Landing page functionality
│   └── todo-app.js   # Main todo application logic
└── styles/
    └── main.css      # All styles for both pages
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Node.js (optional, for development server)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahniaditya007/todo-app.git
   cd taskflow-todo-app
   ```

2. **Install dependencies (optional)**
   ```bash
   npm install
   ```

3. **Run the application**
   
   **Option A: Using npm (recommended)**
   ```bash
   npm start
   ```
   
   **Option B: Using any web server**
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js http-server
   npx http-server -p 3000
   ```
   
   **Option C: Open directly in browser**
   Simply open `index.html` in your web browser.

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🎯 Usage

### First Time Setup
1. Open the application in your browser
2. Enter your full name and date of birth
3. Ensure you're over 10 years old (age verification required)
4. Click "Continue to TaskFlow" to access the main application

### Task Management
1. **Adding Tasks**: Enter task description and click "Add Task"
2. **Moving Tasks**: Use action buttons to move tasks between stages:
   - **Todo → Completed**: Mark tasks as complete
   - **Completed → Todo**: Reactivate completed tasks
   - **Any Stage → Archived**: Archive tasks for reference
3. **Managing Tasks**: Tasks in archived state can be moved back to Todo or Completed
4. **Viewing Progress**: Task counters show real-time counts for each stage

### Navigation
- **Sign Out**: Clears localStorage and returns to landing page
- **Persistent Sessions**: User data and tasks are saved between browser sessions

## 🔧 Development

### Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Code Validation
```bash
npm run validate
```

## 🎨 Customization

### Styling
- All styles are contained in `styles/main.css`
- CSS custom properties used for easy theming
- Responsive breakpoints: 768px (tablet), 480px (mobile)

### Functionality
- Main landing logic in `js/app.js`
- Todo application logic in `js/todo-app.js`
- Easy to extend with additional features

## 🌟 Key Features Implemented

### Landing Page ✅
- [x] Age verification (must be >10 years old)
- [x] Name input field with validation
- [x] Date of birth input with date picker
- [x] Form validation with error messages
- [x] Data storage in localStorage
- [x] Automatic redirect for returning users

### Main Application ✅
- [x] User profile display with avatar
- [x] Task management across three stages
- [x] Add new tasks functionality
- [x] Move tasks between stages
- [x] Archive tasks (no delete functionality)
- [x] Display last modified timestamps
- [x] Persistent data storage
- [x] Initial data loading from DummyJSON API
- [x] Dynamic task counters

### Technical ✅
- [x] Vanilla JavaScript implementation
- [x] Responsive design
- [x] Clean code structure
- [x] Proper error handling
- [x] API integration
- [x] localStorage persistence


## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for Inter font family
- UI Avatars API for avatar generation
- DummyJSON API for initial task data
- Modern CSS techniques for responsive design

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---
