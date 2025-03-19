#!/usr/bin/env node

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import typescript from 'typescript';

// Ensure dist directory exists
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist', { recursive: true });
}

// Clean dist directory
console.log('🧹 Cleaning dist directory...');
fs.readdirSync('./dist').forEach(file => {
  fs.rmSync(path.join('./dist', file), { recursive: true, force: true });
});

// Run TypeScript compiler using the API
console.log('🔨 Compiling TypeScript...');
const configPath = path.resolve('./tsconfig.build.json');

// Read and parse the tsconfig.build.json file
const configFile = typescript.readConfigFile(configPath, typescript.sys.readFile);
if (configFile.error) {
  console.error('❌ Error reading TypeScript configuration:');
  console.error(typescript.formatDiagnostic(configFile.error, formatHost));
  process.exit(1);
}

// Parse the config content
const parsedConfig = typescript.parseJsonConfigFileContent(
  configFile.config,
  typescript.sys,
  path.dirname(configPath)
);

if (parsedConfig.errors.length > 0) {
  console.error('❌ Error parsing TypeScript configuration:');
  console.error(typescript.formatDiagnostics(parsedConfig.errors, formatHost));
  process.exit(1);
}

// Create a program and emit
const program = typescript.createProgram(parsedConfig.fileNames, parsedConfig.options);
const emitResult = program.emit();

// Report any errors
const allDiagnostics = typescript.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

// Format host to improve error messages
const formatHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: typescript.sys.getCurrentDirectory,
  getNewLine: () => typescript.sys.newLine
};

if (allDiagnostics.length > 0) {
  console.error('❌ TypeScript compilation errors:');
  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      const message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.error(typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
  });
  process.exit(1);
}

// Copy package files
console.log('📝 Copying package files...');
const filesToCopy = ['package.json', 'README.md', 'LICENSE'];
filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('./dist', file));
    console.log(`Copied ${file} to dist`);
  }
});

// Update package.json in dist
console.log('📦 Updating package.json...');
const packageJsonPath = path.join('./dist', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Change main and types paths
  packageJson.main = 'index.js';
  packageJson.types = 'index.d.ts';
  
  // Remove development dependencies and scripts
  delete packageJson.devDependencies;
  delete packageJson.scripts;
  
  // Remove module field if it exists (since we're compiling to CommonJS)
  delete packageJson.module;
  
  // Update version field from environment variable if present
  if (process.env.NEW_VERSION) {
    packageJson.version = process.env.NEW_VERSION;
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
}

console.log('✅ Build completed successfully!');