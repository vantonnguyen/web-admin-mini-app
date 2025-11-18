<template>
    <div class="container">
        <div class="title">
            <div>
                <h2>Danh sách từ vựng</h2>
            </div>
            <div class="toolbar">
                <el-input v-model="search" size="small" placeholder="Tìm kiếm" style="width: 180px; height: 30px;"
                    clearable>
                </el-input>
                <div style="width: 40px;"></div>
                <el-button type="primary" icon="el-icon-plus" @click="openAdd">
                    <el-icon>
                        <Plus />
                    </el-icon> Thêm mới
                </el-button>
            </div>
        </div>

        <div class="container-item">
            <el-table v-loading="loading" :data="filterTableData" @row-click="(row) => openEdit(undefined, row)"
                style="width: 100%">
                <el-table-column label="STT" width="60">
                    <template #default="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column label="Kanji">
                    <template #default="scope">
                        {{ scope.row.kanji }}
                    </template>
                </el-table-column>

                <el-table-column label="Kana">
                    <template #default="scope">
                        {{ scope.row.kana }}
                    </template>
                </el-table-column>

                <el-table-column label="Romaji">
                    <template #default="scope">
                        {{ scope.row.romaji }}
                    </template>
                </el-table-column>

                <el-table-column label="Nghĩa">
                    <template #default="scope">
                        {{ scope.row.meaning }}
                    </template>
                </el-table-column>
                <el-table-column label="Audio">
                    <template #default="scope">
                        <audio :src="scope.row.audio_url" controls
                            style="width: 110px; height: 28px; transform: scale(0.85); transform-origin: left;"></audio>
                    </template>
                </el-table-column>

                <el-table-column label="Ví dụ">
                    <template #default="scope">
                        {{ scope.row.example }}
                    </template>
                </el-table-column>
                <el-table-column label="Image">
                    <template #default="scope">
                        <img :src="scope.row.image_url" alt="image"
                            style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;" />
                    </template>
                </el-table-column>
                <el-table-column align="right" label="Thao tác">
                    <template #default="scope">
                        <el-button type="primary" :icon="Edit"
                            @click.stop="openEdit(scope.$index, scope.row)"></el-button>
                        <el-button type="danger" :icon="Delete" circle
                            @click.stop="handleDelete(scope.$index, scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
                layout="total, prev, pager, next, sizes" @current-change="fetchVocabularies"
                @size-change="fetchVocabularies" />
        </div>
    </div>
    <DialogCreateOrEditVocabulary v-model:dialogVisible="dialogVisible" :form="form" :rules="rules" :mode="mode"
        :form-loading="formLoading" @onSuccess="handleGetVocabulary" />
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { listVocabulary, deleteVocabulary }  from '@/api/vocabulary.js';
import {
    Delete,
    Edit,
    Search,
} from '@element-plus/icons-vue'
import DialogCreateOrEditVocabulary from '@/views/vocabulary/dialog-create-or-edit-vocabulary.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';


interface Vocabulary {
    id: number;
    kanji: string;
    kana: string;
    romaji: string;
    meaning: string;
    jlpt_level?: string | null;
    audio_url?: string;
    example?: string;
    image_url?: string;
    category_key: string;
    [key: string]: any;
}

const vocabularies = ref<Vocabulary[]>([]);
const search = ref('')
const loading = ref(true)
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

onMounted(() => {
    fetchVocabularies();
    loading.value = false;
});

function fetchVocabularies() {
    listVocabulary({ page: currentPage.value, pageSize: pageSize.value })
        .then((res) => {
            console.log('Vocabularies fetched:', res.data);
            if (res && Array.isArray(res.data)) {
                vocabularies.value = res.data.map((item: any) => ({
                    id: item.id,
                    kanji: item.kanji,
                    kana: item.kana,
                    romaji: item.romaji,
                    meaning: item.meaning,
                    jlpt_level: item.jlpt_level,
                    audio_url: item.audio_url,
                    example: item.example,
                    image_url: item.image_url,
                    category_key: item.category_key,
                }));
                total.value = res.total || 0;
            } else {
                console.error('Invalid response format for vocabularies:', res);
            }
        })
        .catch((error) => {
            console.error('Error fetching vocabularies:', error);
        })
        .finally(() => {
            loading.value = false;
        })
}

const filterTableData = computed(() =>
    vocabularies.value.filter(
        (data) =>
            !search.value ||
            (data.kanji && data.kanji.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.kana && data.kana.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.romaji && data.romaji.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.meaning && data.meaning.toLowerCase().includes(search.value.toLowerCase()))
    )
);

const form = ref({
    id: '',
    kanji: '',
    kana: '',
    romaji: '',
    meaning: '',
    jlpt_level: '',
    audio_url: '',
    example: '',
    image_url: '',
    category_key: '',
});
const rules = ref({
    kanji: [{ required: true, message: 'Vui lòng nhập Kanji', trigger: 'blur' }],
    kana: [{ required: true, message: 'Vui lòng nhập Kana', trigger: 'blur' }],
    romaji: [{ required: true, message: 'Vui lòng nhập Romaji', trigger: 'blur' }],
    meaning: [{ required: true, message: 'Vui lòng nhập Nghĩa', trigger: 'blur' }],
});

const mode = ref<'add' | 'update'>('add');

const formLoading = ref(false);
const handleGetVocabulary = (formData) => {
    console.log('Form submitted with data:', formData);
    formLoading.value = true;
    fetchVocabularies();
    dialogVisible.value = false;
    formLoading.value = false;
};

const dialogVisible = ref(false);
const openAdd = () => {
    console.log('Open dialog to create or edit vocabulary');
    form.value = {
        id: '',
        kanji: '',
        kana: '',
        romaji: '',
        meaning: '',
        jlpt_level: '',
        audio_url: '',
        example: '',
        image_url: '',
        category_key: '',
    };
    mode.value = 'add';
    dialogVisible.value = true;
}

const openEdit = (index: number, row: Vocabulary) => {
    console.log(index, row)
    Object.assign(form.value, row);
    mode.value = 'update';
    dialogVisible.value = true;
}

const handleDelete = (index: number, row: Vocabulary) => {
    console.log(index, row);
    ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa từ vựng "${row.kanji}" không?`,
        'Xác nhận xóa',
        {
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            type: 'warning',
        }
    ).then(() => {
        deleteVocabulary(row.id)
            .then(() => {
                console.log('Vocabulary deleted:', row.id);
                fetchVocabularies();
                ElMessage.success('Đã xóa thành công!');
            })
            .catch((error) => {
                console.error('Error deleting vocabulary:', error);
                ElMessage.error('Xóa thất bại!');
            });
    }
    ).catch(() => {
        console.log('Delete canceled');
        ElMessage.info('Đã hủy xóa');
    });
};
</script>
<style scoped>
.container {
    width: 95%;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.container-item {
    width: 100%;
    height: calc(100% - 60px);
    padding: 10px;
    overflow-y: auto;
}

.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 2px solid #efecec;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
}

.pagination {
    display: flex;
    justify-content: end;
    padding-right: 10px;
    align-items: center;
}
</style>