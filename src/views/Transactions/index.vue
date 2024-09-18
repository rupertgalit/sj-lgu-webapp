<script setup>
import { TransactionService } from '@/service/TransactionService';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { inject, onBeforeMount, reactive, ref } from 'vue';
const { user, login, signout } = inject('user');

const customers1 = ref(null);
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
        Penalties: 123123,
        Sub_Amount: 1245612,
        Total_Amount: 12312,
        Date_Created: '2024-09-05 00:00:00',
        created_at: '2024-09-11T06:45:37.000000Z',
        updated_at: '2024-09-11T06:45:37.000000Z'
    }
]);
const preLoader = ref(true);
const customers2 = ref(null);
const customers3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const balanceFrozen = ref(false);
const expandedRows = ref([]);
const statuses = reactive(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = reactive([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

function getOrderSeverity(order) {
    switch (order.status) {
        case 'DELIVERED':
            return 'success';

        case 'CANCELLED':
            return 'danger';

        case 'PENDING':
            return 'warn';

        case 'RETURNED':
            return 'info';

        default:
            return null;
    }
}

function getSeverity(status) {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warn';

        case 'renewal':
            return null;
    }
}

function getStatus(status) {
    switch (status) {
        case 'FAILED':
            return 'danger';

        case 'SUCCESS':
            return 'success';

        case 'new':
            return 'info';

        case 'CREATED' || 'PENDING':
            return 'warn';

        case 'renewal':
            return null;
    }
}

function getStockSeverity(product) {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
}

onBeforeMount(async () => {
    // ProductService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    // CustomerService.getCustomersSmall().then((data) => {
    //     customers1.value = data;
    //     loading1.value = false;
    //     customers1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    // });
    let tx = await TransactionService.getAllTransaction();
    const mappedTx = tx.map(({ id, Trans_Id, Categories, Penalties, Sub_Amount, Total_Amount, Date_Created, created_at, updated_at }) => {
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
    transactions.value = mappedTx;
    preLoader.value = false;
    initFilters1();
});

function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
}

function formatCurrency(value) {
    return (typeof value == 'number' ? value : parseFloat(value)).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(value) {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
</script>

<template>
    <Skeleton v-if="preLoader" width="100%" height="65vh"></Skeleton>
    <div v-else class="card">
        <div class="font-semibold text-xl mb-4">Transactions</div>
        <!-- <DataTable
            :value="customers1"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            v-model:filters="filters1"
            removableSort
            :sortOrder="-1"
            :loading="true"
            :filters="filters1"
            :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
            showGridlines
        >
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters1['global'].value" placeholder="Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No transaction found. </template>
            <template #loading> Loading transaction data. Please wait. </template>
            <Column sortable field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                </template>
            </Column>
            <Column sortable header="Country" field="country.name" filterField="country.name" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" />
                        <span>{{ data.country.name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
                </template>
                <template #filterclear="{ filterCallback }">
                    <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                </template>
                <template #filterapply="{ filterCallback }">
                    <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                </template>
            </Column>
            <Column sortable header="Agent" filterField="representative" field="representative.name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <img :alt="data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`" style="width: 32px" />
                        <span>{{ data.representative.name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <img :alt="slotProps.option.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`" style="width: 32px" />
                                <span>{{ slotProps.option.name }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>
            <Column sortable header="Date" filterField="date" filter="date" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatDate(data.date) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                </template>
            </Column>
            <Column :sortable="true" header="Balance" filter="balance" dataType="number" style="min-width: 10rem">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.balance) }}
                </template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                </template>
            </Column>
            <Column sortable header="Status" field="status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getSeverity(data.status)" />
                </template>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="statuses" placeholder="Select One" showClear>
                        <template #option="slotProps">
                            <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                        </template>
                    </Select>
                </template>
            </Column>
            <Column sortable field="activity" header="Activity" :showFilterMatchModes="false" style="min-width: 12rem">
                <template #body="{ data }">
                    <ProgressBar :value="data.activity" :showValue="false" style="height: 6px"></ProgressBar>
                </template>
                <template #filter="{ filterModel }">
                    <Slider v-model="filterModel.value" range class="m-4"></Slider>
                    <div class="flex items-center justify-between px-2">
                        <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                        <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
                    </div>
                </template>
            </Column>
            <Column sortable field="verified" header="Verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                <template #body="{ data }">
                    <i class="pi" :class="{ 'pi-check-circle text-green-500 ': data.verified, 'pi-times-circle text-red-500': !data.verified }"></i>
                </template>
                <template #filter="{ filterModel }">
                    <label for="verified-filter" class="font-bold"> Verified </label>
                    <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary inputId="verified-filter" />
                </template>
            </Column>
        </DataTable> -->
        <DataTable :value="transactions" dataKey="id" paginator :rows="10" :rows-per-page-options="[5, 10, 20]" striped-rows removable-sort :sort-order="-1" tableStyle="min-width: 50rem">
            <template #empty>No transaction data found.</template>
            <template #loading>Preparing transaction data. Please wait.</template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
            </template>
            <Column sortable field="id" header="Reference No.">
                <template #body="{ data }">{{ data.id }}</template>
            </Column>
            <Column field="Trans_Id" header="Transaction No.">
                <template #body="{ data }">{{ data.Trans_Id }}</template>
            </Column>
            <Column field="Categories" header="Criterias">
                <template #body="{ data }">{{ data.Categories ?? '-' }}</template>
            </Column>
            <Column field="Sub_Amount" header="Sub-Amount" sortable>
                <template #body="slotProps">{{ formatCurrency(slotProps.data.Sub_Amount) }}</template>
            </Column>
            <Column field="Convenience_Fee" header="Convenience Fee">
                <template #body="{ data }">{{ data.Convenience_Fee }}</template>
            </Column>
            <Column field="Total_Amount" header="Total Amount" sortable>
                <template #body="slotProps">{{ formatCurrency(slotProps.data.Total_Amount) }}</template>
            </Column>
            <Column field="Status" header="Status">
                <template #body="{ data }"> <Tag :value="data.Status.toLowerCase() == 'created' ? 'pending' : data.Status.toLowerCase()" :severity="getStatus(data.Status.toUpperCase())" /> </template>
            </Column>
            <Column sortable field="Transaction_Date" header="Transaction Date">
                <template #body="{ data }">{{ data.Transaction_Date }}</template>
            </Column>
            <Column sortable field="Settle_Date" header="Settled Date">
                <template #body="{ data }">{{ data.Settle_Date ?? '-' }}</template>
            </Column>
        </DataTable>
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
