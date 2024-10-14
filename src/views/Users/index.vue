<template>
    <div class="card">
        <div class="font-semibold text-xl p-2 pl-4 mb-4 bg-slate-200 rounded-md">{{ useRoute().name }} Detail</div>
        <div class="flex justify-end mb-2">
            <Button label="Add User" severity="success" icon="pi pi-plus" class="mr-4" size="small" @click="data.addUser.show = true" />
        </div>
        <Skeleton v-if="preLoader" width="100%" height="65vh"></Skeleton>
        <DataTable
            v-else
            paginator
            striped-rows
            removable-sort
            ref="userT"
            class="footer-bg-none border-x-2"
            dataKey="id"
            tableStyle="min-width: 100%"
            sort-field="last_login"
            :loading="isLoading"
            :value="accounts"
            :rows="data.pagination.length"
            :rows-per-page-options="[5, 10, 20]"
            :filters="data.filter"
            :globalFilterFields="['id', 'Email', 'UserType', 'Status', 'last_login']"
            :sort-order="-1"
        >
            <template #empty>No user data found.</template>
            <template #loading>Preparing user data. Please wait.</template>
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
            <Column sortable field="id" header="Id">
                <template #body="{ data }">{{ data.id }}</template>
            </Column>
            <Column sortable field="Email" header="Email">
                <template #body="{ data }">{{ data.Email }}</template>
            </Column>
            <Column field="is_active" header="Online">
                <template #body="slotProps">
                    <!-- <Tag
                        :icon="{
                            'pi pi-check text-green': slotProps.data.is_active,
                            'pi pi-times text-red': !slotProps.data.is_active
                        }"
                        class="tracking-wider !rounded-full !p-2"
                        :severity="slotProps.data.is_active ? 'success' : 'warn'"
                    /> -->
                    <i class="pi" :class="{ 'pi-check-circle text-green-500 ': slotProps.data.Is_active, 'pi-times-circle text-red-500': !slotProps.data.Is_active }"></i>
                </template>
            </Column>
            <Column field="UserType" header="User Type">
                <template #body="slotProps">
                    <Tag
                        class="tracking-wider select-none"
                        disabled
                        :value="data.USER_TYPES[slotProps.data.UserType].name"
                        :severity="data.USER_TYPES[slotProps.data.UserType].serverity"
                        :class="{ [`${data.USER_TYPES[slotProps.data.UserType].class}`]: true }"
                    />
                </template>
            </Column>
            <Column field="Status" header="Status" class="" sortable>
                <template #body="slotProps"><Tag class="tracking-wider capitalize select-none" :value="slotProps.data.Status.toLowerCase()" :severity="slotProps.data.Status == 'ACTIVATED' ? 'success' : 'danger'" /></template>
            </Column>
            <Column field="last_login" header="Last Login" class="" sortable>
                <template #body="slotProps">{{ formatDate(slotProps.data.last_login, true) }}</template>
            </Column>
            <Column class="!text-right">
                <template #body="slotProps">
                    <Menu :ref="slotProps.data.Status == 'ACTIVATED' ? 'deactivated_menu' : 'activated_menu'" :model="overlayMenuItems[slotProps.data.Status]" :baseZIndex="10" :popup="true">
                        <template #item="{ label, item }">
                            <div
                                class="cursor-pointer"
                                @click.prevent="toggleMenuItem(label)"
                                :class="{ 'text-white': ['Deactivate', 'Activate'].includes(label), 'bg-red-600 hover:bg-red-500': label == 'Deactivate', 'bg-green-600 hover:bg-green-500': label == 'Activate' }"
                            >
                                <i :class="item.icon" class="p-3 px-4"></i>
                                {{ item.label }}
                            </div>
                        </template>
                    </Menu>

                    <Button
                        class="2xl:!text-lg"
                        size="small"
                        type="button"
                        label="Actions"
                        icon="pi pi-angle-down"
                        icon-pos="right"
                        :id="slotProps.data.id"
                        @click="actionClicked($event, slotProps.data.Status, slotProps.data.id)"
                        style="width: auto"
                    />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="data.addUser.show" @after-hide="closeAddUser" :closable="!data.addUser.isLoading" modal :draggable="false" header="Add Item" :style="{ maxWidth: '50rem', minWidth: '25rem' }">
            <div class="flex flex-col gap-4 py-5 pt-3">
                <FloatLabel class="mt-5">
                    <InputText
                        :invalid="data.addUser.invalid.email"
                        class="w-full"
                        id="email"
                        dataType="Email"
                        v-model="data.addUser.register.email"
                        :disabled="data.addUser.isLoading"
                        @input="
                            () => {
                                data.addUser.invalid.email = false;
                            }
                        "
                    />
                    <label :class="{ '!text-red-400': data.addUser.invalid.email }" class="tracking-wider" for="email">Email</label>
                </FloatLabel>
                <Fluid class="grid gap-2 grid-cols-2" v-if="!data.addUser.isEdit">
                    <FloatLabel class="mt-3">
                        <Password :invalid="data.addUser.invalid.password" fuild id="password" type="password" v-model="data.addUser.register.password" :disabled="data.addUser.isLoading" :feedback="false" toggle-mask />
                        <label class="tracking-wider" for="password">Password</label>
                    </FloatLabel>
                    <FloatLabel class="mt-3">
                        <Password
                            :invalid="data.addUser.invalid.password_confirmation"
                            fuild
                            id="confirmPassword"
                            type="password"
                            v-model="data.addUser.register.password_confirmation"
                            :disabled="data.addUser.isLoading"
                            :feedback="false"
                            toggle-mask
                        />
                        <label class="tracking-wider" for="confirmPassword">Confirm Password</label>
                    </FloatLabel>
                </Fluid>
                <Fluid class="grid gap-2 grid-cols-2">
                    <Select :invalid="data.addUser.invalid.usertype" v-model="data.addUser.register.usertype" :options="data.USER_TYPES" optionLabel="name" optionValue="index" placeholder="Select User Type" />
                    <Select v-model="data.addUser.register.status" :options="data.status_options" optionLabel="name" optionValue="value" placeholder="Select User Status" />
                </Fluid>
            </div>
            <div class="flex justify-end gap-2 flex-col sm:flex-row">
                <Button type="button" class="w-100 md:w-auto" size="small" severity="secondary" label="Cancel" :loading="data.addUser.isLoading" @click="closeAddUser" />
                <Button type="button" class="w-100 md:w-auto" size="small" label="Add Item" :loading="data.addUser.isLoading" @click="createUser" />
            </div>
        </Dialog>
    </div>
</template>
<style src="./style.sass" scoped></style>
<script setup>
import { formatDate } from '@/helper';
import { UserService } from '@/service/UserService';
import { FilterMatchMode } from '@primevue/core/api';
import { inject, nextTick, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const toast = inject('toast');
const data = reactive({
    pagination: {
        page: 1,
        length: 10,
        totalCount: 0,
        first: 0
    },
    addUser: {
        show: false,
        isLoading: false,
        isEdit: false,
        invalid: {
            email: false,
            password: false,
            password_confirmation: false,
            usertype: false,
            status: false
        },
        register: {
            email: '',
            password: '',
            password_confirmation: '',
            usertype: null,
            is_active: 0,
            status: 'Active'
        }
    },
    USER_TYPES: [
        { index: 0, serverity: 'contrast', name: 'Admin' },
        { index: 1, serverity: 'success', name: 'Cashier' },
        { index: 2, serverity: 'info', name: 'CEO' },
        { index: 3, serverity: 'primary', name: 'Other' },
        { index: 4, serverity: 'secondary', name: 'CSR' }
    ],
    status_options: [
        { name: 'Activated', value: 'ACTIVATED' },
        { name: 'Deactivated', value: 'DEACTIVATED' }
    ],
    filter: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
});
const activated_menu = ref(null);
const deactivated_menu = ref(null);
const userT = ref(null);
const popover = ref(null);
const poData = ref(null);
const isLoading = ref(false);
const overlayMenuItems = ref({
    ACTIVATED: [
        {
            separator: true
        },
        {
            label: 'Edit',
            icon: 'pi pi-file-edit'
        },
        {
            label: 'Deactivate',
            icon: 'pi pi-lock'
        }
    ],
    DEACTIVATED: [
        {
            separator: true
        },
        {
            label: 'Edit',
            icon: 'pi pi-file-edit'
        },
        {
            label: 'Activate',
            icon: 'pi pi-lock-open'
        }
    ]
});
const accounts = ref([
    {
        id: 1,
        Email: '1298379872',
        UserType: 0,
        is_active: 1,
        Status: 1,
        last_login: '01/03/2024'
    },
    {
        id: 2,
        Email: '124123123',
        UserType: 1,
        is_active: 1,
        Status: 0,
        last_login: '01/03/2024'
    },
    {
        id: 3,
        Email: 123123,
        UserType: 2,
        Status: 1,
        is_active: 0,
        last_login: '01/03/2024'
    },
    {
        id: 4,
        Email: 123123,
        UserType: 3,
        Status: 1,
        is_active: 0,
        last_login: '01/03/2024'
    },
    {
        id: 5,
        Email: 123123,
        UserType: 4,
        Status: 1,
        is_active: 0,
        last_login: '01/03/2024'
    }
]);
const preLoader = ref(true);

async function paginate(e) {
    data.pagination = { ...data.pagination, page: e.page + 1, length: e.rows, first: e.rows != data.pagination.length ? 0 : e.first };
}

onMounted(async () => {
    accounts.value = await UserService.getAllUser();
    preLoader.value = false;
    if (window.innerHeight < document.body.clientHeight) data.pagination.length = 5;
    window.addEventListener('resize', () => {
        if (window.innerHeight < document.body.clientHeight) data.pagination.length = 5;
        else data.pagination.length = 10;
    });
});

function toggleMenuItem(name) {
    if (name.toLowerCase() == 'download') console.log(name);
    if (name.toLowerCase() == 'edit') {
        const { register, id } = data.addUser;
        const { Email, Status, UserType } = accounts.value.find((acct) => acct.id == id);
        data.addUser = { ...data.addUser, register: { ...register, email: Email, status: Status, usertype: UserType }, isEdit: true, show: true };
    }
}

function createUser() {
    toast.removeAll();
    if (isInvalidInput()) return;
}

function isInvalidInput() {
    const { invalid, register } = data.addUser;
    const emailValidate = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(register.email);
    let invalidInput = false;

    Object.keys(invalid).forEach((props) => {
        invalid[props] = false;
    });

    if (!register.email.length || !emailValidate) {
        invalidInput = true;
        invalid.email = true;
        if (!register.email.length) toast.add('warn', 'Email field is required.', null, 5000);
        else if (!emailValidate) toast.add('warn', 'Email field value is invalid. e.g. example@email.xyz', null, 5000);
    }

    if (!register.password.length || !register.password_confirmation.length) {
        invalidInput = true;
        let field = [];
        if (!register.password.length) {
            field.push('Password');
            invalid.password = true;
        }
        if (!register.password_confirmation.length) {
            field.push('Confirm Password');
            invalid.password_confirmation = true;
        }
        toast.add('warn', `${field.join(' and ')} field is required`, null, 5000);
    } else {
        (register.password != register.password_confirmation
            ? () => {
                  invalid.password_confirmation = true;
                  toast.add('warn', 'Confirm Password does not match.', null, 5000);
              }
            : () => {})();
    }

    if (!register.usertype) {
        invalidInput = true;
        invalid.usertype = true;
        toast.add('warn', 'User type is required, select an option.', null, 5000);
    }

    return invalidInput;
}

function closeAddUser() {
    data.addUser = {
        show: false,
        isLoading: false,
        invalid: {
            email: false,
            password: false,
            password_confirmation: false,
            usertype: false,
            status: false
        },
        register: {
            email: '',
            password: '',
            password_confirmation: '',
            usertype: null,
            is_active: 0,
            status: 'Active'
        }
    };
}

function actionClicked(e, status, id) {
    activated_menu.value.hide();
    deactivated_menu.value.hide();
    data.addUser.id = id;
    nextTick(() => (status == 'ACTIVATED' ? deactivated_menu.value.show(e) : activated_menu.value.show(e)));
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
