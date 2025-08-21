<template>
  <Card class="w-full max-w-md">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">添加新定式</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="!selectedParentId" class="text-center py-10 text-muted-foreground">
        <p>请先选择一个父节点</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="kata-number" class="text-sm font-medium">编号</Label>
          <Input id="kata-number" v-model="formData.number" type="text" placeholder="例如: 002" required
            class="w-full" />
        </div>

        <div class="space-y-2">
          <Label for="kata-title" class="text-sm font-medium">标题 (4个汉字)</Label>
          <Input id="kata-title" v-model="formData.title" type="text" placeholder="例如: 晨间冥想" maxlength="4" required
            class="w-full" />
          <span class="text-xs text-muted-foreground">{{ formData.title.length }}/4</span>
        </div>

        <div class="space-y-2">
          <Label for="kata-description" class="text-sm font-medium">描述</Label>
          <Textarea id="kata-description" v-model="formData.description" placeholder="详细描述这个定式的内容和要求..." rows="4"
            required class="w-full" />
        </div>

        <div class="space-y-2">
          <Label for="kata-exceptions" class="text-sm font-medium">例外情况 (可选)</Label>
          <Input id="kata-exceptions" v-model="exceptionInput" type="text" placeholder="输入例外情况，按回车添加"
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
          <Button type="button" @click="kataStore.setShowAddForm(false)" variant="secondary" class="flex-1">
            取消
          </Button>
          <Button type="submit" class="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            添加定式
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useKataTreeStore } from '@/stores/kataTree';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

defineProps<{}>();

const kataStore = useKataTreeStore();

const selectedParentId = computed(() => kataStore.selectedKataId);

const formData = reactive({
  number: '',
  title: '',
  description: '',
  exceptions: [] as string[],
});

const exceptionInput = ref('');

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
  if (!selectedParentId.value) return;

  const success = kataStore.addKata(selectedParentId.value, {
    number: formData.number,
    title: formData.title,
    description: formData.description,
    exceptions: [...formData.exceptions],
    parentId: selectedParentId.value,
  });

  if (success) {
    kataStore.setShowAddForm(false);
    kataStore.setSelectedKataId(undefined);
    resetForm();
  }
};

const resetForm = () => {
  formData.number = '';
  formData.title = '';
  formData.description = '';
  formData.exceptions = [];
  exceptionInput.value = '';
};
</script>
