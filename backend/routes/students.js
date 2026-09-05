const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

// GET /api/students/courses -> get enrolled courses for logged in student
router.get('/courses', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('course_id, enrolled_at, courses(*)')
      .eq('student_id', req.user.id);

    if (error) throw error;
    
    // Filter out cases where courses might be null (though DB constraint should prevent it)
    const courses = data.map(enrollment => enrollment.courses).filter(c => c !== null);
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student courses' });
  }
});

module.exports = router;
