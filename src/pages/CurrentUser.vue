<script>
import { useToast } from 'primevue/usetoast';

export default {
    data() {
        return {
            user: {
                username: 'utilisateur123',
                email: 'user@example.com',
                password: '',
                confirmPassword: ''
            },
            isUsernameDisabled: false, // Désactiver l'édition du nom d'utilisateur
            isEmailDisabled: false, // Désactiver l'édition de l'email
            showConfirmationDialog: false,
            toast: null
        };
    },
    mounted() {
        this.toast = useToast();
    },
    methods: {
        saveUserSettings() {
            // Vérifier que les mots de passe correspondent
            if (this.user.password !== this.user.confirmPassword) {
                this.toast.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Les mots de passe ne correspondent pas.',
                    life: 3000
                });
                return;
            }

            // Ouvrir la boîte de dialogue pour confirmer l'enregistrement des modifications
            this.showConfirmationDialog = true;
        },
        confirmSaveUserSettings() {
            // Enregistrer les paramètres
            this.showConfirmationDialog = false;

            // Afficher une notification de succès
            this.toast.add({
                severity: 'success',
                summary: 'Informations sauvegardées',
                detail: "Les informations de l'utilisateur ont été enregistrées avec succès.",
                life: 3000
            });

            // Optionnel: vous pouvez envoyer ces valeurs à un serveur pour les stocker
            console.log('Informations utilisateur enregistrées:', this.user);
        }
    }
};
</script>

<template>
    <div class="flex justify-center items-center">
        <div class="card w-full sm:w-8 max-w-3xl">
            <div class="flex flex-col gap-4">
                <!-- Champ pour le nom d'utilisateur -->
                <div class="field">
                    <label for="username" class="block font-bold">Nom d'utilisateur</label>
                    <InputText id="username" v-model="user.username" :disabled="isUsernameDisabled" />
                </div>

                <!-- Champ pour l'email -->
                <div class="field">
                    <label for="email" class="block font-bold">Courriel</label>
                    <InputText id="email" v-model="user.email" :disabled="isEmailDisabled" />
                </div>

                <!-- Champ pour le mot de passe -->
                <div class="field">
                    <label for="password" class="block font-bold">Mot de passe</label>
                    <Password id="password" v-model="user.password" toggleMask />
                </div>

                <!-- Champ pour confirmer le mot de passe -->
                <div class="field">
                    <label for="confirmPassword" class="block font-bold">Confirmer le mot de passe</label>
                    <Password id="confirmPassword" v-model="user.confirmPassword" toggleMask />
                </div>
            </div>

            <!-- Footer avec le bouton Sauvegarder -->
            <div class="flex justify-end mt-6">
                <Button label="Sauvegarder" icon="pi pi-save" severity="success" @click="saveUserSettings" />
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
            <Button label="Confirmer" icon="pi pi-check" text @click="confirmSaveUserSettings" />
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
