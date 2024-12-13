<script setup>
import FooterComponent from '@/components/FooterComponent.vue';
import NavBar from '@/components/NavBar.vue';
import { computed } from 'vue';

const containerClass = computed(() => {
    return {
        // 'layout-overlay': layoutConfig.menuMode === 'overlay',
        // 'layout-static': layoutConfig.menuMode === 'static',
        // 'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        // 'layout-overlay-active': layoutState.overlayMenuActive,
        // 'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <NavBar></NavBar>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view></router-view>
            </div>
        </div>
        <FooterComponent></FooterComponent>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <Toast />
</template>
