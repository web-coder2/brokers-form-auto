<template>
    <div class="container mt-5">
        <h3 class="text-center mb-5">Форма создание лида по авто</h3>
        <div class="row justify-content-center">
            <div class="col-12 col-md-6 mb-3">
                <input class="form-control w-100" placeholder="Модель" />
            </div>
            <div class="col-12 col-md-6 mb-3">
                <input class="form-control w-100" placeholder="Город" />
            </div>
            <div class="col-12 col-md-6 mb-3">
                <input class="form-control w-100" placeholder="Дилерский центр" />
            </div>
            <div class="col-12 col-md-6 mb-3">
                <input class="form-control w-100" placeholder="Имя" />
            </div>
            <div class="col-12 col-md-6 mb-3">
                <input class="form-control w-100" placeholder="Телефон" />
            </div>
            <div class="col-12 col-md-6 mb-3">
                <input class="form-control w-100" placeholder="Коментарий" />
            </div>
            <div class="col-12 col-md-6 mb-3">
                <input class="form-control w-100" placeholder="Оператор" />
            </div>
            <div class="col-12 col-md-6 mb-3">
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
        };
    },
    methods: {
        async fetchDealersData() {
            let response = await axios.get('https://haval.ru/data/dealers_dealerships/index.json');
            console.log(response, '!!!!!!');
        },
    },
    async beforeMount() {
        await this.fetchDealersData();
    },
};
</script>
