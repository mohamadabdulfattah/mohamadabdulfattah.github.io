# Modern Portfolio Website

A responsive portfolio website with the following features:
- Homepage with introduction and social links
- Projects gallery with individual project pages
- About Me page with professional history and downloadable resume
- Contact form with email functionality
- Admin panel for content management

## Project Structure
```
portfolio-website/
├── frontend/
│   ├── index.html
│   ├── projects.html
│   ├── about.html
│   ├── contact.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── assets/
│       └── images/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   │   ├── api.js
│   │   └── admin.js
│   ├── models/
│   │   ├── Project.js
│   │   └── User.js
│   └── config/
│       └── database.js
└── package.json
```

## Technologies Used
- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js, Express.js
- Database: SQLite (for simplicity)
- Email: Nodemailer for contact form
- Authentication: JWT for admin panel

