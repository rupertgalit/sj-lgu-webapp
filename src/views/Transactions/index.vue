<script setup>
import TransactionDetails from '@/components/TransactionDetails.vue';
import { formatCurrency, formatDate } from '@/helper';
import PrintPlugin from '@/helper/print';
import { CategoryService } from '@/service/CategoryService';
import { TransactionService } from '@/service/TransactionService';
import { inject, nextTick, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const data = reactive({
    pagination: {
        page: 0,
        length: 10,
        totalCount: 0,
        first: 0,
        sort: 'Date_Created',
        direction: 'desc'
    },
    filter: '',
    categories: [],
    txDetails: {
        selected: null,
        show: false,
        tx: {}
    },
    frozeSettleDate: ref(true)
});
const toast = inject('toast');
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
        label: 'Payment Info',
        icon: 'pi pi-print',
        code: 'print'
    },
    {
        label: 'Details',
        icon: 'pi pi-file',
        code: 'detail'
    }
]);
const transactions = ref([
    {
        id: 1,
        Trans_Id: '1298379872',
        Categories: [1, 4, 2, 3],
        Sub_Amount: 14312,
        Penalties: 1233,
        Total_Amount: 123.123,
        Status: 'Created',
        Transaction_Date: '1/12/2024',
        updated_at: '1/13/2024'
    },
    {
        id: 2,
        Trans_Id: '124123123',
        Categories: [1, 4, 2, 3],
        Sub_Amount: 12312,
        Penalties: 1233,
        Total_Amount: 125.123,
        Status: 'success',
        Transaction_Date: '1/12/2024',
        updated_at: null
    },
    {
        id: 3,
        Trans_Id: 123123,
        Categories: 'awdad',
        Penalties: 123123,
        Sub_Amount: 1245612,
        Total_Amount: 1231,
        Status: 'failed',
        Transaction_Date: '2024-09-05 00:00:00',
        created_at: '2024-09-11T06:45:37.000000Z',
        updated_at: '2024-09-11T06:45:37.000000Z'
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
    const { length, page, sort, direction } = data.pagination;
    try {
        let tx = await TransactionService.getAllTransaction(length, page + 1, { sort, direction });

        if (tx.status && !tx.data.length) throw tx;

        data.pagination.totalCount = tx.pagination.total;
        const mappedTx = parseTx(tx.data ?? tx);
        transactions.value = mappedTx;
    } catch (error) {
        toast.add('error', 'Error occured upon request.');
        return false;
    }
    // transactions.value = Array.apply(mappedTx, transactions.value);
    isLoading.value = false;
}

function parseTx(_data) {
    return _data.map(({ id, Trans_Id, Reference_No, Name, Company, Categories, Penalties, Sub_Amount, Total_Amount, Date_Created, created_at, updated_at }) => {
        Categories = Categories.split(',').map((cat) => {
            return data.categories.find((_cat) => _cat.id == cat) ?? { Category_Name: 'N/A' };
        });
        return {
            id,
            Trans_Id,
            Reference_No,
            Name,
            Company,
            Categories,
            Sub_Amount,
            Total_Amount,
            Penalties,
            Status: 'failed',
            Date_Created: formatDate(Date_Created, true),
            updated_at: formatDate(updated_at, true)
        };
    });
}

async function paginate(e) {
    data.pagination.page = e.rows != data.pagination.length ? 0 : e.page;
    data.pagination.length = e.rows;
    data.pagination.first = e.rows * data.pagination.page;
    data.pagination = { ...data.pagination };
    if ((await fetchTransaction()) == false) {
        data.pagination.page--;
        data.pagination.first = e.rows * data.pagination.page;
    }
}

onMounted(async () => {
    data.categories = await CategoryService.getAllCategory();
    await fetchTransaction();
    preLoader.value = false;
    const css = `
    <style>
     .container {
                width: 99%;
                height: 60rem;
                border: 1px solid #00000010;
                display: grid;
                gap: 5px;
                grid-template:
                    'head head' 10%
                    'bd sum' 50%
                    'bd qr' 29%
                    'foot foot' 10%;
            }
            header,
            break-down,
            summation,
            footer,
            QR,
            outlets {
                overflow: hidden;
                border: 1px solid #00000030;
            }
            header {
                grid-area: head;
            }
            footer {
                grid-area: foot;
            }
            summation {
                grid-area: sum;
            }
            break-down {
                grid-area: bd;
            }
            QR {
                grid-area: qr;
            }
            outlets {
                grid-area: outlets;
            }

            break-down {
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            item {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                padding: 0 1rem 0 1rem;
            }

            .item,
            .amount {
                padding-top: 1rem;
            }

            .amount,
            .amount-header {
                padding-left: 1rem;
            }

            .item,
            .item-header {
                padding-right: 1rem;
            }

            item:first-child{
                padding-top: 1rem;
                padding-bottom: .5rem;
                background-color: #6088b4;
            }


            QR {
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
            svg {
                width: 120px
            }

            @print {
                @page :footer, @page :header {
                    display: none
                }
            }

    </style>
    `;
    PrintPlugin.print(
        css +
            `<div class="container">
        <header>Payment Information</header>
        <break-down>
            <item>
                <span>Item(s)</span>
                <span>Amount(P)</span>
            </item>
            <item>
                <span class="item">Barangay Clearance</span>
                <span class="amount">350.00</span>
            </item>
            <item>
                <span class="item">Business Permit</span>
                <span class="amount">1,000.00</span>
            </item><item>
                <span class="item">Other Fee</span>
                <span class="amount">580.00</span>
            </item>
        </break-down>
        <summation>

        </summation>
        <QR>
            <div>jkyasdi</div>
            ${PrintPlugin.makeQR('ashjdloj0sd.asdasdaspijdfa09a;f.@.sdfsdikjf9u@./@/.sdoihjasd987opij')}
        </QR>
        <footer></footer>

        </div>`
    );
});

function toggleMenuItem(_data) {
    console.log(_data);
    if (_data.code == 'print') {
        console.log(_data.code);
    }
    if (_data.code == 'detail') data.txDetails.show = true;
}

function showDetails(_data) {}

async function searchTx() {
    try {
        isLoading.value = true;
        const res = await TransactionService.searchTx(data.filter);
        if (!res.status || res.status == 200) {
            transactions.value = parseTx(res.data ?? res);
            return;
        }

        toast.add('error', 'Error occured upon request.');
    } catch (error) {
        toast.add('error', 'Error occured upon request.');
    } finally {
        isLoading.value = false;
    }
}

function exportData() {
    dFilename.value = `transaction-${Date()}`;
    nextTick(() => {
        const _transactions = transactions.value.map((tx) => {
            return {
                ...tx,
                Categories: data.categories.find((cat) => cat.id == tx.Categories)?.Category_Name ?? 'n/a',
                Total_Amount: formatCurrency(tx.Total_Amount, 'PHP'),
                Sub_Amount: formatCurrency(tx.Sub_Amount, 'PHP'),
                Penalties: formatCurrency(tx.Penalties, 'PHP'),
                Date_Created: formatDate(tx.Date_Created, true),
                updated_at: formatDate(tx.updated_at, true)
            };
        });
        tx.value.exportCSV(null, _transactions);
    });
}

function showMenu(evt, _data) {
    menu.value.hide();
    data.txDetails.selected = _data.id;
    data.txDetails.tx = _data;

    nextTick(() => {
        menu.value.show(evt);
    });
}

async function _sort(_data) {
    data.pagination.sort = _data.sortField ?? 'Date_Created';
    data.pagination.direction = _data.sortOrder <= 0 ? 'desc' : 'asc';
    data.pagination.page = 0;
    data.pagination.first = 0;
    await fetchTransaction();
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
    <div class="card">
        <div class="font-semibold text-xl p-2 pl-4 mb-4 bg-slate-200 rounded-md">{{ useRoute().name }}</div>

        <Skeleton v-if="preLoader" width="100%" height="65vh"></Skeleton>
        <DataTable
            v-else
            striped-rows
            removable-sort
            :export-filename="dFilename"
            exportHeader="San Jose, Batangas LGU Transaction"
            exportFooter="San Jose, Batangas LGU Transaction"
            ref="tx"
            class="footer-bg-none border-x-2"
            dataKey="id"
            :loading="isLoading"
            :value="transactions"
            :rows="data.pagination.length"
            :rows-per-page-options="[5, 10, 20]"
            :globalFilterFields="['id', 'Trans_Id', 'Categories', 'Penalties', 'Total_Amount', 'Status', 'Transaction_Date', 'updated_at']"
            @sort="_sort"
        >
            <template #empty>No transaction data found.</template>
            <template #loading>Preparing transaction data. Please wait.</template>
            <template #header>
                <div class="flex md:flex-row flex-col justify-between bg-white-900">
                    <div style="text-align: left" class="mb:mb-0 mb-2">
                        <Button class="2xl:!text-lg" size="small" icon="pi pi-external-link" label="Export" @click="exportData" />
                    </div>
                    <InputGroup class="md:!w-2/5 w-full">
                        <InputText placeholder="Keyword" @keyup.enter="searchTx" v-model="data.filter" />
                        <Button label="Search" @click="searchTx" />
                    </InputGroup>
                    <!-- <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="data.filter" placeholder="Keyword Search" />
                    </IconField> -->
                </div>
            </template>

            <Column field="Trans_Id" header="Transaction No." frozen>
                <template #body="{ data }">{{ data.Trans_Id }}</template>
            </Column>
            <Column field="Reference_No" header="Reference No.">
                <template #body="{ data }">{{ data.Reference_No }}</template>
            </Column>
            <Column field="Name" header="Name">
                <template #body="{ data }">{{ data.Name ?? '-' }}</template>
            </Column>
            <Column field="Company" header="Company">
                <template #body="{ data }">{{ data.Company ?? '-' }}</template>
            </Column>
            <Column field="Categories" header="Categories">
                <template #body="{ data }"><Button class="2xl:!text-lg" size="small" severity="info" label="Show" text @click="openPopOver($event, data)" /></template>
            </Column>
            <Column field="Sub_Amount" header="Sub-Amount" class="!text-right">
                <template #body="slotProps">{{ formatCurrency(slotProps.data.Sub_Amount) }}</template>
            </Column>
            <Column field="Penalties" header="Convenience Fee" class="!text-right">
                <template #body="slotProps">{{ formatCurrency(slotProps.data.Penalties) }}</template>
            </Column>
            <Column field="Total_Amount" header="Total Amount" class="!text-right">
                <template #body="slotProps">{{ formatCurrency(slotProps.data.Total_Amount) }}</template>
            </Column>
            <Column field="Status" header="Status">
                <template #body="{ data }">
                    <Tag
                        class="select-none"
                        :value="data.Status.toLowerCase() == 'created' ? 'pending' : data.Status.toLowerCase()"
                        :severity="getStatus(data.Status.toUpperCase())"
                        :style="{
                            width: '4.3rem'
                        }"
                    />
                </template>
            </Column>
            <Column sortable field="Date_Created" header="Transaction Date" frozen checked>
                <template #body="{ data }">{{ data.Date_Created }}</template>
            </Column>
            <Column sortable field="updated_at" header="Settled Date">
                <template #body="{ data }">{{ data.updated_at }}</template>
            </Column>
            <Column>
                <template #body="{ data }">
                    <Menu ref="menu" :model="overlayMenuItems" :popup="true" class="!min-w-44">
                        <template #item="{ item }">
                            <div class="cursor-pointer" @click.prevent="toggleMenuItem(item)">
                                <i :class="item.icon" class="p-3 px-4"></i>
                                {{ item.label }}
                            </div>
                        </template>
                    </Menu>
                    <Button class="2xl:!text-lg" size="small" type="button" label="Action" icon="pi pi-angle-down" icon-pos="right" @click="showMenu($event, data)" style="width: auto" />
                </template>
            </Column>
            <template #footer class="!p-0">
                <Paginator
                    ref="paginator"
                    :class="{
                        'pointer-events-none opacity-60': isLoading
                    }"
                    class="rounded-none"
                    template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown RowsPerPageDropdown"
                    @page="paginate"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    v-model:first="data.pagination.first"
                    :rows="data.pagination.length"
                    :totalRecords="data.pagination.totalCount"
                    :rowsPerPageOptions="[10, 20, 30]"
                    :active="false"
                    :disabled="isLoading"
                />
            </template>
        </DataTable>

        <Dialog v-model:visible="data.txDetails.show" no-header modal :draggable="false" :closable="false">
            <Card class="md:w-[50rem] lg:w-[60rem] w-[23rem] !border">
                <template #title class="grid grid-rows-2 !text-base">
                    <div class="px-12 text-base">
                        <div>Tx. Reference: <Chip :label="data.txDetails.tx.Reference_No" /></div>
                        <div class="grid grid-cols-2 mt-5 gap-1">
                            <div>RCPT Name: <Chip :label="data.txDetails.tx.Reference_No" /></div>
                            <div class="text-right">RCPT Company: <Chip :label="data.txDetails.tx.Reference_No" /></div>
                        </div>
                    </div>
                </template>
                <template #content>
                    <TransactionDetails :items="data.txDetails.tx.items ?? []" :sub-total="data.txDetails.tx.Sub_Amount" :total="data.txDetails.tx.Total_Amount" :fee="data.txDetails.tx.Penalties" />
                </template>
                <template #footer>
                    <div class="flex justify-end gap-2">
                        <Button
                            type="button"
                            label="Close"
                            severity="secondary"
                            @click="
                                () => {
                                    data.txDetails.show = false;
                                }
                            "
                        ></Button>
                    </div>
                </template>
            </Card>
        </Dialog>

        <Popover ref="popover">
            <div class="flex flex-wrap justify-center gap-3 max-w-[28rem]">
                <Chip v-for="_category of poData.Categories" :label="_category.Category_Name" />
            </div>
        </Popover>
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
