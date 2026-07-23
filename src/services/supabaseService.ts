import { supabase } from '@/lib/supabase/client';
import {
  UserProfile,
  TaskItem,
  UserProgress,
  StudyTopic,
  StudyMaterial,
  WeeklyPerformer,
} from '@/types';
import { calculateLevel } from '@/lib/utils';

// --- Production Supabase Database & Storage Service API ---

export const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('uid', uid).single();
    if (!error && data) {
      return {
        uid: data.uid,
        email: data.email,
        displayName: data.display_name,
        role: data.role,
        college: data.college,
        year: data.year,
        avatarUrl: data.avatar_url,
        level: data.level,
        xp: data.xp,
        currentStreak: data.current_streak,
        longestStreak: data.longest_streak,
        tasksCompletedCount: data.tasks_completed_count,
        bio: data.bio,
        createdAt: data.created_at,
      } as UserProfile;
    }
  } catch (err) {
    console.error('Error fetching Supabase user profile:', err);
  }
  return null;
};

export const fetchAllStudents = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('role', 'student');
    if (!error && data) {
      return data.map((d) => ({
        uid: d.uid,
        email: d.email,
        displayName: d.display_name,
        role: d.role,
        college: d.college,
        year: d.year,
        avatarUrl: d.avatar_url,
        level: d.level,
        xp: d.xp,
        currentStreak: d.current_streak,
        longestStreak: d.longest_streak,
        tasksCompletedCount: d.tasks_completed_count,
        bio: d.bio,
        createdAt: d.created_at,
      }));
    }
  } catch (err) {
    console.error('Error fetching Supabase students:', err);
  }
  return [];
};

export const fetchTasks = async (): Promise<TaskItem[]> => {
  try {
    const { data, error } = await supabase.from('tasks').select('*');
    if (!error && data) {
      return data.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        category: d.category,
        difficulty: d.difficulty,
        type: d.type,
        xpReward: d.xp_reward,
        starterCode: d.starter_code,
        testCases: d.test_cases,
        deadline: d.deadline,
        isArchived: d.is_archived,
        createdBy: d.created_by || 'Admin',
        createdAt: d.created_at,
      }));
    }
  } catch (err) {
    console.error('Error fetching Supabase tasks:', err);
  }
  return [];
};

export const createTaskInSupabase = async (task: TaskItem): Promise<void> => {
  await supabase.from('tasks').insert({
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.category || 'dsa',
    difficulty: task.difficulty,
    type: task.type,
    xp_reward: task.xpReward,
    starter_code: task.starterCode,
    test_cases: task.testCases,
    deadline: task.deadline,
    is_archived: task.isArchived || false,
    created_by: task.createdBy || 'Admin',
    created_at: task.createdAt,
  });
};

export const deleteTaskInSupabase = async (taskId: string): Promise<void> => {
  await supabase.from('tasks').delete().eq('id', taskId);
};

export const markTaskCompleteInSupabase = async (
  userId: string,
  task: TaskItem,
  submittedCode?: string
): Promise<{ newXp: number; newLevel: number; streak: number }> => {
  const progressId = `${userId}_${task.id}`;
  const existingUser = await fetchUserProfile(userId);

  const currentXp = existingUser?.xp || 0;
  const currentStreak = (existingUser?.currentStreak || 0) + 1;
  const addedXp = task.xpReward;
  const newXp = currentXp + addedXp;
  const newLevel = calculateLevel(newXp);

  await supabase.from('progress').upsert({
    id: progressId,
    user_id: userId,
    task_id: task.id,
    status: 'completed',
    submitted_code: submittedCode || '',
    xp_earned: addedXp,
    completed_at: new Date().toISOString(),
  });

  await supabase.from('users').update({
    xp: newXp,
    level: newLevel,
    current_streak: currentStreak,
    longest_streak: Math.max(currentStreak, existingUser?.longestStreak || 0),
    tasks_completed_count: (existingUser?.tasksCompletedCount || 0) + 1,
  }).eq('uid', userId);

  return { newXp, newLevel, streak: currentStreak };
};

export const fetchTopics = async (): Promise<StudyTopic[]> => {
  try {
    const { data, error } = await supabase.from('topics').select('*');
    if (!error && data) {
      return data.map((d) => ({
        id: d.id,
        name: d.name,
        category: d.category,
        description: d.description,
        resourceCount: d.resource_count,
        createdAt: d.created_at,
      }));
    }
  } catch (err) {
    console.error('Error fetching Supabase topics:', err);
  }
  return [];
};

export const fetchMaterials = async (): Promise<StudyMaterial[]> => {
  try {
    const { data, error } = await supabase.from('materials').select('*');
    if (!error && data) {
      return data.map((d) => ({
        id: d.id,
        topicId: d.topic_id,
        title: d.title,
        type: d.type,
        url: d.url,
        provider: d.provider,
        description: d.description,
        createdBy: d.created_by,
        uploadDate: d.upload_date,
      }));
    }
  } catch (err) {
    console.error('Error fetching Supabase materials:', err);
  }
  return [];
};

export const uploadFileToSupabaseStorage = async (file: File, bucket: string): Promise<string> => {
  const filePath = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
  if (error) {
    console.error('Supabase Storage upload error:', error);
    return URL.createObjectURL(file);
  }
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrlData.publicUrl;
};

export const publishWeeklyPerformer = async (performer: WeeklyPerformer): Promise<void> => {
  await supabase.from('performers').insert({
    id: performer.id,
    student_id: performer.studentId,
    student_name: performer.studentName,
    student_avatar: performer.studentAvatar,
    week_label: performer.weekLabel,
    achievement_reason: performer.achievementReason,
    published_at: performer.publishedAt,
  });
};

export const fetchWeeklyPerformer = async (): Promise<WeeklyPerformer | null> => {
  try {
    const { data, error } = await supabase
      .from('performers')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(1);
    if (!error && data && data.length > 0) {
      const d = data[0];
      return {
        id: d.id,
        studentId: d.student_id,
        studentName: d.student_name,
        studentAvatar: d.student_avatar,
        weekLabel: d.week_label,
        achievementReason: d.achievement_reason,
        publishedAt: d.published_at,
      };
    }
  } catch (err) {
    console.error('Error fetching Supabase weekly performer:', err);
  }
  return null;
};
