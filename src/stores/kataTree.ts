import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import type { Kata, KataTreeState } from '@/types/kata';

export const useKataTreeStore = defineStore('kataTree', () => {
  const DEFAULT_ROOT_KATA = {
    id: 'root',
    number: '000',
    title: '慎始敬终',
    description: '每天添加至少一个定式',
    exceptions: [],
    streak: 0,
    completed: false,
    children: [],
  };
  const preferences = useLocalStorage('KTT_pref', {
    dayStart: 3, // o'clock
  });
  const state = useLocalStorage<KataTreeState>('KTT_tree_state', {
    rootKata: DEFAULT_ROOT_KATA,
    currentStreak: 0,
    lastVerification: null,
    lastKataCreation: null,
    currentNumber: 1,
    katasCreatedToday: 0,
  });
  const stateUI = reactive({
    confirmingAddMultiple: false,
    creatingKata: false,
    selectedParentId: null as null | string,
  });

  const rootKata = computed(() => state.value.rootKata);
  const currentStreak = computed(() => state.value.currentStreak);
  const todayVerified = computed(() => getDate(state.value.lastVerification) === getToday());
  const katasCreatedToday = computed(() => state.value.katasCreatedToday);
  const currentNumber = computed(() => state.value.currentNumber);

  function getToday(): string {
    return dayjs().subtract(preferences.value.dayStart, 'hours').format("YYYY/MM/DD");
  }

  function getDate(str: string | null): string | null {
    if (str === null) {
      return null;
    }
    return dayjs(str).subtract(preferences.value.dayStart, 'hours').format("YYYY/MM/DD");
  }

  function addKata(parentId: string, kataData: Omit<Kata, 'id' | 'children' | 'streak' | 'completed'>) {
    const parent = findKataById(parentId);
    if (!parent) {
      return false;
    }

    const newKata: Kata = {
      ...kataData,
      id: nanoid(),
      children: [],
      streak: 0,
      completed: false,
    };

    parent.children.push(newKata);
    state.value.currentNumber += 1;
    const today = getToday();

    if (getDate(state.value.lastVerification) === today) {
      state.value.katasCreatedToday += 1;
    } else {
      state.value.katasCreatedToday = 1;
    }

    state.value.lastVerification = dayjs().toISOString();
    return true;
  }

  function findKataById(id: string, _kata?: Kata): Kata | null {
    const kata = _kata ?? rootKata.value;
    if (!kata) {
      return null;
    }
    if (kata.id === id) {
      return kata;
    }

    for (const child of kata.children) {
      const found = findKataById(id, child);
      if (found) {
        return found;
      }
    }

    return null;
  }

  function verifyKata(kataId: string, completed: boolean, exception?: string) {
    const kata = findKataById(kataId);
    if (!kata) {
      return false;
    }

    if (completed) {
      kata.completed = true;
      kata.lastCompleted = dayjs().toISOString();
      kata.streak += 1;
    } else if (exception) {
      kata.exceptions.push(exception);
      kata.completed = true;
      kata.lastCompleted = dayjs().toISOString();
      kata.streak += 1;
    } else {
      removeChildren(kata);
      kata.completed = false;
      kata.streak = 0;
    }

    return true;
  }

  function removeChildren(kata: Kata) {
    kata.children = [];
  }

  function verifyAllKatas() {
    if (!state.value.rootKata) return false;

    const allCompleted = checkAllKatasCompleted(state.value.rootKata);

    if (allCompleted) {
      state.value.currentStreak += 1;
    } else {
      state.value.currentStreak = 0;
    }

    state.value.lastVerification = dayjs().toISOString();

    return allCompleted;
  }

  function checkAllKatasCompleted(kata: Kata): boolean {
    return kata.completed && kata.children.every(child => checkAllKatasCompleted(child));
  }

  function editKata(kataId: string, kataData: Partial<Kata>) {
    const kata = findKataById(kataId);
    if (!kata) {
      return false;
    }

    Object.assign(kata, kataData);
    return true;
  }

  function selectParent(kataId: string | null) {
    stateUI.selectedParentId = kataId;
  }

  function setCreatingKata(adding: boolean) {
    stateUI.creatingKata = adding;
  }

  function setConfirmingMultiple(confirming: boolean) {
    stateUI.confirmingAddMultiple = confirming;
  }

  function backupData() {
    const backupData = {
      state: state.value,
      preferences: preferences.value,
      timestamp: dayjs().toISOString(),
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kata-tree-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  return {
    state,
    rootKata,
    currentStreak,
    todayVerified,
    katasCreatedToday,
    stateUI,
    currentNumber,
    addKata,
    findKataById,
    verifyKata,
    verifyAllKatas,
    editKata,
    selectParent,
    setConfirmingMultiple,
    setCreatingKata,
    backupData,
  };
});
