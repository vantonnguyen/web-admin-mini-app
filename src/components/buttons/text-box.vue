<template lang="">
    <div class>
        <label v-if="label">{{label}}</label>
        <el-input :type="type" :placeholder="placeholder" v-model="value"  />
    </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: String,
    label: String,
    placeholder: String,
    type: { type: String, default: 'text' }
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

</script>
<style scoped></style>