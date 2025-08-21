<template>
  <Dialog :open="store.stateUI.confirmingAddMultiple" @update:open="store.setConfirmingMultiple($event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-lg font-semibold">确认创建多个定式</DialogTitle>
      </DialogHeader>

      <div class="text-center py-4">
        <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileWarningIcon />
        </div>
        <p class="text-sm text-muted-foreground mb-2">
          您今天已经创建了 <strong class="text-destructive">{{ store.katasCreatedToday }}</strong> 个定式。
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useKataTreeStore } from '@/stores/kataTree';
import { FileWarningIcon } from 'lucide-vue-next';

const store = useKataTreeStore();
</script>
