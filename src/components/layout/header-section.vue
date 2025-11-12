<template>
    <div class="header">
        <headerButton image="/logo.png" label="Trang chủ" :size="28" @click="goHome()" />
        <headerButton :image="cate" label="Chủ đề từ vựng" :size="28" @click="goHome()" />
        <headerButton :image="voca" label="Danh sách từ vựng" :size="28" @click="goHome()" />
        <headerButton :image="user" label="Quản lý người dùng" :size="28" @click="goHome()" />
    </div>

</template>
<script setup>
import headerButton from '@/components/buttons/header-button.vue';
import { useRouter } from 'vue-router';
import cate from '@/assets/icons/menu.png';
import voca from '@/assets/icons/list.png';
import user from '@/assets/icons/user.png';


const router = useRouter();
function goHome() {
    router.push('/login');
}
</script>
<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background-color: #f5f5f5;
}
</style>