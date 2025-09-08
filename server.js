const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const dayjs = require('dayjs');

const dealerModel = require('./models/dealer-model.js');

const app = express();
const PORT = 3000;

let residenceBaseUrl = 'https://residence.hbnetwork.ru/api/';
let residenceToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZiNjU5YjBlZWE3YzQwODVmOTAxNTciLCJsb2dpbiI6Iml2YW4iLCJpYXQiOjE3MjI2ODc5MzcsImV4cCI6Mzc3MjI2ODQzMzd9.9_UL1lKPhouKkbN9_ZMsjOEcqB87v5OujNae40aZxIs';
let DATABASE_URL = '31.130.151.240';
let DATABASE_PORT = 27417;
let DATABASE_USERNAME = 'admin';
let DATABASE_PASSWORD = 'Holo132AsD';
let DATABASE_NAME = 'leadsByAuto';

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/dealears/get', async (req, res) => {
    try {
        let response = await axios.get('https://haval.ru/data/dealers_dealerships/index.json');

        let residenceBrokers = await axios.get(`${residenceBaseUrl}/users`, {
            headers: { Authorization: `Bearer ${residenceToken}` },
            params: {
                _populate: 'rankId',
                _page: 1,
                _limit: 0,
            },
        });

        let allUsers = residenceBrokers.data.data;

        let notAllowedStatuses = ['Уволен', 'Админ', 'Менеджер ОКК'];

        let allBrokers = allUsers.filter((user) => {
            return !notAllowedStatuses.includes(user.rankId.name);
        });

        let cities = [];
        let dealers = [];
        let models = ['НОВЫЙ F9X', 'F7', 'Jolion', 'M6', 'DARGO X', 'DARGO', 'НОВЫЙ POER', 'POER', 'KINGKONG POER', 'H3', 'H9', 'H5', 'НОВЫЙ H7'];

        let allDealersData = response.data;

        allDealersData.forEach((item) => {
            if (!cities.includes(item.address.city.name)) {
                cities.push(item.address.city.name);
            }

            dealers.push({
                city: item.address.city.name,
                dealerName: item.dealer.name,
            });
        });

        res.status(200).json({
            data: allDealersData,
            cities: cities,
            dealers: dealers,
            models: models,
            operators: allBrokers,
        });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            e: e.message,
        });
    }
});

async function startApp() {
    try {
        const uri = `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_URL}:${DATABASE_PORT}/${DATABASE_NAME}?authSource=admin`;
        await mongoose.connect(uri);
    } catch (err) {
        console.log(err);
    }
}

app.post('/api/dealears/create', async (req, res) => {
    let { dealersObject } = req.body;

    console.log(dealersObject);

    try {
        const newDealer = new dealerModel({
            city: dealersObject.city,
            dealer: dealersObject.dealer,
            model: dealersObject.model,
            name: dealersObject.name,
            phone: dealersObject.phone,
            comment: dealersObject.comment,
            operator: dealersObject.operator,
            presale: dealersObject.presale,
            createdAt: dayjs(new Date()).format('YYYY-MM-DD'),
            datedAt: new Date(),
        });

        await newDealer.save();

        res.status(201).json({ message: 'Dealer created successfully' });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            e: e.message,
        });
    }
});

app.listen(3000, () => {
    startApp();
    console.log('server app running >>> http://localhost:5000');
});
