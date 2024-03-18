<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import {useDatasourceStore} from "../../plugins/datasourceStore";
const datasources = useDatasourceStore().datasources;
</script>

<template>
  <VerticalNavLink
    :item="{
      title: 'Dashboard',
      icon: 'ri-user-settings-line',
      to: '/dashboard',
    }"
  />
  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Datasources',
    }"
  />
  <VerticalNavLink
    v-for="datasource in datasources"
    :item="datasource"
  />
  <VerticalNavLinksss
    :item="{
      title: 'Account Settings',
      icon: 'ri-user-settings-line',
      to: '/account-settings',
    }"
  />

  <!-- 👉 User Interface -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Management',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Datasources',
      icon: 'ri-text',
      to: '/typography',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'New Datasource',
      icon: 'ri-remixicon-line',
      to: '/icons',
    }"
  />

  <!-- 👉 Others -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Others',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Documentation',
      icon: 'ri-article-line',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/documentation/',
      target: '_blank',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Request Support',
      href: 'https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free/issues',
      icon: 'ri-lifebuoy-line',
      target: '_blank',
    }"
  />
</template>
