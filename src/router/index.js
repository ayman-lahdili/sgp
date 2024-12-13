import Layout from '@/layout/Layout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/pages/Login.vue'),
            meta: { requiresAuth: false } // Pas d'authentification requise pour la page de login
        },
        {
            path: '/',
            component: Layout,
            meta: { requiresAuth: true }, // Authentification requise pour les pages sous Layout
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/pages/Dashboard.vue'),
                    meta: { requiresAuth: true } // Authentification requise pour Dashboard
                },
                {
                    path: '/pump',
                    name: 'pump',
                    component: () => import('@/pages/Pump.vue'),
                    meta: { requiresAuth: true } // Authentification requise pour Pump
                },
                {
                    path: '/reservoir',
                    name: 'reservoir',
                    component: () => import('@/pages/Reservoir.vue'),
                    meta: { requiresAuth: true } // Authentification requise pour Reservoir
                },
                {
                    path: '/transactions',
                    name: 'transactions',
                    component: () => import('@/pages/Transactions.vue'),
                    meta: { requiresAuth: true } // Authentification requise pour Transactions
                },
                {
                    path: '/incidents',
                    name: 'incidents',
                    component: () => import('@/pages/Incidents.vue'),
                    meta: { requiresAuth: true } // Authentification requise pour Transactions
                },
                {
                    path: '/clients',
                    name: 'clients',
                    component: () => import('@/pages/Clients.vue'),
                    meta: { requiresAuth: true } // Authentification requise pour Transactions
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/pages/Users.vue'),
                    meta: { requiresAuth: true } // Authentification requise pour Users
                },
                {
                    path: '/settings',
                    name: 'settings',
                    component: () => import('@/pages/Settings.vue'),
                    meta: { requiresAuth: true } // Authentification requise pour Settings
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/pages/CurrentUser.vue'),
                    meta: { requiresAuth: true } // Authentification requise pour CurrentUser
                }
            ]
        }
    ]
});

// Vérification de l'authentification avant chaque navigation
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('user'); // Vérifier si l'utilisateur est "authentifié"

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login' }); // Rediriger vers la page de login si non authentifié
    } else {
        next();
    }
});

export default router;
