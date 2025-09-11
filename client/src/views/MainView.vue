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
                <input type="number" @input="validatorOfValue()" class="form-control w-100" v-model="formObject.phone" placeholder="Телефон" />
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

function validate(phoneInput) {
    const str = String(phoneInput);
    return str.length > 11 ? str.slice(0, 11) : str;
}

// function validate2(phoneInput) {
//     let arrayOfPhone = phoneInput.map(Number);
//     let validatedArrayOfPhone = [];
//     arrayOfPhone[0] = 7;

//     arrayOfPhone.forEach((elem) => {
//         validatedArrayOfPhone.push(elem);
//     });
//     return validatedArrayOfPhone;
// }

function validate2(phoneInput) {
    let arrayOfDigits = String(phoneInput).split('').map(Number);
    let newPhoneNumber = '';
    if (arrayOfDigits.length > 0) {
        arrayOfDigits[0] = 7;
    }
    arrayOfDigits.forEach((item) => {
        newPhoneNumber = newPhoneNumber + item;
    });
    return newPhoneNumber;
}

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
        validatorOfValue() {
            console.log(this.formObject.phone);
            this.formObject.phone = validate(this.formObject.phone);
            this.formObject.phone = validate2(this.formObject.phone);
        },
        async createDealer() {
            if (!this.formObject.name || !this.formObject.presale || this.formObject.phone.length !== 11 || !this.formObject.city || !this.formObject.dealer || !this.formObject.model || !this.formObject.operator || !this.formObject.comment) {
                alert('Пожалуйста, заполните все обязательные поля или проверьте формат номера телефона 11 символов');
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
