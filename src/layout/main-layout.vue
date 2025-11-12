<template>
    <div class="main-layout">
        <headerSection />
        <div class="body">
            <headerSection />
            <div class="content">

            </div>

        </div>
        <footerSection />
    </div>
</template>
<script setup>
import headerSection from '@/components/layout/header-section.vue';
import footerSection from '@/components/layout/footer-section.vue';
</script>
<style scoped>
.main-layout {
    height: 100vh;
    width: 100vw;
}
</style>