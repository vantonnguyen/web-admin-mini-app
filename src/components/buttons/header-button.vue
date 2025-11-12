<template>
    <button class="header-button">
        <img v-if="image" :src="image" :style="{ width: size + 'px', height: size + 'px' }" class="image" />
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
    gap: 8px;
    background: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    padding: 8px 12px;
    transition: box-shadow 0.2s;
}

.header-button:not(.logo):hover {
    box-shadow: 0 2px 8px rgba(5, 109, 221, 0.08);
    background-color: aquamarine;
}


</style>