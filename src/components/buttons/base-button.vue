<template lang="">
    <el-button type="primary" class="base-button" @click="onClick">
        <slot />
    </el-button>
</template>
<script setup>
const emit = defineEmits(['click']);
function onClick(e) {
    emit('click', e);
}
</script>
<style scoped>
.base-button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: #007bff;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
}
</style>