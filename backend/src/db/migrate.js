import bcrypt from 'bcryptjs';
import db from './index.js';

export async function migrateAndSeed() {
	// Create tables
	db.exec(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		role TEXT NOT NULL DEFAULT 'admin',
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS jobs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		location TEXT,
		type TEXT,
		department TEXT,
		description TEXT,
		requirements TEXT,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS contacts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		email TEXT NOT NULL,
		company TEXT,
		message TEXT NOT NULL,
		submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS applications (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		job_id INTEGER NOT NULL,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		phone TEXT,
		resume_path TEXT,
		cover_letter TEXT,
		submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
		FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
	);
	`);

	// Lightweight, idempotent schema migrations for existing databases
	try {
		const applicationColumns = db
			.prepare("PRAGMA table_info(applications)")
			.all()
			.map((c) => c.name);

		const ensureColumn = (name, ddl) => {
			if (!applicationColumns.includes(name)) {
				db.exec(`ALTER TABLE applications ADD COLUMN ${ddl}`);
			}
		};

		ensureColumn('phone', 'phone TEXT');
		ensureColumn('resume_path', 'resume_path TEXT');
		ensureColumn('cover_letter', 'cover_letter TEXT');
		ensureColumn('submitted_at', "submitted_at TEXT NOT NULL DEFAULT (datetime('now'))");
	} catch (e) {
		// eslint-disable-next-line no-console
		console.warn('Non-fatal: migration checks for applications table failed:', e?.message || e);
	}

	// Seed superuser
	const adminEmail = process.env.ADMIN_EMAIL || 'admin@ramanuj.local';
	const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
	const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
	if (!existing) {
		const passwordHash = await bcrypt.hash(adminPassword, 10);
		db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)')
			.run(adminEmail, passwordHash, 'admin');
		console.log('Seeded superuser:', adminEmail);
	}

	return true;
}


