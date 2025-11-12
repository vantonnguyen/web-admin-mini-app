<template lang="">
    <div class>
        <label v-if="label">{{label}}</label>
        <input :type="type" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
    </div>
</template>
<script setup>
defineProps({
    modelValue: String,
    label: String,
    placeholder: String,
    type: { type: String, default: 'text' }
}
);
</script>
<style scoped>
    .text-box input{
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
    }
    
</style>