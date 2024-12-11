<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Ajouter Réservoir" icon="pi pi-plus" severity="secondary" class="mr-2" @click="createReservoir" />
                <Button label="Modifier Réservoir" icon="pi pi-pencil" severity="secondary" class="mr-2" @click="editReservoir()" :disabled="!selectedReservoir" />
                <Button label="Supprimer Réservoir" icon="pi pi-trash" severity="secondary" class="mr-2" @click="deleteReservoirDialog = true;" :disabled="!selectedReservoir" />
            </template>

            <template #end>
                <Button label="Exporter" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>
        <DataTable 
            v-model:selection="selectedReservoir"
            dataKey="id"
            :value="reservoirs" 
            tableStyle="min-width: 50rem"
        >
            <Column selectionMode="single" style="width: 3rem"></Column>
            <Column field="id" header="Code"></Column>
            <Column field="capacity" header="Capacité (L)"></Column>
            <Column field="current_level" header="Niveau actuel (L)"></Column>
            <Column field="fuel_percentage" header="Pourcentage de carburant" />
        </DataTable>
        <Dialog v-model:visible="ReservoirDialog" :style="{ width: '450px' }" :header="ReservoirDialog==='edit' ? 'Modifier un Réservoir' : 'Ajouter un Réservoir'" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">ID</label>
                    <InputText id="name" v-model.trim="reservoir.id" required="true" autofocus :invalid="submitted && !reservoir.id" fluid disabled />
                </div>
                <div>
                    <label for="capacity" class="block font-bold mb-3">Capacité</label>
                    <InputNumber id="capacity" v-model="reservoir.capacity" required="true" :invalid="submitted && !reservoir.capacity" />
                </div>
            </div>

            <template #footer>
                <Button label="Annuler" icon="pi pi-times" text @click="ReservoirDialog = false; submitted = false;" />
                <Button label="Enregistrer" icon="pi pi-check" @click="saveReservoir" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteReservoirDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span>Êtes-vous sûr de vouloir supprimer ce réservoir ?</span>
            </div>
            <template #footer>
                <Button label="Non" icon="pi pi-times" text @click="deleteReservoirDialog = false" />
                <Button label="Oui" icon="pi pi-check" text @click="deleteSelectedReservoir" />
            </template>
        </Dialog>
    </div>
</template>

<script>
import { useToast } from 'primevue/usetoast';

export default {
    data() {
        return {
            reservoirs: [
                { id: 'R001', capacity: 3000, current_level: 102 },
                { id: 'R002', capacity: 3000, current_level: 2000 },
            ],
            selectedReservoir: null,
            ReservoirDialog: false,
            deleteReservoirDialog: false,
            ReservoirDialogState: 'create',
            toast: null,
            reservoir: {},
            submitted: false,
        };
    },
    mounted() {
        this.toast = useToast();
        this.updateFuelPercentage();
    },
    methods: {
        createReservoir() {
            this.reservoir = {
                id: this.getNextReservoirId(),
                capacity: 3000,
                current_level: 0,
            };
            this.ReservoirDialogState = 'create';
            this.submitted = false;
            this.ReservoirDialog = true;
        },
        editReservoir() {
            this.reservoir = this.selectedReservoir;
            this.ReservoirDialogState = 'edit';
            this.submitted = false;
            this.ReservoirDialog = true;
        },
        updateFuelPercentage() {
            this.reservoirs.forEach(res => {
                res.fuel_percentage = Math.floor((res.current_level / res.capacity) * 100);
            });
        },
        saveReservoir() {
            if (this.ReservoirDialogState === 'create') {
                if (this.reservoir?.id?.trim()) {
                    this.reservoirs.push(this.reservoir);
                    this.updateFuelPercentage();
                    this.toast.add({ severity: 'success', summary: 'Succès', detail: 'Réservoir ajouté', life: 3000 });
                    this.submitted = true;
                    this.ReservoirDialog = false;
                    this.reservoir = {};
                }
            } else {
                this.updateFuelPercentage();
                this.submitted = true;
                this.ReservoirDialog = false;
                this.reservoir = {};
                this.toast.add({ severity: 'success', summary: 'Succès', detail: 'Réservoir modifié', life: 3000 });
            }
        },
        deleteSelectedReservoir() {
            this.reservoirs = this.reservoirs.filter((val) => val !== this.selectedReservoir);
            this.deleteReservoirDialog = false;
            this.selectedReservoir = null;
            this.toast.add({ severity: 'success', summary: 'Succès', detail: 'Réservoir supprimé', life: 3000 });
        },
        getNextReservoirId() {
            const maxId = this.reservoirs.reduce((max, res) => {
                const numericPart = parseInt(res.id.slice(1), 10);
                return numericPart > max ? numericPart : max;
            }, 0);
            const nextId = maxId + 1;
            return `R${nextId.toString().padStart(3, '0')}`;
        },
    },
};
</script>
