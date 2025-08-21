<template>
  <Dialog :open="true" @update:open="$emit('cancel')">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-lg font-semibold">确认创建多个定式</DialogTitle>
      </DialogHeader>

      <div class="text-center py-4">
        <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-xl text-orange-600">⚠️</span>
        </div>
        <p class="text-sm text-muted-foreground mb-2">
          您今天已经创建了 <strong class="text-destructive">{{ katasCreatedToday }}</strong> 个定式。
        </p>
        <p class="text-sm text-muted-foreground">
          建议每天只创建一个定式以确保质量。您确定要继续创建吗？
        </p>
      </div>

      <DialogFooter class="flex gap-2">
        <Button @click="$emit('cancel')" variant="secondary" class="flex-1">
          取消
        </Button>
        <Button @click="$emit('confirm')" variant="destructive" class="flex-1">
          确认创建
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
interface Props {
  katasCreatedToday: number;
}

interface Emits {
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

defineProps<Props>();
defineEmits<Emits>();

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
</script>
