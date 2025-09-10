<template>
    <div class="container mt-5">
        <h3 class="text-center mb-5">Форма создание лида по авто</h3>
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 mb-5">
                <p>Выбрать модель</p>
                <select class="form-control" v-model="formObject.model">
                    <option v-for="(item, index) in models" :key="index" :value="item">{{ item }}</option>
                </select>
            </div>
            <div class="col-12 col-md-8 mb-5">
                <p>Выбрать город</p>
                <select class="form-control" v-model="formObject.city">
                    <option v-for="(item, index) in cities" :key="index" :value="item">{{ item }}</option>
                </select>
            </div>
            <div class="col-12 col-md-8 mb-5">
                <p>Выбрать Дилерский центр</p>
                <select class="form-control" v-model="formObject.dealer">
                    <option v-for="(item, index) in dealersByCity" :key="index" :value="item.dealerName">
                        {{ item.dealerName }}
                    </option>
                </select>
            </div>
            <div class="col-12 col-md-8 mb-5">
                <p>Введите имя</p>
                <input class="form-control w-100" v-model="formObject.name" placeholder="Имя" />
            </div>
            <div class="col-12 col-md-8 mb-5">
                <p>Введите телефон</p>
                <input type="tel" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" class="form-control w-100" v-model="formObject.phone" placeholder="Телефон" />
            </div>
            <div class="col-12 col-md-8 mb-5">
                <p>Введите коментарий</p>
                <select class="form-control" v-model="formObject.comment">
                    <option v-for="(item, index) in comments" :key="index" :value="item">
                        {{ item }}
                    </option>
                </select>
            </div>
            <div class="col-12 col-md-8 mb-5">
                <p>Выбрать Оператора</p>
                <select class="form-control" v-model="formObject.operator">
                    <option v-for="(item, index) in operators" :key="index" :value="item.name">
                        {{ item.name }}
                    </option>
                </select>
            </div>
            <div class="col-12 col-md-8 mb-5">
                <p>Введите пресейл</p>
                <input class="form-control w-100" v-model="formObject.presale" placeholder="Присейл" />
            </div>
        </div>
        <div class="justify-content-center mt-5 mb-5 row">
            <button class="btn btn-success col-12 col-md-8" @click="createDealer()">создать лид</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

console.log('API base URL:', apiBaseUrl);

export default {
    data() {
        return {
            dealersData: null,
            cities: [],
            dealers: [],
            models: [],
            operators: [],
            comments: ['Тест-драйв', 'Предложение'],
            formObject: {
                city: null,
                dealer: null,
                model: null,
                name: null,
                phone: null,
                comment: null,
                operator: null,
                presale: null,
            },
        };
    },
    methods: {
        async fetchDealersData() {
            let response = await axios.get(`${apiBaseUrl}api/dealears/get`);
            this.cities = response.data.cities;
            this.dealers = response.data.dealers;
            this.models = response.data.models;
            this.operators = response.data.operators;

            if (this.cities.length > 0) {
                this.formObject.city = this.cities[0];
                this.formObject.dealer = this.dealersByCity[0];
                this.formObject.model = this.models[0];
                this.formObject.operator = this.operators[0];
                this.formObject.comment = this.comments[0];
            }
        },
        async createDealer() {
            if (!this.formObject.name || !this.formObject.presale || !this.formObject.phone || !this.formObject.city || !this.formObject.dealer || !this.formObject.model || !this.formObject.operator || !this.formObject.comment) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }

            let response = await axios.post(`${apiBaseUrl}api/dealears/create`, {
                dealersObject: this.formObject,
            });

            console.log(response.data);

            this.formObject = {
                city: '',
                dealer: '',
                model: '',
                name: null,
                phone: null,
                comment: null,
                operator: '',
                presale: null,
            };
        },
    },
    computed: {
        dealersByCity() {
            return this.dealers.filter((item) => {
                return item.city === this.formObject.city;
            });
        },
    },
    async beforeMount() {
        await this.fetchDealersData();
    },
};
</script>
