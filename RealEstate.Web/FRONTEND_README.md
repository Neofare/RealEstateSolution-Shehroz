# Real Estate Website - Frontend Documentation

## 🏠 Project Overview

This is a **fully-fledged Real Estate website frontend** built with HTML, CSS, and JavaScript. It integrates with your .NET 10 backend API to provide a complete user experience for buying, selling, and inquiring about properties.

## 📁 Project Structure

```
RealEstate.Web/
├── index.html                 # Home page
├── pages/
│   ├── login.html            # Login page
│   ├── signup.html           # Sign up page
│   ├── properties.html       # All properties with filters
│   ├── property-details.html # Individual property details
│   ├── contact.html          # Contact/Support page
│   └── add-property.html     # Add new property (logged-in users)
├── assets/
│   ├── css/
│   │   └── style.css         # Global styles (responsive)
│   └── js/
│       ├── api.js            # API service functions
│       ├── home.js           # Home page logic
│       ├── properties.js     # Properties page logic
│       ├── property-details.js# Property details logic
│       ├── contact.js        # Contact page logic
│       ├── login.js          # Login logic
│       ├── signup.js         # Sign up logic
│       └── add-property.js   # Add property logic
```

## 🎨 Features

### ✅ Home Page (`index.html`)
- **Hero Section**: Eye-catching banner with search functionality
- **Browse by Type**: Quick links to filter properties (Villas, Apartments, Houses)
- **Featured Properties**: Display of latest properties
- **Why Choose Us**: Trust indicators
- **Search Box**: Location and property type search

### 🔐 Authentication
- **Login Page** (`login.html`): Email and password login
- **Sign Up Page** (`signup.html`): User registration with validation
- **User Sessions**: Uses localStorage for session management (demo)
- **User Menu**: Shows logged-in user with dropdown (Add Property, Logout)

### 🏘️ Properties Page (`properties.html`)
- **Property Grid**: Displays all properties with images
- **Advanced Filters**:
  - Property Type (Villa, Apartment, House)
  - Minimum Bedrooms
  - Maximum Price
- **Search Integration**: Search by location, area, or type
- **Property Cards**: Shows title, location, price, beds, baths, area
- **Click to Details**: Each property links to detailed view

### 🔍 Property Details (`property-details.html`)
- **Large Image Display**: Full-size property image
- **Complete Information**:
  - Price (formatted currency)
  - Location with map icon
  - Type, Area, Bedrooms, Bathrooms
  - Full description
- **Inquiry Form**: Interested users can inquire about property
- **Contact Information**: Capture name, email, and message

### 📧 Contact Page (`contact.html`)
- **Contact Form**: Send messages to support
- **Form Validation**: Email format, required fields
- **Success/Error Messages**: User feedback
- **Contact Info**: Phone, email, address display

### ➕ Add Property (`add-property.html`)
- **Protected Page**: Only logged-in users can access
- **Comprehensive Form**:
  - Title, Type, Location
  - Price, Bedrooms, Bathrooms, Area
  - Image URL, Description
- **Form Validation**: All fields validated
- **Direct API Integration**: Posts to your backend API

## 🔌 API Integration

### API Configuration
- **Base URL**: `https://localhost:7144/api`
- **Endpoints Used**:
  - `GET /property` - Get all properties
  - `GET /property/{id}` - Get single property
  - `POST /property` - Create new property
  - `POST /inquiry` - Submit inquiry/message

### API Functions (in `assets/js/api.js`)
```javascript
getProperties()           // Fetch all properties
getPropertyById(id)       // Fetch single property
submitInquiry(inquiry)    // Submit inquiry
getUser()                 // Get user from localStorage
saveUser(user)            // Save user to localStorage
logout()                  // Clear user session
```

## 💻 Key JavaScript Features

### Navigation & Authentication
- **Dynamic Navbar**: Changes based on login status
- **User Dropdown**: Quick access to Add Property and Logout
- **Protected Routes**: Add Property page redirects to login if not authenticated

### Form Validation
- Email format validation
- Phone number validation
- Password strength (min 6 chars)
- Password confirmation matching
- Required field checks

### Data Filtering & Search
- Filter by property type
- Filter by minimum bedrooms
- Filter by maximum price
- Search by location, title, or description
- URL parameter-based filtering

### User Feedback
- Success/error alerts
- Form error messages inline
- Loading states
- Redirect on success

## 🎯 Usage Guide

### For Users

#### 1. Browse Properties
1. Click "Properties" in navbar
2. View all properties with images
3. Use filters to narrow down (type, bedrooms, price)
4. Click any property to see details
5. Fill inquiry form to express interest

#### 2. Search
1. Use search box on home page
2. Enter location, area, or property type
3. Results filtered automatically

#### 3. Register & Login
1. Click "Sign Up" to create account
2. Fill registration form with validation
3. Click "Login" to sign in
4. View user menu when logged in

#### 4. Add Property (Logged In Only)
1. Login to your account
2. Click "👤 YourName" → "Add Property"
3. Fill property details form
4. Click "List Property"
5. Redirects to properties page after success

#### 5. Contact Support
1. Go to "Contact" page
2. Fill contact form
3. Submit to send message

### For Developers

#### Local Setup
1. Update API URL in `assets/js/api.js` if needed:
   ```javascript
   const API_URL = "https://your-api-url/api";
   ```

2. Ensure your backend is running:
   - API should be on `https://localhost:7144`
   - CORS should be enabled (already in your Program.cs)

3. Open in browser:
   - Use Live Server or any local server
   - Or open `index.html` directly

#### Adding New Features
1. Create new HTML page in `pages/` folder
2. Add corresponding JS file in `assets/js/`
3. Link in navbar navigation
4. Use existing API functions

#### Styling
- All styles in `assets/css/style.css`
- Responsive design (mobile, tablet, desktop)
- Color scheme: Blue (#4facfe) primary color
- Poppins font family

## 🚀 Deployment Checklist

Before submitting your project:

- [ ] Test all pages load correctly
- [ ] Test login/signup functionality
- [ ] Test property filtering and search
- [ ] Test add property (requires login)
- [ ] Test contact form submission
- [ ] Test property inquiries
- [ ] Check responsive design on mobile
- [ ] Update API URL for production
- [ ] Add sample properties to database
- [ ] Test error handling
- [ ] Check console for any errors

## 📱 Responsive Design

- **Desktop**: Full-width layout with 3-column grids
- **Tablet**: Adjusted grid and spacing
- **Mobile**: Single column, optimized navigation

## 🔒 Security Notes

- Passwords stored in localStorage (demo only) - use proper backend auth in production
- Form inputs validated on client and should be validated on backend
- CORS enabled for cross-origin requests
- SQL injection prevention: Use backend parameterized queries

## 🎨 Customization

### Change Colors
Edit in `assets/css/style.css`:
```css
/* Primary color */
#4facfe  /* Change to your brand color */
```

### Change Fonts
Edit in HTML head:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR-FONT&display=swap">
```

### Update Contact Info
Edit `pages/contact.html` contact info section

### Update Home Page Content
Edit sections in `index.html`

## 📊 Database Considerations

Your backend models needed:
- Property (Id, Title, Description, Price, Location, Bedrooms, Bathrooms, Area, ImageUrl, Type, CreatedAt)
- Inquiry (Id, Name, Email, Message, PropertyId, CreatedAt)
- Agent (Id, Name, Email, Phone)

## 🐛 Troubleshooting

### Properties not loading
- Check API URL in `assets/js/api.js`
- Ensure backend is running on `https://localhost:7144`
- Check browser console for CORS errors
- Verify CORS policy in backend

### Login not working
- Check if localStorage is enabled
- Clear browser cache
- Check browser console for errors

### Add property showing 404
- Ensure user is logged in
- Check API endpoint `/api/property` is correct
- Verify backend accepts POST requests

### Forms not submitting
- Check required fields are filled
- Verify email format is correct
- Check browser console for validation errors

## 📞 Support

For issues or questions:
1. Check browser console (F12)
2. Check Network tab for API calls
3. Verify backend is running
4. Review error messages in alerts

## ✨ Features Ready for Enhancement

Future improvements you can add:
- Google Maps integration for location
- Image upload instead of URL
- Advanced search filters
- Favorites/Wishlist
- User profile page
- Property reviews
- Video tours
- Payment integration
- Admin dashboard
- Email notifications
- Two-factor authentication

## 📝 Notes for College Project

This frontend covers:
✅ Responsive design
✅ Form validation
✅ API integration
✅ User authentication
✅ CRUD operations (Create, Read properties)
✅ Search and filtering
✅ User experience
✅ Error handling

Perfect for a college project grading system focusing on:
- Frontend skills (HTML, CSS, JavaScript)
- API integration
- User interface/UX
- Functionality and features
- Code organization

Good luck with your project submission! 🎉