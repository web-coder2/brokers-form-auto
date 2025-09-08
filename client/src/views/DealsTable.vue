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
        <button class="btn btn-danger" @click="downloadLeads()">Выгрузить лиды</button>
        <div class="table-responsive mt-3">
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

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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
            let response = await axios.get(`${apiBaseUrl}api/dealers/filter`, {
                params: {
                    gte: this.gte,
                    lte: this.lte,
                },
            });
            this.tableData = response.data.data;
        },
        downloadLeads() {
            if (!this.tableData || this.tableData.length === 0) {
                alert('Нет данных для экспорта');
                return;
            }

            this.tableData.forEach((lead) => {
                lead.phone = lead.phone.replace(/\D/g, '');
            });

            const headers = ['Город', 'Дилер', 'Модель', 'Имя', 'Телефон', 'Коментарий', 'Оператор', 'Пресейл', 'Дата'];

            const csvRows = [];

            csvRows.push(headers.join(','));

            this.tableData.forEach((item) => {
                const row = [item.city, item.dealer, item.model, item.name, item.phone, item.comment, item.operator, item.presale, item.createdAt];
                const escapedRow = row.map((field) => {
                    if (typeof field === 'string' && (field.includes(',') || field.includes('"'))) {
                        return `"${field.replace(/"/g, '""')}"`;
                    }
                    return field;
                });
                csvRows.push(escapedRow.join(','));
            });

            const csvString = csvRows.join('\n');

            const blob = new Blob([csvString], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'leads.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        },
    },
    async beforeMount() {
        await this.fetchTableData();
    },
};
</script>
