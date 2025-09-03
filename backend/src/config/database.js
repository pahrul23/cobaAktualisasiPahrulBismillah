// Path: /backend/src/config/database.js
const mysql = require('mysql2/promise')

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ri7_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

const pool = mysql.createPool(dbConfig)

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('✅ Database connected successfully')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

// Run test on startup
testConnection()

module.exports = pool