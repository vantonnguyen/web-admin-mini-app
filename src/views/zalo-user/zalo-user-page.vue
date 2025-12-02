<template>
    <div class="container">
        <div class="title">
            <div>
                <h2>Danh sách người dùng zalo mini app</h2>
            </div>
            <div class="toolbar">
                <el-input class="search-input" v-model="search" size="small" placeholder="Tìm kiếm"
                    style="width: 180px;" clearable>
                </el-input>
            </div>
        </div>

        <div class="container-item">
            <el-table v-loading="loading" :data="filterTableData" style="width: 100%">
                <el-table-column label="STT" width="60">
                    <template #default="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column label="Mã Zalo">
                    <template #default="scope">
                        {{ scope.row.zalo_id }}
                    </template>
                </el-table-column>
                <el-table-column label="Họ và tên">
                    <template #default="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column label="Số điện thoại">
                    <template #default="scope">
                        {{ scope.row.phone_number?.replace(/^84/, '0') }}
                    </template>
                </el-table-column>
                <el-table-column label="Ảnh đại diện">
                    <template #default="scope">
                        <img :src="scope.row.avatar_url" alt="image"
                            style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;" />
                    </template>
                </el-table-column>
                <el-table-column align="right" label="Thao tác">
                    <template #default="scope">
                        <!-- <el-button type="primary" :icon="Edit" @click.stop="edit(scope.row.id)"></el-button> -->
                        <el-button type="danger" :icon="Delete" circle
                            @click.stop="handleDelete(scope.$index, scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
                layout="total, prev, pager, next, sizes" @current-change="getList" @size-change="getList" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, provide } from 'vue'
import {
    Delete,
    Edit,
    Search,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { listZaloUsers, deleteZaloUser } from '@/api/zalo-user';

const listData = ref([])
const userZalo = ref([]);
const search = ref('');
const loading = ref(true)
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogForSubmit = ref(null);

const submitForm = ref({
    title: "",
    id: null,
    open: false,
    mode: 'add',
    form: null,
});

provide("submitForm", submitForm);

function getList() {
    listZaloUsers({ page: currentPage.value, pageSize: pageSize.value })
        .then((res) => {
            console.log('Zalo users fetched:', res.data);
            if (res && Array.isArray(res.data)) {
                listData.value = res.data.map(item => ({ ...item }));
                total.value = res.total || 0;
            } else {
                console.error('Invalid response format for zalo users:', res);
            }
        })
        .catch((error) => {
            console.error('Error fetching zalo users:', error);
        })
        .finally(() => {
            loading.value = false;
        })
}

const handleGetVocabulary = () => {
    getList();
};


const edit = (id) => {
    dialogForSubmit.value.showDialog(id);
};

const handleDelete = (index: number, row) => {
    console.log(index, row);
    ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa người dùng "${row.name}" không?`,
        'Xác nhận xóa',
        {
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            type: 'warning',
        }
    ).then(() => {
        deleteZaloUser(row.id)
            .then(() => {
                console.log('Zalo user deleted:', row.id);
                getList();
                ElMessage.success('Đã xóa thành công!');
            })
            .catch((error) => {
                console.error('Error deleting zalo user:', error);
                ElMessage.error('Xóa thất bại!');
            });
    }
    ).catch(() => {
        console.log('Delete canceled');
        ElMessage.info('Đã hủy xóa');
    });
};

onMounted(() => {
    getList();
    loading.value = false;
});

const filterTableData = computed(() => {
    const q = (search.value || '').toString().trim().toLowerCase();
    if (!q) return listData.value;
    return listData.value.filter((row) => {
        const zaloId = (row.zalo_id || '').toString().toLowerCase();
        const name = (row.name || '').toString().toLowerCase();
        const phoneRaw = (row.phone_number || '').toString();
        const phoneNorm = phoneRaw.replace(/^84/, '0').toLowerCase();
        return (
            zaloId.includes(q) ||
            name.includes(q) ||
            phoneRaw.toLowerCase().includes(q) ||
            phoneNorm.includes(q)
        );
    });
});



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
}

/* Make the input inner element and button share the same height and sit close */
.search-input ::v-deep .el-input__inner {
    height: 30px;
    line-height: 33px;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    box-sizing: border-box;
    border-radius: 20px;
}

.search-button ::v-deep .el-button,
.search-button .el-button,
.search-button {
    height: 30px;
    display: inline-flex;
    align-items: center;
    padding: 0 10px;
}

.search-button .el-icon {
    margin-right: 6px;
}

.pagination {
    display: flex;
    justify-content: end;
    padding-right: 10px;
    align-items: center;
}
</style>