<template>
    <div class="main-layout">
        <div class="header-wrapper">
            <headerSection />
        </div>

        <div class="body">
            <div class="nav-bar">
                <navBar />
            </div>
            <div class="content">
                  <router-view></router-view>
            </div>

        </div>

        <div class="footer-wrapper">
            <headerSection />
        </div>
    </div>
</template>
<script setup>
import headerSection from '@/components/layout/header-section.vue';
import footerSection from '@/components/layout/footer-section.vue';
import navBar from '@/components/layout/nav-bar.vue';
</script>
<style scoped>
.main-layout {
    height: 100vh;
    width: 100%;
    box-sizing: border-box;
}

.header-wrapper {
    width: 100%;
    border-bottom: 2px solid black;
}
.body {
    display: flex;
    flex-direction: row;
    height: calc(100vh - 100px);
    width: 100%;
    margin-top: 10px;
}
.content {
    flex: 1;
    padding: 16px;
}
.nav-bar {
    max-width: 250px;
}

.footer-wrapper {
    width: 100%;
}
</style>