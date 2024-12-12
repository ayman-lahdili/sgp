<script>
import { useToast } from 'primevue/usetoast';

export default {
    data() {
        return {
            settings: {
                gasPrice: 140.23, // Prix de l'essence par défaut
                tps: 5, // TPS par défaut en %
                tvq: 9.975 // TVQ par défaut en %
            },
            showConfirmationDialog: false,
            toast: null
        };
    },
    mounted() {
        this.toast = useToast();
    },
    methods: {
        saveSettings() {
            // Ouvrir la boîte de dialogue pour confirmer l'enregistrement des modifications
            this.showConfirmationDialog = true;
        },
        confirmSaveSettings() {
            // Enregistrer les paramètres
            this.showConfirmationDialog = false;

            // Afficher une notification de succès
            this.toast.add({ severity: 'success', summary: 'Paramètres sauvegardés', detail: 'Les modifications ont été enregistrées avec succès.', life: 3000 });

            // Optionnel: vous pouvez envoyer ces valeurs à un serveur pour les stocker
            console.log('Paramètres enregistrés:', this.settings);
        }
    }
};
</script>

<template>
    <div class="flex justify-center items-center">
        <div class="card w-full sm:w-8 max-w-3xl">
            <div class="flex flex-col gap-4">
                <!-- Prix de l'essence -->
                <div class="field">
                    <label for="gas-price" class="block font-bold">Prix de l'essence</label>
                    <InputNumber id="gas-price" v-model="settings.gasPrice" mode="currency" currency="CAD" :min="0" />
                </div>

                <!-- TPS -->
                <div class="field">
                    <label for="tps" class="block font-bold">TPS (%)</label>
                    <InputNumber id="tps" v-model="settings.tps" mode="decimal" :min="0" :max="100" />
                </div>

                <!-- TVQ -->
                <div class="field">
                    <label for="tvq" class="block font-bold">TVQ (%)</label>
                    <InputNumber id="tvq" v-model="settings.tvq" mode="decimal" :min="0" :max="100" />
                </div>
            </div>

            <!-- Footer avec le bouton Sauvegarder -->
            <div class="flex justify-end mt-6">
                <Button label="Sauvegarder" icon="pi pi-save" severity="success" @click="saveSettings" />
            </div>
        </div>
    </div>

    <!-- Dialog de confirmation -->
    <Dialog v-model:visible="showConfirmationDialog" :style="{ width: '450px' }" header="Confirmation" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span>Êtes-vous sûr de vouloir enregistrer les modifications ?</span>
        </div>
        <template #footer>
            <Button label="Annuler" icon="pi pi-times" text @click="showConfirmationDialog = false" />
            <Button label="Confirmer" icon="pi pi-check" text @click="confirmSaveSettings" />
        </template>
    </Dialog>
</template>

<style scoped>
/* Centrer les éléments au milieu de l'écran */
.flex {
    display: flex;
    justify-content: center;
    align-items: center;
}

.min-h-screen {
    min-height: 100vh;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 600px; /* Ajustez la taille du card */
}

.field {
    margin-bottom: 16px;
}
</style>
