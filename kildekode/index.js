const express = require('express');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('./konfigurasjonsfiler/database.db');

app.use(express.json());
app.use(express.static('./kildekode'));

// Kunde
app.get('/produkter', (req, res) => {
    res.json(db.prepare('SELECT * FROM produkter').all());
});

// Admin
app.post('/admin/produkter', (req, res) => {
    db.prepare('INSERT INTO produkter (navn, beskrivelse, pris, kategori_id) VALUES (?, ?, ?, ?)')
      .run(req.body.navn, req.body.beskrivelse, req.body.pris, req.body.kategori_id);
    res.json({ melding: 'Lagt til' });
});

app.put('/admin/produkter/:id', (req, res) => {
    db.prepare('UPDATE produkter SET navn=?, beskrivelse=?, pris=?, kategori_id=? WHERE id=?')
      .run(req.body.navn, req.body.beskrivelse, req.body.pris, req.body.kategori_id, req.params.id);
    res.json({ melding: 'Oppdatert' });
});

app.delete('/admin/produkter/:id', (req, res) => {
    db.prepare('DELETE FROM produkter WHERE id=?').run(req.params.id);
    res.json({ melding: 'Slettet' });
});

app.listen(3000, () => console.log('Kjører på port 3000'));