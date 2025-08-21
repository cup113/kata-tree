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
  rootKata: Kata;
  currentStreak: number;
  lastVerificationDate: string | null;
  todayVerified: boolean;
  currentNumber: number;
  katasCreatedToday: number;
  lastKataCreationDate: string | null;
  selectedKataId: string | undefined;
}
