<template>
    <button class="header-button">
        <img v-if="image" :src="image" :style="{ width: size + 'px', height: size + 'px' }" />
        <component v-else :is="icon" :style="{ fontSize: size + 'px' }" />
        <span>{{ label }}</span>
    </button>
</template>
<script setup>
defineProps({
    icon: String,
    image: String,
    label: String,
    size: { type: Number, default: 20 }
}
);
</script>
<style scoped>
    .header-button {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 8px 12px;
    }
</style>