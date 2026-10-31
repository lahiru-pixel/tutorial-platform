import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, GraduationCap, Landmark, MapPin, Play, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './HomePage.css';

const teachingAreas = [
  { icon: BookOpen, number: '01', title: 'A/L Accounting', description: 'Build your understanding of accounting, from the first principles to exam preparation.' },
  { icon: GraduationCap, number: '02', title: 'Professional examinations', description: 'Accounting and costing teaching experience across CIMA, CMA, ACCA, banking and degree examinations.' },
  { icon: Landmark, number: '03', title: 'Government examinations', description: 'Teaching for the Government Accountancy Service, Audit Examiners and competitive examinations.' },
];

const experience = [
  { since: 'Since 2007', title: 'A/L Accounting', detail: 'Visiting lecturer · Group and individual classes' },
  { since: 'Since 2007', title: 'AAT Sri Lanka', detail: 'Registered lecturer' },
  { since: 'Since 2009', title: 'Institute of Chartered Accountants of Sri Lanka', detail: 'Registered lecturer' },
  { since: 'Since 2012', title: 'Government & competitive examinations', detail: 'Accountancy Service · Audit Examiners · Accounting and costing' },
];

const questions = [
  { question: 'How do I start learning?', answer: 'Create a student account, then arrange course enrollment and payment confirmation with your teacher. Once your access is activated, your enrolled courses appear in My Courses.' },
  { question: 'Does creating an account give me access to every course?', answer: 'No. An account lets you sign in. Lesson access requires enrollment in the course and payment approval by the teacher.' },
  { question: 'Can I watch lessons on my phone?', answer: 'Yes. You can use the platform in a modern mobile browser. Video lessons require an internet connection, and you can also study on a tablet or computer.' },
  { question: 'Where do I find the courses I have joined?', answer: 'Sign in and open My Courses. If a course is missing or a lesson is locked, check your enrollment and payment status with your teacher.' },
];

function CourseCard({ course, signedIn }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="home-course-card">
      <div className="home-course-image">
        {course.thumbnail_url && !imageFailed ? (
          <img src={course.thumbnail_url} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        ) : (
          <div className="home-course-placeholder" aria-hidden="true">
            <BookOpen size={44} strokeWidth={1.2} />
            <span>eZy Account <small>WITH JB</small></span>
          </div>
        )}
        <span className="home-course-type"><Play size={12} fill="currentColor" aria-hidden="true" /> Video course</span>
      </div>
      <div className="home-course-body">
        <h3>{course.title}</h3>
        <p>{course.description || 'Explore accounting with Jayaruwan Bandara through online video lessons.'}</p>
        <Link to={signedIn ? `/courses/${course.id}` : '/login'} className="home-course-link">
          {signedIn ? 'View course' : 'Sign in to view course'} <ArrowUpRight size={19} aria-hidden="true" />
          <span className="sr-only">: {course.title}</span>
        </Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { hash, key: locationKey } = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    api.get('/api/courses', { signal: controller.signal, timeout: 15000 })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error('Invalid course response');
        setCourses(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, locationKey]);

  return (
    <div className="home-page">
      <section className="home-hero home-container" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="home-eyebrow"><span className="home-dot" /> Accounting education · Sri Lanka</p>
          <h1 id="home-title">Make sense of<br />accounting.<br /><em>Build your future.</em></h1>
          <p className="home-intro">Learn with <strong>Jayaruwan Bandara.</strong> Bring your accounting studies into focus with online video courses and a teacher whose experience spans school, professional and government examinations.</p>
          <div className="home-actions">
            <a href="#courses" className="home-button home-button-primary">Explore courses <ArrowUpRight size={19} aria-hidden="true" /></a>
            <Link to={user ? '/my-courses' : '/login'} className="home-button home-button-outline">{user ? 'My courses' : 'Student sign in'} <ArrowRight size={19} aria-hidden="true" /></Link>
          </div>
          <p className="home-location"><MapPin size={16} aria-hidden="true" /> Rooted in Kandy. Ready to learn wherever you are.</p>
        </div>

        <div className="home-hero-art">
          <div className="home-teacher-card">
            <div className="home-card-top"><span>Your accounting classroom</span><BookOpen size={23} strokeWidth={1.4} aria-hidden="true" /></div>
            <div className="home-logo-sheet"><img src="/logo.svg" alt="eZy Accounting with JB" width="124" height="143" /></div>
            <p className="home-card-label">Learn with</p>
            <p className="home-teacher-name">Jayaruwan<br />Bandara<span>.</span></p>
            <div className="home-card-bottom"><span>Accounting, explained.</span><span>eZy / JB</span></div>
          </div>
          <div className="home-experience-note"><GraduationCap size={28} strokeWidth={1.5} aria-hidden="true" /><div><strong>Teaching accounting since 2007</strong><span>School & professional examinations</span></div></div>
        </div>
      </section>

      <div className="home-trust-strip">
        <div className="home-container home-trust-grid">
          <div><span>01 / Foundation</span><strong>Understand the principles</strong></div>
          <div><span>02 / Direction</span><strong>Learn with an experienced teacher</strong></div>
          <div><span>03 / Flexibility</span><strong>Study through video lessons</strong></div>
        </div>
      </div>

      <section className="home-section home-container" aria-labelledby="areas-title">
        <div className="home-section-heading"><div><p className="home-eyebrow">A subject. Many possibilities.</p><h2 id="areas-title">Learning for your next chapter.</h2></div><p>From school studies to professional ambitions, build a clearer understanding of accounting.</p></div>
        <div className="home-area-grid">
          {teachingAreas.map(({ icon: Icon, number, title, description }) => (
            <article className="home-area-card" key={number}>
              <div className="home-area-top"><Icon size={28} strokeWidth={1.4} aria-hidden="true" /><span>{number}</span></div>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="courses" className="home-courses-section home-section" aria-labelledby="courses-title">
        <div className="home-container">
          <div className="home-section-heading"><div><p className="home-eyebrow">The online classroom</p><h2 id="courses-title">Find your next step.</h2></div><p>Browse the published courses. Your enrolled lessons will be waiting in My Courses after you sign in.</p></div>
          <div aria-live="polite" aria-busy={loading}>
            {loading ? (
              <><span className="sr-only">Loading courses</span><div className="home-course-grid" aria-hidden="true">{[1, 2, 3].map(item => <div className="home-course-skeleton" key={item}><div /><span /><span /></div>)}</div></>
            ) : error ? (
              <div className="home-course-message"><BookOpen size={32} aria-hidden="true" /><h3>We couldn’t load the courses.</h3><p>Please try again in a moment. You can still sign in to your student account.</p><button type="button" className="home-button home-button-outline" onClick={() => setAttempt(value => value + 1)}><RefreshCw size={16} aria-hidden="true" /> Try again</button></div>
            ) : courses.length ? (
              <div className="home-course-grid">{courses.map(course => <CourseCard key={course.id} course={course} signedIn={Boolean(user)} />)}</div>
            ) : (
              <div className="home-course-message"><BookOpen size={32} aria-hidden="true" /><h3>The next chapter is on its way.</h3><p>New courses will appear here when published. Already enrolled? Sign in to find your lessons.</p><Link to={user ? '/my-courses' : '/login'} className="home-button home-button-outline">{user ? 'My courses' : 'Student sign in'} <ArrowRight size={17} aria-hidden="true" /></Link></div>
            )}
          </div>
          <p className="home-course-note"><Check size={16} aria-hidden="true" /> Lesson access is activated after course enrollment and payment confirmation.</p>
        </div>
      </section>

      <section id="about" className="home-section home-container home-about" aria-labelledby="about-title">
        <div className="home-about-intro">
          <p className="home-eyebrow">Meet your teacher</p>
          <h2 id="about-title">Experience that brings<br />the subject to life.</h2>
          <p className="home-about-name">Jayaruwan Bandara</p>
          <p>Based in Kandy, Jayaruwan’s teaching experience brings together A/L accounting, professional studies and government examinations, alongside experience in internal auditing.</p>
          <div className="home-education"><GraduationCap size={25} aria-hidden="true" /><div><strong>University of Sri Jayewardenepura</strong><span>Studied at · Class of 2014</span></div></div>
          <p className="home-audit-note">Former Internal Auditor, SARU International (Pvt) Ltd<br /><span>February 2015 – May 2016 · Gampola</span></p>
        </div>
        <div className="home-experience-list">
          <p className="home-experience-heading">A background in teaching</p>
          {experience.map(item => <div className="home-experience-item" key={item.title}><span>{item.since}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div></div>)}
          <p className="home-other-teaching">Also teaching O/L Mathematics in English and Sinhala since 2005.</p>
        </div>
      </section>

      <section className="home-start-section" aria-labelledby="start-title">
        <div className="home-container">
          <div className="home-section-heading"><div><p className="home-eyebrow">A clear path to your classroom</p><h2 id="start-title">Ready when you are.</h2></div><Link to={user ? '/my-courses' : '/register'} className="home-button home-button-primary">{user ? 'Go to my courses' : 'Create your account'} <ArrowUpRight size={19} aria-hidden="true" /></Link></div>
          <ol className="home-steps">
            <li><span>01</span><h3>Create your account</h3><p>Register with your name and email to get started.</p></li>
            <li><span>02</span><h3>Confirm your enrollment</h3><p>Arrange your course enrollment and payment confirmation with your teacher.</p></li>
            <li><span>03</span><h3>Make time to learn</h3><p>Sign in, open My Courses and start your video lessons.</p></li>
          </ol>
        </div>
      </section>

      <section className="home-section home-container home-faq" aria-labelledby="faq-title">
        <div><p className="home-eyebrow">Before you begin</p><h2 id="faq-title">A little clarity<br />goes a long way.</h2><p>Answers to a few common questions about your online classroom.</p><a href="#courses" className="home-text-link">Back to courses <ArrowDown size={17} className="home-arrow-up" aria-hidden="true" /></a></div>
        <div className="home-faq-list">{questions.map(item => <details key={item.question}><summary>{item.question}<ChevronDown size={20} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>
      </section>
    </div>
  );
}
