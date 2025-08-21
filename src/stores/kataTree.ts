import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { Kata, KataTreeState } from '@/types/kata';

export const useKataTreeStore = defineStore('kataTree', () => {
  const state = useLocalStorage<KataTreeState>('KTT_tree_state', {
    rootKata: null,
    currentStreak: 0,
    lastVerificationDate: null,
    todayVerified: false,
    katasCreatedToday: 0,
    lastKataCreationDate: null,
    selectedKataId: undefined as string | undefined,
    showAddForm: false,
    showEditForm: false,
    showVerification: false,
    showConfirmation: false,
    editingKata: null as Kata | null,
  });

  const rootKata = computed(() => state.value.rootKata);
  const currentStreak = computed(() => state.value.currentStreak);
  const todayVerified = computed(() => state.value.todayVerified);
  const katasCreatedToday = computed(() => state.value.katasCreatedToday);
  const selectedKataId = computed(() => state.value.selectedKataId);
  const showAddForm = computed(() => state.value.showAddForm);
  const showEditForm = computed(() => state.value.showEditForm);
  const showVerification = computed(() => state.value.showVerification);
  const showConfirmation = computed(() => state.value.showConfirmation);
  const editingKata = computed(() => state.value.editingKata);

  function initializeTree() {
    if (!state.value.rootKata) {
      state.value.rootKata = {
        id: 'root',
        number: '001',
        title: '根基',
        description: '每日基础练习',
        exceptions: [],
        streak: 0,
        completed: false,
        children: [],
      };
    }
  }

  function addKata(parentId: string, kataData: Omit<Kata, 'id' | 'children' | 'streak' | 'completed'>) {
    const parent = findKataById(parentId);
    if (!parent) return false;

    const newKata: Kata = {
      ...kataData,
      id: generateId(),
      children: [],
      streak: 0,
      completed: false,
    };

    parent.children.push(newKata);
    updateKataCreationCount();
    return true;
  }

  function findKataById(id: string, kata: Kata | null = state.value.rootKata): Kata | null {
    if (!kata) return null;
    if (kata.id === id) return kata;

    for (const child of kata.children) {
      const found = findKataById(id, child);
      if (found) return found;
    }

    return null;
  }

  function verifyKata(kataId: string, completed: boolean, exception?: string) {
    const kata = findKataById(kataId);
    if (!kata) return false;

    if (completed) {
      kata.completed = true;
      kata.lastCompleted = new Date().toISOString();
      kata.streak += 1;
    } else {
      if (exception) {
        kata.exceptions.push(exception);
      } else {
        removeChildren(kata);
      }
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

    state.value.todayVerified = true;
    state.value.lastVerificationDate = new Date().toISOString();

    return allCompleted;
  }

  function checkAllKatasCompleted(kata: Kata): boolean {
    if (!kata.completed) return false;

    for (const child of kata.children) {
      if (!checkAllKatasCompleted(child)) return false;
    }

    return true;
  }

  function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  function resetDailyVerification() {
    const today = new Date().toDateString();
    const lastVerification = state.value.lastVerificationDate;

    if (lastVerification && new Date(lastVerification).toDateString() !== today) {
      state.value.todayVerified = false;
    }

    resetDailyKataCreation();
  }

  function resetDailyKataCreation() {
    const today = new Date().toDateString();
    const lastCreation = state.value.lastKataCreationDate;

    if (lastCreation && new Date(lastCreation).toDateString() !== today) {
      state.value.katasCreatedToday = 0;
    }
  }

  function updateKataCreationCount() {
    const today = new Date().toDateString();
    const lastCreation = state.value.lastKataCreationDate;

    if (lastCreation && new Date(lastCreation).toDateString() === today) {
      state.value.katasCreatedToday += 1;
    } else {
      state.value.katasCreatedToday = 1;
    }

    state.value.lastKataCreationDate = new Date().toDateString();
  }

  function editKata(kataId: string, kataData: Partial<Kata>) {
    const kata = findKataById(kataId);
    if (!kata) return false;

    Object.assign(kata, kataData);
    return true;
  }

  function setSelectedKataId(kataId: string | undefined) {
    state.value.selectedKataId = kataId;
  }

  function setShowAddForm(show: boolean) {
    state.value.showAddForm = show;
  }

  function setShowEditForm(show: boolean) {
    state.value.showEditForm = show;
  }

  function setShowVerification(show: boolean) {
    state.value.showVerification = show;
  }

  function setShowConfirmation(show: boolean) {
    state.value.showConfirmation = show;
  }

  function setEditingKata(kata: Kata | null) {
    state.value.editingKata = kata;
  }

  function resetUIState() {
    state.value.showAddForm = false;
    state.value.showEditForm = false;
    state.value.showVerification = false;
    state.value.showConfirmation = false;
    state.value.editingKata = null;
  }

  return {
    state,
    rootKata,
    currentStreak,
    todayVerified,
    katasCreatedToday,
    selectedKataId,
    showAddForm,
    showEditForm,
    showVerification,
    showConfirmation,
    editingKata,
    initializeTree,
    addKata,
    findKataById,
    verifyKata,
    verifyAllKatas,
    resetDailyVerification,
    resetDailyKataCreation,
    updateKataCreationCount,
    editKata,
    setSelectedKataId,
    setShowAddForm,
    setShowEditForm,
    setShowVerification,
    setShowConfirmation,
    setEditingKata,
    resetUIState,
  };
});