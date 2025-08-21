<template>
  <div class="ml-4">
    <div :class="[
      'p-3 rounded-lg border cursor-pointer transition-colors',
      {
        'bg-green-50 border-green-200': kata.completed,
        'bg-red-50 border-red-200': !kata.completed && kata.streak > 0,
        'bg-blue-50 border-blue-200': isSelected,
        'bg-card border-border hover:bg-muted/50': !kata.completed && kata.streak === 0 && !isSelected
      }
    ]" @click="selectKata">
      <div class="flex items-center gap-2 mb-2">
        <span class="font-mono text-sm font-semibold text-primary">{{ kata.number }}</span>
        <span class="font-medium">{{ kata.title }}</span>
        <Badge v-if="kata.streak > 0" class="ml-auto bg-orange-100 text-orange-800">
          {{ kata.streak }}天
        </Badge>
        <Button @click.stop="editKata" variant="ghost" size="sm" class="ml-auto opacity-60 hover:opacity-100"
          title="编辑定式">
          ✏️
        </Button>
      </div>
      <div class="text-sm text-muted-foreground mb-2">{{ kata.description }}</div>
      <div class="flex flex-wrap gap-1" v-if="kata.exceptions.length > 0">
        <Badge v-for="(exception, index) in kata.exceptions" :key="index" variant="secondary"
          class="text-xs">
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
import { Button } from '@/components/ui/button';

interface Props {
  kata: Kata;
}

const props = defineProps<Props>();
const kataStore = useKataTreeStore();

const isSelected = computed(() => props.kata.id === kataStore.selectedKataId);

const selectKata = () => {
  kataStore.setSelectedKataId(props.kata.id);
};

const editKata = () => {
  kataStore.setEditingKata(props.kata);
  kataStore.setShowEditForm(true);
  kataStore.setShowAddForm(false);
  kataStore.setShowVerification(false);
};
</script>
