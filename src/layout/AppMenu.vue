<script setup>
import { computed, inject } from 'vue';

import setPrivilage from '@/helper/user_privilage';
import AppMenuItem from './AppMenuItem.vue';

const { details } = inject('user-details');

const models = computed(() => {
    return setPrivilage(details.usertype);
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in models" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
