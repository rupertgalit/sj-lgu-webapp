<template>
    <div class="card">
        <div class="font-semibold text-xl p-2 pl-4 mb-4 bg-slate-200 rounded-md">{{ useRoute().name }} Detail</div>
        <div class="flex justify-end mb-2"><Button size="small" label="Add Item" severity="success" icon="pi pi-plus" class="mr-4" @click="data.addItem.show = true" /></div>
        <Skeleton v-if="preLoader" width="100%" height="65vh"></Skeleton>
        <DataTable
            v-else
            paginator
            striped-rows
            removable-sort
            ref="categoriesT"
            class="footer-bg-none border-x-2"
            dataKey="id"
            tableStyle="min-width: 100%"
            v-model:filters="data.filter"
            :loading="isLoading"
            :value="categories"
            :rows="data.pagination.length"
            :rows-per-page-options="[5, 10, 20]"
            :globalFilterFields="['id', 'Category_Name', 'Amount']"
            @sort="sortUpdate"
        >
            <template #empty>No item data found.</template>
            <template #loading>Preparing item data. Please wait.</template>
            <template #header>
                <div class="flex justify-end bg-white-900">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="data.filter.global.value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <Column field="id" header="Id">
                <template #body="{ data }">{{ data.id }}</template>
            </Column>
            <Column sortable field="Category_Name" header="Name">
                <template #body="{ data }">{{ data.Category_Name }}</template>
            </Column>
            <Column sortable field="Amount" header="Amount" dataType="number" class="!text-right">
                <template #body="{ data }">{{ formatCurrency(data.Amount) }}</template>
            </Column>
            <Column field="created_at" header="Created" dataType="date" sortable>
                <template #body="slotProps">{{ slotProps.data.created_at }}</template>
            </Column>
            <Column field="updated_at" header="Last Updated" dataType="date" sortable>
                <template #body="slotProps">{{ slotProps.data.updated_at }}</template>
            </Column>
            <Column class="!text-right">
                <template #body="{ data }">
                    <!-- <Menu ref="menu" :model="overlayMenuItems" :popup="true" class="!min-w-44">
                        <template #item="_data">
                            <div class="cursor-pointer" @click="nextTick(toggleMenuItem(_data.label))">
                                <i :class="_data.item.icon" class="p-3 px-4"></i>
                                {{ _data.item.label }}
                            </div>
                        </template>
                    </Menu> -->
                    <Button class="hover:!bg-primary hover:!text-white" size="small" type="button" icon="pi pi-file-edit" icon-pos="left" :id="data.id" @click="toEdit" style="width: auto" rounded link>
                        <template #icon="data"><i :class="`${data.class} pi pi-file-edit xl:!text-2xl !text-lg xl:!h-9 xl:!w-5`"></i></template>
                    </Button>
                    <!-- < class="pi pi-file-edit cursor-pointer text-white hover:opacity-90 hover:text-primary bg-primary rounded-full p-1" :id="data.id" @click="toEdit" :style="{ fontSize: '1.2rem' }"></i> -->
                </template>
            </Column>
        </DataTable>
        <Dialog class="header-mb-1 header-pb-1 header-pt-1" v-model:visible="data.addItem.show" @update:visible="closeAddItem" :closable="!data.addItem.isLoading" modal :draggable="false" :style="{ maxWidth: '50rem', minWidth: '25rem' }">
            <template #header="_data">
                <div :class="_data.class">{{ data.addItem.isEdit ? 'Update' : 'Add' }} Item</div>
            </template>
            <div class="flex flex-col gap-3 py-5 pt-0">
                <FloatLabel class="mt-5">
                    <InputText class="w-full" id="categoryName" :invalid="data.addItem.invalid.name" v-model="data.addItem.data.Category_Name" :disabled="data.addItem.isLoading" @update:modelValue="data.addItem.invalid.name = false" />
                    <label :class="{ '!text-red-400': data.addItem.invalid.name }" class="tracking-wider" for="categoryName">Category Name</label>
                </FloatLabel>
                <div class="pb-1 pl-2 gap-3 items-center inline-flex"><Checkbox v-model="data.addItem.fixedAmount" binary :disabled="data.addItem.isLoading" /> with fixed amount ?</div>
                <FloatLabel class="mt-3" v-show="data.addItem.fixedAmount">
                    <InputNumber
                        id="amount"
                        v-model="data.addItem.data.Amount"
                        :disabled="data.addItem.isLoading"
                        :invalid="data.addItem.invalid.amount"
                        placeholder="0.00"
                        inputId="locale-user"
                        :minFractionDigits="2"
                        :maxFractionDigits="2"
                        @input="(e) => (data.addItem.invalid.amount = !e)"
                        class="currency border-0 border-b-1 w-full"
                    />
                    <label class="tracking-wider" for="amount" :class="{ '!text-red-400': data.addItem.invalid.amount }">Amount</label>
                </FloatLabel>
            </div>
            <div class="flex justify-end gap-2 flex-col sm:flex-row">
                <Button type="button" class="w-100 md:w-auto" size="small" severity="secondary" label="Cancel" :disabled="data.addItem.isLoading" @click="closeAddItem" />
                <Button type="button" class="w-100 md:w-auto" size="small" :label="data.addItem.isEdit ? `Update` : `Add`" :loading="data.addItem.isLoading" @click="makeItem(data.addItem.isEdit)" />
            </div>
        </Dialog>
    </div>
</template>
<style src="./style.sass" scoped></style>
<script setup>
import { formatCurrency, formatDate } from '@/helper';
import { CategoryService } from '@/service/CategoryService';
import { FilterMatchMode } from '@primevue/core/api';
import { inject, nextTick, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const data = reactive({
    addItem: { show: false, fixedAmount: false, isEdit: false, isLoading: false, invalid: { name: false, amount: false }, data: { Category_Name: '', Amount: null } },
    pagination: {
        page: 1,
        length: 10,
        totalCount: 0,
        first: 0,
        sortOrder: -1,
        sortField: 'created_at'
    },
    filter: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
});
const menu = ref(null);
const categoriesT = ref(null);
const toast = inject('toast');
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
        label: 'Edit',
        icon: 'pi pi-file-edit',
        command: () => toEdit()
    }
]);
const categories = ref([]);
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
async function paginate(e) {
    data.pagination = { ...data.pagination, page: e.page + 1, length: e.rows, first: e.rows != data.pagination.length ? 0 : e.first };
    // await fetchCategories();
}

function sortUpdate({ sortField, sortOrder }) {
    data.pagination = { ...data.pagination, sortOrder, sortField };
}

onMounted(async () => {
    categories.value = await fetchCategories();
    preLoader.value = false;
    if (window.innerHeight < document.body.clientHeight) data.pagination.length = 5;
    window.addEventListener('resize', () => {
        if (window.innerHeight < document.body.clientHeight) data.pagination.length = 5;
        else data.pagination.length = 10;
    });
    await nextTick();
});

async function fetchCategories(method = null) {
    try {
        isLoading.value = true;
        const res = await CategoryService.getAllCategory();

        return res
            .map((data) => {
                let _data = { ...data, created_at: data.created_at ? formatDate(new Date(data.created_at), true) : '', updated_at: data.updated_at ? formatDate(new Date(data.updated_at), true) : '' };
                return _data;
            })
            .sort(function (a, b) {
                a = new Date(a.created_at);
                b = new Date(b.created_at);
                return b.getTime() - a.getTime();
                // return a.created_at.localeCompare(b.created_at); // <-- alternative
            });
    } catch (error) {
        toast.add('error', 'Error occured while fetching category items. Please check if you are connected to internet.');
        console.log(error);
    } finally {
        isLoading.value = false;
    }
}

// function formatCurrency(value) {
//     return (typeof value == 'number' ? value : parseFloat(value)).toLocaleString('en-US', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 });
// }

function closeAddItem() {
    data.addItem.show = false;
    data.addItem = { show: false, fixedAmount: false, isLoading: false, invalid: { name: false, amount: false }, data: { Category_Name: '', Amount: null } };
}

async function makeItem(update = false) {
    let hasValue = { categoryName: true, amount: true };
    const { Amount, Category_Name } = data.addItem.data;

    if (data.addItem.fixedAmount && !Amount) hasValue.amount = false;
    if (!Category_Name || !Category_Name.length) hasValue.categoryName = false;

    if (Object.values(hasValue).includes(false)) {
        toast.removeAll();
        if (!hasValue.amount) {
            setTimeout(() => toast.add('info', `Fill the amount field where the fixed amount is checked.`), 200);
            data.addItem.invalid.amount = true;
            document.getElementById('amount').firstChild.focus();
        }
        if (!hasValue.categoryName) {
            toast.add('info', `Fill the category name field.`);
            data.addItem.invalid.name = true;
            document.getElementById('categoryName').focus();
        }
        return;
    }

    try {
        data.addItem.isLoading = true;
        const _amount = data.addItem.fixedAmount ? Amount : 0;
        const res = await CategoryService[update ? 'updateCategory' : 'createCategory']({ Category_Name, Amount: _amount, Is_Fix: data.addItem.fixedAmount ? 1 : 0 }, data.addItem.idToEdit);

        if (!res.status || res.status == 200) {
            toast.add('success', `Category items ${Category_Name} is ${update ? 'updated' : 'created'} successfully`);
            closeAddItem();
            categories.value = await fetchCategories();
            return;
        }
        toast.add('error', `An error occured while ${update ? 'updating' : 'creating'} item.`);
    } catch (error) {
        toast.add('error', `An error occured while ${update ? 'updating' : 'creating'} item.`);
        console.log(error);
    } finally {
        data.addItem.isLoading = false;
    }
}

async function openMenu(e) {
    menu.value.hide();
    data.addItem.idToEdit = e.target.id ? e.target.id : e.target.offsetParent.id;
    await nextTick(() => menu.value.show(e));
}

function toEdit({ target }) {
    const id = target.type ? target.id : target.offsetParent.id;
    const { Category_Name, Amount, Is_Fix } = [...categories.value].find((categ) => id == categ.id);
    data.addItem.idToEdit = id;
    data.addItem.isEdit = true;
    data.addItem.fixedAmount = !!Is_Fix;
    data.addItem.data = { Category_Name, Amount: Amount ? Amount : null };
    data.addItem.show = true;
}

function toggleMenuItem(name) {
    if (name.toLowerCase() == 'download') console.log(name);
    if (name.toLowerCase() == 'edit') toEdit();
}
</script>
