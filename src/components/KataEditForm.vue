<template>
  <AlertDialog v-model:open="open">
    <AlertDialogTrigger>
      <Button variant="ghost" size="sm" title="编辑定式">
        <EditIcon />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="text-lg font-semibold">编辑定式</AlertDialogTitle>
      </AlertDialogHeader>

      <KataForm v-if="kata" :initial-data="initialData" title-placeholder="例如: 晨间冥想" submit-button-text="保存修改"
        id-prefix="edit" @submit="handleSubmit" @cancel="handleCancel" />
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKataTreeStore } from '@/stores/kataTree';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { EditIcon } from 'lucide-vue-next';
import type { Kata } from '@/types/kata';
import KataForm from './KataForm.vue';

const props = defineProps<{
  kata: Kata,
}>();

const kataStore = useKataTreeStore();

const open = ref(false);

const initialData = computed(() => ({
  number: props.kata?.number || '',
  title: props.kata?.title || '',
  description: props.kata?.description || '',
  exceptions: props.kata?.exceptions || [],
}));

const handleSubmit = (data: any) => {
  if (!props.kata) return;

  kataStore.editKata(props.kata.id, {
    number: data.number,
    title: data.title,
    description: data.description,
    exceptions: [...data.exceptions],
  });
  open.value = false;
};

const handleCancel = () => {
  open.value = false;
};
</script>
