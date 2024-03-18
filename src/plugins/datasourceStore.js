import { defineStore } from 'pinia';
import avatar4 from '@images/avatars/avatar-4.png'
export const useDatasourceStore = defineStore('datasource', {
    state: () => ({
        datasources: []
    }),
    actions: {
        async fetchDatasources() {
            try {
                const response = await fetch('http://localhost:5000/datasources');
                const data = await response.json();
                this.datasources = data.datasources;
                console.log(this.datasources)
            } catch (error) {
                console.error('Failed to fetch datasources:', error);
            }
        }

    }
});
