export interface Kata {
  id: string;
  number: string;
  title: string;
  description: string;
  exceptions: string[];
  streak: number;
  lastCompleted?: string;
  children: Kata[];
  parentId?: string;
}

export interface KataTreeState {
  rootKata: Kata;
  lastVerification: string | null;
  lastKataCreation: string | null;
  currentNumber: number;
  katasCreatedToday: number;
}
