<script>

  import AuditTrailSearchForm from '@/views/source/AuditTrailSearchForm.vue'
  import SourceExplorer from "@/views/source/SourceExplorer.vue";
  export default {
    components:{SourceExplorer, AuditTrailSearchForm},
    data() {
      return {
        navigationTab :'Query',
        tabItems : [
          'Datasource',
          'Query',
          'Results',
          'Settings',
        ]

      }
    },
    methods: {
      handleDateRangeUpdate(payload) {
        console.log('New Date Range:', payload.startDate, 'to', payload.endDate);
      },
    },
  };
</script>
<template>
  <div>
    <VCard>
      <VTabs v-model="navigationTab">
        <VTab
          v-for="item in tabItems"
          :key="item"
          :value="item"
        >
          {{ item }}
        </VTab>
      </VTabs>

      <!-- tabs content -->
      <VWindow v-model="navigationTab">
        <VWindowItem value="Datasource">
          <VCol>
            <div style="padding: 2rem;">
              <SourceExplorer></SourceExplorer>
            </div>

          </VCol>

        </VWindowItem>
        <VWindowItem value="Query">
          <VCol>
            <div style="padding: 2rem;">
              <AuditTrailSearchForm></AuditTrailSearchForm>
            </div>

          </VCol>

        </VWindowItem>

        <VWindowItem value="Results">
          <VCardItem>
            <VCardTitle>Results</VCardTitle>
          </VCardItem>

          <VCardText>
            sqdsqd
          </VCardText>

          <VCardText>
            <VBtn>Learn More</VBtn>
          </VCardText>
        </VWindowItem>

        <VWindowItem value="Settings">
          <VCardItem>
            <VCardTitle>Settings</VCardTitle>
          </VCardItem>

          <VCardText>
            sqdsqd
          </VCardText>

          <VCardText>
            <VBtn>Learn More</VBtn>
          </VCardText>
        </VWindowItem>
      </VWindow>
    </VCard>
  </div>

</template>






