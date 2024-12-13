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
                    label: 'SGP',
                    command: () => {
                        this.$router.push('/');
                    }
                },
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
                    icon: 'pi pi-fw pi-alert',
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
