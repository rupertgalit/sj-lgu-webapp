<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, nextTick, onBeforeMount, onMounted, provide, ref, watch } from 'vue';
import AppConfigurator from './AppConfigurator.vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
const { layoutConfig, layoutState, isSidebarActive, resetMenu } = useLayout();

const isLogin = ref(false);
const isLoading = ref(true);
const outsideClickListener = ref(null);

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const isLoadingContent = (bool) => (isLoading = bool);

const user = computed(() => {
    const user = window.localStorage.getItem('user');
    if (!user) {
        isLogin.value = false;
        return null;
    }
    return JSON.parse(user);
});
const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                resetMenu();
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}

provide('is-loading-content', isLoadingContent);

onBeforeMount(() => {});

onMounted(() => {
    nextTick(() => {
        setTimeout(() => {
            document.body.classList.remove('preparing-content');
            isLoading.value = false;
        }, 1000);
    });
});
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar v-if="user" :user="user" />
        <app-sidebar v-if="user" :user="user" />
        <div class="layout-main-container m-xs:!px-1">
            <div class="layout-main">
                <router-view></router-view>
            </div>
            <app-footer />
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <AppConfigurator />
    <Toast />
</template>
