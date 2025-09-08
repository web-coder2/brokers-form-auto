<template>
    <div class="container mt-5">
        <h3>{{ title }}</h3>
        <div class="row mt-5">
            <div class="col-12 col-md-8">
                <p>Выбрать дату от</p>
                <input type="date" v-model="gte" class="form-control" />
            </div>
            <div class="col-12 col-md-8 mt-3">
                <p>Выбрать дату до</p>
                <input type="date" v-model="lte" class="form-control" />
            </div>
        </div>
        <button class="btn btn-primary mt-3">Применить</button>
    </div>

    <div class="container mt-5">
        <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th>Город</th>
                        <th>Дилер</th>
                        <th>Модель</th>
                        <th>Имя</th>
                        <th>Телефон</th>
                        <th>Коментарий</th>
                        <th>Оператор</th>
                        <th>Пресейл</th>
                        <th>Дата</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tableData">
                        <td>{{ item.city }}</td>
                        <td>{{ item.dealer }}</td>
                        <td>{{ item.model }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.phone }}</td>
                        <td>{{ item.comment }}</td>
                        <td>{{ item.operator }}</td>
                        <td>{{ item.presale }}</td>
                        <td>{{ item.createdAt }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import axios from 'axios';

export default {
    data() {
        return {
            title: 'Таблица Дилеров',
            gte: dayjs(new Date()).format('YYYY-MM-DD'),
            lte: dayjs(new Date()).format('YYYY-MM-DD'),
            tableData: null,
        };
    },
    methods: {
        async fetchTableData() {
            let response = await axios.get('http://localhost:3000/api/dealers/filter', {
                params: {
                    gte: this.gte,
                    lte: this.lte,
                },
            });
            this.tableData = response.data.data;
        },
    },
    async beforeMount() {
        await this.fetchTableData();
    },
};
</script>
