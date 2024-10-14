<script setup>
import { TransactionService } from '@/service/TransactionService';
import { onMounted, reactive } from 'vue';

const data = reactive({
    res: []
});

function smoothScroll(id) {
    document.body.click();
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
}

onMounted(async () => {
    data.res = await TransactionService.getAllTransaction(15, 1, { sort: 'Date_Created', direction: 'desc' });
});
</script>

<template>
    {{ data.res.length ? [] : data.res.data }}
</template>
