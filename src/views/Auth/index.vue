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
            <FloatLabel class="mt-5 mb-12">
                <InputText id="username" class="w-full" @keyup.enter="loginUser" @change="data.uname.isError = false" v-model="data.uname.value" :invalid="data.uname.isError" autofocus />
                <label for="username" class="!leading-4 !text-lg tracking-wider" :class="{ '!text-red-400': data.uname.isError }">Username</label>
                <small class="absolute -bottom-7 text-red-400 right-0" id="username-help" v-show="data.uname.isError">Username is required.</small>
            </FloatLabel>

            <FloatLabel class="w-full">
                <Password id="password" inputId="password" fluid @keyup.enter="loginUser" @change="data.pass.isError = false" v-model="data.pass.value" :invalid="data.pass.isError" toggle-mask :feedback="false" />
                <label for="password" class="!leading-4 !text-lg tracking-wider" :class="{ '!text-red-400': data.pass.isError }">Password</label>
                <small class="absolute -bottom-7 text-red-400 right-0" id="username-help" v-show="data.pass.isError">Password is required.</small>
            </FloatLabel>
            <div class="flex flex-col w-full mt-9">
                <Button :loading="data.loading" class="w-full text-indigo-50 font-bold bg-cyan-600 py-3 rounded-md hover:bg-cyan-700 transition duration-300" @click="loginUser">
                    <i
                        v-if="data.loading"
                        class="pi pi-spinner pi-spin"
                        :style="{
                            fontSize: '1.5rem'
                        }"
                    ></i>
                    <span v-else>LOGIN</span>
                </Button>
                <Message severity="error" class="mt-1 h-8 !text-xs" :hidden="!data.error">Incorrect username or password.</Message>
            </div>
        </div>
    </div>
</template>
<style src="./style.sass" scoped></style>
<script setup>
import { AuthService } from '@/service/AuthService';
import Password from 'primevue/password';
import { inject, nextTick, onMounted, reactive } from 'vue';

const toast = inject('toast');
const { login } = inject('user');
const data = reactive({
    uname: { value: '', isError: false },
    pass: { value: '', isError: false },
    hide_pass: true,
    error: false,
    loading: false
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
    data.error = false;
    data.uname.isError = false;
    data.pass.isError = false;

    console.log(AuthService);
    if (await validateFields()) return;

    data.loading = true;
    const res = await AuthService.Authenticate({
        email: data.uname.value,
        password: data.pass.value
    });

    console.log(res);
    if (res.status > 200) {
        data.error = true;
        data.loading = false;
        return;
    }

    toast.add('success', 'Logined Successfully.');
    login(res);
}
onMounted(() => {});
</script>
