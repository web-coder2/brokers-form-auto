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
        <button class="btn btn-primary mt-3" @click="fetchTableData()">Применить</button>
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
                        <th>Удалить</th>
                        <th>Редактировать</th>
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
                        <td>
                            <button class="btn btn-danger"><i class="fas fa-trash"></i>Удалить</button>
                        </td>
                        <td>
                            <button class="btn btn-warning" @click="editLead(item)"><i class="fas fa-pen"></i>Редактировать</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-if="editVisibleLead" class="modal d-block" style="background: rgba(0, 0, 0, 0.5); overflow-y: auto">
        <div class="modal-dialog" style="max-height: 80vh; margin: auto; display: flex; flex-direction: column">
            <div class="modal-content" style="flex: 1; display: flex; flex-direction: column">
                <div class="modal-header">
                    <h5 class="modal-title">Редактировать лид</h5>
                    <button type="button" class="close" @click="editVisibleLead = false">&times;</button>
                </div>
                <div class="modal-body" style="overflow-y: auto; flex: 1">
                    <div class="mb-4">
                        <label>Выбрать модель</label>
                        <select class="form-control" v-model="formObject.model" @change="fetchDealersByModel">
                            <option v-for="(item, index) in models" :key="index" :value="item">{{ item }}</option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label>Выбрать город</label>
                        <select class="form-control" v-model="formObject.city" @change="fetchDealersByCity">
                            <option v-for="(item, index) in cities" :key="index" :value="item">{{ item }}</option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label>Выбрать Дилерский центр</label>
                        <select class="form-control" v-model="formObject.dealer">
                            <option v-for="(item, index) in dealersByCity" :key="index" :value="item.dealerName">
                                {{ item.dealerName }}
                            </option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label>Введите имя</label>
                        <input class="form-control" v-model="formObject.name" placeholder="Имя" />
                    </div>

                    <div class="mb-4">
                        <label>Введите телефон</label>
                        <input type="tel" class="form-control" v-model="formObject.phone" placeholder="Телефон" />
                    </div>

                    <div class="mb-4">
                        <label>Введите комментарий</label>
                        <input class="form-control" v-model="formObject.comment" placeholder="Коментарий" />
                    </div>

                    <div class="mb-4">
                        <label>Выбрать Оператора</label>
                        <select class="form-control" v-model="formObject.operator">
                            <option v-for="(item, index) in operators" :key="index" :value="item.name">
                                {{ item.name }}
                            </option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label>Введите пресейл</label>
                        <input class="form-control" v-model="formObject.presale" placeholder="Пресейл" />
                    </div>
                </div>
                <div class="modal-footer mt-auto">
                    <button class="btn btn-primary" @click="saveChanges">Сохранить</button>
                    <button class="btn btn-secondary ml-2" @click="editVisibleLead = false">Отмена</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Ограничение высоты модального окна и добавление прокрутки */
.custom-modal {
    max-height: 80vh; /* Максимальная высота 80% высоты окна */
    display: flex;
    flex-direction: column;
}

.custom-modal-body {
    overflow-y: auto; /* Вертикальная прокрутка при переполнении */
    max-height: calc(80vh - 60px); /* Высота с учётом заголовка и кнопок */
}
</style>

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
            editedObject: null,
            editVisibleLead: false,
            models: [],
            cities: [],
            dealers: [],
            operators: [],
            formObject: {
                city: '',
                dealer: '',
                model: '',
                name: '',
                phone: '',
                comment: '',
                operator: '',
                presale: '',
            },
        };
    },
    computed: {
        dealersByCity() {
            return this.dealers.filter((item) => {
                return item.city === this.formObject.city;
            });
        },
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
        async fetchLookupData() {
            try {
                const response = await axios.get(`${apiBaseUrl}api/dealears/get`);
                this.cities = response.data.cities || [];
                this.dealers = response.data.dealers || [];
                this.models = response.data.models || [];
                this.operators = response.data.operators || [];

                if (this.cities.length) this.formObject.city = this.cities[0];
                if (this.dealersByCity.length) this.formObject.dealer = this.dealersByCity[0];
                if (this.models.length) this.formObject.model = this.models[0];
                if (this.operators.length) this.formObject.operator = this.operators[0].name;
            } catch (error) {
                console.error('Ошибка при загрузке справочников:', error);
            }
        },
        editLead(lead) {
            this.formObject = { ...lead };
            this.editVisibleLead = true;
        },
        async saveChanges() {
            try {
                await axios.post(`${apiBaseUrl}api/leads/update`, {
                    leadObject: this.formObject,
                });
                this.editVisibleLead = false;
            } catch (error) {
                console.error('Ошибка при сохранении:', error);
            }
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
        await this.fetchLookupData();
    },
};
</script>
