(function() {
    // Initialisation de PouchDB pour chaque collection
    const db = {
        clients: new PouchDB('clients'),
        gps: new PouchDB('gps'),
        sim_cards: new PouchDB('sim_cards'),
        locations: new PouchDB('locations'),
        payments: new PouchDB('payments'),
        cashflow: new PouchDB('cashflow'),
        promotions: new PouchDB('promotions')
    };

    // Gestion du routage simple
    const modules = document.querySelectorAll('.module');
    document.querySelectorAll('#menu a').forEach(link => {
        link.addEventListener('click', evt => {
            evt.preventDefault();
            const target = evt.target.getAttribute('data-module');
            modules.forEach(m => m.classList.add('hidden'));
            document.getElementById(target).classList.remove('hidden');
        });
    });

    // Utilitaires
    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Clients
    const clientForm = document.getElementById('client-form');
    const clientList = document.getElementById('client-list');
    const cancelBtn = document.getElementById('client-cancel');
    let editingClient = null;

    clientForm.addEventListener('submit', async e => {
        e.preventDefault();
        const doc = {
            nom: clientForm['client-nom'].value.trim(),
            tel: clientForm['client-tel'].value.trim(),
            vehicule: clientForm['client-vehicule'].value.trim(),
            plaque: clientForm['client-plaque'].value.trim()
        };
        try {
            if (editingClient) {
                doc._id = editingClient._id;
                doc._rev = editingClient._rev;
            } else {
                doc._id = uuid();
            }
            await db.clients.put(doc);
            cancelEdit();
            loadClients();
        } catch (err) {
            alert('Erreur lors de l\'enregistrement du client');
        }
    });

    cancelBtn.addEventListener('click', cancelEdit);

    function cancelEdit() {
        editingClient = null;
        clientForm.reset();
        clientForm.querySelector('button[type="submit"]').textContent = 'Ajouter';
        cancelBtn.classList.add('hidden');
    }

    async function loadClients() {
        const result = await db.clients.allDocs({ include_docs: true });
        clientList.innerHTML = '';
        result.rows.forEach(row => {
            const li = document.createElement('li');
            li.textContent = row.doc.nom + ' - ' + row.doc.tel + ' - ' + row.doc.vehicule + ' - ' + row.doc.plaque;
            const edit = document.createElement('button');
            edit.textContent = 'Modifier';
            edit.addEventListener('click', () => editClient(row.doc));
            const del = document.createElement('button');
            del.textContent = 'Supprimer';
            del.addEventListener('click', () => deleteClient(row.doc));
            li.appendChild(edit);
            li.appendChild(del);
            clientList.appendChild(li);
        });
    }

    function editClient(doc) {
        editingClient = doc;
        clientForm['client-nom'].value = doc.nom;
        clientForm['client-tel'].value = doc.tel;
        clientForm['client-vehicule'].value = doc.vehicule;
        clientForm['client-plaque'].value = doc.plaque;
        clientForm.querySelector('button[type="submit"]').textContent = 'Modifier';
        cancelBtn.classList.remove('hidden');
    }

    async function deleteClient(doc) {
        if (confirm('Supprimer ce client ?')) {
            try {
                await db.clients.remove(doc);
                loadClients();
            } catch (err) {
                alert('Erreur lors de la suppression');
            }
        }
    }

    loadClients();

    // GPS
    const gpsForm = document.getElementById('gps-form');
    const gpsList = document.getElementById('gps-list');

    gpsForm.addEventListener('submit', async e => {
        e.preventDefault();
        const doc = {
            _id: uuid(),
            modele: gpsForm['gps-modele'].value.trim(),
            imei: gpsForm['gps-imei'].value.trim(),
            statut: gpsForm['gps-statut'].value
        };
        try {
            await db.gps.put(doc);
            gpsForm.reset();
            loadGps();
        } catch (err) {
            alert('Erreur lors de l\'ajout du GPS');
        }
    });

    async function loadGps() {
        const result = await db.gps.allDocs({ include_docs: true });
        gpsList.innerHTML = '';
        result.rows.forEach(row => {
            const li = document.createElement('li');
            li.textContent = row.doc.modele + ' - ' + row.doc.imei;
            li.addEventListener('click', () => deleteGps(row.doc));
            gpsList.appendChild(li);
        });
    }

    async function deleteGps(doc) {
        if (confirm('Supprimer ce GPS ?')) {
            try {
                await db.gps.remove(doc);
                loadGps();
            } catch (err) {
                alert('Erreur lors de la suppression');
            }
        }
    }

    loadGps();

    // SIM
    const simForm = document.getElementById('sim-form');
    const simList = document.getElementById('sim-list');

    simForm.addEventListener('submit', async e => {
        e.preventDefault();
        const doc = {
            _id: uuid(),
            numero: simForm['sim-num'].value.trim(),
            operateur: simForm['sim-operateur'].value.trim(),
            validite: simForm['sim-validite'].value,
            statut: simForm['sim-statut'].value
        };
        try {
            await db.sim_cards.put(doc);
            simForm.reset();
            loadSims();
        } catch (err) {
            alert('Erreur lors de l\'ajout de la carte SIM');
        }
    });

    async function loadSims() {
        const result = await db.sim_cards.allDocs({ include_docs: true });
        simList.innerHTML = '';
        result.rows.forEach(row => {
            const li = document.createElement('li');
            li.textContent = row.doc.numero + ' - ' + row.doc.operateur;
            li.addEventListener('click', () => deleteSim(row.doc));
            simList.appendChild(li);
        });
    }

    async function deleteSim(doc) {
        if (confirm('Supprimer cette carte SIM ?')) {
            try {
                await db.sim_cards.remove(doc);
                loadSims();
            } catch (err) {
                alert('Erreur lors de la suppression');
            }
        }
    }

    loadSims();

    // Locations
    const locationForm = document.getElementById('location-form');
    const locationList = document.getElementById('location-list');

    locationForm.addEventListener('submit', async e => {
        e.preventDefault();
        const doc = {
            _id: uuid(),
            client: locationForm['location-client'].value.trim(),
            gps: locationForm['location-gps'].value.trim(),
            sim: locationForm['location-sim'].value.trim(),
            debut: locationForm['location-debut'].value
        };
        try {
            await db.locations.put(doc);
            locationForm.reset();
            loadLocations();
        } catch (err) {
            alert('Erreur lors de l\'ajout de la location');
        }
    });

    async function loadLocations() {
        const result = await db.locations.allDocs({ include_docs: true });
        locationList.innerHTML = '';
        result.rows.forEach(row => {
            const li = document.createElement('li');
            li.textContent = row.doc.client + ' - ' + row.doc.gps;
            li.addEventListener('click', () => deleteLocation(row.doc));
            locationList.appendChild(li);
        });
    }

    async function deleteLocation(doc) {
        if (confirm('Supprimer cette location ?')) {
            try {
                await db.locations.remove(doc);
                loadLocations();
            } catch (err) {
                alert('Erreur lors de la suppression');
            }
        }
    }

    loadLocations();

    // Paiements
    const paymentForm = document.getElementById('payment-form');
    const paymentList = document.getElementById('payment-list');

    paymentForm.addEventListener('submit', async e => {
        e.preventDefault();
        const doc = {
            _id: uuid(),
            location: paymentForm['payment-location'].value.trim(),
            montant: parseFloat(paymentForm['payment-montant'].value),
            methode: paymentForm['payment-methode'].value,
            date: new Date().toISOString()
        };
        try {
            await db.payments.put(doc);
            paymentForm.reset();
            loadPayments();
        } catch (err) {
            alert('Erreur lors de l\'enregistrement du paiement');
        }
    });

    async function loadPayments() {
        const result = await db.payments.allDocs({ include_docs: true });
        paymentList.innerHTML = '';
        result.rows.forEach(row => {
            const li = document.createElement('li');
            li.textContent = row.doc.location + ' - ' + row.doc.montant + ' Ar';
            li.addEventListener('click', () => deletePayment(row.doc));
            paymentList.appendChild(li);
        });
    }

    async function deletePayment(doc) {
        if (confirm('Supprimer ce paiement ?')) {
            try {
                await db.payments.remove(doc);
                loadPayments();
            } catch (err) {
                alert('Erreur lors de la suppression');
            }
        }
    }

    loadPayments();
})();
