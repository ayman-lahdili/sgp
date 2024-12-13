<script>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default {
    data() {
        return {
            users: [
                { id: 'U001', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
                { id: 'U002', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Employé' },
                { id: 'U003', name: 'Alice Brown', email: 'alice.brown@example.com', role: 'Employé' }
            ],
            selectedUser: null,
            filters: null,
            roles: ['Admin', 'Employé'],
            userDialogVisible: false
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
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                role: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
            };
        },
        getSeverity(role) {
            switch (role) {
                case 'Admin':
                    return 'success';
                case 'Employé':
                    return 'info';
            }
        },
        showAddUserDialog() {
            this.userDialogVisible = true;
            this.selectedUser = { id: null, name: '', email: '', role: 'Employé' };
        },
        hideUserDialog() {
            this.userDialogVisible = false;
        },
        editUser(user) {
            this.selectedUser = { ...user };
            this.userDialogVisible = true;
        },
        deleteUser(userId) {
            this.users = this.users.filter((user) => user.id !== userId);
        },
        saveUser() {
            if (this.selectedUser.id) {
                const index = this.users.findIndex((user) => user.id === this.selectedUser.id);
                if (index !== -1) {
                    this.users[index] = { ...this.selectedUser };
                }
            } else {
                this.selectedUser.id = 'U' + (this.users.length + 1).toString().padStart(3, '0');
                this.users.push(this.selectedUser);
            }
            this.hideUserDialog();
        }
    }
};
</script>

<template>
    <div class="card">
        <DataTable ref="dt" v-model:selection="selectedUser" v-model:filters="filters" :value="users" dataKey="id" tableStyle="min-width: 50rem" paginator :rows="10" filterDisplay="menu" :globalFilterFields="['id', 'name', 'role', 'email']">
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
                    <Button icon="pi pi-user-plus" label="Ajouter un Utilisateur" @click="showAddUserDialog" />
                </div>
            </template>

            <Column style="width: 3rem"></Column>
            <Column field="id" header="ID"></Column>
            <Column field="name" header="Name" sortable style="width: 25%"></Column>
            <Column field="email" header="Email" sortable style="width: 25%"></Column>
            <Column field="role" header="Role" sortable filterMatchMode="equals" style="width: 15%">
                <template #body="{ data }">
                    <Tag :value="data.role" :severity="getSeverity(data.role)" />
                </template>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="roles" placeholder="Select Role" showClear />
                </template>
            </Column>
            <Column header="Actions" style="width: 10%">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" @click="editUser(data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteUser(data.id)" />
                </template>
            </Column>
        </DataTable>

        <!-- Add/Edit User Dialog -->
        <Dialog v-model:visible="userDialogVisible" :style="{ width: '450px' }" :header="userDialogMode === 'edit' ? 'Modifier un Utilisateur' : 'Ajouter un Utilisateur'" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Nom</label>
                    <InputText id="name" v-model.trim="selectedUser.name" required="true" autofocus :invalid="submitted && !selectedUser.name" fluid />
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" v-model.trim="selectedUser.email" required="true" :invalid="submitted && !selectedUser.email" fluid />
                </div>
                <div>
                    <label for="role" class="block font-bold mb-3">Rôle</label>
                    <Select v-model="selectedUser.role" :options="roles" id="role" required="true" :invalid="submitted && !selectedUser.role" />
                </div>
            </div>

            <template #footer>
                <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="hideUserDialog" />
                <Button label="Sauvegarder" icon="pi pi-check" class="p-button-text" @click="saveUser" />
            </template>
        </Dialog>
    </div>
</template>
