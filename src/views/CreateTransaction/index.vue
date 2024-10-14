<template>
    <div class="px-10 py-5 pb-12 bg-white rounded mx-auto gap-5 h-full w-full">
        <Stepper v-model:value="data.step" linear>
            <StepList class="m-md:flex m-md:flex-wrap">
                <Step :value="1">Create Transaction</Step>
                <Step :value="2">Review Entry</Step>
                <Step :value="3">Transaction Complete</Step>
            </StepList>
            <Divider />
            <StepPanels>
                <StepPanel :value="1" class="grid gap-4">
                    <div class="flex place-content-end mt-2 mb-5">
                        <Button :disabled="data.isLoading || data.addButtonState" label="Add Item" icon="pi pi-plus" class="h-10 w-auto" @click="data.showCriteriaModal = true" :loading="data.addButtonState"></Button>
                    </div>
                    <div v-if="!items.length" class="card flex flex-col place-items-center flex-center w-full bg-slate-200">No Item</div>
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
                                                :disabled="!!item.isFixedAmount || !!data.isLoading"
                                                :readonly="!!item.isFixedAmount || !!data.isLoading"
                                                :minFractionDigits="2"
                                                :maxFractionDigits="2"
                                                class="currency border-0 border-b-1"
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card flex flex-col gap-4 mb:w-auto mb:flex-wrap mx-auto my-0 flex-center border w-full m-xs:px-3 py-3 totality sticky bottom-0">
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
                        <Button label="Review Transaction" class="h-10 w-auto h-12" size="large" @click="reviewTransaction"></Button>
                    </div>
                </StepPanel>
                <StepPanel :value="2">
                    <Fieldset class="!mb-4 w-11/12 !mx-auto">
                        <template #legend> Recipient </template>
                        <Fluid>
                            <div class="grid md:grid-cols-2 m-md:grid-rows-2 gap-4">
                                <div>
                                    <span class="font-bold mb-2 block">Name</span>
                                    <InputText v-model="data.recipient.name.value" :loading="data.isLoading" :invalid="data.recipient.name.invalid" @update:modelValue="(e) => (data.recipient.name.invalid = !e)" />
                                </div>
                                <div>
                                    <span class="font-bold mb-2 block">Company</span>
                                    <InputText v-model="data.recipient.company.value" :loading="data.isLoading" :invalid="data.recipient.company.invalid" @update:modelValue="(e) => (data.recipient.company.invalid = !e)" />
                                </div>
                            </div>
                        </Fluid>
                    </Fieldset>
                    <TransactionDetails :items="items" :sub-total="subTotal" :total="computedTotal" :fee="convenienceFee" />
                    <div class="flex justify-end gap-2 flex-col sm:flex-row flex-col-reverse">
                        <Button type="button" label="Back" severity="secondary" @click="data.step--"></Button>
                        <Button type="button" class="w-100 md:w-52" size="large" severity="success" label="Create Transaction" :loading="data.isLoading" @click="createTransaction()" />
                    </div>
                </StepPanel>

                <StepPanel :value="3">
                    <div class="w-11/12 !mx-auto mb-3">
                        Reference No.: <Message severity="secondary"> {{ data.finishedTx.refNo ?? 'John Doe' }}</Message>
                    </div>
                    <Fieldset class="!mb-4 w-11/12 !mx-auto">
                        <template #legend> Recipient </template>
                        <Fluid>
                            Name: <Message severity="secondary">{{ data.finishedTx.name ?? 'John Doe' }}</Message> Company: <Message severity="secondary">{{ data.finishedTx.company ?? 'XXX Corp. Inc.' }}</Message>
                        </Fluid>
                    </Fieldset>
                    <TransactionDetails v-if="data.step == 3" :items="data.finishedTx.items" :sub-total="data.finishedTx.subTotal" :total="data.finishedTx.computedTotal" :fee="data.finishedTx.convenienceFee" />
                    <QRCodeComponent
                        v-if="data.step == 3"
                        :data="'00020101021228760011ph.ppmi.p2m0111OPDVPHM1XXX0315777148000000028041652948137246807660503001520460165303608540510.005802PH5907Brankas6015City Of Mandalu62140010ph.allbank88310012ph.ppmi.qrph0111OPDVPHM1XXX6304131E'"
                    />
                    <div class="flex flex-col md:flex-row md:justify-end"><Button class="mb-3 md:mb-0 md:mr-3" label="Print" icon="pi pi-print" /> <Button severity="success" label="New Transaction" @click="data.step = 1" /></div>
                </StepPanel>
            </StepPanels>
        </Stepper>

        <Dialog v-model:visible="data.showCriteriaModal" @update:visible="onCriteriaVisibility" modal :draggable="false" header="Add Item" :style="{ width: '25rem' }">
            <div class="flex flex-col md:flex-row gap-4 pb-5 h-max">
                <div class="w-full md:w-4/5" v-if="data.customCriteria.custom">
                    <InputText class="w-full" id="customName" placeholder="Name" @keyup.enter="addCriteria" v-model="data.customCriteria.name" />
                </div>
                <Select v-else id="criteria" v-model="data.dropdownItem" :options="data.dropdownItems" optionLabel="Category_Name" placeholder="Select Item" class="w-full"></Select>
                <!-- <Button
                    type="button"
                    :label="data.customCriteria.custom ? 'Options' : 'Custom'"
                    :icon="`pi ${data.customCriteria.custom ? 'pi-folder-open' : 'pi-file-edit'}`"
                    severity="info"
                    @click="data.customCriteria.custom = !data.customCriteria.custom"
                    class="w-auto"
                ></Button> -->
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="onCriteriaVisibility"></Button>
                <Button type="button" label="Add" @click="addCriteria"></Button>
            </div>
        </Dialog>
        <Dialog v-model:visible="data.showSummarizeTransactionModal" :closable="!data.isLoading" modal :draggable="false" header="Add Item" :style="{ width: '50rem' }">
            <div class="flex flex-col gap-3 py-5 px-10 pt-0">
                <div class="grid space-between">
                    <p class="col-start-1 font-semibold xl:text-xl pl-2">Item</p>
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
                    <p class="col-start-1 pl-3 xl:text-xl text-teal-800">Convenience Fee</p>
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
import QRCodeComponent from '@/components/QRCodeComponent.vue';
import TransactionDetails from '@/components/TransactionDetails.vue';
import { CategoryService } from '@/service/CategoryService';
import { TransactionService } from '@/service/TransactionService';
import { computed, inject, nextTick, onMounted, reactive, ref } from 'vue';

const toast = inject('toast');
const data = reactive({
    showCriteriaModal: false,
    showSummarizeTransactionModal: false,
    dropdownItem: null,
    isLoading: false,
    customCriteria: { custom: false, name: '' },
    step: 1,
    finishedTx: { item: [], computedTotal: 0, convenienceFee: 0, subTotal: 0 },
    addButtonState: true,
    recipient: { name: { value: '', invalid: false }, company: { value: '', invalid: false } },
    dropdownItems: [
        { id: 1, amount: 0, name: 'Criteria 1' },
        { id: 1, amount: 0, name: 'Criteria 2' },
        { id: 1, amount: 500, name: 'Criteria 3' },
        { id: 1, amount: 0, name: 'Criteria 4' },
        { id: 1, amount: 0, name: 'Criteria 5' }
    ]
});
const items = ref([]);
const finishedTx = ref({ item: [], computedTotal: 0, convenienceFee: 0, subTotal: 0 });
let subTotal = computed(() => {
    let total = 0;
    console.log(items.value.reduce((total, value) => (total += parseFloat(value.amount)), 0));
    for (let item of items.value) total = total + (item.amount ? item.amount : 0);
    return parseFloat(total);
});
const convenienceFee = computed(() => 0.018 * subTotal.value);
const computedTotal = computed(() => convenienceFee.value + subTotal.value);

async function addCriteria() {
    let item = {};
    if (data.customCriteria.custom) {
        if (!data.customCriteria.name) {
            await nextTick();
            document.getElementById('customName').focus();
            toast.add('Error', 'Input the custom item name.');
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
            toast.add('Error', 'Select a critera.');
            return;
        }

        item = {
            code: data.dropdownItem.id,
            name: data.dropdownItem.Category_Name,
            amount: data.dropdownItem.Amount ? data.dropdownItem.Amount : null,
            isFixedAmount: data.dropdownItem.Is_Fix
        };
        if (data.dropdownItem.Is_Fix) item['fixedAmount'] = data.dropdownItem.Amount;
    }
    items.value.unshift(item);
    data.customCriteria.custom = false;
    onCriteriaVisibility();
}

async function createTransaction() {
    const { name, company } = data.recipient;

    if (!name.value.length || !company.value.length) {
        let field = [];
        if (!name.value.length) {
            field.push('Name');
            name.invalid = true;
        }
        if (!company.value.length) {
            field.push('Company');
            company.invalid = true;
        }
        toast.add('warn', `Recipient ${field.join(' and ')} are required`);
        return;
    }

    const Date_Created = formatDateForQuery(new Date());
    data.isLoading = true;

    try {
        const res = await TransactionService.createTransaction({
            Name: data.recipient.name.value,
            Company: data.recipient.company.value,
            Categories: items.value.map((item) => item.code).join(','),
            Sub_Amount: subTotal.value,
            Total_Amount: computedTotal.value,
            Date_Created
        });
        if (res.status != 200) throw false;

        toast.add('success', 'Transaction created successfully.');
        data.finishedTx = {
            refNo: res.data.Reference_No,
            name: data.recipient.name.value,
            company: data.recipient.company.value,
            items: items.value,
            subTotal: subTotal.value,
            convenienceFee: convenienceFee.value,
            computedTotal: computedTotal.value
        };
        data.step++;
        data.isLoading = false;
        data.showSummarizeTransactionModal = false;
        items.value = [];
        [data.recipient.name, data.recipient.company] = [
            { value: '', invalid: false },
            { value: '', invalid: false }
        ];
    } catch (error) {
        console.log(error);
        toast.add('error', 'Transaction creation unsuccessfully.');
        data.isLoading = false;
    }
    // }
}

function reviewTransaction() {
    let settledAllAmount = true;
    if (!items.value.length) {
        toast.add('error', 'No item listed.');
        return;
    }

    for (let item of items.value) {
        if (!settledAllAmount) continue;
        settledAllAmount = !!item.amount;
    }

    if (!settledAllAmount) {
        data.isLoading = false;
        toast.add('warn', 'Fill all amount field of each categories.');
        return;
    }
    data.step++;
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
    if (item.isFixedAmount) item.amount = parseFloat(item.fixedAmount);
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

async function fetchCategories(method = null) {
    try {
        const res = await CategoryService.getAllCategory();

        return res.map((data) => {
            let _data = { ...data, created_at: data.created_at ? formatDate(new Date(data.created_at), true) : '', updated_at: data.updated_at ? formatDate(new Date(data.updated_at), true) : '' };
            return _data;
        });
    } catch (error) {
        toast.add('error', 'Error occured while fetching category items. Please check if you are connected to internet.');
        return [];
    }
}

onMounted(async () => {
    // data.dropdownItems = await fetchCategories();

    nextTick(async () => {
        data.dropdownItems = await fetchCategories();
        data.addButtonState = false;
    });
});
</script>
