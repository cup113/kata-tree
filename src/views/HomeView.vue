<script setup lang="ts">
import { ref, computed } from 'vue';
import KataTree from '@/components/KataTree.vue';
import KataForm from '@/components/KataForm.vue';
import KataEditForm from '@/components/KataEditForm.vue';
import DailyVerification from '@/components/DailyVerification.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import { useKataTreeStore } from '@/stores/kataTree';
import { Button } from '@/components/ui/button';
import type { Kata } from '@/types/kata';

const kataStore = useKataTreeStore();

const selectedKataId = computed(() => kataStore.selectedKataId);
const showAddForm = computed(() => kataStore.showAddForm);
const showEditForm = computed(() => kataStore.showEditForm);
const showVerification = computed(() => kataStore.showVerification);
const showConfirmation = computed(() => kataStore.showConfirmation);
const katasCreatedToday = computed(() => kataStore.katasCreatedToday);

const handleAddKata = () => {
  if (!selectedKataId.value) return;

  if (katasCreatedToday.value > 0) {
    kataStore.setShowConfirmation(true);
  } else {
    proceedToAddKata();
  }
};

const proceedToAddKata = () => {
  kataStore.setShowAddForm(true);
  kataStore.setShowEditForm(false);
  kataStore.setShowVerification(false);
  kataStore.setShowConfirmation(false);
};

const toggleVerification = () => {
  kataStore.setShowVerification(!showVerification.value);
  kataStore.setShowAddForm(false);
  kataStore.setShowEditForm(false);
};
</script>

<template>
  <div class="kata-container">
    <div class="kata-action-bar">
      <Button @click="handleAddKata" :disabled="!selectedKataId" class="kata-btn kata-btn-primary">
        添加子定式
      </Button>
      <Button @click="toggleVerification" variant="secondary" class="kata-btn kata-btn-secondary">
        {{ showVerification ? '关闭验证' : '每日验证' }}
      </Button>
    </div>

    <div class="kata-main-content">
      <KataTree />

      <div v-if="showAddForm" class="kata-side-panel">
        <KataForm />
      </div>

      <div v-if="showEditForm" class="kata-side-panel">
        <KataEditForm />
      </div>

      <div v-if="showVerification" class="kata-side-panel">
        <DailyVerification />
      </div>
    </div>

    <ConfirmationDialog v-if="showConfirmation" :katas-created-today="katasCreatedToday" @confirm="proceedToAddKata"
      @cancel="kataStore.setShowConfirmation(false)" />
  </div>
</template>

<style scoped>
@media (max-width: 1024px) {
  .kata-main-content {
    grid-template-columns: 1fr;
  }

  .kata-side-panel {
    position: static;
  }
}
</style>
