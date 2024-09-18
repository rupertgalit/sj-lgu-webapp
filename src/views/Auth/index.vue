<template>
    <div class="container flex flex-col md:flex-row md:max-w-3xl md:mt-32 relative mx-auto !rounded-b-xl justify-center rounded-t-2xl max-w-sm shadow-md hover:shadow-2xl transition duration-200 bg-slate-600">
        <div class="flex flex-col items-center w-full justify-center py-5">
            <div class="flex flex-col text-center text-2xl text-white tracking-wide pb-2">
                <p>San Jose, Batangas LGU</p>
                <p class="text-xl">Dashboard</p>
            </div>
            <img width="128" src="/src/assets/images/san_jose_batangas_logo.jpg" alt="" class="rounded-full" />
        </div>
        <div class="py-12 p-10 bg-white rounded-xl w-full">
            <FloatLabel class="mt-5 mb-10">
                <InputText id="username" class="w-full" @keyup:enter="loginUser" @change="data.uname.isError = false" v-model="data.uname.value" :invalid="data.uname.isError" />
                <label for="username" class="!leading-4 !text-lg tracking-wider">Username</label>
                <small class="absolute -bottom-5 text-red-500 left-3" id="username-help" v-show="data.uname.isError">Username is required.</small>
            </FloatLabel>

            <FloatLabel class="">
                <InputGroup>
                    <InputText id="password" :type="data.hide_pass ? 'password' : 'text'" class="w-full" @keyup:enter="loginUser" @change="data.pass.isError = false" v-model="data.pass.value" :invalid="data.pass.isError" />
                    <InputGroupAddon class="!p-0">
                        <Button class="!rounded-s-none" aria-label="Save" @click="data.hide_pass = !data.hide_pass">
                            <template #icon>
                                <i v-if="data.hide_pass" class="pi pi-eye"></i>
                                <i v-else class="pi pi-eye-slash"></i>
                            </template>
                        </Button>
                    </InputGroupAddon>
                </InputGroup>
                <label for="password" class="!leading-4 !text-lg tracking-wider">Password</label>
                <small class="absolute -bottom-5 text-red-500 left-3" id="username-help" v-show="data.pass.isError">Password is required.</small>
            </FloatLabel>
            <div class="flex flex-col w-full mt-9">
                <button class="w-full text-indigo-50 font-bold bg-cyan-600 py-3 rounded-md hover:bg-cyan-700 transition duration-300" @click="loginUser">LOGIN</button>
                <Message severity="error" class="mt-1 h-8 !text-xs" hidden>Incorrect username or password.</Message>
            </div>
        </div>
    </div>
</template>
<style src="./style.sass" scoped></style>
<script setup>
import { inject, nextTick, onMounted, reactive } from 'vue';

const toast = inject('toast');
const { login } = inject('user');
const data = reactive({
    uname: { value: '', isError: false },
    pass: { value: '', isError: false },
    hide_pass: true
});

async function validateFields() {
    if (!data.uname.value) {
        data.uname.isError = true;
        await nextTick();
        document.getElementById('username').focus();
    }
    if (!data.pass.value) {
        data.pass.isError = true;
        if (!!data.uname.value) {
            await nextTick();
            document.getElementById('password').focus();
        }
    }
    return !data.uname.value || !data.pass.value;
}

async function loginUser() {
    data.uname.isError = false;
    data.pass.isError = false;

    if (await validateFields()) return;
    toast('success', 'Logined Successfully.');
    login({
        user: data.uname.value,
        pass: data.pass.value
    });
}
onMounted(() => {});
</script>
