<template>
    <div class="container">
        <div class="title">
            <div>
                <h2>Danh sách chủ đề từ vựng</h2>
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
            <el-table v-loading="loading" :data="filterTableData"  @row-click="(row) => edit(row.key)"
                style="width: 100%">
                <el-table-column label="STT" width="60">
                    <template #default="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column label="Mã danh mục">
                    <template #default="scope">
                        {{ scope.row.key }}
                    </template>
                </el-table-column>

                <el-table-column label="Tên danh mục">
                    <template #default="scope">
                        {{ scope.row.label }}
                    </template>
                </el-table-column>

                <el-table-column label="Màu">
                    <template #default="scope">
                        <span :style="{ color: scope.row.color }">{{ scope.row.color }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="Tiếng Nhật">
                    <template #default="scope">
                        {{ scope.row.japanese }}
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

                <el-table-column label="Thứ tự hiển thị">
                    <template #default="scope">
                        {{ scope.row.display_order }}
                    </template>
                </el-table-column>
                <el-table-column align="right" label="Thao tác">
                    <template #default="scope">
                        <el-button type="primary" :icon="Edit"
                            @click.stop="edit(scope.row.key)"></el-button>
                        <el-button type="danger" :icon="Delete" circle
                            @click.stop="handleDelete(scope.$index, scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
                layout="total, prev, pager, next, sizes" @current-change="fetchCategories"
                @size-change="fetchCategories" />
        </div>
    </div>
    <DialogCreateOrEditCategory ref="dialogForSubmit" @on-success="handleGetCategory" />
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, provide } from 'vue'
import { listCategory, deleteCategory } from '@/api/category.js';
import {
    Delete,
    Edit,
} from '@element-plus/icons-vue'
import DialogCreateOrEditCategory from './dialog-create-or-edit-category.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

const search = ref('')
const loading = ref(true)
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const listData = ref([]);
const dialogForSubmit = ref(null);

const submitForm = ref({
    title: "",
    id: null,
    open: false,
});

provide("submitForm", submitForm);

onMounted(() => {
    fetchCategories();
    loading.value = false;
});

function fetchCategories() {
    listCategory({ page: currentPage.value, pageSize: pageSize.value })
        .then((res) => {
            console.log('Categories fetched:', res.data);
            if (res && Array.isArray(res.data)) {
                listData.value = res.data.map(item => ({ ...item }));
                total.value = res.total || 0;
            } else {
                console.error('Invalid response format for categories:', res);
            }
        })
        .catch((error) => {
            console.error('Error fetching categories:', error);
        })
        .finally(() => {
            loading.value = false;
        })
}

const handleGetCategory = () => {
    fetchCategories();
};

const add = () => {
    dialogForSubmit.value.showDialog(null);
};
const edit = (key) => {
    dialogForSubmit.value.showDialog(key);
};
const handleDelete = (index: number, row) => {
    console.log(index, row);
    ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa danh mục "${row.label}" không?`,
        'Xác nhận xóa',
        {
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            type: 'warning',
        }
    ).then(() => {
        deleteCategory(row.key)
            .then(() => {
                console.log('Category deleted:', row.key);
                fetchCategories();
                ElMessage.success('Đã xóa thành công!');
            })
            .catch((error) => {
                console.error('Error deleting category:', error);
                ElMessage.error('Xóa thất bại!');
            });
    }
    ).catch(() => {
        console.log('Delete canceled');
        ElMessage.info('Đã hủy xóa');
    });
};

const filterTableData = computed(() =>
    listData.value.filter(
        (data) =>
            !search.value ||
            data.label.toLowerCase().includes(search.value.toLowerCase()) ||
            data.key.toLowerCase().includes(search.value.toLowerCase()) ||
            (data.japanese && data.japanese.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.kana && data.kana.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.romaji && data.romaji.toLowerCase().includes(search.value.toLowerCase()))
    )
)

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