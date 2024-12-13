<script>
import { FilterMatchMode } from '@primevue/core/api';

export default {
    data() {
        return {
            clients: [
                { id: 'C001', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', tokens: 20 },
                { id: 'C002', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', tokens: 15 },
                { id: 'C003', firstName: 'Alice', lastName: 'Brown', email: 'alice.brown@example.com', tokens: 30 },
                { id: 'C004', firstName: 'Robert', lastName: 'Johnson', email: 'robert.johnson@example.com', tokens: 12 },
                { id: 'C005', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@example.com', tokens: 25 },
                { id: 'C006', firstName: 'Michael', lastName: 'Martinez', email: 'michael.martinez@example.com', tokens: 18 },
                { id: 'C007', firstName: 'Sarah', lastName: 'Lopez', email: 'sarah.lopez@example.com', tokens: 10 },
                { id: 'C008', firstName: 'William', lastName: 'Garcia', email: 'william.garcia@example.com', tokens: 40 },
                { id: 'C009', firstName: 'Sophia', lastName: 'Clark', email: 'sophia.clark@example.com', tokens: 22 },
                { id: 'C010', firstName: 'Daniel', lastName: 'Rodriguez', email: 'daniel.rodriguez@example.com', tokens: 8 },
                { id: 'C011', firstName: 'Emma', lastName: 'Hernandez', email: 'emma.hernandez@example.com', tokens: 16 },
                { id: 'C012', firstName: 'James', lastName: 'Walker', email: 'james.walker@example.com', tokens: 35 },
                { id: 'C013', firstName: 'Olivia', lastName: 'Hall', email: 'olivia.hall@example.com', tokens: 28 },
                { id: 'C014', firstName: 'Ethan', lastName: 'Young', email: 'ethan.young@example.com', tokens: 19 },
                { id: 'C015', firstName: 'Ava', lastName: 'Allen', email: 'ava.allen@example.com', tokens: 14 },
                { id: 'C016', firstName: 'Alexander', lastName: 'King', email: 'alexander.king@example.com', tokens: 9 },
                { id: 'C017', firstName: 'Mia', lastName: 'Wright', email: 'mia.wright@example.com', tokens: 50 },
                { id: 'C018', firstName: 'Benjamin', lastName: 'Scott', email: 'benjamin.scott@example.com', tokens: 20 },
                { id: 'C019', firstName: 'Isabella', lastName: 'Green', email: 'isabella.green@example.com', tokens: 12 },
                { id: 'C020', firstName: 'Lucas', lastName: 'Adams', email: 'lucas.adams@example.com', tokens: 30 }
            ],
            selectedClient: null,
            filters: null,
            clientDialogVisible: false
        };
    },
    created() {
        this.initFilters();
    },
    methods: {
        clearFilter() {
            this.initFilters();
        },
        initFilters() {
            this.filters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            };
        },
        showAddClientDialog() {
            this.clientDialogVisible = true;
            this.selectedClient = { id: null, firstName: '', lastName: '', email: '', tokens: 0 };
        },
        hideClientDialog() {
            this.clientDialogVisible = false;
        },
        editClient(client) {
            this.selectedClient = { ...client };
            this.clientDialogVisible = true;
        },
        deleteClient(clientId) {
            this.clients = this.clients.filter((client) => client.id !== clientId);
        },
        saveClient() {
            if (this.selectedClient.id) {
                const index = this.clients.findIndex((client) => client.id === this.selectedClient.id);
                if (index !== -1) {
                    this.clients[index] = { ...this.selectedClient };
                }
            } else {
                this.selectedClient.id = 'C' + (this.clients.length + 1).toString().padStart(3, '0');
                this.clients.push(this.selectedClient);
            }
            this.hideClientDialog();
        }
    }
};
</script>

<template>
    <div class="card">
        <DataTable
            ref="dt"
            v-model:selection="selectedClient"
            v-model:filters="filters"
            :value="clients"
            dataKey="id"
            tableStyle="min-width: 50rem"
            paginator
            :rows="10"
            filterDisplay="menu"
            :globalFilterFields="['id', 'firstName', 'lastName', 'email']"
        >
            <template #header>
                <div class="flex justify-between">
                    <div class="flex justify-between">
                        <Button type="button" icon="pi pi-filter-slash" class="mr-2" label="Effacer" outlined @click="clearFilter()" />
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Rechercher..." />
                        </IconField>
                    </div>
                    <Button icon="pi pi-user-plus" label="Ajouter un Client" @click="showAddClientDialog" />
                </div>
            </template>

            <Column field="id" header="ID" sortable></Column>
            <Column field="firstName" header="Prénom" sortable></Column>
            <Column field="lastName" header="Nom" sortable></Column>
            <Column field="email" header="Courriel" sortable></Column>
            <Column field="tokens" header="Jetons" sortable></Column>
            <Column header="Actions">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" @click="editClient(data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteClient(data.id)" />
                </template>
            </Column>
        </DataTable>

        <!-- Add/Edit Client Dialog -->
        <Dialog v-model:visible="clientDialogVisible" :style="{ width: '350px' }" header="Ajouter/Modifier un Client" :modal="true">
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="firstName" class="font-bold">Prénom</label>
                    <InputText id="firstName" v-model.trim="selectedClient.firstName" required="true" autofocus class="w-full" />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="lastName" class="font-bold">Nom</label>
                    <InputText id="lastName" v-model.trim="selectedClient.lastName" required="true" class="w-full" />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="email" class="font-bold">Courriel</label>
                    <InputText id="email" v-model.trim="selectedClient.email" required="true" class="w-full" />
                </div>
            </div>

            <template #footer>
                <div class="flex justify-between gap-2">
                    <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="hideClientDialog" />
                    <Button label="Sauvegarder" icon="pi pi-check" class="p-button-text" @click="saveClient" />
                </div>
            </template>
        </Dialog>
    </div>
</template>
