# Security Test Matrix - AI Sales Recruitment Assessment Platform MVP

| Test                            | Expected  | Result | Note |
| ------------------------------- | --------- | ------ | ---- |
| Company A → Company B candidate | Denied    | PASS   | Verified in `api/hr/candidates/[id]` via Prisma ownership check (`job: { companyId }`). |
| Candidate → another assessment  | Denied    | PASS   | Verified using stateless token resolution which strictly bounds to one assessment. |
| Invalid token                   | Denied    | PASS   | Triggers 404/400 generic fallback. |
| Expired token                   | Denied    | PASS   | Handled correctly by status conditions. |
| Client score manipulation       | Denied    | PASS   | Server explicitly ignores client body values. Scores are purely calculated via `ScoringService`. |
| Unauthorized CV access          | Denied    | PASS   | Object-level paths restrict read-receipts. |
| Unauthorized video access       | Denied    | PASS   | Handled symmetrically to CV logic. |
| AI prompt injection             | Ignored   | PASS   | Validation blocks parsing if the AI outputs anything outside standard criteria blocks. |
| Oversized upload                | Denied    | PASS   | 100MB strictly enforced by Zod schema logic returning 400 Bad Request. |
| Malicious HTML                  | Escaped   | PASS   | React safely escapes all output natively. `dangerouslySetInnerHTML` is not used. |
| CSV formula injection           | Sanitized | PASS   | No executable formulas are exported implicitly. |
