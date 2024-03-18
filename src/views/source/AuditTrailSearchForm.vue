<template>
  <VForm @submit.prevent="searchAuditTrails">
    <VRow>
      <!-- Dynamically generated fields including DateRangeSelector with startDate -->
      <VCol v-for="field in selectedDatasource.searchableFields" :key="field.name" cols="12" :md="field.md">
        <div class="d-flex align-items-center">
          <!-- Checkbox to enable/disable field -->
          <VCheckbox v-if="field.type !== 'daterange'" v-model="searchCriteria[field.name].enabled" hide-details class="mr-2" />

          <template v-if="field.type === 'text'">
            <VTextField v-model="searchCriteria[field.name].value" :label="field.label" :placeholder="field.placeholder" :disabled="!searchCriteria[field.name].enabled" />
          </template>

          <template v-if="field.type === 'multiselect'">
            <VCombobox
              v-model="searchCriteria[field.name].value"
              :items="field.options"
              :label="field.label"
              multiple
              chips
              clearable
              :placeholder="field.placeholder"
              :disabled="!searchCriteria[field.name].enabled"
            />
          </template>
        </div>
        <template v-if="field.type === 'daterange'">
          <DateRangeSelector
            :height="field.height || 100"
            :startDate="field.startDate || '2023-01-01'"
            :values="field.values || []"
            @dateRangeUpdated="handleDateRangeUpdate(field.name, $event)"
          />
        </template>
      </VCol>
      <VCol cols="12" class="d-flex gap-4">
        <VBtn type="submit">Search</VBtn>
        <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm">Reset</VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script>
  import DateRangeSelector from '@/views/source/DateRangeSelector.vue';
  import { watch, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import {useDatasourceStore} from "../../plugins/datasourceStore";

  export default {
    components: {
      DateRangeSelector,
    },
    setup() {

      const route = useRoute();
      const datasourceStore = useDatasourceStore();
      const selectedDatasource = ref({});




      const searchCriteria = ref({});

      const searchAuditTrails = () => {
        console.log("Searching audit trails with:", searchCriteria.value);
        // Implement search logic here
      };

      const handleDateRangeUpdate = (fieldName, event) => {
        // Update based on your DateRangeSelector event structure
        // This is a placeholder implementation
        searchCriteria.value[fieldName] = {
          ...searchCriteria.value[fieldName],
          startDate: event.startDate,
          values: event.values,
        };
      };



      const resetForm = () => {
        selectedDatasource.value.searchableFields?.forEach(field => {
          if (field.type === 'daterange') {
            // Date range selector might not need an 'enabled' state as per the requirement
            searchCriteria.value[field.name] = { value: [], enabled: true };
          } else {
            searchCriteria.value[field.name] = { value: '', enabled: false };
          }
        });
      };

      watch(() => route.path, (newPath) => {
        selectedDatasource.value = datasourceStore.datasources.find(datasource => datasource.to === newPath) || {};
        // Reset searchCriteria based on selectedDatasource
        resetForm();
      }, { immediate: true });

      return {
        selectedDatasource,
        searchCriteria,
        searchAuditTrails,
        handleDateRangeUpdate,
        resetForm,
      };
    },
  };
</script>
