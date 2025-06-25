<template>
    <q-btn-dropdown
      icon="language"
      color="accent"
      size="md"
      no-caps
      :loading="isChangingLanguage"
      :disable="isChangingLanguage"
    >
      <template #label>
        <div class="row items-center no-wrap">
          <q-icon name="language" size="20px" class="q-mr-xs" />
          <span class="text-caption text-weight-medium">
            {{ getLanguageName(currentLanguage) }}
          </span>
        </div>
      </template>
  
      <q-list>
        <q-item
          v-for="lang in availableLanguages"
          :key="lang.code"
          clickable
          v-close-popup
          :active="lang.code === currentLanguage"
          @click="changeLanguage(lang.code)"
        >
          <q-item-section>{{ lang.name }}</q-item-section>
          <q-item-section side v-if="lang.code === currentLanguage">
            <q-icon name="check" color="positive" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useLanguageSelector } from '@/composables/useLanguageSelector'
  
  const {
    availableLanguages,
    getCurrentLanguage,
    changeLanguage,
    isChangingLanguage
  } = useLanguageSelector()
  
  const currentLanguage = computed(() => getCurrentLanguage())
  
  const getLanguageName = (code) =>
    availableLanguages.find(l => l.code === code)?.name || code.toUpperCase()
  </script>
  