export type UserRole = 'admin' | 'student';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  level: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  tasksCompletedCount: number;
  createdAt: string;
  college?: string;
  year?: string;
  bio?: string;
  githubUrl?: string;
  linkedInUrl?: string;
}

export type TaskDifficulty = 'easy' | 'medium' | 'hard';
export type TaskType = 'daily' | 'weekly';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  difficulty: TaskDifficulty;
  xpReward: number; // Easy: 10, Medium: 20, Hard: 40
  deadline?: string;
  estimatedMinutes?: number;
  starterCode?: Record<string, string>;
  testCases?: Array<{ input: string; expectedOutput: string }>;
  isArchived?: boolean;
  createdBy: string;
  createdAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  taskId: string;
  status: 'completed' | 'in_progress';
  submittedCode?: string;
  xpEarned: number;
  completedAt: string;
}

export type CategoryType = 'dsa' | 'cs_fundamentals' | 'system_design';

export interface StudyTopic {
  id: string;
  name: string; // Arrays, Strings, Linked List, Stack, Queue, Trees, Graphs, DP, OS, DBMS, Computer Networks, OOP, System Design
  category: CategoryType;
  description: string;
  iconName?: string;
  resourceCount?: number;
  createdAt: string;
}

export type MaterialProvider = 'youtube' | 'gfg' | 'github' | 'leetcode' | 'docs' | 'pdf';

export interface StudyMaterial {
  id: string;
  topicId: string;
  title: string;
  type: 'pdf' | 'link';
  url: string;
  provider: MaterialProvider;
  uploadDate: string;
  createdBy: string;
  description?: string;
}

export interface WeeklyPerformer {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  weekLabel: string;
  achievementReason: string;
  publishedAt: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirementType: 'tasks_completed' | 'streak_days' | 'xp_earned';
  requirementValue: number;
  xpBonus: number;
}

export interface MaterialBookmark {
  id: string;
  userId: string;
  materialId: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type?: 'task' | 'achievement' | 'performer' | 'system';
  createdAt: string;
}

export interface Judge0SubmissionResponse {
  token: string;
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status?: {
    id: number;
    description: string;
  };
  time?: string | null;
  memory?: number | null;
}
