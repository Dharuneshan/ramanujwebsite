import express from 'express';
import db from '../db/index.js';

const router = express.Router();

router.post('/', (req, res) => {
	const { firstName, lastName, email, company, message } = req.body;
	if (!firstName || !lastName || !email || !message) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	db.prepare('INSERT INTO contacts (first_name, last_name, email, company, message) VALUES (?, ?, ?, ?, ?)')
		.run(firstName, lastName, email, company || '', message);
	return res.status(201).json({ ok: true });
});

export default router;


