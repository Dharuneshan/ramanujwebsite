import express from 'express';
import db from '../db/index.js';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, '../../../data/uploads');

// Configure multer storage for PDFs
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // ensure exists (server.js also ensures)
    if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot, { recursive: true });
    cb(null, uploadsRoot);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${timestamp}_${safeOriginal}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    // Reject non-PDF uploads with a friendly error instead of crashing the route
    return cb(new Error('Only PDF files are allowed'));
  }
});

// Use an inline wrapper to catch multer errors and send 4xx instead of 500
router.post('/', (req, res) => {
    upload.single('resume')(req, res, (uploadErr) => {
        if (uploadErr) {
            const message = uploadErr.message || 'File upload error';
            // Treat file validation/size issues as a bad request
            return res.status(400).json({ error: message });
        }
        try {
        // eslint-disable-next-line no-console
        console.log('Incoming application payload', {
            hasFile: !!req.file,
            body: {
                jobId: req.body?.jobId ?? req.body?.job_id,
                name: req.body?.name,
                email: req.body?.email,
                phone: req.body?.phone,
                hasCoverLetter: typeof (req.body?.coverLetter ?? req.body?.cover_letter) === 'string'
            }
        });
        const body = req.body || {};
        const jobIdRaw = (body.jobId ?? body.job_id ?? '').toString();
        const name = (body.name ?? '').toString().trim();
        const email = (body.email ?? '').toString().trim();
        const phoneRaw = (body.phone ?? '').toString();
        const coverLetter = (body.coverLetter ?? body.cover_letter ?? '').toString();

        const jobIdNum = Number(jobIdRaw);
        const phone = phoneRaw.trim();

        const missing = [];
        if (!jobIdRaw) missing.push('jobId');
        if (!name) missing.push('name');
        if (!email) missing.push('email');
        if (!phone) missing.push('phone');
        if (missing.length) {
            return res.status(400).json({ error: 'Missing required fields', missing });
        }

        if (!Number.isFinite(jobIdNum)) {
            return res.status(400).json({ error: 'Invalid jobId' });
        }

        const job = db.prepare('SELECT id FROM jobs WHERE id = ?').get(jobIdNum);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        const resumePath = req.file ? `/uploads/${req.file.filename}` : null;

        db.prepare('INSERT INTO applications (job_id, name, email, phone, resume_path, cover_letter) VALUES (?, ?, ?, ?, ?, ?)')
            .run(jobIdNum, name, email, phone, resumePath, coverLetter || '');
        return res.status(201).json({ ok: true });
    } catch (err) {
        // Log detailed error on server for debugging while keeping response generic
        // eslint-disable-next-line no-console
        console.error('Application submission failed:', err && err.stack ? err.stack : err);
        return res.status(500).json({ error: 'Internal error' });
    }
    });
});

export default router;


