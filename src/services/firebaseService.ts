import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import {
  UserProfile,
  TaskItem,
  UserProgress,
  StudyTopic,
  StudyMaterial,
  WeeklyPerformer,
} from '@/types';
import { calculateLevel } from '@/lib/utils';

// --- Production Firebase Service API ---

export const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
  return null;
};

export const fetchAllStudents = async (): Promise<UserProfile[]> => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'student'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as UserProfile);
    }
  } catch (error) {
    console.error('Error fetching students:', error);
  }
  return [];
};

export const fetchTasks = async (): Promise<TaskItem[]> => {
  try {
    const snap = await getDocs(collection(db, 'tasks'));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as TaskItem);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
  return [];
};

export const createTaskInFirestore = async (task: TaskItem): Promise<void> => {
  await setDoc(doc(db, 'tasks', task.id), task);
};

export const deleteTaskInFirestore = async (taskId: string): Promise<void> => {
  await deleteDoc(doc(db, 'tasks', taskId));
};

export const markTaskCompleteInFirestore = async (
  userId: string,
  task: TaskItem,
  submittedCode?: string
): Promise<{ newXp: number; newLevel: number; streak: number }> => {
  const progressId = `${userId}_${task.id}`;
  const progressRef = doc(db, 'progress', progressId);
  const userRef = doc(db, 'users', userId);

  const userSnap = await getDoc(userRef);
  let currentXp = 0;
  let currentStreak = 1;

  if (userSnap.exists()) {
    const userData = userSnap.data() as UserProfile;
    currentXp = userData.xp || 0;
    currentStreak = (userData.currentStreak || 0) + 1;
  }

  const addedXp = task.xpReward;
  const newXp = currentXp + addedXp;
  const newLevel = calculateLevel(newXp);

  const progressData: UserProgress = {
    id: progressId,
    userId,
    taskId: task.id,
    status: 'completed',
    submittedCode: submittedCode || '',
    xpEarned: addedXp,
    completedAt: new Date().toISOString(),
  };

  await setDoc(progressRef, progressData);
  await updateDoc(userRef, {
    xp: newXp,
    level: newLevel,
    currentStreak: currentStreak,
    longestStreak: Math.max(currentStreak, (userSnap.data()?.longestStreak || 0)),
    tasksCompletedCount: (userSnap.data()?.tasksCompletedCount || 0) + 1,
  });

  return { newXp, newLevel, streak: currentStreak };
};

export const fetchUserProgress = async (userId: string): Promise<UserProgress[]> => {
  try {
    const q = query(collection(db, 'progress'), where('userId', '==', userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as UserProgress);
    }
  } catch (error) {
    console.error('Error fetching user progress:', error);
  }
  return [];
};

export const fetchTopics = async (): Promise<StudyTopic[]> => {
  try {
    const snap = await getDocs(collection(db, 'topics'));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as StudyTopic);
    }
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
  return [];
};

export const fetchMaterials = async (): Promise<StudyMaterial[]> => {
  try {
    const snap = await getDocs(collection(db, 'materials'));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as StudyMaterial);
    }
  } catch (error) {
    console.error('Error fetching materials:', error);
  }
  return [];
};

export const uploadFileToFirebaseStorage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const publishWeeklyPerformer = async (performer: WeeklyPerformer): Promise<void> => {
  await setDoc(doc(db, 'performers', performer.id), performer);
};

export const fetchWeeklyPerformer = async (): Promise<WeeklyPerformer | null> => {
  try {
    const q = query(collection(db, 'performers'), orderBy('publishedAt', 'desc'), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as WeeklyPerformer;
    }
  } catch (error) {
    console.error('Error fetching weekly performer:', error);
  }
  return null;
};
