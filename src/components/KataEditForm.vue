<template>
  <Card class="w-full max-w-md">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">编辑定式</CardTitle>
    </CardHeader>
    <CardContent>
      <form v-if="kata" @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="edit-kata-number" class="text-sm font-medium">编号</Label>
          <Input id="edit-kata-number" v-model="formData.number" type="text" placeholder="例如: 002" required
            class="w-full" />
        </div>

        <div class="space-y-2">
          <Label for="edit-kata-title" class="text-sm font-medium">标题 (4个汉字)</Label>
          <Input id="edit-kata-title" v-model="formData.title" type="text" placeholder="例如: 晨间冥想" maxlength="4" required
            class="w-full" />
          <span class="text-xs text-muted-foreground">{{ formData.title.length }}/4</span>
        </div>

        <div class="space-y-2">
          <Label for="edit-kata-description" class="text-sm font-medium">描述</Label>
          <Textarea id="edit-kata-description" v-model="formData.description" placeholder="详细描述这个定式的内容和要求..." rows="4"
            required class="w-full" />
        </div>

        <div class="space-y-2">
          <Label for="edit-kata-exceptions" class="text-sm font-medium">例外情况</Label>
          <Input id="edit-kata-exceptions" v-model="exceptionInput" type="text" placeholder="输入例外情况，按回车添加"
            @keyup.enter="addException" class="w-full" />
          <div class="flex flex-wrap gap-1" v-if="formData.exceptions.length > 0">
            <Badge v-for="(exception, index) in formData.exceptions" :key="index" variant="secondary"
              class="text-xs">
              {{ exception }}
              <button type="button" @click="removeException(index)" class="ml-1 text-xs hover:text-destructive">×</button>
            </Badge>
          </div>
        </div>

        <div class="flex gap-2 pt-4">
          <Button type="button" @click="kataStore.setShowEditForm(false); kataStore.setEditingKata(null);" variant="secondary" class="flex-1">
            取消
          </Button>
          <Button type="submit" class="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            保存修改
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { useKataTreeStore } from '@/stores/kataTree';
import type { Kata } from '@/types/kata';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

defineProps<{}>();

const kataStore = useKataTreeStore();

const kata = computed(() => kataStore.editingKata);

const formData = reactive({
  number: '',
  title: '',
  description: '',
  exceptions: [] as string[],
});

const exceptionInput = ref('');

watch(() => kata.value, (newKata) => {
  if (newKata) {
    formData.number = newKata.number;
    formData.title = newKata.title;
    formData.description = newKata.description;
    formData.exceptions = [...newKata.exceptions];
  }
}, { immediate: true });

const addException = () => {
  if (exceptionInput.value.trim() && !formData.exceptions.includes(exceptionInput.value.trim())) {
    formData.exceptions.push(exceptionInput.value.trim());
    exceptionInput.value = '';
  }
};

const removeException = (index: number) => {
  formData.exceptions.splice(index, 1);
};

const handleSubmit = () => {
  if (!kata.value) return;

  const success = kataStore.editKata(kata.value.id, {
    number: formData.number,
    title: formData.title,
    description: formData.description,
    exceptions: [...formData.exceptions],
  });

  if (success) {
    kataStore.setShowEditForm(false);
    kataStore.setEditingKata(null);
  }
};
</script>
