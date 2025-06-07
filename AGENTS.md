# AGENTS.md – Guide de développement pour Codex

## 🎯 Objectif de l'application

Créer une application web de gestion de locations GPS (trackers) destinée aux professionnels. L’application doit fonctionner **sans connexion**, uniquement avec **PouchDB en local storage**, sans Firebase ni backend.

L’interface doit être **responsive**, simple et rapide à utiliser sur mobile comme sur PC.

---

## 📦 Modules à développer

### 1. Tableau de bord
- Statistiques : clients actifs, GPS loués/disponibles, revenus mensuels
- Graphiques (facultatif)

### 2. Clients
- Ajouter, modifier, supprimer des clients
- Données : nom, téléphone, adresse, plaque, CIN
- Historique des locations

### 3. GPS
- Ajouter/modifier/supprimer des GPS
- Champs : modèle, IMEI (15 chiffres), statut (disponible/loué/en maintenance)

### 4. Cartes SIM
- Ajouter/modifier/supprimer des cartes SIM
- Champs : numéro, opérateur, validité (par date ou période), statut
- Alerte expiration

### 5. Locations
- Associer client + GPS + SIM
- Champs : date début, activation, 1er mois gratuit (option)
- Calcul automatique du statut de paiement
- Système de couleurs :
  - 🟢 À jour
  - 🟡 Bientôt en retard
  - 🔴 En retard

### 6. Paiements
- Enregistrement des paiements mensuels
- Méthode : Espèces / MVola
- Historique par client ou GPS
- Génération de reçus (texte simple ou modals)

### 7. Caisse
- Calcul dynamique : revenus – dépenses
- Par méthode de paiement
- Historique exportable

### 8. Promotions
- Codes promos (pourcentage ou montant)
- Validité : date de fin + limite d’utilisation
- Application automatique lors de la location

---

## 🗃️ Base de données PouchDB

Collections (objets stockés) :
- `clients`
- `gps`
- `sim_cards`
- `locations`
- `payments`
- `cashflow`
- `promotions`

---

## ✅ Bonnes pratiques à respecter

- Code JS séparé dans `app.js` (ou modulaire via `modules/*.js`)
- Style CSS séparé
- Validations dans les formulaires (IMEI, téléphone, champs requis)
- Utilisation de `pouchdb.min.js` en local
- Utiliser `uuid()` ou équivalent pour les IDs
- Design mobile-first
- Tous les messages/erreurs en français

---

## 📂 Structure recommandée
/index.html
/style.css
/app.js
/pouchdb.min.js
/modules/ (optionnel)

yaml
Copier
Modifier

---

Merci Codex 🙏
