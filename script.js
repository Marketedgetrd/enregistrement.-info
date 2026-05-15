document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = form.querySelector('.btn-text');
    const loader = form.querySelector('.loader');
    const formMessage = document.getElementById('formMessage');

    // ⚠️ IMPORTANT: Remplacez cette URL par l'URL de votre Web App Google Apps Script
    // Voir le fichier INSTRUCTIONS.md pour savoir comment l'obtenir
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdfOGUCsE5eIMnVD_1abm8WzMJu8sC_feahhgVdLJDUkS3LJAOvipCWtov07E9QpOh/exec';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UX: Désactiver le bouton et montrer le loader
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        loader.style.display = 'block';
        if (formMessage) {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }

        // Récupération des données du formulaire
        const formData = new FormData(form);
        // Ajout de la date
        formData.append('date_inscription', new Date().toLocaleString('fr-FR'));

        try {
            // Envoi des données au Google Script
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Évite les erreurs de sécurité CORS (notamment en ouvrant le fichier localement)
                body: formData
            });

            // Succès (avec no-cors on ne peut pas lire la réponse exacte, on assume le succès)
            // Succès (avec no-cors on ne peut pas lire la réponse exacte, on assume le succès)
            showToast('success', 'Félicitations !', 'Votre enregistrement est effectué avec succès.');
            form.reset(); // Vider le formulaire
        } catch (error) {
            // Erreur
            console.error('Erreur!', error.message);
            showToast('error', 'Erreur !', 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            // UX: Réactiver le bouton et cacher le loader
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            loader.style.display = 'none';
        }
    });

    // Fonction pour afficher le popup (toast) non intrusif
    function showToast(type, title, message) {
        const toast = document.getElementById('toast');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');

        // Configurer le contenu
        toastTitle.textContent = title;
        toastMessage.textContent = message;

        if (type === 'success') {
            toast.className = 'toast success';
            toastIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else {
            toast.className = 'toast error';
            toastIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        }

        // Afficher avec une petite pause pour permettre la transition CSS
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Cacher après 4 secondes
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
});
