<template>
    <div class="loginpage">
        <authLayout>

            <div class="container">
                <div class="item">
                    <textBox label="Tên đăng nhập" placeholder="Nhập tên đăng nhập của bạn" v-model="username" />
                </div>
                <div class="item">
                    <textBox label="Mật khẩu" placeholder="Nhập mật khẩu của bạn" type="password" v-model="password" />
                </div>
                <div class="item">
                    <baseButton @click="login" class="login-button">Đăng nhập</baseButton>
                </div>
            </div>

        </authLayout>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import authLayout from '@/layout/auth-layout.vue';
import textBox from '@/components/buttons/text-box.vue';
import baseButton from '@/components/buttons/base-button.vue';

const username = ref('');
const password = ref('');
</script>
<style scoped>
.loginpage {
    width: 100%;
    height: 100%;
}
.container {
    width: 400px;
    margin: 0 auto;
    padding-top: 100px;
}
.login-button {
    display: block;
    margin: 20px auto;
}
.item {
    display: block;
    margin: 0 auto;
    width: 70%;
}
</style>