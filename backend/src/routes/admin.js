import express from 'express';
import db from '../db/index.js';

const router = express.Router();

function requireAdmin(req, res, next) {
	if (!req.session.user) return res.redirect('/auth/login');
	if (req.session.user.role !== 'admin') return res.status(403).send('Forbidden');
	next();
}

router.get('/', requireAdmin, (req, res) => {
	const jobCount = db.prepare('SELECT COUNT(*) as c FROM jobs').get().c;
	const contactCount = db.prepare('SELECT COUNT(*) as c FROM contacts').get().c;
	const appCount = db.prepare('SELECT COUNT(*) as c FROM applications').get().c;
	res.render('dashboard', { user: req.session.user, stats: { jobCount, contactCount, appCount } });
});

router.get('/jobs', requireAdmin, (req, res) => {
	const jobs = db.prepare('SELECT * FROM jobs ORDER BY created_at DESC').all();
	res.render('jobs', { user: req.session.user, jobs });
});

router.post('/jobs', requireAdmin, (req, res) => {
	const { title, location, type, department, description, requirements } = req.body;
	db.prepare('INSERT INTO jobs (title, location, type, department, description, requirements) VALUES (?, ?, ?, ?, ?, ?)')
		.run(title, location, type, department, description, requirements || '');
	res.redirect('/admin/jobs');
});

router.post('/jobs/:id/delete', requireAdmin, (req, res) => {
	const id = Number(req.params.id);
	db.prepare('DELETE FROM jobs WHERE id = ?').run(id);
	res.redirect('/admin/jobs');
});

router.get('/contacts', requireAdmin, (req, res) => {
	const contacts = db.prepare('SELECT * FROM contacts ORDER BY submitted_at DESC').all();
	res.render('contacts', { user: req.session.user, contacts });
});

router.get('/applications', requireAdmin, (req, res) => {
	const apps = db.prepare(`
		SELECT a.*, j.title as job_title
		FROM applications a
		LEFT JOIN jobs j ON j.id = a.job_id
		ORDER BY a.submitted_at DESC
	`).all();
	res.render('applications', { user: req.session.user, applications: apps });
});

export default router;


