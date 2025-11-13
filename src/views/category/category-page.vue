<template>
    <div class="container">
        <div class="title">
            <div>
                <h2>Danh sách chủ đề từ vựng</h2>
            </div>
            <div class="toolbar">
                <!-- Input tìm kiếm -->
                <el-input v-model="search" size="small" placeholder="Tìm kiếm" style="width: 180px; height: 30px;"
                    clearable>
                    <template #prefix>
                        <el-icon style="font-size: 22px;">
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
                <!-- Nút thêm mới -->
                <el-button type="primary" icon="el-icon-plus" @click="handleAddCategory">
                    Thêm mới
                </el-button>
                <!-- Nút xuất excel -->
                <!-- <el-button type="success" icon="el-icon-document">
                    Xuất Excel
                </el-button> -->
            </div>
        </div>

        <div>
            <el-table v-loading="loading" :data="filterTableData" style="width: 100%">
                <el-table-column label="STT" width="60">
                    <template #default="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <!-- <el-table-column label="ID" prop="id" /> -->
                <!-- <el-table-column label="Mã danh mục" prop="key" />
                <el-table-column label="Tên danh mục" prop="label" />
                <el-table-column label="Màu" prop="color" />
                <el-table-column label="Tiếng Nhật" prop="japanese" />
                <el-table-column label="Kana" prop="kana" />
                <el-table-column label="Romaji" prop="romaji" />
                <el-table-column label="Thứ tự hiển thị" prop="display_order" /> -->
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
                        <el-button type="primary" :icon="Edit" @click="handleUpdate(scope.$index, scope.row)">
                            Edit
                        </el-button>
                        <el-button type="danger" :icon="Delete" circle @click="handleDelete(scope.$index, scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <DialogCreateOrEditCategory v-model:dialogVisible="dialogVisible" :form="form" :rules="rules" :mode="mode"
        :form-loading="formLoading" @onSuccess="handleGetCategory" />
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { listCategory, deleteCategory } from '@/api/category.js';
import {
    Delete,
    Edit,
    Search,
} from '@element-plus/icons-vue'
import DialogCreateOrEditCategory from './dialog-create-or-edit-category.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

interface Category {
    id: number;
    key: string;
    label: string;
    color?: string;
    japanese?: string;
    kana?: string;
    romaji?: string;
    display_order?: number;
    [key: string]: any; // 👈 Cho phép có thêm các field ngoài interface
}

const categories = ref<Category[]>([]);
const search = ref('')
const loading = ref(true)

onMounted(() => {
    fetchCategories();
    loading.value = false;
});

function fetchCategories() {
    listCategory()
        .then((res) => {
            console.log('Categories fetched:', res);
            // Xử lý dữ liệu response 
            if (res && Array.isArray(res)) {
                // categories.value = res;
                // ✅ Chỉ lấy các trường cần
                categories.value = res.map((item: any) => ({
                    id: item.id,
                    key: item.key,
                    label: item.label,
                    color: item.color,
                    japanese: item.japanese,
                    kana: item.kana,
                    romaji: item.romaji,
                    display_order: item.display_order,
                }));
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



const filterTableData = computed(() =>
    categories.value.filter(
        (data) =>
            !search.value ||
            data.label.toLowerCase().includes(search.value.toLowerCase()) ||
            data.key.toLowerCase().includes(search.value.toLowerCase()) ||
            (data.japanese && data.japanese.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.kana && data.kana.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.romaji && data.romaji.toLowerCase().includes(search.value.toLowerCase()))
    )
)

const form = ref({
    id: '',
    key: '',
    label: '',
    color: '',
    japanese: '',
    kana: '',
    romaji: '',
    display_order: 1
});
const rules = ref({
    key: [{ required: true, message: 'Vui lòng nhập mã danh mục', trigger: 'blur' }],
    label: [{ required: true, message: 'Vui lòng nhập tên danh mục', trigger: 'blur' }],
    // Thêm các rules khác nếu cần
});

const mode = ref<'add' | 'update'>('add');


const formLoading = ref(false);
const handleGetCategory = (formData) => {
    // Xử lý lưu dữ liệu (gọi API, validate, v.v.)
    console.log('Form submitted with data:', formData);
    formLoading.value = true;
    // Sau khi xong:
    fetchCategories();
    dialogVisible.value = false;
    formLoading.value = false;
};



const dialogVisible = ref(false);
const handleAddCategory = () => {
    console.log('Open dialog to create or edit category');
    form.value = {
        id: '',
        key: '',
        label: '',
        color: '',
        japanese: '',
        kana: '',
        romaji: '',
        display_order: 1
    };
    dialogVisible.value = true;
}

const handleUpdate = (index: number, row: Category) => {
    console.log(index, row)
    Object.assign(form.value, row);
    mode.value = 'update';
    dialogVisible.value = true;
}

const handleDelete = (index: number, row: Category) => {
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
                // Cập nhật lại danh sách sau khi xóa
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


</script>
<style scoped>
.container {
    width: 95%;
    height: 100%;
    padding: 10px;
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
</style>