<template>
    <el-dialog :title="formData.key ? `Chỉnh sửa chủ đề: ${formData.label}` : 'Thêm chủ đề từ vựng mới'"
        v-model="dialogVisible" width="30%">
        <el-form :model="formData" :rules="rules" ref="myForm" label-width="120px">
            <el-form-item label="Mã danh mục" prop="key" :rules="mode === 'update' ? [] : undefined">
                <el-input v-model="formData.key" autocomplete="off" style="width: 240px" placeholder="Nhập mã danh mục"
                    :disabled="mode === 'update'" />
            </el-form-item>
            <el-form-item label="Tên danh mục" prop="label">
                <el-input v-model="formData.label" autocomplete="off" style="width: 240px"
                    placeholder="Nhập tên danh mục" />
            </el-form-item>
            <el-form-item label="Màu" prop="color">
                <div class="demo-color-block">
                    <el-color-picker v-model="formData.color" />
                </div>
            </el-form-item>
            <el-form-item label="Tiếng Nhật" prop="japanese">
                <el-input v-model="formData.japanese" autocomplete="off" style="width: 240px"
                    placeholder="Nhập tiếng Nhật" />
            </el-form-item>
            <el-form-item label="Kana" prop="kana">
                <el-input v-model="formData.kana" autocomplete="off" style="width: 240px" placeholder="Nhập kana" />
            </el-form-item>
            <el-form-item label="Romaji" prop="romaji">
                <el-input v-model="formData.romaji" autocomplete="off" style="width: 240px" placeholder="Nhập romaji" />
            </el-form-item>
            <el-form-item label="Thứ tự hiển thị" prop="display_order">
                <el-input v-model.number="formData.display_order" autocomplete="off" type="number" style="width: 240px"
                    placeholder="Nhập thứ tự hiển thị" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Hủy</el-button>
                <el-button type="primary" @click="submitForm" :loading="formLoading">Xác nhận</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { computed, ref, watch, nextTick, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { addCategory, updateCategory, getCategoryByKey } from '@/api/category.js';

const formLoading = ref(false);
const dialogVisible = ref(false);
const myForm = ref();
const loading = ref(false);
const emit = defineEmits(['on-success']);
const defaultFormValue = reactive({
    id: null,
    key: '',
    label: '',
    color: '',
    japanese: '',
    kana: '',
    romaji: '',
    display_order: 1,
});
const formData = ref({ ...defaultFormValue });

const showDialog = (key) => {
    // Reset form
    if (myForm.value) {
        myForm.value.clearValidate();
    }
    formLoading.value = false;
    dialogVisible.value = true;
    formData.value = { ...defaultFormValue };
    //edit
    if (key) {
        loading.value = true;
        getCategoryByKey(key)
            .then((res) => {
                formData.value = { ...res.data };
            })
            .catch((err) => {
                ElMessage.error('Lỗi tải dữ liệu danh mục');
                console.error('Lỗi tải dữ liệu danh mục:', err);
            })
            .finally(() => {
                loading.value = false;
            });
    };
}

const submitForm = async () => {
    try {
        await myForm.value.validate();

        formLoading.value = true;
        const { key, id } = formData.value;
        const existingCategory = await getCategoryByKey(key);
        const existingId = existingCategory?.data?.id;
        if (formData.value.id) {
            // Update category
            if (existingId && existingId !== id) {
                ElMessage.error('Danh mục đã tồn tại, không thể cập nhật');
                return;
            }

            await updateCategory(key, formData.value);
            ElMessage.success('Cập nhật danh mục thành công');
        } else {
            // Add new category
            if (existingId) {
                ElMessage.error('Danh mục đã tồn tại, không thể thêm mới');
                return;
            }
            await addCategory(formData.value);
            ElMessage.success('Thêm danh mục thành công');
        }

        dialogVisible.value = false;
        emit('on-success');
    } catch (err) {
        console.error('submitForm error:', err);
        ElMessage.error(err?.message || 'Có lỗi xảy ra');
    } finally {
        formLoading.value = false;
    }
};

const rules = ref({
    key: [{ required: true, message: 'Vui lòng nhập mã danh mục', trigger: 'blur' }],
    label: [{ required: true, message: 'Vui lòng nhập tên danh mục', trigger: 'blur' }],
});

defineExpose({ showDialog });

</script>
<style scoped></style>