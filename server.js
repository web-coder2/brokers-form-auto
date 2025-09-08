const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));

app.get('/api/dealears/get', async (req, res) => {
    try {
        let response = await axios.get('https://haval.ru/data/dealers_dealerships/index.json');

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
        });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            e: e.message,
        });
    }
});

app.listen(3000, () => {
    console.log('server app running >>> http://localhost:5000');
});
