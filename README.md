# Grace Community Church Management System

A comprehensive, modern church management website built with HTML5, Bootstrap CSS, and JavaScript. This system provides advanced functionality for church administrators, staff, and ministry leaders to efficiently manage all aspects of church operations.

## 🌟 Features

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for all devices (desktop, tablet, mobile)
- **Progressive Web App (PWA)**: Install as a mobile app with offline capabilities
- **Touch-Friendly Interface**: Designed for mobile interaction
- **Fast Loading**: Optimized performance for mobile networks

### 👥 Member Management
- **Member Database**: Comprehensive member profiles and directory
- **Registration System**: Online member registration with approval workflow
- **Ministry Tracking**: Track member involvement in various ministries
- **Communication Tools**: Contact members individually or in groups
- **Search & Filter**: Advanced search and filtering capabilities

### 📅 Event Management
- **Event Creation**: Create and manage church events with detailed information
- **RSVP System**: Allow members to register for events
- **Calendar Integration**: Visual calendar with event scheduling
- **Recurring Events**: Set up weekly, monthly, or custom recurring events
- **Event Analytics**: Track attendance and engagement

### 💰 Offerings & Financial Management
- **Offering Recording**: Track cash, check, and online donations
- **Fund Management**: Designate offerings to specific funds (General, Building, Missions)
- **Financial Reports**: Generate detailed financial reports
- **Tax Receipts**: Automated tax-deductible receipt generation
- **Giving Analytics**: Track giving trends and patterns

### ⛪ Ministry Management
- **Ministry Oversight**: Manage all church ministries and small groups
- **Volunteer Coordination**: Track and schedule volunteers
- **Leader Management**: Assign and manage ministry leaders
- **Resource Allocation**: Manage ministry resources and budgets
- **Performance Tracking**: Monitor ministry growth and engagement

### 📢 Communications
- **Announcements**: Create and manage church announcements
- **Newsletter System**: Design and send newsletters to subscribers
- **Prayer Requests**: Manage prayer request submissions and approvals
- **Bulk Messaging**: Send targeted messages to specific groups
- **Email Templates**: Pre-designed templates for common communications

### 📚 Media & Resources
- **Sermon Archive**: Upload, organize, and share sermon recordings
- **Media Library**: Centralized storage for photos, videos, and documents
- **Document Management**: Store and share study guides, forms, and resources
- **Live Streaming**: Manage live stream services and recordings
- **Download Tracking**: Monitor resource downloads and engagement

### 🎛️ Admin Dashboard
- **Comprehensive Overview**: Real-time statistics and key metrics
- **User Management**: Manage staff accounts and permissions
- **System Settings**: Configure system-wide settings and preferences
- **Analytics**: Detailed reports on all aspects of church operations
- **Backup & Export**: Data backup and export capabilities

## 🚀 Technology Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5.3.2
- **JavaScript**: Vanilla ES6+ with modular architecture
- **Icons**: Bootstrap Icons
- **PWA**: Service Worker for offline functionality
- **Storage**: Local Storage for client-side data persistence
- **Responsive**: Mobile-first responsive design

## 📁 Project Structure

```
church-management-system/
├── index.html                 # Main application entry point
├── manifest.json             # PWA manifest file
├── sw.js                     # Service worker for offline functionality
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet with custom styles
│   ├── js/
│   │   ├── main.js           # Core application logic
│   │   ├── components.js     # UI components and utilities
│   │   └── admin.js          # Admin-specific functionality
│   └── images/               # Image assets and icons
├── pages/
│   ├── about.html            # About page content
│   ├── events.html           # Event management interface
│   ├── members.html          # Member management system
│   ├── giving.html           # Offerings management
│   ├── ministries.html       # Ministry management
│   ├── communications.html   # Communication tools
│   ├── media.html            # Media and resources
│   ├── admin.html            # Admin panel
│   └── dashboard.html        # Admin dashboard
└── README.md                 # Project documentation
```

## 🛠️ Installation & Setup

1. **Download or Clone** the project files to your web server
2. **Configure Web Server** to serve the files (Apache, Nginx, or any static file server)
3. **Open in Browser** - Navigate to the index.html file
4. **Admin Access** - Use the login system to access admin features

### Local Development
```bash
# Serve locally using Python (if available)
python -m http.server 8000

# Or using Node.js http-server
npx http-server

# Then open http://localhost:8000 in your browser
```

## 👤 User Roles & Permissions

### Administrator
- Full access to all features
- User management and system settings
- Financial management and reporting
- Content management and approval

### Staff Member
- Member management
- Event creation and management
- Communication tools
- Ministry oversight

### Ministry Leader
- Ministry-specific member management
- Event creation for their ministry
- Communication with ministry members
- Resource access and sharing

### Member
- Profile management
- Event registration
- Resource access
- Prayer request submission

## 🔧 Configuration

### Basic Setup
1. Update church information in `index.html`
2. Customize colors and branding in `assets/css/style.css`
3. Configure service times and contact information
4. Set up initial admin user credentials

### Advanced Configuration
- **Email Integration**: Configure SMTP settings for email notifications
- **Payment Processing**: Integrate with payment processors for online giving
- **Database Integration**: Connect to backend database for data persistence
- **Authentication**: Implement secure authentication system

## 📱 Mobile Features

### Progressive Web App (PWA)
- **Installable**: Can be installed on mobile devices like a native app
- **Offline Access**: Core functionality available without internet
- **Push Notifications**: Receive important church notifications
- **App-like Experience**: Full-screen mode with native navigation

### Mobile Optimizations
- **Touch Gestures**: Swipe navigation and touch-friendly controls
- **Responsive Images**: Optimized images for different screen sizes
- **Fast Loading**: Minimized assets and efficient caching
- **Accessibility**: Screen reader support and keyboard navigation

## 🔒 Security Features

- **Input Validation**: All forms include client-side validation
- **XSS Protection**: Sanitized user inputs and outputs
- **CSRF Protection**: Form tokens and request validation
- **Secure Storage**: Encrypted local storage for sensitive data
- **Permission System**: Role-based access control

## 📊 Analytics & Reporting

### Built-in Reports
- **Membership Reports**: Growth trends and demographics
- **Financial Reports**: Giving patterns and fund allocation
- **Event Reports**: Attendance and engagement metrics
- **Ministry Reports**: Participation and volunteer hours

### Export Options
- **PDF Reports**: Professional formatted reports
- **CSV Export**: Data export for external analysis
- **Email Reports**: Automated report delivery
- **Dashboard Widgets**: Real-time metrics display

## 🤝 Contributing

This is a complete church management system ready for deployment. For customizations:

1. **Styling**: Modify `assets/css/style.css` for visual changes
2. **Functionality**: Extend `assets/js/main.js` for new features
3. **Pages**: Add new HTML pages in the `pages/` directory
4. **Components**: Create reusable components in `assets/js/components.js`

## 📞 Support

For technical support or customization requests:
- Review the code documentation in each file
- Check the browser console for any error messages
- Ensure all files are properly uploaded to your web server
- Verify that JavaScript is enabled in the browser

## 📄 License

This church management system is provided as-is for church use. Feel free to modify and customize according to your church's specific needs.

## 🙏 Acknowledgments

Built with modern web technologies to serve church communities worldwide. Special thanks to:
- Bootstrap team for the responsive framework
- Bootstrap Icons for the comprehensive icon set
- The open-source community for inspiration and best practices

---

**Grace Community Church Management System** - Empowering churches with modern technology for effective ministry management.
