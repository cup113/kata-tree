<script setup lang="ts">
import { useKataTreeStore } from '@/stores/kataTree';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-vue-next';

const kataStore = useKataTreeStore();

const handleBackup = () => {
  kataStore.backupData();
};
</script>

<template>
  <Button @click="handleBackup" variant="outline" size="sm">
    <Download class="w-4 h-4" />
    备份
  </Button>
</template>