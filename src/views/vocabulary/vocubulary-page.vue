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
                <el-button type="primary" icon="el-icon-plus" @click="add">
                    <el-icon>
                        <Plus />
                    </el-icon> Thêm mới
                </el-button>
            </div>
        </div>

        <div class="container-item">
            <el-table v-loading="loading" :data="filterTableData" @row-click="(row) => edit(row.id)"
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
                <el-table-column label="Danh mục">
                    <template #default="scope">
                        {{ getCategoryLabel(scope.row.category_key) }}
                    </template>
                </el-table-column>
                <el-table-column align="right" label="Thao tác">
                    <template #default="scope">
                        <el-button type="primary" :icon="Edit" @click.stop="edit(scope.row.id)"></el-button>
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
    <DialogCreateOrEditVocabulary ref="dialogForSubmit" @on-success="handleGetVocabulary" />
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, provide } from 'vue'
import { listVocabulary, deleteVocabulary } from '@/api/vocabulary.js';
import { listCategory } from '@/api/category.js';
import {
    Delete,
    Edit,
    Search,
} from '@element-plus/icons-vue'
import DialogCreateOrEditVocabulary from '@/views/vocabulary/dialog-create-or-edit-vocabulary.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

const listData = ref([]);
const search = ref('')
const loading = ref(true)
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogForSubmit = ref(null);

const categories = ref([]);
const categoryMap = ref({} as Record<string, string>);

const submitForm = ref({
    title: "",
    id: null,
    open: false,
});

provide("submitForm", submitForm);

function fetchVocabularies() {
    listVocabulary({ page: currentPage.value, pageSize: pageSize.value })
        .then((res) => {
            console.log('Vocabularies fetched:', res.data);
            if (res && Array.isArray(res.data)) {
                listData.value = res.data.map(item => ({ ...item }));
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

function fetchCategories() {
    listCategory({ page: 1, pageSize: 1000 })
        .then((res) => {
            if (res && Array.isArray(res.data)) {
                categories.value = res.data;
                const map: Record<string, string> = {};
                res.data.forEach((c) => {
                    // common field names: name, title, label, key
                    map[c.key ?? c.id ?? c._id ?? c.slug] = c.name ?? c.title ?? c.label ?? c.key ?? c.id;
                });
                categoryMap.value = map;
            } else {
                console.error('Invalid response format for categories:', res);
            }
        })
        .catch((err) => {
            console.error('Error fetching categories:', err);
        });
}

const handleGetVocabulary = () => {
    fetchVocabularies();
};

const add = () => {
    dialogForSubmit.value.showDialog(null);
}

const edit = (id) => {
    dialogForSubmit.value.showDialog(id);
};

const handleDelete = (index: number, row) => {
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

onMounted(() => {
    fetchCategories();
    fetchVocabularies();
    loading.value = false;
});

const getCategoryLabel = (key: string) => {
    if (!key) return '';
    return categoryMap.value[key] ?? key;
};

const filterTableData = computed(() =>
    listData.value.filter(
        (data) =>
            !search.value ||
            (data.kanji && data.kanji.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.kana && data.kana.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.romaji && data.romaji.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.meaning && data.meaning.toLowerCase().includes(search.value.toLowerCase()))
    )
);

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