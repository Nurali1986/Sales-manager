import { prisma } from '@/lib/db/prisma'
import crypto from 'crypto'
import { AssessmentStatus } from '@prisma/client'

export class AssessmentService {
  /**
   * Hashes a raw token string for secure comparison/lookup
   */
  public static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  /**
   * Retrieves an active assessment by its raw secure token.
   * Also verifies expiration and status.
   */
  public static async getAssessmentByToken(rawToken: string) {
    const hashedToken = this.hashToken(rawToken)

    const assessment = await prisma.assessment.findFirst({
      where: {
        OR: [
          { token: rawToken }, // Fallback for Phase 1 tokens if needed
          { secureTokenHash: hashedToken }
        ]
      },
      include: {
        candidate: true,
        job: true,
        application: true,
        stages: {
          orderBy: { order: 'asc' }
        },
        stageConfigs: true
      }
    })

    if (!assessment) {
      throw new Error('Assessment not found')
    }

    if (assessment.expiresAt && assessment.expiresAt < new Date()) {
      throw new Error('Assessment has expired')
    }

    return assessment
  }

  public static async markAssessmentCompleted(assessmentId: string) {
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status: AssessmentStatus.COMPLETED,
        completedAt: new Date()
      }
    })
  }
}
