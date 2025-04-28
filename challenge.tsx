import React from 'react'; // <- this if needed (for older JSX transforms)
import { useState } from 'react';
import entities from '../data/entities.json';
import traits from '../data/traits.json';



export default function Challenge() {
  const [challengeEntity, setChallengeEntity] = useState(null);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [result, setResult] = useState(null);

  const startChallenge = () => {
    const randomIndex = Math.floor(Math.random() * entities.length);
    setChallengeEntity(entities[randomIndex]);
    setSelectedTraits([]);
    setResult(null);
  };

  const toggleTrait = (traitName) => {
    setSelectedTraits(prev =>
      prev.includes(traitName) ? prev.filter(t => t !== traitName) : [...prev, traitName]
    );
  };

  const checkAnswer = () => {
    if (!challengeEntity) return;

    const correctSet = new Set(challengeEntity.traits);
    const userSet = new Set(selectedTraits);

    const correctMatches = [...userSet].filter(trait => correctSet.has(trait));
    const missedTraits = [...correctSet].filter(trait => !userSet.has(trait));
    const extraTraits = [...userSet].filter(trait => !correctSet.has(trait));

    setResult({ correctMatches, missedTraits, extraTraits });
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold">UHT Trait Challenge</h1>
      {!challengeEntity && (
        <button onClick={startChallenge} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Start New Challenge
        </button>
      )}

      {challengeEntity && (
        <div className="w-full max-w-xl flex flex-col items-center">
          <img src={challengeEntity.image} alt={challengeEntity.name} className="w-48 h-48 object-contain mb-4" />
          <h2 className="text-2xl font-semibold mb-2">{challengeEntity.name}</h2>
          <p className="text-sm mb-4 italic">Select the traits you think apply:</p>
          <div className="grid grid-cols-2 gap-2 w-full mb-4">
            {traits.map((trait) => (
              <button
                key={trait.id}
                onClick={() => toggleTrait(trait.name)}
                className={`border rounded p-2 text-sm ${selectedTraits.includes(trait.name) ? 'bg-green-300' : 'bg-gray-100'} hover:bg-green-200`}
              >
                {trait.name}
              </button>
            ))}
          </div>

          <button onClick={checkAnswer} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
            Submit Answer
          </button>

          {result && (
            <div className="text-left w-full">
              <h3 className="text-xl font-semibold mb-2">Results:</h3>
              <p><strong>Correct:</strong> {result.correctMatches.length}</p>
              <p><strong>Missed:</strong> {result.missedTraits.length}</p>
              <p><strong>Extras:</strong> {result.extraTraits.length}</p>

              <div className="mt-2">
                <p className="text-green-700">✔ Correct Traits: {result.correctMatches.join(", ")}</p>
                <p className="text-red-700">❌ Missed Traits: {result.missedTraits.join(", ")}</p>
                <p className="text-yellow-700">⚠️ Extra Traits: {result.extraTraits.join(", ")}</p>
              </div>

              <button onClick={startChallenge} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Try Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
