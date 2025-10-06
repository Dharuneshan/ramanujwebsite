import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import express from 'express';
import session from 'express-session';
import SQLiteStoreFactory from 'connect-sqlite3';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { migrateAndSeed } from './db/migrate.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import jobsRouter from './routes/jobs.js';
import contactsRouter from './routes/contacts.js';
import applicationsRouter from './routes/applications.js';
import cors from 'cors';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure data directory exists
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure uploads directory exists
const uploadsDir = path.resolve(dataDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security and logging
app.use(helmet());
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
	origin: process.env.FRONTEND_URL || 'https://ramanuj-website.vercel.app',
	credentials: true 
}));

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Sessions
const SQLiteStore = SQLiteStoreFactory(session);
app.use(
	session({
		store: new SQLiteStore({
			dir: dataDir,
			db: 'sessions.sqlite'
		}),
		secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 8 }
	})
);

// Static for simple admin assets (if any)
app.use('/admin/static', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/applications', applicationsRouter);

app.get('/health', (_req, res) => {
	res.json({ ok: true });
});

const port = Number(process.env.PORT || 8080);

async function start() {
	await migrateAndSeed();
	app.listen(port, () => {
		console.log(`Backend listening on http://127.0.0.1:${port}`);
		console.log('Admin dashboard: http://127.0.0.1:' + port + '/admin');
	});
}

start().catch((err) => {
	console.error('Failed to start server', err);
	process.exit(1);
});


