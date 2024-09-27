<script setup>
import { TransactionService } from '@/service/TransactionService';
import { inject, nextTick, onMounted, reactive, ref } from 'vue';
const { user, login, signout } = inject('user');

const data = reactive({
    pagination: {
        page: 1,
        length: 10,
        totalCount: 0,
        first: 0
    },
    filter: ''
});
const menu = ref(null);
const tx = ref(null);
const popover = ref(null);
const poData = ref(null);
const dFilename = ref('filename');
const isLoading = ref(false);
const overlayMenuItems = ref([
    {
        separator: true
    },
    {
        label: 'Download',
        icon: 'pi pi-download'
    },
    {
        label: 'Details',
        icon: 'pi pi-file'
    }
]);
const transactions = ref([
    {
        id: 1,
        Trans_Id: '1298379872',
        Categories: [1, 4, 2, 3],
        Sub_Amount: 14312,
        Convenience_Fee: 1233,
        Total_Amount: 123.123,
        Status: 'Created',
        Transaction_Date: '1/12/2024',
        Settle_Date: '1/13/2024'
    },
    {
        id: 2,
        Trans_Id: '124123123',
        Categories: [1, 4, 2, 3],
        Sub_Amount: 12312,
        Convenience_Fee: 1233,
        Total_Amount: 125.123,
        Status: 'success',
        Transaction_Date: '1/12/2024',
        Settle_Date: null
    },
    {
        id: 3,
        Trans_Id: 123123,
        Categories: 'awdad',
        Convenience_Fee: 123123,
        Sub_Amount: 1245612,
        Total_Amount: 1231,
        Status: 'failed',
        Transaction_Date: '2024-09-05 00:00:00',
        created_at: '2024-09-11T06:45:37.000000Z',
        Settle_Date: '2024-09-11T06:45:37.000000Z'
    }
]);
const preLoader = ref(true);

function getStatus(status) {
    switch (status) {
        case 'FAILED':
            return 'danger';

        case 'SUCCESS':
            return 'success';

        case 'new':
            return 'info';

        case 'CREATED':
            return 'warn';
        case 'PENDING':
            return 'warn';

        case 'renewal':
            return null;
    }
}

async function fetchTransaction() {
    isLoading.value = true;

    let tx = await TransactionService.getAllTransaction({
        ...data.pagination
    });
    const mappedTx = tx.data.map(({ id, Trans_Id, Categories, Penalties, Sub_Amount, Total_Amount, Date_Created, created_at, updated_at }) => {
        return {
            id,
            Trans_Id,
            Categories,
            Sub_Amount,
            Total_Amount,
            Convenience_Fee: Penalties ? Penalties : '-',
            Status: 'failed',
            Transaction_Date: formatDate(new Date(Date_Created)),
            Settle_Date: formatDate(new Date(updated_at))
        };
    });
    transactions.value = Array.apply(mappedTx, transactions.value);
    data.pagination.totalCount = tx.totalCount ?? 0;
    isLoading.value = false;
}

async function paginate(e) {
    data.pagination = { ...data.pagination, page: e.page + 1, length: e.rows, first: e.rows != data.pagination.length ? 0 : e.first };
    await fetchTransaction();
}

onMounted(async () => {
    await fetchTransaction();
    preLoader.value = false;
});

function formatCurrency(value) {
    return (typeof value == 'number' ? value : parseFloat(value)).toLocaleString('en-US', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(value) {
    if (!value || value.length == 0) return '-';
    return new Date(value).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function toggleMenuItem(data, name) {
    if (name.toLowerCase() == 'download') console.log(name);
    if (name.toLowerCase() == 'details') showDetails(data);
}

function showDetails(data) {
    console.log('this data will be shown', data);
}

const openPopOver = (event, data) => {
    if (poData.value?.id != data.id) {
        popover.value.hide();
        poData.value = data;
    }

    nextTick(() => {
        popover.value.show(event);
    });
};
</script>

<template>
    <Skeleton v-if="preLoader" width="100%" height="65vh"></Skeleton>
    <div v-else class="card">
        <div class="font-semibold text-xl mb-4">Transactions</div>

        <DataTable
            striped-rows
            removable-sort
            :export-filename="dFilename"
            exportHeader="San Jose, Batangas LGU Transaction"
            exportFooter="San Jose, Batangas LGU Transaction"
            ref="tx"
            class="footer-bg-none"
            dataKey="id"
            tableStyle="min-width: 100%"
            :loading="isLoading"
            :value="transactions"
            :rows="data.pagination.length"
            :rows-per-page-options="[5, 10, 20]"
            :globalFilterFields="['id', 'Trans_Id', 'Categories', 'Convenience_Fee', 'Total_Amount', 'Status', 'Transaction_Date', 'Settle_Date']"
            :sort-order="-1"
            @update:sorfField="(a) => console.log(a)"
            @update:sorfOrder="(a) => console.log(a)"
        >
            <template #empty>No transaction data found.</template>
            <template #loading>Preparing transaction data. Please wait.</template>
            <template #header>
                <div class="flex justify-between bg-white-900">
                    <div style="text-align: left">
                        <Button class="xl:!text-lg" size="small" icon="pi pi-external-link" label="Export" @click="tx.exportCSV(null, transactions.value)" />
                    </div>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="data.filter" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <Column sortable field="id" header="Reference No.">
                <template #body="{ data }">{{ data.id }}</template>
            </Column>
            <Column field="Trans_Id" header="Transaction No.">
                <template #body="{ data }">{{ data.Trans_Id }}</template>
            </Column>
            <Column field="Categories" header="Criterias">
                <template #body="{ data }"><Button class="xl:!text-lg" size="small" severity="info" label="Show" text @click="openPopOver($event, data)" /></template>
            </Column>
            <Column field="Sub_Amount" header="Sub-Amount" class="!text-right" sortable>
                <template #body="slotProps">{{ formatCurrency(slotProps.data.Sub_Amount) }}</template>
            </Column>
            <Column field="Convenience_Fee" header="Convenience Fee" class="!text-right" sortable>
                <template #body="slotProps">{{ formatCurrency(slotProps.data.Convenience_Fee) }}</template>
            </Column>
            <Column field="Total_Amount" header="Total Amount" class="!text-right" sortable>
                <template #body="slotProps">{{ formatCurrency(slotProps.data.Total_Amount) }}</template>
            </Column>
            <Column field="Status" header="Status">
                <template #body="{ data }">
                    <Tag
                        :value="data.Status.toLowerCase() == 'created' ? 'pending' : data.Status.toLowerCase()"
                        :severity="getStatus(data.Status.toUpperCase())"
                        :style="{
                            width: '4.3rem'
                        }"
                    />
                </template>
            </Column>
            <Column sortable field="Transaction_Date" header="Transaction Date">
                <template #body="{ data }">{{ formatDate(data.Transaction_Date) }}</template>
            </Column>
            <Column sortable field="Settle_Date" header="Settled Date">
                <template #body="{ data }">{{ formatDate(data.Settle_Date) }}</template>
            </Column>
            <Column>
                <template #body="{ data }">
                    <Menu ref="menu" :model="overlayMenuItems" :popup="true" class="!min-w-44">
                        <template #item="_data">
                            <div class="cursor-pointer" @click.prevent="toggleMenuItem(data, _data.label)">
                                <i :class="_data.item.icon" class="p-3 px-4"></i>
                                {{ _data.item.label }}
                            </div>
                        </template>
                    </Menu>
                    <Button class="xl:!text-lg" size="small" type="button" label="Actions" icon="pi pi-angle-down" icon-pos="right" @click="menu.show($event)" style="width: auto" />
                </template>
            </Column>
            <template #footer class="!p-0">
                <Paginator
                    :ref="data.pagination.totalCount + data.pagination.page"
                    :class="{
                        'pointer-events-none opacity-60': isLoading
                    }"
                    class="rounded-none"
                    template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown RowsPerPageDropdown"
                    @page="paginate"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    :first="data.pagination.first"
                    :rows="data.pagination.length"
                    :totalRecords="data.pagination.totalCount"
                    :rowsPerPageOptions="[10, 20, 30]"
                    :active="false"
                    :disabled="isLoading"
                    :always-show="false"
            /></template>
        </DataTable>

        <Popover ref="popover">{{ poData.Categories }}</Popover>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
