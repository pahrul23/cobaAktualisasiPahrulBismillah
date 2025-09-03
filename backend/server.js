// Path: /backend/server.js
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files middleware untuk serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
const authRoutes = require('./src/routes/auth.routes')
const lettersRoutes = require('./src/routes/letters.routes')  // Updated letters routes
const usersRoutes = require('./src/routes/users.routes')
const proposalsRoutes = require('./src/routes/proposals.routes')
const invitesRoutes = require('./src/routes/invites.routes')
const agendaRoutes = require('./src/routes/agenda.routes')
const dispositionsRoutes = require('./src/routes/dispositions.routes')

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/letters', lettersRoutes)  // Updated dengan file upload support
app.use('/api/users', usersRoutes)
app.use('/api/proposals', proposalsRoutes)
app.use('/api/invites', invitesRoutes)
app.use('/api/agenda', agendaRoutes)
app.use('/api/dispositions', dispositionsRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'RI7 API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Root endpoint dengan informasi API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Sistem Informasi Surat RI7 API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      letters: '/api/letters',
      users: '/api/users',
      proposals: '/api/proposals',
      invites: '/api/invites',
      agenda: '/api/agenda',
      dispositions: '/api/dispositions'
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
  console.log(`\n📋 Available endpoints:`)
  console.log(`   - POST /api/letters (Create with file upload)`)
  console.log(`   - GET  /api/letters (List with filters)`)
  console.log(`   - GET  /api/letters/:id (Detail)`)
  console.log(`   - PUT  /api/letters/:id (Update)`)
  console.log(`   - DEL  /api/letters/:id (Delete)`)
  console.log(`   - GET  /api/letters/stats (Dashboard stats)`)
  console.log(`\n💾 Database: MySQL with support for all letter types`)
  console.log(`📤 File Upload: PDF, DOC, DOCX, JPG, PNG (max 10MB)`)
  console.log(`\n✨ Ready to handle frontend integration!\n`)
})