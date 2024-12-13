<template>
    <div class="card">
        <DataTable ref="dt" v-model:selection="selectedIncident" v-model:filters="filters" :value="incidents" dataKey="id" tableStyle="min-width: 50rem" paginator :rows="10" filterDisplay="menu" :globalFilterFields="['licensePlate', 'transactionNumber', 'observations']">
            <template #header>
                <div class="flex justify-between">
                    <div class="flex justify-between">
                        <Button type="button" icon="pi pi-filter-slash" class="mr-2" label="Clear" outlined @click="clearFilter()" />
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </IconField>
                    </div>
                    <!-- Bouton pour signaler un incident -->
                    <Button label="Signaler un incident" severity="danger" variant="outlined" @click="incidentDialog = true" />
                </div>
            </template>
            <Column style="width: 3rem"></Column>
            <Column field="licensePlate" header="Plaque d'immatriculation" sortable filterMatchMode="equals" style="width: 20%"></Column>
            <Column field="transactionNumber" header="Numéro de Transaction" sortable filterMatchMode="equals" style="width: 25%"></Column>
            <Column field="observations" header="Observations" sortable filterMatchMode="contains" style="width: 40%">
                <template #body="{ data }">
                    {{ data.observations }}
                </template>
            </Column>
            <Column field="date" header="Date" sortable filterField="date" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatDate(data.date) }}
                </template>
            </Column>
        </DataTable>

        <!-- Dialog pour signaler un incident -->
        <Dialog v-model:visible="incidentDialog" header="Signaler un incident" :style="{ width: '450px' }" :modal="true">
            <div class="flex flex-col gap-4">
                <!-- Plaque d'immatriculation et numéro de transaction dans la même ligne -->
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

                <!-- Observations -->
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

<script>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

export default {
    data() {
        return {
            incidents: [
                { id: 'I001', licensePlate: 'AB123CD', transactionNumber: 'T001', observations: 'Incidents mineurs', date: new Date('2024-12-10') },
                { id: 'I002', licensePlate: 'EF456GH', transactionNumber: 'T002', observations: 'Défaillance technique', date: new Date('2024-12-9') },
                { id: 'I003', licensePlate: 'IJ789KL', transactionNumber: 'T003', observations: 'Problème de communication', date: new Date('2024-12-8') },
                { id: 'I004', licensePlate: 'MN123OP', transactionNumber: 'T004', observations: 'Incidents mineurs', date: new Date('2024-12-7') },
                { id: 'I005', licensePlate: 'QR456ST', transactionNumber: 'T005', observations: 'Risque d\'incident', date: new Date('2024-12-10') }
            ],
            selectedIncident: null,
            filters: null,
            incidentDialog: false,
            incident: {
                licensePlate: '',
                transactionNumber: '',
                observations: ''
            },
            submitted: false,
            toast: null
        };
    },
    created() {
        this.initFilters();
        this.toast = useToast();
    },
    methods: {
        clearFilter() {
            this.initFilters();
        },
        initFilters() {
            this.filters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                licensePlate: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                transactionNumber: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                observations: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
            };
        },
        formatDate(value) {
            return value.toLocaleDateString('en-CA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
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

            // Ajoutez l'incident dans la liste
            this.incidents.push({ ...this.incident, id: 'I' + (this.incidents.length + 1), date: new Date() });

            this.toast.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Incident signalé avec succès.',
                life: 3000
            });

            // Réinitialisez le formulaire et fermez le dialog
            this.incidentDialog = false;
            this.incident = { licensePlate: '', transactionNumber: '', observations: '' };
            this.submitted = false;
        },
        resetIncidentForm() {
            this.incidentDialog = false;
            this.incident = { licensePlate: '', transactionNumber: '', observations: '' };
            this.submitted = false;
        }
    }
};
</script>

<style scoped>
.card {
    margin: 20px;
}
</style>
