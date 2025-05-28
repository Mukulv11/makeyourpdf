# 📄 MakeYourPDF

A professional PDF generation service with user accounts, template management, and powerful API.

## 🚀 Features

- **🎨 Template Engine**: Support for Handlebars/Mustache templates
- **👤 User Accounts**: Registration, login, and profile management
- **💾 Template Library**: Save, organize, and share templates
- **🔧 Powerful API**: RESTful API for programmatic access
- **📱 Responsive UI**: Beautiful interface that works on all devices
- **⚡ Fast Generation**: Optimized PDF creation with multiple engines
- **🔒 Secure**: JWT authentication and secure data handling

## 🏗️ Architecture

```
Frontend (Next.js + Tailwind)
    ↓
API Routes (Vercel Functions)
    ↓
Database (Vercel Postgres)
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Vercel Functions, Next.js API Routes
- **Database**: Vercel Postgres
- **Authentication**: NextAuth.js
- **PDF Generation**: Multiple engines (jsPDF, Puppeteer, html2canvas)
- **Template Engine**: Handlebars + Mustache
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/makeyourpdf.git
   cd makeyourpdf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🔧 Environment Variables

```env
# Database
POSTGRES_URL="your-vercel-postgres-url"
POSTGRES_PRISMA_URL="your-prisma-url"
POSTGRES_URL_NON_POOLING="your-non-pooling-url"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# API Keys (optional)
OPENAI_API_KEY="your-openai-key"
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Templates
- `GET /api/templates` - List user templates
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### PDF Generation
- `POST /api/generate` - Generate PDF from template
- `POST /api/generate/preview` - Generate HTML preview

## 🎯 Usage Examples

### Basic PDF Generation
```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    template: {
      html: '<h1>Hello {{name}}!</h1>',
      name: 'My Invoice'
    },
    data: { name: 'John Doe' }
  })
});

const { pdf_url } = await response.json();
```

### Template with Arrays
```javascript
const template = {
  html: `
    <h1>Invoice #{{invoice_number}}</h1>
    <table>
      {{#items}}
      <tr><td>{{name}}</td><td>{{price}}</td></tr>
      {{/items}}
    </table>
  `,
  data: {
    invoice_number: 'INV-001',
    items: [
      { name: 'Product A', price: '$99.99' },
      { name: 'Product B', price: '$149.99' }
    ]
  }
};
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Set up Database**
   - Create Vercel Postgres database
   - Run migrations
   - Update environment variables

## 📁 Project Structure

```
makeyourpdf/
├── src/
│   ├── app/                 # Next.js 14 app directory
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # User dashboard
│   │   ├── templates/      # Template management
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI components
│   │   ├── forms/         # Form components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utilities and configurations
│   │   ├── auth.ts        # Authentication config
│   │   ├── db.ts          # Database connection
│   │   └── pdf.ts         # PDF generation utilities
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── prisma/               # Database schema and migrations
└── docs/                 # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting and database
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation 