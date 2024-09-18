<template>
    <div class="grid px-10 py-5 pb-12 bg-white rounded mx-auto gap-5 h-full w-full">
        <div class="flex place-content-end mt-2 mb-5">
            <Button :disabled="data.isLoading" label="Add Item" icon="pi pi-plus" class="h-10 w-auto" @click="data.showCriteriaModal = true" #end></Button>
        </div>
        <div v-if="!items.length" class="card flex flex-col place-items-center flex-center w-full bg-slate-200">No Criteria</div>
        <div v-else>
            <div v-for="item in items" class="card relative flex flex-col gap-4 mb:w-auto m-xs:flex-wrap mx-auto my-0 flex-center border w-full m-xs:px-3">
                <div class="absolute right-1 top-1">
                    <!-- v-show="items.length > 1" -->
                    <Button icon="pi pi-trash !bg-red-600" size="small" aria-label="Save" severity="danger" @click="removeCriteria(item)" />
                </div>
                <div class="flex flex-column flex-wrap font-semibold text-xl">
                    <span class="capitalize">{{ item.name }}</span>
                    <Button v-if="!item.hasOwnProperty('note')" label="Note" size="small" icon="pi pi-plus" class="h-8 w-auto ml-5" @click="item['note'] = ''" #end></Button>
                    <Button v-else label="Note" size="small" icon="pi pi-trash" class="h-8 w-auto ml-5 !bg-red-600 !border-0" @click="delete item.note" #end></Button>
                </div>
                <div class="flex-col grid gap-5">
                    <Textarea v-show="item.hasOwnProperty('note')" variant="filled" v-model="item.note" rows="2" class="w-full md:w-1/2" cols="10" />
                    <div class="grid grid-cols-3 gap-2">
                        <div class="flex md:col-start-2 col-start-1 gap-2 place-content-end">
                            <label for="amount" class="leading-10">Amount</label>
                        </div>
                        <div class="flex md:col-start-3 col-start-2 col-span-2 gap-2">
                            <InputGroup>
                                <InputGroupAddon>₱</InputGroupAddon>
                                <InputNumber
                                    v-model="item.amount"
                                    placeholder="0.00"
                                    inputId="locale-user"
                                    @update:modelValue="anAmountChange($event, item)"
                                    :disabled="item.isFixedAmount || data.isLoading"
                                    :readonly="item.isFixedAmount || data.isLoading"
                                    :minFractionDigits="2"
                                    :maxFractionDigits="2"
                                    class="currency border-0 border-b-1"
                                />
                            </InputGroup>
                        </div>
                    </div>
                    <!-- <div v-if="item.hasOwnProperty('penalty')" class="grid md:grid-cols-3 grid-cols-2 gap-2">
                    <div class="flex md:col-start-2 col-start-1 gap-2">
                        <label for="penalty" class="leading-10">Penalty</label>
                        <InputGroup>
                            <InputGroupAddon>₱</InputGroupAddon>
                            <InputNumber v-model="item.penalty" placeholder="0.00" inputId="locale-user" :minFractionDigits="2" :maxFractionDigits="2" class="currency border-0 border-b-1" />
                        </InputGroup>
                    </div>
                </div> -->
                </div>
            </div>
        </div>
        <div class="card flex flex-col gap-4 mb:w-auto mb:flex-wrap mx-auto my-0 flex-center border w-full m-xs:px-3 py-3 totality sticky bottom-0">
            <!-- <div class="font-semibold text-xl">{{ item.name }}</div> -->
            <div class="flex-col grid gap-2">
                <div class="grid grid-cols-3 gap-2">
                    <div class="flex lg:col-start-2 col-start-1 gap-2 place-content-end">
                        <label class="leading-10 text-md">Sub-Total</label>
                    </div>
                    <div class="flex lg:col-start-3 col-start-2 col-span-2 gap-2">
                        <InputGroup>
                            <InputGroupAddon>₱</InputGroupAddon>
                            <InputNumber disabled v-model="subTotal" placeholder="0.00" inputId="locale-user" :minFractionDigits="2" :maxFractionDigits="2" variant="filled" class="currency border-0 border-b-1" />
                        </InputGroup>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <div class="flex lg:col-start-2 col-start-1 gap-2 place-content-end">
                        <label for="penalty" class="leading-10 text-md">Convenience Fee (1.8%)</label>
                        <!-- <InputGroup>
                            <InputGroupAddon>₱</InputGroupAddon>
                            <InputNumber disabled v-model="totalPenalty" placeholder="0.00" inputId="locale-user" :minFractionDigits="2" :maxFractionDigits="2" variant="filled" class="currency border-0 border-b-1" />
                        </InputGroup> -->
                    </div>
                    <div class="flex lg:col-start-3 col-start-2 col-span-2 gap-2 place-content-end">
                        <InputGroup class="penalty">
                            <InputGroupAddon>₱</InputGroupAddon>
                            <InputNumber disabled v-model="convenienceFee" placeholder="0.00" inputId="locale-user" :minFractionDigits="2" :maxFractionDigits="2" variant="filled" class="currency border-0 border-b-1" />
                        </InputGroup>
                    </div>
                </div>
                <Divider class="!m-1" />
                <div class="grid grid-cols-3 gap-2">
                    <div class="flex lg:col-start-2 col-start-1 gap-2 place-content-end">
                        <label class="leading-10 text-xl text-bold font-bold">Total</label>
                    </div>
                    <div class="flex lg:col-start-3 col-start-2 col-span-2 gap-2">
                        <InputGroup>
                            <InputGroupAddon>₱</InputGroupAddon>
                            <InputNumber disabled v-model="computedTotal" placeholder="0.00" inputId="locale-user" :minFractionDigits="2" :maxFractionDigits="2" variant="filled" class="currency total border-0 border-b-1" />
                        </InputGroup>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex place-content-end mt-2">
            <Button label="Review Trasaction" class="h-10 w-auto h-12" size="large" @click="data.showSummarizeTransactionModal = true" #end></Button>
        </div>
        <Dialog v-model:visible="data.showCriteriaModal" @update:visible="onCriteriaVisibility" modal :draggable="false" header="Add Criteria" :style="{ width: '25rem' }">
            <div class="flex flex-col md:flex-row gap-4 pb-5 h-max">
                <div class="w-full md:w-4/5" v-if="data.customCriteria.custom">
                    <InputText class="w-full" id="customName" placeholder="Name" @keyup.enter="addCriteria" v-model="data.customCriteria.name" />
                </div>
                <Select v-else id="criteria" v-model="data.dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select Criteria" class="w-full md:w-4/5"></Select>
                <Button type="button" :label="data.customCriteria.custom ? 'Option' : 'Custom'" severity="info" @click="data.customCriteria.custom = !data.customCriteria.custom" class="w-auto"></Button>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="onCriteriaVisibility"></Button>
                <Button type="button" label="Add" @click="addCriteria"></Button>
            </div>
        </Dialog>
        <Dialog v-model:visible="data.showSummarizeTransactionModal" :closable="!data.isLoading" modal :draggable="false" header="Add Criteria" :style="{ width: '50rem' }">
            <div class="flex flex-col gap-3 py-5 px-10 pt-0">
                <div class="grid space-between">
                    <p class="col-start-1 font-semibold xl:text-xl pl-2">Criteria</p>
                    <p class="col-start-3 font-semibold xl:text-xl text-right pr-2">Amount (&#8369;)</p>
                </div>
                <div class="container max-h-96 overflow-auto">
                    <div v-for="(item, i) of items" class="grid space-between" :class="{ 'bg-gray-100': i % 2 }">
                        <p class="col-start-1 pl-3 xl:text-xl">{{ item.name }}</p>
                        <p class="col-start-3 text-right xl:text-xl pr-2">{{ !item.amount ? '0.00' : formatCurrency(item.amount) }}</p>
                    </div>
                </div>
                <Divider class="!m-1" />
                <div class="grid space-between">
                    <p class="col-start-1 pl-3 xl:text-xl">Sub-Total</p>
                    <p class="col-start-3 text-right xl:text-xl pr-2">{{ subTotal == 0 ? '0.00' : formatCurrency(subTotal) }}</p>
                </div>
                <div class="grid space-between">
                    <p class="col-start-1 pl-3 xl:text-xl text-teal-800">Convenience Fee (1.8%)</p>
                    <p class="col-start-3 text-right xl:text-xl text-teal-800 pr-2">{{ convenienceFee == 0 ? '0.00' : formatCurrency(convenienceFee) }}</p>
                </div>
                <Divider class="!m-1" />
                <div class="grid space-between">
                    <p class="col-start-1 pl-3 xl:text-2xl text-lg text-lime-600">Total</p>
                    <p class="col-start-3 text-lg xl:text-2xl text-right text-lime-600 pr-2">{{ computedTotal == 0 ? '0.00' : formatCurrency(computedTotal) }}</p>
                </div>
            </div>
            <div class="flex justify-end gap-2 flex-col sm:flex-row">
                <Button type="button" class="w-100 md:w-52" size="large" severity="success" label="Create Transaction" :loading="data.isLoading" @click="createTransaction()" />
            </div>
        </Dialog>
    </div>
</template>
<style src="./style.sass" scoped></style>
<script setup>
import { TransactionService } from '@/service/TransactionService';
import { useToast } from 'primevue/usetoast';
import { computed, nextTick, onMounted, reactive, ref } from 'vue';

const toast = useToast();
const data = reactive({
    showCriteriaModal: false,
    showSummarizeTransactionModal: false,
    dropdownItem: null,
    isLoading: false,
    customCriteria: { custom: false, name: '' }
});
// const toast = useToast();
// const showCriteriaModal = ref(false);
// const showSummarizeTransactionModal = ref(false);
// const dropdownItem = ref(null);
// const isLoading = ref(false);
// const customCriteria = ref({ custom: false, name: '' });
const dropdownItems = [
    { id: 1, amount: 0, name: 'Criteria 1' },
    { id: 1, amount: 0, name: 'Criteria 2' },
    { id: 1, amount: 500, name: 'Criteria 3' },
    { id: 1, amount: 0, name: 'Criteria 4' },
    { id: 1, amount: 0, name: 'Criteria 5' }
];
const items = ref([]);

const createdTransaction = ref(null);

let subTotal = computed(() => {
    let total = 0;
    for (let item of items.value) total = total + (item.amount ? item.amount : 0);
    return total;
});
const convenienceFee = computed(() => 0.018 * subTotal.value);
const computedTotal = computed(() => convenienceFee.value + subTotal.value);

async function addCriteria() {
    let item = {};
    if (data.customCriteria.custom) {
        if (!data.customCriteria.name) {
            await nextTick();
            document.getElementById('customName').focus();
            showToast('Error', 'Input the custom criteria name.');
            return;
        }
        item = {
            code: 0,
            name: data.customCriteria.name,
            amount: null
        };
    } else {
        if (!data.dropdownItem) {
            await nextTick();
            document.querySelector('#criteria .p-select-dropdown').click();
            showToast('Error', 'Select a critera.');
            return;
        }
        item = {
            code: data.dropdownItem.id,
            name: data.dropdownItem.name,
            amount: data.dropdownItem.amount ? data.dropdownItem.amount : null,
            isFixedAmount: !!data.dropdownItem.amount
        };
        if (item.isFixedAmount) item['fixedAmount'] = data.dropdownItem.amount;
    }
    items.value.unshift(item);
    onCriteriaVisibility();
}

function showToast(serverity, message, summary = null) {
    const capitalize = () => {
        return serverity.charAt(0).toUpperCase() + serverity.slice(1);
    };
    toast.add({ severity: serverity.toLowerCase(), summary: summary ?? capitalize(), detail: message, life: 3000 });
}

async function createTransaction() {
    data.isLoading = true;
    let settledAllAmount = true;

    const Date_Created = formatDateForQuery(new Date());

    for (let item of items.value) {
        if (!settledAllAmount) continue;
        settledAllAmount = !!item.amount;
    }

    if (!settledAllAmount) {
        data.isLoading = false;
        showToast('Info', 'Fill all amount field of each categories.');
        return;
    }

    const res = await TransactionService.createTransaction({ Trans_Id: '12312324', Categories: items.value.map((item) => item.code).join(','), Sub_Amount: subTotal.value, Total_Amount: computedTotal.value, Date_Created });
    if (res.status == 200) {
        showToast('success', 'Transaction created successfully.');
        data.isLoading = false;
        data.showSummarizeTransactionModal = false;
        items.value = [];
    }
}

function removeCriteria(item) {
    items.value.splice(
        items.value.findIndex((_item) => item.name == _item.name),
        1
    );
}

function onCriteriaVisibility() {
    data.showCriteriaModal = false;
    data.dropdownItem = null;
    data.customCriteria = {
        custom: false,
        name: ''
    };
}

function anAmountChange(val, item) {
    if (item.isFixedAmount) item.amount = item.fixedAmount;
}

function formatCurrency(value) {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(value) {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateForQuery(date) {
    return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

const totalItemsProp = (prop) => {};

onMounted(() => {});
</script>
