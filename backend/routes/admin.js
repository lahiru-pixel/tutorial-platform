const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authenticate = require('../middleware/authenticate');
const isAdmin = require('../middleware/isAdmin');

router.use(authenticate, isAdmin);

// GET /api/admin/students -> all students + paid status
router.get('/students', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// PUT /api/admin/students/:id/pay -> mark student as paid
router.put('/students/:id/pay', async (req, res) => {
  try {
    const { is_paid } = req.body;
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        is_paid, 
        paid_at: is_paid ? new Date().toISOString() : null 
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student status' });
  }
});

// POST /api/admin/enroll -> enroll student into course
router.post('/enroll', async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    const { data, error } = await supabase
      .from('enrollments')
      .insert([
        { student_id, course_id, enrolled_by: req.user.id }
      ])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to enroll student' });
  }
});

// DELETE /api/admin/enroll -> remove enrollment
router.delete('/enroll', async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    const { data, error } = await supabase
      .from('enrollments')
      .delete()
      .match({ student_id, course_id });

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove enrollment' });
  }
});

// GET /api/admin/dashboard -> stats overview
router.get('/dashboard', async (req, res) => {
  try {
    const { count: studentsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
    const { count: paidCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student').eq('is_paid', true);
    const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
    
    res.json({
      total_students: studentsCount || 0,
      total_paid: paidCount || 0,
      total_courses: coursesCount || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/admin/courses -> get all courses (including unpublished)
router.get('/courses', async (req, res) => {
  try {
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});


// POST /api/admin/courses -> create course
router.post('/courses', async (req, res) => {
  try {
    const { data, error } = await supabase.from('courses').insert([req.body]).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// PUT /api/admin/courses/:id -> edit course
router.put('/courses/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('courses').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE /api/admin/courses/:id -> delete course
router.delete('/courses/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('courses').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// GET /api/admin/videos -> get all videos (can be filtered by course_id in frontend if needed)
router.get('/videos', async (req, res) => {
  try {
    let query = supabase.from('videos').select('*').order('order_index', { ascending: true });
    if (req.query.course_id) {
        query = query.eq('course_id', req.query.course_id);
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// POST /api/admin/videos -> add video to course
router.post('/videos', async (req, res) => {
  try {
    const { data, error } = await supabase.from('videos').insert([req.body]).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// PUT /api/admin/videos/:id -> edit video
router.put('/videos/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('videos').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// DELETE /api/admin/videos/:id -> delete video
router.delete('/videos/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('videos').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// GET /api/admin/enrollments -> get all enrollments
router.get('/enrollments', async (req, res) => {
  try {
    const { data, error } = await supabase.from('enrollments').select('*, courses(*), profiles!student_id(*)');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

module.exports = router;
