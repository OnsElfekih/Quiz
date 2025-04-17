import React, { useState, useEffect } from 'react';

const EditQuizForm = ({ quizData }) => {
  // Initialisation des états avec des valeurs par défaut
  const [titre, setTitre] = useState('');
  const [nbQuestions, setNbQuestions] = useState('');
  const [score, setScore] = useState('');
  const [time, setTime] = useState('');

  // Met à jour les valeurs du formulaire dès que quizData est disponible
  useEffect(() => {
    if (quizData) {
      setTitre(quizData.titre || '');
      setNbQuestions(quizData.nbQuestions || '');
      setScore(quizData.score || '');
      setTime(quizData.time || '');
    }
  }, [quizData]);

  // Vérifie si quizData est défini et si ce n'est pas le cas, afficher un message de chargement
  if (!quizData) {
    return <div>Chargement des données...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour soumettre le formulaire
    console.log({ titre, nbQuestions, score, time });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Titre:</label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />
      </div>
      <div>
        <label>Nombre de Questions:</label>
        <input
          type="number"
          value={nbQuestions}
          onChange={(e) => setNbQuestions(e.target.value)}
        />
      </div>
      <div>
        <label>Score:</label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </div>
      <div>
        <label>Temps (en secondes):</label>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default EditQuizForm;
