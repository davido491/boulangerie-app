const brain = require('brain.js');

// Création d'un réseau de neurones
const net = new brain.NeuralNetwork({
  hiddenLayers: [3],
});

// Données d'entraînement (à adapter selon vos besoins)
const trainingData = [
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] },
];

// Fonction pour entraîner le réseau
function trainNetwork() {
  console.log('Entraînement du réseau...');
  const results = net.train(trainingData, {
    iterations: 20000,
    errorThresh: 0.005,
    log: true,
    logPeriod: 1000,
  });
  console.log('Entraînement terminé:', results);
}

// Fonction pour faire une prédiction
function predictWithDebug(input) {
  console.log(`Prédiction pour l'entrée: [${input}]`);
  const output = net.run(input);
  console.log(`Sortie: ${output}`);
  return output;
}

// Fonction de débogage
function debugBrainJS() {
  console.log('Démarrage du débogage Brain.js');
  trainNetwork();
  console.log('Test de prédiction:');
  predictWithDebug([0, 0]);
  predictWithDebug([1, 1]);
  console.log('Débogage terminé');
}

module.exports = {
  trainNetwork,
  predictWithDebug,
  debugBrainJS,
};