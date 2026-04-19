export type UserProgress = {
  lessons: Record<string, { viewedAt: string }>;
  exercises: Record<string, { passedAt: string }>;
};
