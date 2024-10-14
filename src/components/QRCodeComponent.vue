<template>
    <div :class="{}" class="flex justify-center block p-5">
        <Button v-show="state.showButton" severity="success" label="Generate QR" @click="generateQR"></Button>
        <div v-show="!state.showButton" class="p-2 border-2" :style="{ width: size }">
            <div v-if="state.isLoading">
                <i class="absolute pi pi-spinner pi-spin !text-6xl text-blue-500 opacity-60"></i>
                <i class="pi pi-qrcode !text-6xl"></i>
            </div>
            <div v-if="state.isError" class="flex flex-col py-8 px-3">
                <i class="pi pi-refresh !text-4xl cursor-pointer mx-auto text-green-500 hover:bg-slate-100 p-1 rounded" @click="generateQR"></i>
                <span class="pt-3">Regenerate QR</span>
            </div>
            <div ref="qrcodeRef" id="QRCode" v-else></div>
        </div>
    </div>
</template>
<script setup>
import qrcode from 'qrcode-generator-es6';
import { defineExpose, inject, onMounted, reactive, ref } from 'vue';

const toast = inject('toast');
const qrcodeRef = ref(null);
const url = 'https://api.qrserver.com/v1/create-qr-code/?format=svg&data=';
const state = reactive({
    showButton: true,
    isLoading: false,
    isError: false
});
const props = defineProps({
    size: {
        type: String,
        default: '100'
    },
    data: {
        type: String,
        required: true
    }
});
defineExpose({ qrcodeRef });

async function generateQR() {
    state.showButton = false;
    state.isLoading = true;
    state.isError = false;

    const res = { status: 200 };
    // const res = await fetch(url + props.data);
    if (res.status == 200) {
        const _qrcode = new qrcode(0, 'H');
        _qrcode.addData(props.data);
        _qrcode.make();
        qrcodeRef.value.innerHTML = _qrcode.createSvgTag({
            margin: 5,
            cellSize: 4,
            cellColor: () => '#223448',
            obstruction: {
                // height: 10,
                // width: 10
                path: '/assets/images/san_jose_batangas_logo.jpg'
            }
        });

        // qrcodeRef.value.innerHTML = await res.text();
        state.isLoading = false;
        return;
    }

    toast.add('error', 'Failed to create QR Code.');
    state.isLoading = false;
    state.isError = true;
}
onMounted(async () => {
    console.log();
});
</script>
