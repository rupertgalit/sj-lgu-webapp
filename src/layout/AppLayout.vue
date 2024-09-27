<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useToast } from 'primevue/usetoast';
import { computed, nextTick, onBeforeMount, onMounted, provide, ref, watch } from 'vue';
import AppConfigurator from './AppConfigurator.vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
const { layoutConfig, layoutState, isSidebarActive, resetMenu } = useLayout();

const toast = useToast();
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

const user = computed(() => {
    try {
        const user = JSON.parse(document.cookie);
        if (!user && !user.access_token) {
            isLogin.value = false;
            return null;
        }
        return user;
    } catch (error) {
        return {};
    }
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

onBeforeMount(() => {
    provide('user-details', JSON.parse(document.cookie));
    provide('toast', (serverity, message, summary = null) => {
        const capitalize = () => {
            return serverity.charAt(0).toUpperCase() + serverity.slice(1);
        };
        toast.add({ severity: serverity.toLowerCase(), summary: summary ?? capitalize(), detail: message, life: 3000 });
    });
});

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
        <Toast />
        <app-topbar v-if="user.access_token" :user="user.details" />
        <app-sidebar v-if="user.access_token" :user="user.details" />
        <div class="layout-main-container m-xs:!px-1 xl:!text-xl">
            <div class="layout-main pb-5">
                <router-view></router-view>
            </div>
            <app-footer />
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <AppConfigurator />
    <Toast />
</template>
