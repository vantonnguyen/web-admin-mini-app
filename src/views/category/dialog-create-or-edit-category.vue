<template>
    <el-dialog title="Thêm chủ đề từ vựng mới" v-model="dialogVisible" width="30%">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="Mã danh mục" prop="key" :rules="props.mode === 'update' ? [] : undefined">
                <el-input v-model="form.key" autocomplete="off" style="width: 240px" placeholder="Nhập mã danh mục"
                    :disabled="props.mode === 'update'" />
            </el-form-item>
            <el-form-item label="Tên danh mục" prop="label">
                <el-input v-model="form.label" autocomplete="off" style="width: 240px"
                    placeholder="Nhập tên danh mục" />
            </el-form-item>
            <el-form-item label="Màu" prop="color">
                <el-input v-model="form.color" autocomplete="off" style="width: 240px" placeholder="Nhập màu" />
            </el-form-item>
            <el-form-item label="Tiếng Nhật" prop="japanese">
                <el-input v-model="form.japanese" autocomplete="off" style="width: 240px"
                    placeholder="Nhập tiếng Nhật" />
            </el-form-item>
            <el-form-item label="Kana" prop="kana">
                <el-input v-model="form.kana" autocomplete="off" style="width: 240px" placeholder="Nhập kana" />
            </el-form-item>
            <el-form-item label="Romaji" prop="romaji">
                <el-input v-model="form.romaji" autocomplete="off" style="width: 240px" placeholder="Nhập romaji" />
            </el-form-item>
            <el-form-item label="Thứ tự hiển thị" prop="display_order">
                <el-input v-model.number="form.display_order" autocomplete="off" type="number" style="width: 240px"
                    placeholder="Nhập thứ tự hiển thị" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Hủy</el-button>
                <el-button type="primary" @click="submitForm" :loading="props.formLoading">Xác nhận</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { addCategory, updateCategory } from '@/api/category.js';

const props = defineProps({
    dialogVisible: Boolean,
    form: Object,
    rules: Object,
    formLoading: Boolean,
    mode: String,
});
const emit = defineEmits(['update:dialogVisible', 'onSuccess']);
const formRef = ref();

const dialogVisible = computed({
    get: () => props.dialogVisible,
    set: (value) => emit('update:dialogVisible', value)
});

const submitForm = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            const action = props.mode === 'add' ? addCategory : updateCategory;
            if (props.mode === 'add') {
                addCategory(props.form)
                    .then((res) => {
                        emit('onSuccess', props.form);
                        ElMessage.success('Đã thêm thành công!');
                        dialogVisible.value = false;
                        console.log('Category added:', res);
                    })
                    .catch(() => {
                        ElMessage.error('Có lỗi khi thêm danh mục!');
                    });

            } else {
                updateCategory(props.form.key, props.form)
                    .then((res) => {
                        emit('onSuccess', props.form);
                        ElMessage.success('Đã cập nhật thành công!');
                        dialogVisible.value = false;
                        console.log('Category updated:', res);
                    })
                    .catch(() => {
                        ElMessage.error('Có lỗi khi cập nhật!');
                    });
            }

        } else {
            ElMessage.warning('Vui lòng kiểm tra lại thông tin đã nhập trong form!');
        }
    });
};
</script>
<style scoped></style>