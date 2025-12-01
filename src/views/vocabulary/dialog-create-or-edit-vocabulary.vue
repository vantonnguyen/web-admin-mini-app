<template>
    <el-dialog :title="formData.id ? `Chỉnh sửa từ vựng: ${formData.kanji}` : 'Thêm từ vựng mới'"
        v-model="dialogVisible" width="40%">
        <el-form :model="formData" :rules="rules" ref="myForm" label-width="120px">
            <el-form-item label="Kanji" prop="kanji">
                <el-input v-model="formData.kanji" autocomplete="off" style="width: 240px" placeholder="Nhập Kanji" />
            </el-form-item>
            <el-form-item label="Kana" prop="kana">
                <el-input v-model="formData.kana" autocomplete="off" style="width: 240px" placeholder="Nhập Kana" />
            </el-form-item>
            <el-form-item label="Romaji" prop="romaji">
                <el-input v-model="formData.romaji" autocomplete="off" style="width: 240px" placeholder="Nhập Romaji" />
            </el-form-item>
            <el-form-item label="Nghĩa" prop="meaning">
                <el-input v-model="formData.meaning" autocomplete="off" style="width: 240px" placeholder="Nhập Nghĩa" />
            </el-form-item>
            <el-form-item label="Link Audio" prop="audio_url">
                <el-input v-model="formData.audio_url" autocomplete="off" style="width: 300px"
                    placeholder="Nhập Link Audio" />
                <div v-if="formData.audio_url" style="margin-left: 10px;">
                    <audio :src="formData.audio_url" controls
                        style="width: 120px; height: 38px; transform: scale(0.85); transform-origin: left;"></audio>
                </div>
            </el-form-item>
            <el-form-item label="Ví dụ" prop="example">
                <el-input v-model="formData.example" autocomplete="off" style="width: 440px" placeholder="Nhập Ví dụ" />
            </el-form-item>
            <el-form-item label="Link Image" prop="image_url">
                <el-input v-model="formData.image_url" autocomplete="off" style="width: 440px"
                    placeholder="Nhập Link Image" />
            </el-form-item>
            <div v-if="formData.image_url" style="margin-top: 10px; text-align: center;">
                <img :src="formData.image_url" alt="preview"
                    style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;" />
            </div>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Hủy</el-button>
                <el-button type="primary" @click="submitForm" :loading="formLoading">Xác
                    nhận</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { addVocabulary, updateVocabulary, getVocabularyById } from '@/api/vocabulary.js';

const dialogVisible = ref(false);
const emit = defineEmits(['on-success']);
const myForm = ref();
const formLoading = ref(false);
const loading = ref(false);
const defaultFormValue = reactive({
    id: null,
    kanji: '',
    kana: '',
    romaji: '',
    meaning: '',
    audio_url: '',
    example: '',
    image_url: ''
});
const formData = ref({ ...defaultFormValue });

const showDialog = (id) => {
    // Reset form
    if (myForm.value) {
        myForm.value.clearValidate();
    }
    formLoading.value = false;
    dialogVisible.value = true;
    formData.value = { ...defaultFormValue };
    //edit
    if (id) {
        loading.value = true;
        getVocabularyById(id)
            .then((res) => {
                formData.value = { ...res.data };
            })
            .catch((err) => {
                ElMessage.error('Lỗi tải dữ liệu từ vựng');
                console.error('Lỗi tải dữ liệu từ vựng:', err);
            })
            .finally(() => {
                loading.value = false;
            });
    };
}

const submitForm = async () => {
    await myForm.value.validate((valid) => {
        if (!valid) {
            return;
        }
        formLoading.value = true;

        if (formData.value.id) {
            // pass id as first arg (updateVocabulary expects (key, data))
            updateVocabulary(formData.value.id, formData.value)
                .then(() => {
                    ElMessage.success('Cập nhật từ vựng thành công');
                    dialogVisible.value = false;
                    emit('on-success');
                })
                .catch((err) => {
                    console.error('submitForm updateVocabulary error:', err);
                })
                .finally(() => {
                    formLoading.value = false;
                });

        } else {
            addVocabulary(formData.value)
                .then(() => {
                    ElMessage.success('Thêm từ vựng thành công');
                    dialogVisible.value = false;
                    emit('on-success');
                })
                .catch((err) => {
                    console.error('submitForm addVocabulary error:', err);
                })
                .finally(() => {
                    formLoading.value = false;
                });
        }
    });
};


const rules = reactive({
    kanji: [{ required: false, message: 'Vui lòng nhập Kanji (có thể có hoặc không)', trigger: 'blur' }],
    kana: [{ required: true, message: 'Vui lòng nhập Kana ( hiragana hoặc katakana )', trigger: 'blur' }],
    romaji: [{ required: true, message: 'Vui lòng nhập Romaji', trigger: 'blur' }],
    meaning: [{ required: true, message: 'Vui lòng nhập Nghĩa', trigger: 'blur' }],
});

defineExpose({
    showDialog
});
</script>
<style scoped></style>