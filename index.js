#!/usr/bin/env node

// Root index.js - Railway entry point
// This file starts the backend server

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Ramanuj Backend Server...');
console.log('📁 Current directory:', process.cwd());

// Check if backend directory exists
const backendPath = path.join(__dirname, 'backend');
if (!fs.existsSync(backendPath)) {
  console.error('❌ Backend directory not found at:', backendPath);
  process.exit(1);
}

console.log('📂 Backend directory found at:', backendPath);

// Change to backend directory
process.chdir(backendPath);
console.log('📁 Changed to backend directory:', process.cwd());

// Check if package.json exists in backend
const packageJsonPath = path.join(backendPath, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Backend package.json not found at:', packageJsonPath);
  process.exit(1);
}

console.log('✅ Backend package.json found');

// Start the backend server
console.log('🔄 Starting backend server with: npm start');

const child = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true,
  cwd: backendPath
});

child.on('error', (error) => {
  console.error('❌ Failed to start backend:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`🔄 Backend exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  child.kill('SIGTERM');
});
