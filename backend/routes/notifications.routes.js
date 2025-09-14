// routes/notifications.routes.js - Tambah ke routing yang sudah ada
const express = require('express');
const router = express.Router();
const db = require('../src/config/database');

// GET - Ambil notifikasi untuk staf (dengan filter role)
router.get('/staff', async (req, res) => {
  try {
    console.log('🔔 GET /api/notifications/staff - Request received');
    
    const { limit = 20, offset = 0, status = 'all' } = req.query;
    
    let whereClause = "WHERE 1=1";
    let params = [];
    
    // Filter by read status
    if (status === 'unread') {
      whereClause += " AND status_read = 0";
    } else if (status === 'read') {
      whereClause += " AND status_read = 1";
    }
    
    const query = `
      SELECT 
        n.id,
        n.jenis,
        n.pesan,
        n.letter_id,
        n.status_read,
        n.created_at,
        l.perihal,
        l.asal_surat,
        l.jenis as letter_jenis
      FROM notifications n
      LEFT JOIN letters l ON n.letter_id = l.id
      ${whereClause}
      ORDER BY n.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(parseInt(limit), parseInt(offset));
    const [rows] = await db.execute(query, params);
    
    // Get unread count
    const [unreadCount] = await db.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE status_read = 0'
    );
    
    console.log(`✅ Found ${rows.length} notifications, ${unreadCount[0].count} unread`);
    
    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length,
      unread_count: unreadCount[0].count,
      total_notifications: rows.length
    });
    
  } catch (error) {
    console.error('❌ Error in GET /api/notifications/staff:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch staff notifications',
      message: error.message
    });
  }
});

// PUT - Mark notification as read
router.put('/:id/read', async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(`✅ PUT /api/notifications/${id}/read - Request received`);
    
    const [result] = await db.execute(
      'UPDATE notifications SET status_read = 1 WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    console.log(`✅ Notification ${id} marked as read`);
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification_id: id
    });
    
  } catch (error) {
    console.error(`❌ Error marking notification ${id} as read:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      message: error.message
    });
  }
});

// PUT - Mark all notifications as read
router.put('/mark-all-read', async (req, res) => {
  try {
    console.log('✅ PUT /api/notifications/mark-all-read - Request received');
    
    const [result] = await db.execute(
      'UPDATE notifications SET status_read = 1 WHERE status_read = 0'
    );
    
    console.log(`✅ Marked ${result.affectedRows} notifications as read`);
    
    res.status(200).json({
      success: true,
      message: `${result.affectedRows} notifications marked as read`,
      affected_rows: result.affectedRows
    });
    
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read',
      message: error.message
    });
  }
});

// GET - Get notification statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 GET /api/notifications/stats - Request received');
    
    const statsQuery = `
      SELECT 
        COUNT(*) as total_notifications,
        COUNT(CASE WHEN status_read = 0 THEN 1 END) as unread_count,
        COUNT(CASE WHEN status_read = 1 THEN 1 END) as read_count,
        COUNT(CASE WHEN jenis = 'attendance_update' THEN 1 END) as attendance_updates,
        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_count,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as week_count
      FROM notifications
    `;
    
    const [stats] = await db.execute(statsQuery);
    
    console.log('📊 Notification statistics:', stats[0]);
    
    res.status(200).json({
      success: true,
      data: stats[0]
    });
    
  } catch (error) {
    console.error('❌ Error in GET /api/notifications/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notification statistics',
      message: error.message
    });
  }
});

module.exports = router;