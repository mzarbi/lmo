<script setup>
  import { computed, ref } from 'vue';
  import {useDatasourceStore} from "../../../../plugins/datasourceStore";
  const datasourceStore = useDatasourceStore();

  const filterInput = ref('');
  const filteredDatasources = computed(() => {
    return datasourceStore.datasources.filter((data) => data.title.toLowerCase().includes(filterInput.value.toLowerCase()));
  });
</script>

<template>
  <h3 class="text-h3">
    Datasources
  </h3>
  <div style="padding: 0.5rem"></div>
  <VTextField label="Filter Datasources" v-model="filterInput" outlined dense></VTextField>
  <div style="padding: 0.5rem"></div>
  <VRow>
    <VCol
      v-for="data in filteredDatasources"
      :key="data.icon"
      cols="12"
      md="6"
      lg="4"
    >
      <VCard>
        <VCardItem>
          <template #prepend>
            <VIcon
              size="1.9rem"
              :icon="data.icon"
            />
          </template>
          <VCardTitle>
            {{ data.title }}
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <p class="clamp-text mb-0">
            {{ data.text }}
          </p>
        </VCardText>

        <VCardText class="d-flex justify-space-between align-center flex-wrap">


          <div class="d-flex align-center">
            <VBtn
              color="primary"
              type="reset"
            >
              Access Datasource
            </VBtn>
          </div>

          <div class="text-no-wrap">
            <span class=" ms-2">Last Event : {{ data.lastEvent }}</span>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
