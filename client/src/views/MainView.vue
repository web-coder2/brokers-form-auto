<template>
    <div class="container mt-5">
        <h3 class="text-center mb-5">Форма создание лида по авто</h3>
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 mb-3">
                <input class="form-control w-100" placeholder="Модель" />
            </div>
            <div class="col-12 col-md-8 mb-3">
                <p>Выбрать город</p>
                <select class="form-control" v-model="formObject.city">
                    <option v-for="(item, index) in cities" :key="index" :value="item">{{ item }}</option>
                </select>
            </div>
            <div class="col-12 col-md-8 mb-3">
                <p>Выбрать Дилерский центр</p>
                <select class="form-control" v-model="formObject.dealer">
                    <option v-for="(item, index) in dealersByCity" :key="index" :value="item.dealerName">
                        {{ item.dealerName }}
                    </option>
                </select>
            </div>
            <div class="col-12 col-md-8 mb-3">
                <input class="form-control w-100" placeholder="Имя" />
            </div>
            <div class="col-12 col-md-8 mb-3">
                <input class="form-control w-100" placeholder="Телефон" />
            </div>
            <div class="col-12 col-md-8 mb-3">
                <input class="form-control w-100" placeholder="Коментарий" />
            </div>
            <div class="col-12 col-md-8 mb-3">
                <input class="form-control w-100" placeholder="Оператор" />
            </div>
            <div class="col-12 col-md-8 mb-3">
                <input class="form-control w-100" placeholder="Присейл" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            dealersData: null,
            cities: [],
            dealers: [],
            formObject: {
                city: '',
                dealer: '',
            },
        };
    },
    methods: {
        async fetchDealersData() {
            let response = await axios.get('http://localhost:3000/api/dealears/get');
            this.cities = response.data.cities;
            this.dealers = response.data.dealers;

            if (this.cities.length > 0) {
                this.formObject.city = this.cities[0];
            }
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
