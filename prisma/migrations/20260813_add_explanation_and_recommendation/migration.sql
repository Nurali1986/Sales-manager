-- Migration: add_explanation_and_fix_recommendation
-- Spec §8: Question modeliga explanation maydoni qo'shish
-- Spec §20: Recommendation enum ga RECOMMEND_INTERVIEW qo'shish

-- 1. explanation maydoni qo'shish (Question)
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "explanation" TEXT;

-- 2. Recommendation enum ga yangi qiymat qo'shish
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'RECOMMEND_INTERVIEW' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Recommendation')
  ) THEN
    ALTER TYPE "Recommendation" ADD VALUE 'RECOMMEND_INTERVIEW';
  END IF;
END $$;
