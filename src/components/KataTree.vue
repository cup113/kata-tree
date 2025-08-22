<template>
  <div class="w-full">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-2xl font-bold">定式树</CardTitle>
        <div class="flex gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-muted-foreground">连续天数:</span>
            <span class="text-sm font-semibold">{{ currentStreak }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-muted-foreground">今日验证:</span>
            <span :class="['text-sm font-semibold', todayVerified ? 'text-green-600' : 'text-orange-600']">
              {{ todayVerified ? '已完成' : '待验证' }}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent class="p-4">
        <KataTreeNode :kata="rootKata" />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useKataTreeStore } from '@/stores/kataTree';
import KataTreeNode from './KataTreeNode.vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

defineProps<{}>();

const kataStore = useKataTreeStore();

const rootKata = computed(() => kataStore.rootKata);
const currentStreak = computed(() => kataStore.currentStreak);
const todayVerified = computed(() => kataStore.todayVerified);
</script>
