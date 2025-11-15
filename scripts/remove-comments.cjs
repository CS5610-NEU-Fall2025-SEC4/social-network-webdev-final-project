#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const strip = require('strip-comments')

const ROOT = process.cwd()
const EXCLUDE_DIRS = new Set(['node_modules', '.next', 'standalone'])
const INCLUDED_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.mts', '.cjs'])

function shouldProcess(filePath) {
  const ext = path.extname(filePath)
  return INCLUDED_EXT.has(ext)
}

function stripFile(filePath) {
  try {
    const original = fs.readFileSync(filePath, 'utf8')
    const without = strip(original, { preserve: false })
    if (without !== original) {
      fs.writeFileSync(filePath, without, 'utf8')
      console.log(`Stripped comments: ${path.relative(ROOT, filePath)}`)
    }
  } catch (e) {
    console.error(`Failed to strip ${filePath}:`, e.message)
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
    } else if (entry.isFile() && shouldProcess(full)) {
      stripFile(full)
    }
  }
}

walk(ROOT)
console.log('Comment stripping complete.')
