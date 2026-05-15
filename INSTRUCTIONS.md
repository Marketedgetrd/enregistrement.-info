# Connexion du Formulaire à Google Sheets

Voici les étapes simples pour connecter votre nouveau formulaire MarketEdge à votre tableau Google Sheets. 
L'opération prend environ 3 minutes.

## Étape 1 : Préparer le fichier Google Sheets

1. Allez sur [Google Sheets](https://docs.google.com/spreadsheets) et créez un nouveau tableau (Spreadsheet).
2. Nommez votre tableau (par exemple : "Inscriptions MarketEdge").
3. Sur la première ligne (Ligne 1), ajoutez **exactement** ces entêtes de colonnes (sans majuscules, sans espaces) :
   - Colonne A : `nom_complet`
   - Colonne B : `sexe`
   - Colonne C : `niveau_trading`
   - Colonne D : `broker`
   - Colonne E : `telephone`
   - Colonne F : `email`
   - Colonne G : `date_inscription`

## Étape 2 : Ajouter le script Google Apps

1. Dans votre Google Sheet, cliquez sur **Extensions** dans le menu du haut, puis sur **Apps Script**.
2. Un nouvel onglet s'ouvre. Supprimez tout le code présent dans l'éditeur et remplacez-le par le code suivant :

```javascript
const sheetName = 'Feuille 1'; // Modifiez si votre onglet a un autre nom (ex: Sheet1)

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(sheetName);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header];
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. Cliquez sur l'icône de **Disquette (Sauvegarder)** en haut. Nommez le projet "MarketEdge Form".

## Étape 3 : Déployer le script

1. En haut à droite, cliquez sur le bouton bleu **Déployer** puis sur **Nouveau déploiement**.
2. Cliquez sur l'icône d'engrenage ⚙️ à côté de "Sélectionner le type", puis choisissez **Application Web**.
3. Remplissez les champs ainsi :
   - Description : "Version 1"
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde** (C'est très important, sinon le formulaire ne marchera pas !)
4. Cliquez sur **Déployer**.
5. *Google va vous demander d'autoriser l'accès. Cliquez sur "Autoriser l'accès", choisissez votre compte, cliquez sur "Paramètres avancés" et "Aller à MarketEdge Form (non sécurisé)", puis sur "Autoriser".*
6. Vous obtiendrez une **URL d'application Web** (`https://script.google.com/macros/s/.../exec`). **Copiez cette URL**.

## Étape 4 : Lier le script à votre code

1. Ouvrez le fichier `script.js` qui se trouve dans le dossier de votre site.
2. À la ligne 8, remplacez la valeur de `GOOGLE_SCRIPT_URL` par l'URL que vous venez de copier :

```javascript
// Remplacez VOTRE_URL_GOOGLE_APPS_SCRIPT_ICI par votre lien :
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/.../exec'; 
```

3. **C'est prêt !** Vous pouvez ouvrir `index.html` dans votre navigateur et tester le formulaire. Les données apparaîtront instantanément dans votre Google Sheet.
