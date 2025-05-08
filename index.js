const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter')
const clientRoutes = require('./Routes/clientRoutes');
const categorieRoutes = require("./Routes/categorieRoutes");
const familleRoutes = require("./Routes/familleRoutes");
const articleRoutes = require("./Routes/articleRoutes");
const enteteRoutes = require('./Routes/enteteRoutes');
const  eventRoute = require("./Routes/EventRoute");
const FactureRouter = require('./Routes/FactureRoute')
const stripeRoutes  = require('./Routes/stripe')
require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 5000;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/api/stripe', stripeRoutes);
app.use('/clients', clientRoutes);
app.use('/articles', articleRoutes);
app.use('/categorie', categorieRoutes);
app.use('/famille', familleRoutes);
  app.use('/facture',FactureRouter)
app.use('/entetes', enteteRoutes);
app.use('/api/events', eventRoute);
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})