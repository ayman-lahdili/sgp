<script>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default {
    data() {
        return {
            transactions: [
                { id: 'T001', status: 'Payé', amount: 50.0, paymentMethod: 'Carte Crédit', date: new Date('2024-12-10') },
                { id: 'T002', status: 'Payé', amount: 30.0, paymentMethod: 'Argent Comptant', date: new Date('2024-12-10') },
                { id: 'T003', status: 'Impayé', amount: 30.0, paymentMethod: 'N/A', date: new Date('2024-12-10') },
                { id: 'T004', status: 'Impayé', amount: 30.0, paymentMethod: 'N/A', date: new Date('2024-12-7') },
                { id: 'T005', status: 'Payé', amount: 20.0, paymentMethod: 'Compte Client', date: new Date('2024-12-10') },
                { id: 'T006', status: 'Payé', amount: 100.0, paymentMethod: 'Carte Crédit', date: new Date('2024-12-9') },
                { id: 'T007', status: 'Impayé', amount: 75.0, paymentMethod: 'N/A', date: new Date('2024-12-8') },
                { id: 'T008', status: 'Payé', amount: 45.0, paymentMethod: 'Compte Client', date: new Date('2024-12-9') },
                { id: 'T009', status: 'Impayé', amount: 40.0, paymentMethod: 'N/A', date: new Date('2024-12-5') },
                { id: 'T010', status: 'Payé', amount: 60.0, paymentMethod: 'Carte Crédit', date: new Date('2024-12-12') },
                { id: 'T011', status: 'Impayé', amount: 25.0, paymentMethod: 'N/A', date: new Date('2024-12-6') },
                { id: 'T012', status: 'Payé', amount: 80.0, paymentMethod: 'Argent Comptant', date: new Date('2024-12-11') },
                { id: 'T013', status: 'Impayé', amount: 90.0, paymentMethod: 'N/A', date: new Date('2024-12-10') },
                { id: 'T014', status: 'Payé', amount: 150.0, paymentMethod: 'Carte Crédit', date: new Date('2024-12-10') },
                { id: 'T015', status: 'Payé', amount: 35.0, paymentMethod: 'Argent Comptant', date: new Date('2024-12-9') },
                { id: 'T016', status: 'Impayé', amount: 50.0, paymentMethod: 'N/A', date: new Date('2024-12-8') },
                { id: 'T017', status: 'Payé', amount: 120.0, paymentMethod: 'Compte Client', date: new Date('2024-12-7') },
                { id: 'T018', status: 'Impayé', amount: 55.0, paymentMethod: 'N/A', date: new Date('2024-12-12') },
                { id: 'T019', status: 'Payé', amount: 70.0, paymentMethod: 'Argent Comptant', date: new Date('2024-12-11') },
                { id: 'T020', status: 'Impayé', amount: 40.0, paymentMethod: 'N/A', date: new Date('2024-12-6') }
            ],
            selectedTransaction: null,
            filters: null,
            statuses: ['Payé', 'Impayé'],
            paymentMethods: ['Carte Crédit', 'Argent Comptant', 'N/A', 'Compte Client']
        };
    },
    created() {
        this.initFilters();
    },
    methods: {
        clearFilter() {
            this.initFilters();
        },
        formatCurrency(value) {
            return value.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
        },
        initFilters() {
            this.filters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                paymentMethod: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
                amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
            };
        },
        refreshTransactions() {
            // Simuler une actualisation des transactions
            console.log('Transactions actualisées');
        },
        exportCSV() {
            this.$refs.dt.exportCSV();
        },
        getSeverity(status) {
            switch (status) {
                case 'Impayé':
                    return 'danger';
                case 'Payé':
                    return 'success';
            }
        },
        formatDate(value) {
            return value.toLocaleDateString('en-CA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    }
};
</script>

<template>
    <div class="card">
        <DataTable ref="dt" v-model:selection="selectedTransaction" v-model:filters="filters" :value="transactions" dataKey="id" tableStyle="min-width: 50rem" paginator :rows="10" filterDisplay="menu" :globalFilterFields="['id', 'status', 'amount']">
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
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                </div>
            </template>
            <Column style="width: 3rem"></Column>
            <Column field="id" header="ID"></Column>
            <Column field="status" header="Status" sortable filterMatchMode="equals" style="width: 25%">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getSeverity(data.status)" />
                </template>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="statuses" placeholder="Select One" showClear>
                        <template #option="slotProps">
                            <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                        </template>
                    </Select>
                </template>
            </Column>
            <Column header="Montant" filterField="amount" dataType="numeric" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatCurrency(data.amount) }}
                </template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                </template>
            </Column>
            <Column field="paymentMethod" header="Mode de Paiement" sortable filterMatchMode="equals" style="width: 25%">
                <template #body="{ data }">
                    <Tag :value="data.paymentMethod" severity="secondary" />
                </template>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="paymentMethods" placeholder="Select One" showClear>
                        <template #option="slotProps">
                            <Tag :value="slotProps.option" severity="secondary" />
                        </template>
                    </Select>
                </template>
            </Column>
            <Column field="date" header="Date" sortable filterField="date" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatDate(data.date) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
