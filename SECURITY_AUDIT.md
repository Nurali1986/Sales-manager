# Security Audit - AI Sales Recruitment Assessment Platform MVP

## Overview
This audit assesses the core safety, stability, and authentication measures in the Pifagor Sales MVP deployment.

### Authentication & Sessions
- **Severity**: MEDIUM (Previously CRITICAL before fixes)
- **Location**: `/api/hr/auth/login`, `src/lib/auth/session.ts`
- **Problem**: Login rate-limiting and route-protection were initially absent.
- **Fix**: Added rate limiting (5 attempts/15 mins per IP), secure server-side HTTPOnly cookie handling, and edge `middleware.ts` to block unauthenticated access automatically.
- **Status**: **RESOLVED**

### Authorization & Tenant Isolation
- **Severity**: CRITICAL
- **Location**: `/api/hr/vacancies/*`, `/api/hr/candidates/*`
- **Problem**: Need to ensure HR users cannot access cross-company candidate information.
- **Fix**: Database-level object boundaries exist in Prisma queries enforcing `job: { companyId }` verification on all targeted candidate reads and list paginations.
- **Status**: **RESOLVED**

### Candidate Token Security
- **Severity**: LOW
- **Location**: `/api/assessment/[token]`
- **Problem**: Must ensure unpredictable tokens scope to exact assessment sessions.
- **Fix**: `crypto.randomUUID()` generates unique 128-bit unguessable keys at creation time which are strictly validated server-side against known stages.
- **Status**: **RESOLVED**

### Input Validation & Limits
- **Severity**: HIGH
- **Location**: `src/lib/validations/candidate.ts`
- **Problem**: Zod validations previously lacked upper bounds.
- **Fix**: Max character limits added (10,000 for Case, 15,000 for Script) and max fileSize limits set (100MB for video/cv). 
- **Status**: **RESOLVED**

### AI Idempotency
- **Severity**: MEDIUM
- **Location**: `src/lib/ai/EvaluationService.ts`
- **Problem**: Rapid concurrent candidate clicks on `submit` could theoretically queue parallel evaluation processes for the same stage, incurring redundant Gemini API costs.
- **Fix**: Added an atomic in-memory lock `evalLocks.add()` wrapped securely in `try...finally` to ensure strict single-execution semantics.
- **Status**: **RESOLVED**

### File Security & Signed URLs
- **Severity**: MEDIUM
- **Location**: `video/upload-url`, `cv/upload-url`
- **Problem**: Must not store publicly writable or readable static paths.
- **Fix**: `upload-url` routes enforce token auth first, then generate a securely namespaced UUID key `assessments/[id]/candidate/[id]/cv/[uuid]`. 
- **Status**: **RESOLVED**

### Production Configuration
- **Severity**: HIGH
- **Location**: `middleware.ts`, `route.ts`, `.env`
- **Problem**: API Keys and JWT secrets must not leak.
- **Fix**: `env.ts` requires validation, preventing server launch without valid secrets. No variables are exposed with `NEXT_PUBLIC_` dynamically except safe ones.
- **Status**: **RESOLVED**
