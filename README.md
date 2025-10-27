# Cabin
Planinske Vikendice is a cabin rental platform for mountain tourism in Serbia, built with the MEAN stack (MongoDB, Express, Angular, Node.js).
Key Features
Three User Roles:
Tourist (Turista)

Browse and search mountain cabins
Filter by location, price, services (wifi, parking, kitchen, etc.)
Make reservations with date selection
View booking history and status
Rate and comment on cabins after stay
Owner (Vlasnik)

Register and manage their cabins
Set seasonal pricing (summer/winter)
Upload cabin photos (base64 storage)
Approve/reject reservation requests
View booking statistics and revenue
Administrator (Admin)

User management (approve/block accounts)
Review pending owner registrations
Monitor all reservations and cabins
Access system-wide statistics
Content moderation
🛠️ Technology Stack
Frontend: Angular 20.1.0 (standalone components)
Backend: Node.js + Express.js
Database: MongoDB
Authentication: JWT tokens
Styling: Custom CSS (minimalist red theme)
Testing: Selenium WebDriver
🏔️ Core Functionality
Search & Filter: Location-based search with service filters
Booking System: Date selection, price calculation, status tracking
Image Management: Base64 image storage with gallery view
User Profiles: Editable profiles with credit card info
Statistics Dashboard: Revenue and booking analytics
Responsive Design: Works on desktop and mobile
📊 Database Collections
Users: Admin, tourists, and cabin owners
Cabins: Properties with location, services, pricing
Reservations: Bookings with dates and status
Comments: Ratings and reviews (1-5 stars)
