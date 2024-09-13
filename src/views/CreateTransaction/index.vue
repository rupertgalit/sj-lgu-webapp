<template>
    <div class="grid px-10 py-5 pb-12 bg-white rounded mx-auto gap-5 h-full w-full">
        <div class="flex place-content-end mt-2 mb-5">
            <Button :disabled="isLoading" label="Add Item" icon="pi pi-plus" class="h-10 w-auto" @click="showCriteriaModal = true" #end></Button>
        </div>
        <div v-for="item in items" class="card relative flex flex-col gap-4 mb:w-auto m-xs:flex-wrap mx-auto my-0 flex-center border w-full m-xs:px-3">
            <div class="absolute right-1 top-1" v-show="items.length > 1">
                <Button icon="pi pi-trash !bg-red-600" size="small" aria-label="Save" severity="danger" @click="removeCriteria(item)" />
            </div>
            <div class="flex flex-column flex-wrap font-semibold text-xl">
                <span>{{ item.name }}</span>
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
                                :disabled="item.isFixedAmount || isLoading"
                                :readonly="item.isFixedAmount || isLoading"
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
        <div class="card flex flex-col gap-4 mb:w-auto mb:flex-wrap mx-auto my-0 flex-center border w-full m-xs:px-3 totality sticky bottom-0">
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
                        <label for="penalty" class="leading-10 text-md">Convenience Fee</label>
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
            <Button label="Review Trasaction" class="h-10 w-auto h-12" size="large" @click="showSummarizeTransactionModal = true" #end></Button>
        </div>
        <Dialog v-model:visible="showCriteriaModal" @update:visible="onCriteriaVisibility" modal :draggable="false" header="Add Criteria" :style="{ width: '25rem' }">
            <div class="flex flex-col md:flex-row gap-4 pb-5">
                <div class="flex flex-wrap gap-2 w-full">
                    <!-- <label for="state">State</label> -->
                    <Select id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select Criteria" class="w-full"></Select>
                </div>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="onCriteriaVisibility"></Button>
                <Button type="button" label="Add" @click="addCriteria"></Button>
            </div>
        </Dialog>
        <Dialog v-model:visible="showSummarizeTransactionModal" :closable="!isLoading" modal :draggable="false" header="Add Criteria" :style="{ width: '50rem' }">
            <div class="flex flex-col gap-3 py-5 px-10 pt-0">
                <div class="grid space-between">
                    <p class="col-start-1 font-semibold xl:text-xl">Criteria</p>
                    <p class="col-start-3 font-semibold xl:text-xl text-right">Amount (&#8369;)</p>
                </div>
                <div v-for="item of items" class="grid space-between">
                    <p class="col-start-1 pl-3 xl:text-xl">{{ item.name }}</p>
                    <p class="col-start-3 text-right xl:text-xl">{{ !item.amount ? '0.00' : formatCurrency(item.amount) }}</p>
                </div>
                <Divider class="!m-1" />
                <div class="grid space-between">
                    <p class="col-start-1 pl-3 xl:text-xl">Sub-Total</p>
                    <p class="col-start-3 text-right xl:text-xl">{{ subTotal == 0 ? '0.00' : formatCurrency(subTotal) }}</p>
                </div>
                <div class="grid space-between">
                    <p class="col-start-1 pl-3 xl:text-xl text-teal-800">Convenience Fee</p>
                    <p class="col-start-3 text-right xl:text-xl text-teal-800">{{ convenienceFee == 0 ? '0.00' : formatCurrency(convenienceFee) }}</p>
                </div>
                <Divider class="!m-1" />
                <div class="grid space-between">
                    <p class="col-start-1 pl-3 xl:text-2xl text-lg text-lime-600">Total</p>
                    <p class="col-start-3 text-lg xl:text-2xl text-right text-lime-600">{{ computedTotal == 0 ? '0.00' : formatCurrency(computedTotal) }}</p>
                </div>
            </div>
            <div class="flex justify-end gap-2 flex-col sm:flex-row">
                <Button type="button" class="w-100 md:w-52" size="large" label="Create Transaction" :loading="isLoading" @click="createTransaction()" />
            </div>
        </Dialog>
    </div>
</template>
<style src="./style.sass" scoped></style>
<script setup>
import { TransactionService } from '@/service/TransactionService';
import { computed, onMounted, reactive, ref } from 'vue';

let showCriteriaModal = ref(false);
let showSummarizeTransactionModal = ref(false);
let dropdownItem = ref(null);
let isLoading = ref(false);
let dropdownItems = [
    { id: 1, amount: 0, name: 'Criteria 1' },
    { id: 1, amount: 0, name: 'Criteria 2' },
    { id: 1, amount: 500, name: 'Criteria 3' },
    { id: 1, amount: 0, name: 'Criteria 4' },
    { id: 1, amount: 0, name: 'Criteria 5' }
];
let items = reactive([
    {
        code: 1,
        name: 'Vendor License',
        amount: null
    },
    {
        code: 3,
        name: 'Business Permit',
        amount: null
    }
]);

let subTotal = computed(() => {
    let total = 0;
    for (let item of items) total = total + (item.amount ? item.amount : 0);
    return total;
});
let convenienceFee = computed(() => 0.12 * subTotal.value);
let computedTotal = computed(() => convenienceFee.value + subTotal.value);

function addCriteria() {
    if (!dropdownItem.value) return;
    let item = {
        code: dropdownItem.value.id,
        name: dropdownItem.value.name,
        amount: dropdownItem.value.amount ? dropdownItem.value.amount : null,
        isFixedAmount: !!dropdownItem.value.amount
    };
    if (item.isFixedAmount) item['fixedAmount'] = dropdownItem.value.amount;
    items.unshift(item);
    onCriteriaVisibility();
}

function createTransaction() {
    isLoading.value = true;
    setTimeout(() => (isLoading.value = false), 2000);
    let settledAllAmount = true;

    for (let item of items) {
        if (!settledAllAmount) continue;
        settledAllAmount = !!item.amount;
    }

    console.log(settledAllAmount);
    TransactionService.createTransaction(items);
}

function removeCriteria(item) {
    items.splice(
        items.findIndex((_item) => item.name == _item.name),
        1
    );
}

function onCriteriaVisibility() {
    showCriteriaModal.value = false;
    dropdownItem.value = null;
}

function anAmountChange(val, item) {
    if (item.isFixedAmount) item.amount = item.fixedAmount;
}

function formatCurrency(value) {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // return parseFloat(value).toFixed(2);
}

function formatDate(value) {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const totalItemsProp = (prop) => {};

onMounted(() => {
    TransactionService.getAllTransaction();
});
</script>
