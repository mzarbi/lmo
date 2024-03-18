<template>
  <VRow>
      <VCol
        cols="12"
        sm="2"
      >
        <CardStatisticsVertical
          :title="selectedDatasource.title"
          :stats="selectedDatasource.stats"
          :change="selectedDatasource.change"
          :subtitle="selectedDatasource.subtitle"
          :color="selectedDatasource.cardBg"
          :icon="selectedDatasource.icon"
        />
      </VCol>
      <VTabs direction="vertical" v-model="currentTab">
        <VTab>Schema</VTab>
        <VTab>Info</VTab>
        <VTab>Metadata</VTab>
      </VTabs>
    <VCol cols="12" md="8">

      <VWindow v-model="currentTab">
        <!-- Schema Content -->
        <VWindowItem>
          <VDataTable :headers="schemaHeaders" :items="selectedDatasource.schema" class="mb-4"></VDataTable>
        </VWindowItem>
        <!-- Info Content -->
        <!-- Info Section -->
        <VWindowItem>
          <v-list dense>
            <v-list-item v-for="(value, key) in selectedDatasource.info" :key="`info-${key}`">
              <v-list-item-content>
                <v-list-item-title v-text="key"></v-list-item-title>
                <v-list-item-subtitle v-text="value"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </VWindowItem>

        <!-- Metadata Section -->
        <VWindowItem>
          <v-list dense>
            <v-list-item v-for="(value, key) in selectedDatasource.metadata" :key="`metadata-${key}`">
              <v-list-item-content>
                <v-list-item-title v-text="key"></v-list-item-title>
                <v-list-item-subtitle v-text="value"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </VWindowItem>

      </VWindow>
    </VCol>
    </VRow>
</template>

<script setup>


  import { computed, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useDatasourceStore } from '@/plugins/datasourceStore'; // Adjust path as necessary
  import CardStatisticsVertical from '@core/components/cards/CardStatisticsVertical.vue'

  const route = useRoute();
  const datasourceStore = useDatasourceStore();
  const currentTab = ref(0);

  // Computed property to find and display the current datasource based on the URL
  const selectedDatasource = computed(() => {
    // Extract part of the URL to match against the datasource "to" property
    const path = route.path;
    console.log(datasourceStore.datasources)
    return (
      Object.values(datasourceStore.datasources).find(datasource => datasource.to === path) || {
        schema: [],
        info: {},
        metadata: {}
      }
    );
  });

  const schemaHeaders = [
    { title: 'Field Name', key: 'name' },
    { title: 'Type', key: 'type' },
    { title: 'Description', key: 'description' },
  ];

  // Example data, replace with your actual logic to populate these values
  const totalProfit = {
    title: 'Total Entities',
    color: 'secondary',
    icon: 'ri-pie-chart-2-line',
    stats: '25.6k',
    change: 42,
    subtitle: 'Weekly Updates',
  };
</script>

<style scoped>

</style>
