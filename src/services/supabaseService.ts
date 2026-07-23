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
      const profile = {
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
      if (typeof window !== 'undefined') {
        localStorage.setItem(`skilldev_user_${uid}`, JSON.stringify(profile));
      }
      return profile;
    }
  } catch (err) {
    console.error('Error fetching Supabase user profile:', err);
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`skilldev_user_${uid}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
  }
  return null;
};

export const fetchAllStudents = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('role', 'student');
    if (!error && data) {
      const list = data.map((d) => ({
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('skilldev_persisted_students', JSON.stringify(list));
      }
      return list;
    }
  } catch (err) {
    console.error('Error fetching Supabase students:', err);
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('skilldev_persisted_students');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
  }
  return [];
};

export const fetchTasks = async (): Promise<TaskItem[]> => {
  try {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      const list = data.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        category: d.category || 'dsa',
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('skilldev_persisted_tasks', JSON.stringify(list));
      }
      return list;
    } else if (error) {
      console.warn('Supabase fetchTasks notice:', error.message);
    }
  } catch (err) {
    console.error('Error fetching Supabase tasks:', err);
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('skilldev_persisted_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
  }
  return [];
};

export const createTaskInSupabase = async (task: TaskItem): Promise<{ success: boolean; error?: string }> => {
  try {
    const payload: any = {
      id: task.id,
      title: task.title,
      description: task.description,
      category: task.category || 'dsa',
      difficulty: task.difficulty,
      type: task.type,
      xp_reward: task.xpReward,
      starter_code: task.starterCode || null,
      test_cases: task.testCases || null,
      deadline: task.deadline || 'Today midnight',
      is_archived: false,
    };

    const { error } = await supabase.from('tasks').insert(payload).select();

    if (error) {
      console.error('Supabase task insert error:', error.message);
      return { success: false, error: error.message };
    }

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skilldev_persisted_tasks');
      let list: TaskItem[] = saved ? JSON.parse(saved) : [];
      list = [task, ...list.filter((t) => t.id !== task.id)];
      localStorage.setItem('skilldev_persisted_tasks', JSON.stringify(list));
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error inserting task into Supabase:', err);
    return { success: false, error: err.message || 'Unknown network error' };
  }
};

export const deleteTaskInSupabase = async (taskId: string): Promise<void> => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('skilldev_persisted_tasks');
    if (saved) {
      const list: TaskItem[] = JSON.parse(saved);
      localStorage.setItem(
        'skilldev_persisted_tasks',
        JSON.stringify(list.filter((t) => t.id !== taskId))
      );
    }
  }

  try {
    await supabase.from('tasks').delete().eq('id', taskId);
  } catch (err) {
    console.error('Error deleting task from Supabase:', err);
  }
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

  try {
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
  } catch (e) {
    console.error('Error updating progress in Supabase:', e);
  }

  return { newXp, newLevel, streak: currentStreak };
};

export const fetchUserProgress = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('progress')
      .select('task_id')
      .eq('user_id', userId)
      .eq('status', 'completed');
      
    if (!error && data) {
      return data.map((row) => row.task_id);
    }
  } catch (err) {
    console.error('Error fetching user progress:', err);
  }
  return [];
};

export const fetchTopics = async (): Promise<StudyTopic[]> => {
  try {
    const { data, error } = await supabase.from('topics').select('*');
    if (!error && data) {
      const list = data.map((d) => ({
        id: d.id,
        name: d.name,
        category: d.category,
        description: d.description,
        resourceCount: d.resource_count,
        createdAt: d.created_at,
      }));
      if (typeof window !== 'undefined') {
        localStorage.setItem('skilldev_persisted_topics', JSON.stringify(list));
      }
      return list;
    }
  } catch (err) {
    console.error('Error fetching Supabase topics:', err);
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('skilldev_persisted_topics');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
  }
  return [];
};

export const fetchMaterials = async (): Promise<StudyMaterial[]> => {
  try {
    const { data, error } = await supabase.from('materials').select('*');
    if (!error && data) {
      const list = data.map((d) => ({
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('skilldev_persisted_materials', JSON.stringify(list));
      }
      return list;
    }
  } catch (err) {
    console.error('Error fetching Supabase materials:', err);
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('skilldev_persisted_materials');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
  }
  return [];
};

export const uploadFileToSupabaseStorage = async (file: File, bucket: string): Promise<string> => {
  const filePath = `${Date.now()}_${file.name}`;
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (!error && data) {
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return publicUrlData.publicUrl;
    }
  } catch (e) {
    console.error('Storage upload error:', e);
  }
  return URL.createObjectURL(file);
};

export const publishWeeklyPerformer = async (performer: WeeklyPerformer): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('skilldev_persisted_performer', JSON.stringify(performer));
  }

  try {
    await supabase.from('performers').insert({
      id: performer.id,
      student_id: performer.studentId,
      student_name: performer.studentName,
      student_avatar: performer.studentAvatar,
      week_label: performer.weekLabel,
      achievement_reason: performer.achievementReason,
      published_at: performer.publishedAt,
    });
  } catch (err) {
    console.error('Error publishing performer to Supabase:', err);
  }
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
      const perf = {
        id: d.id,
        studentId: d.student_id,
        studentName: d.student_name,
        studentAvatar: d.student_avatar,
        weekLabel: d.week_label,
        achievementReason: d.achievement_reason,
        publishedAt: d.published_at,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('skilldev_persisted_performer', JSON.stringify(perf));
      }
      return perf;
    }
  } catch (err) {
    console.error('Error fetching Supabase weekly performer:', err);
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('skilldev_persisted_performer');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
  }
  return null;
};
