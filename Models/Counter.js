/*const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  typeDocument: { type: String, required: true },
  counter: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Récupérer le compteur et l'incrémenter
async function getNextCounter(typeDocument) {
  const counter = await Counter.findOneAndUpdate(
    { typeDocument },
    { $inc: { counter: 1 } },
    { new: true, upsert: true }
  );
  return counter.counter;
}
*/