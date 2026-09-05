const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/courses -> list published courses
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id -> course details + video list (titles only)
router.get('/:id', async (req, res) => {
  try {
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('id, title, description, order_index, duration_text, created_at')
      .eq('course_id', req.params.id)
      .order('order_index', { ascending: true });

    if (videosError) throw videosError;

    res.json({ ...course, videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
});

module.exports = router;
