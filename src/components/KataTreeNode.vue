<template>
  <div class="ml-4">
    <div class="p-3 rounded-lg border cursor-pointer transition-colors" :class="{ 'bg-blue-50 border-blue-200': isSelected }" @click="selectKata">
      <div class="flex items-center gap-2 mb-2">
        <span class="font-mono text-sm font-semibold text-primary">{{ kata.number }}</span>
        <span class="font-medium">{{ kata.title }}</span>
        <Badge v-if="kata.streak > 0" class="ml-auto bg-orange-100 text-orange-800">
          {{ kata.streak }} 天
        </Badge>
        <KataEditForm :kata="kata" />
      </div>
      <div class="text-sm text-muted-foreground mb-2">{{ kata.description }}</div>
      <div class="flex flex-wrap gap-1 text-sm items-center" v-if="kata.exceptions.length > 0">
        <span class="font-bold text-xs text-gray-500">除非</span>
        <Badge v-for="(exception, index) in kata.exceptions" :key="index" variant="secondary">
          {{ exception }}
        </Badge>
      </div>
    </div>

    <div class="mt-2" v-if="kata.children.length > 0">
      <KataTreeNode v-for="child in kata.children" :key="child.id" :kata="child" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Kata } from '@/types/kata';
import { computed } from 'vue';
import { useKataTreeStore } from '@/stores/kataTree';
import { Badge } from '@/components/ui/badge';
import KataEditForm from './KataEditForm.vue';

interface Props {
  kata: Kata;
}

const props = defineProps<Props>();
const kataStore = useKataTreeStore();

const isSelected = computed(() => props.kata.id === kataStore.stateUI.selectedParentId);

const selectKata = () => {
  kataStore.selectParent(props.kata.id);
};
</script>
