const express = require('express');        // webserver-rammeverk
const Database = require('better-sqlite3'); // sqlite-pakke for Node.js

const app = express();                      // oppretter express appen
const db = new Database('./konfigurasjonsfiler/database.db'); // kobler til sqlite-databasen

app.use(express.json());                    // lar serveren lese JSON fra requests
app.use(express.static('./kildekode'));      // serverer HTML-filer fra kildekode-mappen

// kundeside henter alle produkter fra databasen og sender som JSON
app.get('/produkter', (req, res) => {
    res.json(db.prepare('SELECT * FROM produkter').all());
});

// admin legger til nytt produkt, ? brukes for å unngå SQL indection 
app.post('/admin/produkter', (req, res) => {
    db.prepare('INSERT INTO produkter (navn, beskrivelse, pris, kategori_id) VALUES (?, ?, ?, ?)')
      .run(req.body.navn, req.body.beskrivelse, req.body.pris, req.body.kategori_id);
    res.json({ melding: 'Lagt til' });
}); 

// admin oppdaterer et eksisterende produkt basert på id i URL
app.put('/admin/produkter/:id', (req, res) => {
    db.prepare('UPDATE produkter SET navn=?, beskrivelse=?, pris=?, kategori_id=? WHERE id=?')
      .run(req.body.navn, req.body.beskrivelse, req.body.pris, req.body.kategori_id, req.params.id);
    res.json({ melding: 'Oppdatert' });
});

// admin sletter et produkt basert på id i URL
app.delete('/admin/produkter/:id', (req, res) => {
    db.prepare('DELETE FROM produkter WHERE id=?').run(req.params.id);
    res.json({ melding: 'Slettet' });
});

// starter serveren på port 3000
app.listen(3000, () => console.log('Kjører på port 3000'));