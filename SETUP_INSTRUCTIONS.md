# TeenTops E-commerce Website - Complete Setup Instructions

## 📦 Package Contents

This ZIP file contains a complete, production-ready e-commerce website with:

- **Backend**: Django REST API with product management, orders, and reviews
- **Frontend**: Modern React application with Tailwind CSS
- **Database**: Pre-configured SQLite with sample data
- **Admin Panel**: Full Django admin interface
- **Sample Data**: 15 products, 6 categories, 58 variants, and customer reviews

## 🚀 Quick Start (Recommended)

### Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- Basic command line knowledge

### Step 1: Extract and Navigate
```bash
# Extract the ZIP file
unzip teentops-ecommerce.zip
cd teentops-ecommerce
```

### Step 2: Backend Setup (5 minutes)
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run database migrations (database already included)
python manage.py migrate

# Start Django server
python manage.py runserver 0.0.0.0:8000
```

### Step 3: Frontend Setup (3 minutes)
```bash
# Open new terminal/command prompt
cd teentops-frontend

# Install dependencies
npm install

# Start development server
npm run dev -- --host
```

### Step 4: Access Your Website
- **Website**: http://localhost:5173 (or next available port)
- **Admin Panel**: http://localhost:8000/admin/
- **API**: http://localhost:8000/api/

**Admin Credentials**: 
- Username: `admin`
- Password: `admin123`

## 🔧 Detailed Setup Instructions

### Backend Configuration

1. **Install Python Dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers django-filter pillow
   ```

2. **Database Setup** (Optional - already configured):
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py populate_sample_data
   ```

3. **Create Admin User** (Optional - already created):
   ```bash
   python manage.py createsuperuser
   ```

4. **Start Backend Server**:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Frontend Configuration

1. **Install Node Dependencies**:
   ```bash
   cd teentops-frontend
   npm install
   ```

2. **Development Mode**:
   ```bash
   npm run dev -- --host
   ```

3. **Production Build**:
   ```bash
   npm run build
   # Built files will be in 'dist' folder
   ```

## 🌐 Production Deployment

### Option 1: Simple Production Setup

1. **Backend Production**:
   ```bash
   # Use production settings
   export DJANGO_SETTINGS_MODULE=teentops_backend.production_settings
   python manage.py collectstatic --noinput
   python manage.py runserver 0.0.0.0:8000
   ```

2. **Frontend Production**:
   ```bash
   cd teentops-frontend
   npm run build
   # Serve the 'dist' folder with any web server
   ```

### Option 2: Using Flask Wrapper (Included)

1. **Install Flask**:
   ```bash
   pip install flask flask-cors
   ```

2. **Run Flask Wrapper**:
   ```bash
   python app.py
   ```

### Option 3: Professional Deployment

1. **Backend**: Deploy Django with Gunicorn + Nginx
2. **Frontend**: Deploy built files to CDN or static hosting
3. **Database**: Use PostgreSQL for production

## 📁 Project Structure Explained

```
teentops-ecommerce/
├── 📁 teentops_backend/          # Django settings
├── 📁 products/                  # Product management
├── 📁 orders/                    # Order processing
├── 📁 reviews/                   # Customer reviews
├── 📁 teentops-frontend/         # React application
│   ├── 📁 src/components/        # UI components
│   ├── 📁 src/contexts/          # State management
│   └── 📁 src/lib/               # API services
├── 📄 db.sqlite3                 # Database with sample data
├── 📄 requirements.txt           # Python dependencies
├── 📄 app.py                     # Flask deployment wrapper
└── 📄 README.md                  # Detailed documentation
```

## 🛠 Key Features

### E-commerce Functionality
- ✅ Product catalog with categories
- ✅ Shopping cart with persistence
- ✅ Cash-on-delivery checkout
- ✅ Order management system
- ✅ Customer reviews and ratings
- ✅ Admin panel for management

### Modern UI/UX
- ✅ Responsive design (mobile-first)
- ✅ Smooth animations and transitions
- ✅ Interactive product modals
- ✅ Real-time cart updates
- ✅ Professional color scheme
- ✅ Clean, modern typography

### Technical Features
- ✅ RESTful API architecture
- ✅ CORS configured
- ✅ Input validation and security
- ✅ Error handling
- ✅ Production-ready settings

## 🎯 Sample Data Included

The database comes pre-loaded with:
- **6 Categories**: T-Shirts, Hoodies, Jeans, Dresses, Jackets, Accessories
- **15 Products**: Various clothing items with descriptions
- **58 Product Variants**: Different sizes and colors
- **6 Customer Reviews**: Sample reviews with ratings
- **1 Admin User**: Username: `admin`, Password: `admin123`

## 🔧 Customization Guide

### Adding New Products
1. Access admin panel: http://localhost:8000/admin/
2. Login with admin credentials
3. Navigate to "Products" → "Products"
4. Click "Add Product" and fill in details
5. Add variants (sizes/colors) in "Product variants"

### Modifying Design
1. Edit React components in `teentops-frontend/src/components/`
2. Modify styles using Tailwind CSS classes
3. Update colors in `tailwind.config.js`

### API Customization
1. Modify Django models in respective `models.py` files
2. Update serializers in `serializers.py`
3. Customize API endpoints in `views.py`

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Backend: Change port
   python manage.py runserver 0.0.0.0:8001
   
   # Frontend: Vite will automatically find next available port
   ```

2. **CORS Errors**:
   - Ensure Django server is running on port 8000
   - Check `CORS_ALLOWED_ORIGINS` in settings.py

3. **Database Issues**:
   ```bash
   # Reset database
   rm db.sqlite3
   python manage.py migrate
   python manage.py populate_sample_data
   ```

4. **Frontend Build Issues**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Getting Help

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure both servers are running
4. Check network connectivity between frontend and backend

## 📱 Testing the Website

### Frontend Testing
1. Navigate through all pages
2. Test product search and filtering
3. Add items to cart
4. Complete checkout process
5. Test responsive design on mobile

### Backend Testing
1. Access admin panel
2. Create/edit products
3. View orders in admin
4. Test API endpoints directly

### API Endpoints to Test
- `GET http://localhost:8000/api/products/` - List products
- `GET http://localhost:8000/api/products/categories/` - List categories
- `POST http://localhost:8000/api/orders/create/` - Create order

## 🎨 Design Customization

### Color Scheme
- Primary: Blue to Purple gradient (#3B82F6 to #8B5CF6)
- Secondary: Gray tones
- Accent: Various product colors

### Fonts and Typography
- Modern, clean fonts
- Proper hierarchy
- Readable sizes

### Layout
- Mobile-first responsive design
- Card-based components
- Clean spacing and alignment

## 🔒 Security Features

- CSRF protection enabled
- SQL injection prevention
- Input validation
- CORS properly configured
- Admin authentication required

## 📈 Performance Optimization

- Optimized React components
- Efficient API queries
- Image optimization ready
- Caching strategies implemented
- Production build optimization

## 🚀 Next Steps

After setup, you can:
1. Add your own products and categories
2. Customize the design and branding
3. Integrate payment gateways
4. Add user authentication
5. Deploy to production hosting
6. Add email notifications
7. Implement inventory management
8. Add analytics and reporting

## 📞 Support

This is a complete, production-ready e-commerce solution. All code is well-documented and follows best practices. The system is designed to be easily customizable and scalable.

**Happy selling with TeenTops! 🛍️✨**

---

*Last updated: October 2024*
*Version: 1.0.0*
