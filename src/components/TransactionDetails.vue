<template>
    <div class="flex flex-col gap-3 py-5 m-xs:px-0 px-10 pt-0">
        <div class="grid space-between">
            <p class="col-start-1 font-semibold xl:text-xl pl-2">Items</p>
            <p class="col-start-3 font-semibold xl:text-xl text-right pr-2">Amount (&#8369;)</p>
        </div>
        <div class="max-h-96 overflow-auto !w-100">
            <div v-for="(item, i) of items" class="grid space-between" :class="{ 'bg-gray-100': i % 2 }">
                <p class="col-start-1 pl-3 xl:text-xl">{{ item.name }}</p>
                <p class="col-start-3 text-right xl:text-xl pr-2 tabular-nums">{{ !item.amount ? '0.00' : formatCurrency(item.amount) }}</p>
            </div>
        </div>
        <Divider class="!m-1" />
        <div class="grid space-between">
            <p class="col-start-1 pl-3 xl:text-xl">Sub-Total</p>
            <p class="col-start-3 text-right xl:text-xl pr-2 tabular-nums">{{ subTotal == 0 ? '0.00' : formatCurrency(subTotal) }}</p>
        </div>
        <div class="grid space-between">
            <p class="col-start-1 pl-3 xl:text-xl text-teal-800">Convenience Fee (1.8%)</p>
            <p class="col-start-3 text-right xl:text-xl text-teal-800 pr-2 tabular-nums">{{ fee == 0 ? '0.00' : formatCurrency(fee) }}</p>
        </div>
        <Divider class="!m-1" />
        <div class="grid space-between">
            <p class="col-start-1 pl-3 xl:text-2xl text-lg text-lime-600">Total</p>
            <p class="col-start-3 text-lg xl:text-2xl text-right text-lime-600 pr-2 tabular-nums">{{ total == 0 ? '0.00' : formatCurrency(total, 'PHP') }}</p>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency } from '@/helper/format-helper';
import { onMounted } from 'vue';
defineProps({ items: Array, subTotal: Number, total: Number, fee: Number });

onMounted(() => {});
</script>
