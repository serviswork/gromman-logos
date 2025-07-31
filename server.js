const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'https://gromman.com', 'https://www.gromman.com', 'https://gromman-logos.pages.dev', 'https://api.gromman.com'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/submit-form', limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve static files
app.use(express.static('.'));
app.use('/public', express.static('public'));

// Validate environment variables
function validateEnv() {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'EMAIL_RECEIVER'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('[CONFIG ERROR] Missing required environment variables:', missing.join(', '));
    console.error('[CONFIG ERROR] Please check your .env file');
    process.exit(1);
  }
  
  console.log('[CONFIG OK] All required environment variables are set');
}

// Create SMTP transporter
function createTransporter() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    console.log('[SMTP OK] Transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('[SMTP ERROR] Failed to create transporter:', error.message);
    throw error;
  }
}

// Validate form data
function validateFormData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.role || data.role.trim().length === 0) {
    errors.push('Position selection is required');
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }
  
  return errors;
}

// Format email content
function formatEmailContent(data) {
  const telegramInfo = data.telegram ? `Telegram: ${data.telegram}` : 'Telegram: Не указан';
  
  return `
📩 Новая заявка в команду Groman Concierge

Имя: ${data.name}
Email: ${data.email}
${telegramInfo}
Вакансия: ${data.role}
Сообщение:
${data.message}

---
Отправлено с формы на сайте gromman.com
Время: ${new Date().toLocaleString('ru-RU')}
Язык: ${data.language || 'ru'}
IP: ${data.ip || 'Не определен'}
User-Agent: ${data.userAgent || 'Не определен'}
  `.trim();
}

// API endpoint for form submission
app.post('/api/submit-form', async (req, res) => {
  try {
    const { name, email, telegram, role, message, source, language } = req.body;
    
    // Validate form data
    const validationErrors = validateFormData({ name, email, telegram, role, message });
    if (validationErrors.length > 0) {
      console.log('[VALIDATION ERROR] Form validation failed:', validationErrors);
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }
    
    // Create transporter
    const transporter = createTransporter();
    
    // Prepare email data
    const emailData = {
      name,
      email,
      telegram,
      role,
      message,
      source,
      language,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    const mailOptions = {
      from: `"Gromman Concierge Form" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: `Новая заявка от ${name}`,
      text: formatEmailContent(emailData),
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8'
      }
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`[EMAIL OK] Application sent to ${process.env.EMAIL_RECEIVER} from ${email}`);
    console.log(`[EMAIL OK] Message ID: ${info.messageId}`);
    
    res.json({
      success: true,
      message: 'Заявка успешно отправлена!',
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send email:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Ошибка при отправке заявки. Попробуйте позже.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve main pages
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/join', (req, res) => {
  res.sendFile(__dirname + '/join.html');
});

app.get('/test-smtp', (req, res) => {
  res.sendFile(__dirname + '/public/test-smtp.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Страница не найдена'
  });
});

// Start server
function startServer() {
  try {
    validateEnv();
    
    app.listen(PORT, () => {
      console.log(`[SERVER OK] Server running on port ${PORT}`);
      console.log(`[SERVER OK] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[SERVER OK] SMTP Host: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
      console.log(`[SERVER OK] Email Receiver: ${process.env.EMAIL_RECEIVER}`);
    });
  } catch (error) {
    console.error('[SERVER ERROR] Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer(); 