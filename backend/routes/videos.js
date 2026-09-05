const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authenticate = require('../middleware/authenticate');
const isEnrolled = require('../middleware/isEnrolled');

// GET /api/videos/:id/watch -> returns youtube_url only if authorized
// Requires valid JWT + is_paid=true + enrolled
router.get('/:id/watch', authenticate, isEnrolled, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('id, title, youtube_url, description')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

module.exports = router;
