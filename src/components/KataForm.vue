<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label :for="`${idPrefix}-kata-number`" class="text-sm font-medium">编号</Label>
      <Input :id="`${idPrefix}-kata-number`" v-model="formData.number" type="text" disabled
        :placeholder="numberPlaceholder" :required="numberRequired" class="w-full" />
    </div>

    <div class="space-y-2">
      <Label :for="`${idPrefix}-kata-title`" class="text-sm font-medium">标题</Label>
      <Input :id="`${idPrefix}-kata-title`" v-model="formData.title" type="text" placeholder="例如：慎始敬终" required
        class="w-full" />
    </div>

    <div class="space-y-2">
      <Label :for="`${idPrefix}-kata-description`" class="text-sm font-medium">描述</Label>
      <Textarea :id="`${idPrefix}-kata-description`" v-model="formData.description" placeholder="详细描述这个定式的内容和要求..."
        rows="4" required class="w-full" />
    </div>

    <div class="space-y-2">
      <Label :for="`${idPrefix}-kata-exceptions`" class="text-sm font-medium">例外情况</Label>
      <div class="flex gap-2">
        <Input :id="`${idPrefix}-kata-exceptions`" v-model="exceptionInput" type="text" placeholder="输入例外情况"
          class="w-full" />
        <Button type="button" @click="addException" variant="outline">
          <PlusIcon />
        </Button>
      </div>
      <div class="flex flex-wrap gap-1" v-if="formData.exceptions.length > 0">
        <Badge v-for="(exception, index) in formData.exceptions" :key="index" variant="secondary" class="text-xs">
          {{ exception }}
          <button type="button" @click="removeException(index)" class="ml-1 text-xs hover:text-destructive">
            <DeleteIcon />
          </button>
        </Badge>
      </div>
    </div>

    <div class="flex gap-2 pt-4">
      <Button type="button" @click="$emit('cancel')" variant="secondary" class="flex-1">
        <DeleteIcon />
        取消
      </Button>
      <Button type="submit" class="flex-1">
        <SaveIcon />
        {{ submitButtonText }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { DeleteIcon, SaveIcon, PlusIcon } from 'lucide-vue-next';

interface FormData {
  number: string;
  title: string;
  description: string;
  exceptions: string[];
}

interface Props {
  initialData?: Partial<FormData>;
  numberPlaceholder?: string;
  numberRequired?: boolean;
  submitButtonText?: string;
  idPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
  numberDisabled: false,
  numberPlaceholder: '',
  numberRequired: true,
  submitButtonText: '保存',
  idPrefix: 'kata',
});

const emit = defineEmits<{
  submit: [data: FormData];
  cancel: [];
}>();

const formData = reactive<FormData>({
  number: props.initialData.number || '',
  title: props.initialData.title || '',
  description: props.initialData.description || '',
  exceptions: props.initialData.exceptions ? [...props.initialData.exceptions] : [],
});

const exceptionInput = ref('');

watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.number = newData.number || '';
    formData.title = newData.title || '';
    formData.description = newData.description || '';
    formData.exceptions = newData.exceptions ? [...newData.exceptions] : [];
  }
}, { deep: true, immediate: true });

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
  emit('submit', { ...formData });
};
</script>