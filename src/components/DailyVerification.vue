<template>
  <AlertDialog>
    <AlertDialogTrigger>
      <Button variant="secondary" :disabled="todayVerified">
        <VerifiedIcon />
        验证今日定式
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="text-lg font-semibold">每日验证</AlertDialogTitle>
        <AlertDialogCancel class="absolute right-4 top-4"><DeleteIcon class="text-red-600" /></AlertDialogCancel>
      </AlertDialogHeader>
      <div v-if="!todayVerified" class="space-y-6">
        <div class="bg-muted/50 p-4 rounded-lg">
          <p class="text-sm text-muted-foreground mb-3">请验证您今天是否完成了所有定式：</p>
          <ol class="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>检查每个定式是否按要求完成</li>
            <li>如果完成，标记为完成</li>
            <li>如果未完成，可以选择添加例外或删除子节点</li>
            <li>完成所有验证后，提交每日验证</li>
          </ol>
        </div>

        <div class="space-y-3">
          <div v-for="kata in allKatas" :key="kata.id" class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex items-center gap-2">
              <span class="font-mono text-sm font-semibold text-primary">{{ kata.number }}</span>
              <span class="font-medium">{{ kata.title }}</span>
              <Badge v-if="kata.streak > 0" class="bg-orange-100 text-orange-800">
                {{ kata.streak }}天
              </Badge>
            </div>

            <div class="flex gap-2">
              <Button @click="verifyKata(kata.id, true)" :disabled="kata.completed"
                :class="['bg-green-600 text-white hover:bg-green-700', { 'opacity-50': kata.completed }]" size="sm">
                ✓ 完成
              </Button>
              <Button @click="showFailureOptions(kata)" :disabled="kata.completed"
                class="bg-red-600 text-white hover:bg-red-700" size="sm">
                ✗ 未完成
              </Button>
            </div>
          </div>
        </div>

        <div class="flex justify-center pt-4">
          <Button @click="submitVerification" :disabled="!allKatasVerified"
            class="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
            提交每日验证
          </Button>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl text-green-600">
            <CheckIcon />
          </span>
        </div>
        <h4 class="text-xl font-semibold mb-2">今日验证完成</h4>
        <p class="text-muted-foreground mb-1">恭喜！您已连续 <strong>{{ currentStreak }}</strong> 天完成所有定式。</p>
        <p class="text-muted-foreground">明天请继续努力！</p>
      </div>

      <!-- Failure Options Modal -->
      <Dialog v-model:open="showModal">
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle class="text-lg font-semibold">处理未完成的定式</DialogTitle>
            <DialogDescription class="text-sm text-muted-foreground">
              {{ selectedKata?.number }} {{ selectedKata?.title }}
            </DialogDescription>
          </DialogHeader>

          <div class="space-y-6">
            <div class="space-y-3">
              <h5 class="text-sm font-medium">添加例外情况</h5>
              <Input v-model="exceptionInput" type="text" placeholder="输入例外原因..." @keyup.enter="addException"
                class="w-full" />
              <Button @click="addException" variant="secondary" class="w-full">
                添加例外
              </Button>
            </div>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t"></span>
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-background px-2 text-muted-foreground">或</span>
              </div>
            </div>

            <div class="space-y-3">
              <h5 class="text-sm font-medium">删除子节点</h5>
              <p class="text-sm text-muted-foreground">这将删除该定式下的所有子节点（包括孙节点等）</p>
              <Button @click="removeChildren" variant="destructive" class="w-full">
                删除子节点
              </Button>
            </div>
          </div>

          <DialogFooter class="flex gap-2">
            <Button @click="closeModal" variant="secondary" class="flex-1">
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKataTreeStore } from '@/stores/kataTree';
import type { Kata } from '@/types/kata';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogHeader, AlertDialogTitle, AlertDialogContent, AlertDialogTrigger, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { DeleteIcon, CheckIcon, VerifiedIcon } from 'lucide-vue-next';

const kataStore = useKataTreeStore();

const todayVerified = computed(() => kataStore.todayVerified);
const currentStreak = computed(() => kataStore.currentStreak);

const showModal = ref(false);
const selectedKata = ref<Kata | null>(null);
const exceptionInput = ref('');

const allKatas = computed(() => {
  const katas: Kata[] = [];

  function collectKatas(kata: Kata | null) {
    if (!kata) return;
    katas.push(kata);
    kata.children.forEach(child => collectKatas(child));
  }

  collectKatas(kataStore.rootKata);
  return katas;
});

const allKatasVerified = computed(() => {
  return allKatas.value.every(kata => kata.completed);
});

const verifyKata = (kataId: string, completed: boolean) => {
  kataStore.verifyKata(kataId, completed);
};

const showFailureOptions = (kata: Kata) => {
  selectedKata.value = kata;
  showModal.value = true;
};

const addException = () => {
  if (selectedKata.value && exceptionInput.value.trim()) {
    kataStore.verifyKata(selectedKata.value.id, false, exceptionInput.value.trim());
    closeModal();
  }
};

const removeChildren = () => {
  if (selectedKata.value) {
    kataStore.verifyKata(selectedKata.value.id, false);
    closeModal();
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedKata.value = null;
  exceptionInput.value = '';
};

const submitVerification = () => {
  kataStore.verifyAllKatas();
};
</script>
