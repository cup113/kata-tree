<template>
  <div class="container mx-auto p-4">
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
      <CardContent v-if="rootKata" class="p-4">
        <KataTreeNode :kata="rootKata" />
      </CardContent>
      <CardContent v-else class="text-center py-10">
        <p class="text-muted-foreground mb-4">暂无定式，请先初始化树</p>
        <Button @click="initializeTree" class="bg-primary text-primary-foreground hover:bg-primary/90 mt-4">初始化定式树</Button>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useKataTreeStore } from '@/stores/kataTree';
import KataTreeNode from './KataTreeNode.vue';
import type { Kata } from '@/types/kata';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

defineProps<{}>();

const kataStore = useKataTreeStore();

const rootKata = computed(() => kataStore.rootKata);
const currentStreak = computed(() => kataStore.currentStreak);
const todayVerified = computed(() => kataStore.todayVerified);
const selectedKataId = computed(() => kataStore.selectedKataId);

const initializeTree = () => {
  kataStore.initializeTree();
};

onMounted(() => {
  kataStore.resetDailyVerification();
});
</script>
