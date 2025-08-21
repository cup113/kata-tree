<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">添加新定式</CardTitle>
    </CardHeader>
    <CardContent>
      <KataForm
        :initial-data="initialData"
        submit-button-text="添加定式"
        id-prefix="create"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useKataTreeStore } from '@/stores/kataTree';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import KataForm from './KataForm.vue';

defineProps<{}>();

const kataStore = useKataTreeStore();

const selectedParentId = computed(() => kataStore.stateUI.selectedParentId);

const initialData = computed(() => ({
  number: kataStore.currentNumber.toString().padStart(3, '0'),
  title: '',
  description: '',
  exceptions: [],
}));

const handleSubmit = (data: any) => {
  if (!selectedParentId.value) return;

  const success = kataStore.addKata(selectedParentId.value, {
    number: data.number,
    title: data.title,
    description: data.description,
    exceptions: [...data.exceptions],
    parentId: selectedParentId.value,
  });

  if (success) {
    kataStore.setCreatingKata(false);
    kataStore.selectParent(null);
  }
};

const handleCancel = () => {
  kataStore.setCreatingKata(false);
};
</script>
