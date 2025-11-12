<template>
    <div class="nav-bar">
        <headerButton :image="cate" label="" :size="58" @click="goLoginPage()" />
        <headerButton :image="voca" label="" :size="58" @click="goHome()" />
        <headerButton :image="user" label="" :size="58" @click="goHome()" />
    </div>

</template>
<script setup>
import headerButton from '@/components/buttons/header-button.vue';
import { useRouter } from 'vue-router';
import cate from '@/assets/icons/menu.png';
import voca from '@/assets/icons/list.png';
import user from '@/assets/icons/user.png';


const router = useRouter();
function goLoginPage() {
    router.push('/login');
}
</script>
<style scoped>
.nav-bar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    background-color: #fff;
}

.logo {
    margin-right: 62px;
}
</style>