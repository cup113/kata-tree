export interface Kata {
  id: string;
  number: string;
  title: string;
  description: string;
  exceptions: string[];
  streak: number;
  completed: boolean;
  lastCompleted?: string;
  children: Kata[];
  parentId?: string;
}

export interface KataTreeState {
  rootKata: Kata | null;
  currentStreak: number;
  lastVerificationDate: string | null;
  todayVerified: boolean;
  katasCreatedToday: number;
  lastKataCreationDate: string | null;
  selectedKataId: string | undefined;
  showAddForm: boolean;
  showEditForm: boolean;
  showVerification: boolean;
  showConfirmation: boolean;
  editingKata: Kata | null;
}