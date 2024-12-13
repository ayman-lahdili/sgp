<script>
import AppConfigurator from '@/layout/AppConfigurator.vue';

import { useLayout } from '@/layout/composables/layout';
import { useToast } from 'primevue/usetoast';

export default {
    components: {
        AppConfigurator
    },
    data() {
        const { toggleDarkMode, isDarkTheme } = useLayout();
        return {
            toggleDarkMode,
            isDarkTheme,
            items: [
                {
                    label: 'Pompe',
                    icon: 'pi pi-fw pi-car',
                    command: () => {
                        this.$router.push('/pump');
                    }
                },
                {
                    label: 'Réservoirs',
                    icon: 'pi pi-fw pi-truck',
                    command: () => {
                        this.$router.push('/reservoir');
                    }
                },
                {
                    label: 'Historique des Transactions',
                    icon: 'pi pi-fw pi-wallet',
                    command: () => {
                        this.$router.push('/transactions');
                    }
                },
                {
                    label: 'Incident',
                    icon: 'pi pi-fw pi-exclamation-triangle',
                    command: () => {
                        this.$router.push('/incidents');
                    }
                },
                {
                    label: 'Clients',
                    icon: 'pi pi-fw pi-users',
                    command: () => {
                        this.$router.push('/clients');
                    }
                },
                {
                    label: 'Utilisateur',
                    icon: 'pi pi-fw pi-users',
                    command: () => {
                        this.$router.push('/users');
                    },
                    visible: false // Par défaut, cet élément est caché
                },
                {
                    label: 'Paramètre',
                    icon: 'pi pi-fw pi-cog',
                    command: () => {
                        this.$router.push('/settings');
                    },
                    visible: false // Par défaut, cet élément est caché
                },
                {
                    label: '',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Modifier son compte',
                            icon: 'pi pi-fw pi-cog',
                            command: () => {
                                this.$router.push('/user');
                            }
                        },
                        {
                            label: 'Se déconnecter',
                            icon: 'pi pi-fw pi-sign-out',
                            command: () => {
                                localStorage.clear();
                                this.$router.push('/login');
                            }
                        }
                    ]
                }
            ],
            incidentDialog: false,
            incident: {
                licensePlate: '',
                transactionNumber: '',
                observations: ''
            },
            submitted: false,
            toast: null,
            isAdmin: false
        };
    },
    beforeMount() {
        this.isAdmin = localStorage.getItem('role') === 'administrateur';
        // Mettez à jour la visibilité des éléments selon le rôle de l'utilisateur
        this.items.forEach((item) => {
            if (item.label === 'Utilisateur' || item.label === 'Paramètre') {
                item.visible = this.isAdmin; // Afficher si l'utilisateur est un admin
            }
        });
    },
    mounted() {
        this.toast = useToast();
    },
    methods: {
        submitIncident() {
            this.submitted = true;

            if (!this.incident.transactionNumber) {
                this.toast.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Le numéro de transaction est requis.',
                    life: 3000
                });
                return;
            }

            console.log('Incident Signalé:', this.incident);

            this.toast.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Incident signalé avec succès.',
                life: 3000
            });
            this.incidentDialog = false;
            this.incident = {
                licensePlate: '',
                transactionNumber: '',
                observations: ''
            };
            this.submitted = false;
        }
    }
};
</script>

<template>
    <div class="card">
        <Menubar :model="items.filter((item) => item.visible !== false)">
            <template #start>
                <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-0 w-16 shrink-0 mx-auto" @click="() => {this.$router.push('/');}">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.1637 19.2467C17.1566 19.4033 17.1529 19.561 17.1529 19.7194C17.1529 25.3503 21.7203 29.915 27.3546 29.915C32.9887 29.915 37.5561 25.3503 37.5561 19.7194C37.5561 19.5572 37.5524 19.3959 37.5449 19.2355C38.5617 19.0801 39.5759 18.9013 40.5867 18.6994L40.6926 18.6782C40.7191 19.0218 40.7326 19.369 40.7326 19.7194C40.7326 27.1036 34.743 33.0896 27.3546 33.0896C19.966 33.0896 13.9765 27.1036 13.9765 19.7194C13.9765 19.374 13.9896 19.0316 14.0154 18.6927L14.0486 18.6994C15.0837 18.9062 16.1223 19.0886 17.1637 19.2467ZM33.3284 11.4538C31.6493 10.2396 29.5855 9.52381 27.3546 9.52381C25.1195 9.52381 23.0524 10.2421 21.3717 11.4603C20.0078 11.3232 18.6475 11.1387 17.2933 10.907C19.7453 8.11308 23.3438 6.34921 27.3546 6.34921C31.36 6.34921 34.9543 8.10844 37.4061 10.896C36.0521 11.1292 34.692 11.3152 33.3284 11.4538ZM43.826 18.0518C43.881 18.6003 43.9091 19.1566 43.9091 19.7194C43.9091 28.8568 36.4973 36.2642 27.3546 36.2642C18.2117 36.2642 10.8 28.8568 10.8 19.7194C10.8 19.1615 10.8276 18.61 10.8816 18.0663L7.75383 17.4411C7.66775 18.1886 7.62354 18.9488 7.62354 19.7194C7.62354 30.6102 16.4574 39.4388 27.3546 39.4388C38.2517 39.4388 47.0855 30.6102 47.0855 19.7194C47.0855 18.9439 47.0407 18.1789 46.9536 17.4267L43.826 18.0518ZM44.2613 9.54743L40.9084 10.2176C37.9134 5.95821 32.9593 3.1746 27.3546 3.1746C21.7442 3.1746 16.7856 5.96385 13.7915 10.2305L10.4399 9.56057C13.892 3.83178 20.1756 0 27.3546 0C34.5281 0 40.8075 3.82591 44.2613 9.54743Z"
                        fill="var(--primary-color)"
                    />
                </svg>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <Button label="Signaler un incident" severity="danger" variant="outlined" size="normal" @click="incidentDialog = true" />
                    <Button type="button" @click="toggleDarkMode" rounded :icon="isDarkTheme ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />
                    <div class="relative" style="z-index: 2">
                        <Button
                            icon="pi pi-palette"
                            v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                            type="button"
                            rounded
                        />
                        <AppConfigurator />
                    </div>
                </div>
            </template>
        </Menubar>

        <!-- Dialog for Reporting an Incident -->
        <Dialog v-model:visible="incidentDialog" header="Signaler un incident" :style="{ width: '450px' }" :modal="true">
            <div class="flex flex-col gap-4">
                <!-- License Plate and Transaction Number in the same row -->
                <div class="flex gap-4">
                    <div class="flex-1">
                        <label for="license-plate" class="block font-bold mb-2">Plaque d'immatriculation</label>
                        <InputText id="license-plate" v-model="incident.licensePlate" placeholder="123-ABC" />
                    </div>
                    <div class="flex-1">
                        <label for="transaction-number" class="block font-bold mb-2">Numéro de transaction</label>
                        <InputText id="transaction-number" v-model="incident.transactionNumber" placeholder="Numéro de transaction" :class="{ 'p-invalid': submitted && !incident.transactionNumber }" />
                        <small v-if="submitted && !incident.transactionNumber" class="p-error">Ce champ est requis.</small>
                    </div>
                </div>

                <!-- Observations textarea -->
                <div>
                    <label for="observations" class="block font-bold mb-2">Observations</label>
                    <Textarea id="observations" v-model="incident.observations" rows="6" placeholder="Décrivez l'incident" :style="{ width: '100%' }" />
                </div>
            </div>
            <template #footer>
                <Button label="Annuler" icon="pi pi-times" text @click="resetIncidentForm" />
                <Button label="Soumettre" icon="pi pi-check" @click="submitIncident" />
            </template>
        </Dialog>
    </div>
</template>
