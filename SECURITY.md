# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, email **adam@integralayer.com** with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

You will receive a response within 48 hours.

## Scope

This skill is pure markdown with no runtime code, no dependencies, and no network access. The primary security concern is prompt injection via malicious input text.

## Design Principles

- **No code execution.** The skill is a markdown prompt, not an application
- **No dependencies.** Nothing to audit, nothing to compromise
- **No data collection.** No telemetry, no analytics, no tracking
- **Read then write.** The skill reads your text and writes improved text. It never deletes or modifies other files
