<template>
    <div class="loginpage">
        <authLayout>

            <div class="container">
                <div class="item">
                    <textBox label="Tên đăng nhập" placeholder="Nhập tên đăng nhập của bạn" v-model="username" />
                </div>
                <div class="item">
                    <label for="password">Mật khẩu</label>
                    <el-input v-model="password" style="width: 280px" type="password" placeholder="Nhập mật khẩu của bạn"
                        show-password />
                </div>
                <div class="item">
                    <baseButton @click="handleLogin" class="login-button">Đăng nhập</baseButton>
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
import { login } from '@/api/auth.js';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const username = ref('');

const password = ref('');
const showPassword = ref(false);

const router = useRouter();
const handleLogin = () => {
    // Validate frontend
    // Validate frontend: chỉ kiểm tra đã nhập hay chưa
    if (!username.value || !username.value.trim()) {
        ElMessage.warning('Vui lòng nhập tên đăng nhập!');
        return;
    }
    if (!password.value || !password.value.trim()) {
        ElMessage.warning('Vui lòng nhập mật khẩu!');
        return;
    }
    login(username.value, password.value)
        .then((response) => {
            if (response) {
                ElMessage.success('Đăng nhập thành công');
                localStorage.setItem('user', JSON.stringify(response));
                router.push('/');
            } else {
                ElMessage.error('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại!');
            }
        })
        .catch((error) => {
            ElMessage.error('Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau!');
            console.error('Lỗi đăng nhập:', error);
        });
};
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