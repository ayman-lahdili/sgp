
<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nouveau" icon="pi pi-plus" severity="secondary" class="mr-2" @click="createPump" />
                <Button label="Modifier" icon="pi pi-pencil" severity="secondary" class="mr-2" @click="editPump()" :disabled="!selectedPump" />
                <Button label="Supprimer" icon="pi pi-trash" severity="secondary" class="mr-2" @click="this.deletePumpDialog = true;" :disabled="!selectedPump" />
                <Button v-if="selectedPump?.status === 'Activé'" label="Désactivé" icon="pi pi-times-circle" severity="danger" class="mr-2" @click="this.selectedPump.status = 'Désactivé'; this.selectedPump.motor_state = 'Désactivé'" :disabled="!selectedPump" />
                <Button v-if="selectedPump?.status === 'Désactivé'" label="Activé" icon="pi pi-check-circle" severity="success" class="mr-2" @click="this.selectedPump.status = 'Activé'; this.selectedPump.motor_state = 'Activé'" :disabled="!selectedPump" />
                <Button v-if="selectedPump?.status === 'Transaction en attente'" label="Payer la transaction" icon="pi pi-credit-card" severity="warn" class="mr-2" @click="payPump()" :disabled="!selectedPump" />
                <Button v-if="selectedPump?.status === 'Transaction en attente'" label="Signaler un incident" severity="danger" variant="outlined" size="normal" @click="PumpIncident()" />
            </template>

            <template #end>
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>
        <DataTable 
            v-model:selection="selectedPump"
            dataKey="id"
            :value="pumps" 
            tableStyle="min-width: 50rem"
        >
            <Column selectionMode="single" style="width: 3rem"></Column>
            <Column field="id" header="Code"></Column>
            <Column field="type" header="Type"></Column>
            <Column field="status" header="État"></Column>
            <Column field="reservoir" header="Code réservoir"></Column>
            <Column field="fuel_level" header="Niveau du réservoir"></Column>
            <Column field="motor_state" header="État du moteur"></Column>
        </DataTable>
        <Dialog v-model:visible="PumpDialog" :style="{ width: '450px' }" :header="PumpDialog==='edit' ? 'Modifier une Pompe' : 'Ajouter une Pompe'" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">ID</label>
                    <InputText id="name" v-model.trim="pump.id" required="true" autofocus :invalid="submitted && !pump.id" fluid disabled />
                </div>
                <div>
                    <span class="block font-bold mb-4">Type</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="normal" v-model="pump.type" name="type" value="Normal"  required="true" :invalid="submitted && !pump.type" />
                            <label for="1">Normal</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="auto" v-model="pump.type" name="type" value="Sophistiqué" required="true" :invalid="submitted && !pump.type" />
                            <label for="2">Sophistiqué</label>
                        </div>
                    </div>
                </div>
                <div>
                    <span class="block font-bold mb-4">Reservoir</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="reservoir1" v-model="pump.reservoir" name="reservoir" value='R001' required="true" :invalid="submitted && !pump.reservoir" />
                            <label for="1">Reservoir 1</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="reservoir2" v-model="pump.reservoir" name="reservoir" value='R002' required="true" :invalid="submitted && !pump.reservoir" />
                            <label for="2">Reservoir 2</label>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="pumpDialog = false; submitted = false;" />
                <Button label="Save" icon="pi pi-check" @click="savePump" />
            </template>
        </Dialog>
        <Dialog v-model:visible="PaymentDialog" :style="{ width: '450px' }" header="Compléter la transaction" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="pump-id" class="block font-bold mb-3">ID Pompe</label>
                    <InputText id="pump-id" v-model="selectedPump.id" disabled />
                </div>

                <div>
                    <span class="block font-bold mb-4">Mode de paiement</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-4">
                            <RadioButton id="credit-card" v-model="paymentMethod" name="payment" value="credit-card" />
                            <label for="credit-card">Carte Crédit</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-4">
                            <RadioButton id="cash" v-model="paymentMethod" name="payment" value="cash" />
                            <label for="cash">Argent Comptant</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-4">
                            <RadioButton id="client-account" v-model="paymentMethod" name="payment" value="client-account" />
                            <label for="client-account">Compte Client</label>
                        </div>
                    </div>
                </div>
                
                <div v-if="paymentMethod === 'credit-card'">
                    <label for="card-number" class="block font-bold mb-3">Numéro de Carte</label>
                    <InputText id="card-number" v-model="paymentDetails.cardNumber" placeholder="XXXX-XXXX-XXXX-XXXX" />
                </div>

                <div v-if="paymentMethod === 'client-account'">
                    <label for="client-email" class="block font-bold mb-3">Courriel du Client</label>
                    <InputText id="client-email" v-model="paymentDetails.clientEmail" placeholder="email@example.com" />
                </div>

                <div>
                    <label for="amount" class="block font-bold mb-3">Montant</label>
                    <InputNumber id="amount" v-model="paymentDetails.amount" mode="currency" currency="USD" />
                </div>
            </div>

            <template #footer>
                <Button label="Annuler" icon="pi pi-times" text @click="PaymentDialog = false; resetPayment()" />
                <Button label="Payer et imprimer le reçu" icon="pi pi-check" @click="processPayment" />
            </template>
        </Dialog>
        <Dialog v-model:visible="deletePumpDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product">Are you sure you want to delete the selected Pump?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deletePumpDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedPump" />
            </template>
        </Dialog>

        <Dialog v-model:visible="incidentDialog" header="Signaler un incident" :style="{ width: '450px' }" :modal="true">
            <div class="flex flex-col gap-4">
                <!-- License Plate and Transaction Number in the same row -->
                <div class="flex gap-4">
                    <div class="flex-1">
                        <label for="license-plate" class="block font-bold mb-2">Plaque d'immatriculation</label>
                        <InputText 
                            id="license-plate" 
                            v-model="incident.licensePlate" 
                            placeholder="123-ABC" 
                        />
                    </div>
                    <div class="flex-1">
                        <label for="transaction-number" class="block font-bold mb-2">Numéro de transaction</label>
                        <InputText 
                            id="transaction-number" 
                            v-model="incident.transactionNumber" 
                            placeholder="Numéro de transaction" 
                            :class="{ 'p-invalid': submitted && !incident.transactionNumber }"
                            disabled
                        />
                        <small v-if="submitted && !incident.transactionNumber" class="p-error">Ce champ est requis.</small>
                    </div>
                </div>

                <div>
                    <label for="amount" class="block font-bold mb-2">Montant à payer</label>
                    <InputText 
                        id="amount" 
                        v-model="incident.amount" 
                        placeholder="0.00" 
                        type="number"
                        :step="0.01" 
                        :min="0" 
                        :class="{ 'p-invalid': submitted && (!incident.amount || incident.amount <= 0) }"
                    />
                    <small v-if="submitted && (!incident.amount || incident.amount <= 0)" class="p-error">Un montant valide est requis.</small>
                </div>

                <!-- Observations textarea -->
                <div>
                    <label for="observations" class="block font-bold mb-2">Observations</label>
                    <Textarea 
                        id="observations" 
                        v-model="incident.observations" 
                        rows="6" 
                        placeholder="Décrivez l'incident" 
                        :style="{ width: '100%' }" 
                    />
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

import { useToast } from 'primevue/usetoast';

export default {
    data() {
        return {
            reservoirs: [
                { id: 'R001', capacity: 3000, current_level: 102 },
                { id: 'R002', capacity: 3000, current_level: 2000 },
            ],
            pumps: [
                { id: 'P001', status: 'Activé', type: 'Normal', reservoir: 'R001', fuel_level: 0, motor_state: 'Activé', amount_pumped: 0, current_trx_id: 'T0000001'},
                { id: 'P002', status: 'Désactivé', type: 'Sophistiqué', reservoir: 'R002', fuel_level: 0, motor_state: 'Désactivé', amount_pumped: 0, current_trx_id: 'T0000002'},
                { id: 'P003', status: 'Transaction en attente', type: 'Sophistiqué', reservoir: 'R002', fuel_level: 0, motor_state: 'Désactivé', amount_pumped: 20, current_trx_id: 'T0000003'},
            ],
            selectedPump: null,
            deletePumpDialog: false,
            PumpDialog: false,
            PumpDialogState: 'create',
            toast: null,
            pump: {},
            submitted: false,
            PaymentDialog: false,
            paymentMethod: null,
            paymentDetails: {
                cardNumber: '',
                clientEmail: '',
                amount: null,
            },
            gasPrice: 140.23,
            incidentDialog: false,
            incident: {
                licensePlate: '',
                transactionNumber: '',
                observations: '',
                amount: 0,
            },
            submitted: false,
        };
    },
    mounted() {
        this.toast = useToast();

        this.updateFuelLevels();
    },
    methods: {
        createPump() {
            console.log(this.selectedPump)
            this.pump = {
                id:  this.getNextPumpId(),
                status: 'deactivated',
                reservoir: 'R001',
                type: 'Normal',
                motor_state: 'Désactivé'
            };
            this.PumpDialogState = 'create'
            this.submitted = false;
            this.PumpDialog = true;
        },
        editPump() {
            this.pump = this.selectedPump;
            this.PumpDialogState = 'edit'
            this.submitted = false;
            this.PumpDialog = true;
        },
        PumpIncident() {
            this.incident.amount = this.gasPrice * this.selectedPump.amount_pumped / 100;
            this.incident.transactionNumber = this.selectedPump.current_trx_id;
            this.incidentDialog = true;
        },
        updateFuelLevels() {
            this.pumps.forEach(pump => {
            // Find the corresponding reservoir
            const reservoir = this.reservoirs.find(res => res.id === pump.reservoir);
            if (reservoir) {
                    // Calculate the fuel level as a percentage
                    pump.fuel_level = Math.floor((reservoir.current_level / reservoir.capacity) * 100);
                }
            });
        },
        savePump() {            
            if (this.PumpDialogState === 'create') {
                if (this.pump?.id?.trim()) {
                    this.pumps.push(this.pump);
                    this.updateFuelLevels();
                    this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Pump Created', life: 3000 });
                    
                    this.submitted = true;
                    this.PumpDialog = false;
                    this.pump = {};
                }
            } else {
                this.updateFuelLevels();
                this.submitted = true;
                this.PumpDialog = false;
                this.pump = {};
                this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Pump Modified', life: 3000 });
            }
        },
        payPump() {
            this.PaymentDialog = true
            this.paymentDetails.amount = this.gasPrice * this.selectedPump.amount_pumped / 100;
        },
        processPayment() {
            if (!this.paymentDetails.amount) {
                this.toast.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez entrer un montant.', life: 3000 });
                return;
            }

            switch (this.paymentMethod) {
                case 'credit-card':
                    if (!this.paymentDetails.cardNumber) {
                        this.toast.add({ severity: 'error', summary: 'Erreur', detail: 'Numéro de carte manquant.', life: 3000 });
                        return;
                    }
                    this.toast.add({ severity: 'success', summary: 'Paiement Réussi', detail: 'Paiement par carte crédit effectué.', life: 3000 });
                    break;

                case 'cash':
                    this.toast.add({ severity: 'success', summary: 'Paiement Réussi', detail: 'Paiement en argent comptant effectué.', life: 3000 });
                    break;

                case 'client-account':
                    if (!this.paymentDetails.clientEmail) {
                        this.toast.add({ severity: 'error', summary: 'Erreur', detail: 'Courriel du client manquant.', life: 3000 });
                        return;
                    }
                    this.toast.add({ severity: 'success', summary: 'Paiement Réussi', detail: 'Paiement via compte client effectué.', life: 3000 });
                    break;

                default:
                    this.toast.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez sélectionner une méthode de paiement.', life: 3000 });
                    return;
            }

            // Close the dialog and reset payment details
            this.PaymentDialog = false;
            this.selectedPump.status = "Désactivé";
            this.selectedPump.amount_pumped = 0;
            this.paymentMethod = null;
            this.paymentDetails = {
                cardNumber: '',
                clientEmail: '',
                amount: null,
            };
        },
        deleteSelectedPump() {
            this.pumps = this.pumps.filter((val) => !this.selectedPump.includes(val));
            this.deletePumpDialog = false;
            this.selectedPump = null;
            this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Pompe supprimée', life: 3000 });
        },
        getNextPumpId() {
            // Extract numeric parts of existing IDs and find the maximum value
            const maxId = this.pumps.reduce((max, pump) => {
                const numericPart = parseInt(pump.id.slice(1), 10); // Extract the number after 'P'
                return numericPart > max ? numericPart : max;
            }, 0);

            // Increment the maximum numeric part and format it as PXXX
            const nextId = maxId + 1;
            return `P${nextId.toString().padStart(3, '0')}`; // Ensures the result has three digits
        },
        submitIncident() {
            this.submitted = true;

            if (!this.incident.transactionNumber) {
                this.toast.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Le numéro de transaction est requis.',
                    life: 3000,
                });
                return;
            }

            console.log('Incident Signalé:', this.incident);

            this.toast.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Incident signalé avec succès.',
                life: 3000,
            });
            this.incidentDialog = false;
            this.incident = {
                licensePlate: '',
                transactionNumber: '',
                observations: '',
            };
            this.submitted = false;
        },
    }
};
</script>
