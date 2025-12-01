<template>
    <div class="header">
        <headerButton image="/logo.png" label="" :size="50" @click="goHome()" class="logo" />
        <headerButton :image="cate" label="Chủ đề từ vựng" :size="20" @click="goCategoryPage()" />
        <headerButton :image="voca" label="Danh sách từ vựng" :size="20" @click="goVocabularyPage()" />
        <headerButton :image="user" label="Quản lý người dùng" :size="20" @click="goZaloUserPage()" />
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
    router.push('/');
}
function goCategoryPage() {
    router.push('/categories');
}
function goVocabularyPage() {
    router.push('/vocabularies');
}
function goZaloUserPage() {
    router.push('/zalo-users');
}
</script>
<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    background-color: #fff;
}

.logo {
    margin-right: 40px;
}
</style>