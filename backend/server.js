// Path: /backend/server.js - FIXED dotenv loading
// CRITICAL: Load dotenv BEFORE any other requires
require('dotenv').config()

// Debug environment variables immediately
console.log('==========================================')
console.log('ENVIRONMENT VARIABLES DEBUG:')
console.log('JWT_SECRET:', process.env.JWT_SECRET || 'MISSING')
console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN || 'MISSING')
console.log('DB_NAME:', process.env.DB_NAME || 'MISSING')
console.log('PORT:', process.env.PORT || 'MISSING')
console.log('==========================================')

const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files middleware untuk serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes - Existing
const authRoutes = require('./src/routes/auth.routes')
const lettersRoutes = require('./src/routes/letters.routes')
const usersRoutes = require('./src/routes/users.routes')
const proposalsRoutes = require('./src/routes/proposals.routes')
const invitesRoutes = require('./src/routes/invites.routes')
const agendaRoutes = require('./src/routes/agenda.routes')
const dispositionsRoutes = require('./src/routes/dispositions.routes')

// NEW: Executive Routes untuk Dashboard Ketua
const executiveRoutes = require('./src/routes/executive.routes')

// API Routes - Existing
app.use('/api/auth', authRoutes)
app.use('/api/letters', lettersRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/proposals', proposalsRoutes)
app.use('/api/invites', invitesRoutes)
app.use('/api/agenda', agendaRoutes)
app.use('/api/dispositions', dispositionsRoutes)

// NEW: Executive API Routes
app.use('/api/executive', executiveRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'RI7 API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: {
      jwt_secret: process.env.JWT_SECRET ? 'LOADED' : 'MISSING',
      jwt_expires_in: process.env.JWT_EXPIRES_IN || 'DEFAULT',
      db_name: process.env.DB_NAME || 'NOT_SET',
      node_env: process.env.NODE_ENV || 'development'
    },
    executive_dashboard: 'Active'
  })
})

// Root endpoint dengan informasi API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Sistem Informasi Surat RI7 API',
    version: '1.0.0',
    security: {
      jwt_expires_in: process.env.JWT_EXPIRES_IN || 'NOT_SET',
      auto_logout: process.env.JWT_EXPIRES_IN === '12h' ? 'Enabled - 12 hours' : 'Check .env configuration'
    },
    endpoints: {
      auth: '/api/auth',
      letters: '/api/letters',
      users: '/api/users',
      proposals: '/api/proposals',
      invites: '/api/invites',
      agenda: '/api/agenda',
      dispositions: '/api/dispositions',
      executive: '/api/executive'
    },
    executive_features: {
      dashboard: '/api/executive/surat-summary',
      proposals: '/api/executive/proposals',
      attendance: '/api/executive/undangan',
      notifications: '/api/executive/notifications',
      health: '/api/executive/health'
    },
    features: {
      fileUpload: 'Supported (max 10MB)',
      formats: ['PDF', 'DOC', 'DOCX', 'JPG', 'JPEG', 'PNG'],
      uploadPath: '/uploads'
    }
  })
})

// Serve static files from React app (production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  })
}

// 404 handler untuk API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack)

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File terlalu besar. Maksimal 10MB',
      error: 'FILE_TOO_LARGE'
    })
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Field file tidak dikenali',
      error: 'INVALID_FILE_FIELD'
    })
  }

  // Database connection errors
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: 'DB_ACCESS_DENIED'
    })
  }

  if (err.code === 'ECONNREFUSED') {
    return res.status(500).json({
      success: false,
      message: 'Database server unavailable',
      error: 'DB_CONNECTION_REFUSED'
    })
  }

  // Generic error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : 'INTERNAL_ERROR'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 RI7 API Server running on port ${PORT}`)
  console.log(`📁 API Base URL: http://localhost:${PORT}/api`)
  console.log(`📂 File Uploads: http://localhost:${PORT}/uploads`)
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`)
  
  // Environment status
  const jwtStatus = process.env.JWT_SECRET ? '✅ LOADED' : '❌ MISSING'
  const expiresStatus = process.env.JWT_EXPIRES_IN || '❌ NOT SET'
  
  console.log(`🔐 JWT Secret: ${jwtStatus}`)
  console.log(`⏰ JWT Expires: ${expiresStatus}`)
  
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    console.log('\n⚠️  WARNING: Environment variables not loaded!')
    console.log('   Check if .env file exists and has correct format')
    console.log('   Expected location: /backend/.env')
  }
  
  console.log(`\n📋 Available endpoints:`)
  console.log(`   - POST /api/auth/login`)
  console.log(`   - GET  /api/health`)
  console.log(`   - GET  /api/executive/notifications`)
  console.log(`   - GET  /api/letters`)
  console.log(`\n✨ Ready to handle requests!\n`)
})