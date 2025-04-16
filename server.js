const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB Atlas (remplace le lien par ton URI MongoDB perso)
mongoose.connect('mongodb+srv://<username>:<password>@cluster.mongodb.net/quiz?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error(err));

// Modèle de données
const AnswerSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  answers: Object
});
const Answer = mongoose.model('Answer', AnswerSchema);

// Endpoint pour recevoir les réponses
app.post('/api/submit', async (req, res) => {
  try {
    const newAnswer = new Answer({ answers: req.body.answers });
    await newAnswer.save();
    res.status(200).json({ message: 'Réponses enregistrées' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l’enregistrement' });
  }
});

app.get('/api/responses', async (req, res) => {
  try {
    const allAnswers = await Answer.find().sort({ date: -1 });
    res.status(200).json(allAnswers);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
