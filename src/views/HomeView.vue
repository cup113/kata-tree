<script setup lang="ts">
import KataTree from '@/components/KataTree.vue';
import KataCreateForm from '@/components/KataCreateForm.vue';
import DailyVerification from '@/components/DailyVerification.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import { useKataTreeStore } from '@/stores/kataTree';
import { Button } from '@/components/ui/button';

const kataStore = useKataTreeStore();

const handleAddKata = () => {
  if (!kataStore.selectedKataId) return;

  if (kataStore.katasCreatedToday > 0) {
    kataStore.setConfirmingMultiple(true);
  } else {
    kataStore.setCreatingKata(true);
  }
};

</script>

<template>
  <div>
    <div class="flex justify-center py-4 gap-2">
      <Button @click="handleAddKata" variant="default"
        :disabled="!kataStore.selectedKataId || !kataStore.todayVerified">
        添加子定式
      </Button>
      <DailyVerification />
    </div>

    <main class="mx-auto w-xs md:w-md lg:w-xl flex flex-col gap-4 items-center">
      <KataTree />
      <KataCreateForm v-show="kataStore.stateUI.creatingKata" />
    </main>
    <ConfirmationDialog />
  </div>
</template>
