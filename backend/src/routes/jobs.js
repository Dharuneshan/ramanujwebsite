import express from 'express';
import db from '../db/index.js';

const router = express.Router();

router.get('/', (_req, res) => {
	const jobs = db.prepare('SELECT id, title, location, type, department, description, requirements, created_at FROM jobs ORDER BY created_at DESC').all();
	res.json(jobs.map(j => ({
		...j,
		requirements: (j.requirements || '').split('\n').filter(Boolean)
	})));
});

export default router;


