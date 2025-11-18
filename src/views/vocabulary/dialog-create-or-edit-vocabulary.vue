<template>
    <el-dialog :title="form.id ? `Chỉnh sửa từ vựng: ${form.kanji}` : 'Thêm từ vựng mới'" v-model="dialogVisible" width="40%">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="Kanji" prop="kanji">
                <el-input v-model="form.kanji" autocomplete="off" style="width: 240px" placeholder="Nhập Kanji" />
            </el-form-item>
            <el-form-item label="Kana" prop="kana">
                <el-input v-model="form.kana" autocomplete="off" style="width: 240px" placeholder="Nhập Kana" />
            </el-form-item>
            <el-form-item label="Romaji" prop="romaji">
                <el-input v-model="form.romaji" autocomplete="off" style="width: 240px" placeholder="Nhập Romaji" />
            </el-form-item>
            <el-form-item label="Nghĩa" prop="meaning">
                <el-input v-model="form.meaning" autocomplete="off" style="width: 240px" placeholder="Nhập Nghĩa" />
            </el-form-item>
            <el-form-item label="JLPT Level" prop="jlpt_level">
                <el-input v-model="form.jlpt_level" autocomplete="off" style="width: 240px" placeholder="Nhập JLPT Level" />
            </el-form-item>
            <el-form-item label="Link Audio" prop="audio_url">
                <el-input v-model="form.audio_url" autocomplete="off" style="width: 240px" placeholder="Nhập Link Audio" />
            </el-form-item>
            <el-form-item label="Ví dụ" prop="example">
                <el-input v-model="form.example" autocomplete="off" style="width: 240px" placeholder="Nhập Ví dụ" />
            </el-form-item>
            <el-form-item label="Link Image" prop="image_url">
                <el-input v-model="form.image_url" autocomplete="off" style="width: 240px" placeholder="Nhập Link Image" />
            </el-form-item>
        
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Hủy</el-button>
                <el-button type="primary" @click="submitForm" :loading="formLoading" :disabled="mode === 'update' && !isDirty">Xác nhận</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { addVocabulary, updateVocabulary } from '@/api/vocabulary.js';

const props = defineProps({
    dialogVisible: Boolean,
    form: Object,
    rules: Object,
    formLoading: Boolean,
    mode: String,
    title: String
});

const emit = defineEmits(['update:dialogVisible', 'onSuccess']);
const formRef = ref();

const dialogVisible = computed({
    get: () => props.dialogVisible,
    set: (value) => emit('update:dialogVisible', value)
});

const originalForm = ref({});

watch(() => props.dialogVisible, (val) => {
    if (val && props.mode === 'update') {
        originalForm.value = { ...props.form };
    }
});
const isDirty = computed(() => {
    if (props.mode !== 'update') return true;
    for (const key in originalForm.value) {
        if (props.form[key] !== originalForm.value[key]) {
            return true;
        }
    }
    return false;
});

const submitForm = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            const action = props.mode === 'add' ? addVocabulary : updateVocabulary;
            if (props.mode === 'add') {
                addVocabulary(props.form)
                    .then((res) => {
                        emit('onSuccess', props.form);
                        ElMessage.success('Đã thêm thành công!');
                        dialogVisible.value = false;
                        console.log('Vocabulary added:', res);
                    })
                    .catch((err) => {
                        if (err && err.message && err.message.includes('409')) {
                            ElMessage.error('Từ vựng đã tồn tại, vui lòng nhập từ khác!');
                        } else {
                            ElMessage.error('Có lỗi khi thêm từ vựng!');
                        }
                    });

            } else {
                updateVocabulary(props.form.id, props.form)
                    .then((res) => {
                        emit('onSuccess', props.form);
                        ElMessage.success('Đã cập nhật thành công!');
                        dialogVisible.value = false;
                        console.log('Vocabulary updated:', res);
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