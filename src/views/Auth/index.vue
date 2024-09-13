<template>
    <div class="container relative mx-auto !rounded-b-xl rounded-t-2xl max-w-md shadow-md hover:shadow-2xl transition duration-200 bg-slate-600">
        <img width="128" src="/src/assets/images/san_jose_batangas_logo.jpg" alt="" class="absolute hidden -top-20 right-10 rounded-full" />

        <div class="py-12 p-10 bg-white rounded-xl">
            <div class="flex flex-col text-center text-2xl font-black pb-5">
                <p>San Jose, Batangas LGU</p>
                <p class="text-lg">Dashboard</p>
            </div>

            <div class="mb-6">
                <label class="mr-4 text-gray-700 font-bold inline-block mb-2" for="name">Username</label>
                <input type="text" class="border bg-gray-100 py-2 px-4 w-full outline-none focus:ring-2 focus:ring-indigo-400 rounded" placeholder="" />
            </div>
            <div class="">
                <label class="mr-4 text-gray-700 font-bold inline-block mb-2" for="name">Password</label>
                <input type="password" class="border bg-gray-100 py-2 px-4 w-full outline-none focus:ring-2 focus:ring-indigo-400 rounded" placeholder="" />
            </div>
            <button class="w-full mt-12 text-indigo-50 font-bold bg-cyan-600 py-3 rounded-md hover:bg-cyan-700 transition duration-300" @click="loginUser">LOGIN</button>
        </div>
        <div class="flex flex-col items-center w-full py-3">
            <img width="128" src="/src/assets/images/san_jose_batangas_logo.jpg" alt="" class="rounded-full" />
        </div>
    </div>
</template>
<style src="./style.sass" scoped></style>
<script setup>
import { inject, onMounted, ref } from 'vue';
const { login } = inject('user');
const user = ref('');
const pass = ref('');
function loginUser() {
    login({
        user: user.value,
        pass: pass.value
    });
}
onMounted(() => {});
</script>
