import { prisma } from '@/lib/db/prisma'
import { AssessmentStage, AssessmentStageType, StageStatus } from '@prisma/client'

export class AssessmentStageService {
  /**
   * Determine the current active stage for the assessment based on stage statuses.
   * Finds the first stage that is NOT_STARTED, IN_PROGRESS, PROCESSING, or ERROR.
   */
  public static getCurrentStage(stages: AssessmentStage[]): AssessmentStageType {
    const sortedStages = [...stages].sort((a, b) => a.order - b.order)
    const current = sortedStages.find(s => s.status !== StageStatus.COMPLETED)
    
    // If all completed, return COMPLETED as a string (handle in API)
    if (!current) {
      return sortedStages[sortedStages.length - 1].type // or handle as completed
    }
    
    return current.type
  }

  /**
   * Checks if the candidate is allowed to access the requested stage type.
   * They can access if it's the current active stage, or if it's already completed.
   */
  public static canAccessStage(stages: AssessmentStage[], requestedStageType: AssessmentStageType): boolean {
    const currentStageType = this.getCurrentStage(stages)
    if (currentStageType === requestedStageType) {
      return true
    }

    const requestedStage = stages.find(s => s.type === requestedStageType)
    if (requestedStage && requestedStage.status === StageStatus.COMPLETED) {
      return true
    }

    return false
  }

  /**
   * Completes a stage and sets its score.
   */
  public static async completeStage(stageId: string, score: number | null = null, maxScore: number | null = null) {
    return prisma.assessmentStage.update({
      where: { id: stageId },
      data: {
        status: StageStatus.COMPLETED,
        completedAt: new Date(),
        score,
        maxScore,
      }
    })
  }

  /**
   * Calculates progress object.
   */
  public static getProgress(stages: AssessmentStage[]) {
    const total = stages.length
    const completed = stages.filter(s => s.status === StageStatus.COMPLETED).length
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  /**
   * Determines the next stage type after the current one.
   */
  public static getNextStage(stages: AssessmentStage[], currentStageType: AssessmentStageType): AssessmentStageType | 'COMPLETED' {
    const sortedStages = [...stages].sort((a, b) => a.order - b.order)
    const currentIndex = sortedStages.findIndex(s => s.type === currentStageType)
    
    if (currentIndex === -1 || currentIndex === sortedStages.length - 1) {
      return 'COMPLETED'
    }
    
    return sortedStages[currentIndex + 1].type
  }
}
