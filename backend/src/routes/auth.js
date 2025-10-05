import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/index.js';

const router = express.Router();

router.get('/login', (req, res) => {
	if (req.session.user) return res.redirect('/admin');
	res.render('login', { error: null });
});

router.post('/login', (req, res) => {
	const { email, password } = req.body;
	const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
	if (!user) return res.render('login', { error: 'Invalid credentials' });
	const ok = bcrypt.compareSync(password, user.password_hash);
	if (!ok) return res.render('login', { error: 'Invalid credentials' });
	req.session.user = { id: user.id, email: user.email, role: user.role };
	res.redirect('/admin');
});

router.post('/logout', (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login');
	});
});

export default router;


