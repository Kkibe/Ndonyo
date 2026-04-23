Here's a complete, professional README.md for your Ndonyo project:

```markdown
# ⚡ NDONYO - Football Predictions & Betting Platform

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://powerking-tips.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.0-ffca28.svg)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)

## 📋 Overview

Ndonyo is a comprehensive football predictions and betting platform that provides users with expert analysis, daily tips, and premium VIP predictions. The platform offers free and premium subscription plans, multiple payment methods, and a complete user management system.

### 🎯 Key Features

- ✅ **Daily Football Predictions** - Free and VIP tips for major leagues
- ✅ **User Authentication** - Email/Password + Google Sign-in
- ✅ **Premium Subscriptions** - Daily, Weekly, Monthly, Yearly plans
- ✅ **Multiple Payment Methods** - M-Pesa, PayPal, Crypto, Google Pay
- ✅ **User Profiles** - Personal dashboard with transaction history
- ✅ **Admin Dashboard** - User management, tip management
- ✅ **Real-time Updates** - Live scores and match results
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **PWA Support** - Installable web app
- ✅ **SEO Optimized** - Meta tags, sitemap, robots.txt

## 🚀 Live Demo

**Production URL:** [https://powerking-tips.onrender.com](https://powerking-tips.onrender.com)

### Test Credentials
```
Email: demo@powerking-tips.com
Password: Demo@123
```

## 📦 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| React Router DOM | 6.27.0 | Routing |
| Vite | 5.4.9 | Build Tool |
| Sass | 1.80.4 | Styling |
| Material-UI Icons | 6.1.5 | Icons |
| Font Awesome | 7.2.0 | Icons |
| React Helmet Async | 2.0.5 | SEO |
| SweetAlert2 | 11.26.23 | Notifications |

### Backend & Services
| Service | Purpose |
|---------|---------|
| Firebase Auth | User authentication |
| Firestore | Database |
| Firebase Storage | File storage |
| PayPal SDK | Payment processing |
| Google Pay API | Digital wallet payments |
| NowPayments | Crypto payments |
| KoraPay | M-Pesa payments |

### Payment Integrations
- 💳 **PayPal** - International credit/debit cards
- 📱 **M-Pesa** - Mobile money (Kenya)
- ₿ **Crypto** - Bitcoin, Ethereum, USDT
- 🔵 **Google Pay** - Digital wallet

## 📁 Project Structure

```
PowerkingTips/
├── public/
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── robots.txt
│   ├── sitemap.xml
│   └── service-worker.js
├── src/
│   ├── assets/              # Images and static assets
│   ├── components/          # Reusable components
│   │   ├── FaqItem/
│   │   ├── Flyer/
│   │   ├── Footer/
│   │   ├── ForgotPassword/
│   │   ├── Loader/
│   │   ├── Navbar/
│   │   ├── PostDetails/
│   │   ├── Pricing/
│   │   ├── Testimonials/
│   │   ├── Topbar/
│   │   └── UserCard/
│   ├── config/              # Configuration files
│   │   └── firebase.js
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── PriceContext.jsx
│   ├── data/                # Mock data and constants
│   │   └── mockData.js
│   ├── hooks/               # Custom React hooks
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   └── usePagination.js
│   ├── pages/               # Page components
│   │   ├── About/
│   │   ├── Admin/
│   │   │   ├── AdminTips.jsx
│   │   │   ├── EditTip.jsx
│   │   │   ├── EditUser.jsx
│   │   │   └── ListUsers.jsx
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── NotFound/
│   │   ├── Payments/
│   │   │   ├── CryptoPayments.jsx
│   │   │   ├── GooglePayments.jsx
│   │   │   ├── KoraPayments.jsx
│   │   │   ├── PaypalPayments.jsx
│   │   │   ├── Payments.jsx
│   │   │   └── paymentUtils.js
│   │   ├── Register/
│   │   ├── Tips/
│   │   └── UserProfile/
│   ├── services/            # API and Firebase services
│   │   ├── auth.service.js
│   │   └── firestore.service.js
│   ├── styles/              # Global styles
│   │   └── global.scss
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- PayPal Developer account (for payments)
- Google Pay Merchant account (optional)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/powerking-tips.git
cd powerking-tips
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication (Email/Password, Google)
   - Create Firestore database
   - Copy credentials to `.env`

4. **Setup Firestore Security Rules**

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null;
    }
    
    // Tips collection
    match /tips/{tipId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.email == 'admin@powerking-tips.com');
    }
    
    // Contacts collection
    match /contacts/{contactId} {
      allow create: if true;
      allow read: if request.auth != null;
    }
  }
}
```

5. **Start development server**
```bash
npm run dev
```

6. **Build for production**
```bash
npm run build
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🌍 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Opera | 76+ |

## 📱 PWA Features

- ✅ Offline support with service workers
- ✅ Installable on mobile devices
- ✅ Push notifications ready
- ✅ App manifest configured
- ✅ 512x512 icons for all devices

## 🔒 Security Features

- 🔐 Firebase Authentication with email verification
- 🔑 Password reset functionality
- 🛡️ Protected routes for admin areas
- 📝 Input sanitization
- 🚫 Rate limiting on API calls
- 🔒 Environment variables for sensitive data

## 💳 Payment Integration Details

### M-Pesa (KoraPay)
- **Countries:** Kenya, Nigeria
- **Currencies:** KES, NGN
- **Auto-detection:** User country detection

### PayPal
- **Countries:** Worldwide
- **Currencies:** USD
- **Subscription Plans:** $2, $7, $16, $50

### Cryptocurrency (NowPayments)
- **Supported Coins:** BTC, ETH, USDT, LTC, BCH, XRP, DOGE
- **Auto-conversion:** Real-time rates

### Google Pay
- **Countries:** Kenya, Nigeria, South Africa, Ghana, Uganda, Tanzania, US, UK
- **Currency conversion:** Automatic based on country

## 📊 Database Schema

### Users Collection
```javascript
{
  email: string,
  username: string,
  isPremium: boolean,
  subscription: "Daily" | "Weekly" | "Monthly" | "Yearly",
  subDate: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp,
  transactions: array
}
```

### Tips Collection
```javascript
{
  home: string,
  away: string,
  date: string,
  time: string,
  odd: number,
  pick: string,
  status: "pending" | "finished" | "live",
  won: "pending" | "won" | "lost",
  premium: boolean,
  results: string,
  createdAt: timestamp
}
```

### Contacts Collection
```javascript
{
  name: string,
  email: string,
  message: string,
  responded: boolean,
  createdAt: timestamp
}
```

## 🚦 API Endpoints

All data operations go through Firebase directly. No custom backend required.

### Firestore Collections
- `users` - User profiles and subscriptions
- `tips` - Football predictions
- `contacts` - Contact form submissions
- `carts` - Shopping cart data
- `orders` - Marketplace orders

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Lint check
npm run lint
```

## 📈 Performance Optimization

- ✅ Lazy loading for routes
- ✅ Image optimization
- ✅ Code splitting with Vite
- ✅ Gzip compression
- ✅ CDN for static assets
- ✅ Firebase persistence for offline access
- ✅ Debounced search inputs
- ✅ Pagination for large datasets

## 🔄 CI/CD Pipeline

The project is deployed on Render.com with automatic deployments:

```yaml
# .render.yaml (example)
services:
  - type: web
    name: powerking-tips
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    envVars:
      - key: VITE_FIREBASE_API_KEY
        sync: false
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Use ESLint configuration provided
- Follow React best practices
- Write meaningful commit messages
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Daddy Market** - *Initial work* - [DaddyMarket](https://github.com/DaddyMarket)

## 🙏 Acknowledgments

- Firebase for backend services
- PayPal for payment integration
- Google Pay API team
- NowPayments for crypto solutions
- KoraPay for M-Pesa integration
- All contributors and users

## 📞 Support & Contact

- **Email:** support@powerking-tips.com
- **Telegram:** [@powerkingtips](https://t.me/powerkingtips)
- **WhatsApp:** [Ndonyo Channel](https://whatsapp.com/channel/0029Vb3Louu9xVJktevbuZ2K)
- **Twitter:** [@powerking_tips](https://twitter.com/powerking_tips)
- **Instagram:** [@powerkingtips](https://instagram.com/powerkingtips)

## 🐛 Known Issues

- [ ] Country detection may fail in some regions (fallback to manual selection)
- [ ] Crypto payment confirmation may take 2-5 minutes
- [ ] Service worker registration may fail in some browsers

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Live match streaming integration
- [ ] AI-powered predictions
- [ ] Multi-language support
- [ ] Affiliate program
- [ ] Push notifications for match alerts
- [ ] Betting calculator tool
- [ ] Community forum

## ⭐ Star History

If you find this project useful, please give it a star ⭐ on GitHub!

---

**Built with ❤️ by the Ndonyo Team**

*Last Updated: April 2026*
```

This README provides:
- Complete project overview
- Tech stack details
- Installation instructions
- Payment integration details
- Database schema
- API documentation
- Contributing guidelines
- Support contacts
- Roadmap

You can customize the GitHub repository URL, author name, and other specific details as needed.