<template>
  <div>
    <!-- loading -->
    <div v-if="pending" class="loader-wrapper">
      <q-spinner-dots color="primary" size="3em" />
      <p class="q-mt-md">Cargando página principal…</p>
    </div>

    <!-- error -->
    <q-banner v-else-if="error" class="bg-negative text-white">
      Error al cargar la página: {{ error.message }}
    </q-banner>

    <!-- éxito -->
    <component
      v-else
      :is="dynamicPageContentComponent"
      :pageData="pageData"
    />
  </div>
</template>

<script setup>
/* ───────────── imports ───────────── */
import { ref, shallowRef, defineAsyncComponent } from 'vue';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useWagtail } from '~/composables/useWagtail';

/* componente renderizador */
const dynamicPageContentComponent = shallowRef(
  defineAsyncComponent(() =>
    import('~/components/api/core/DynamicPageContent.vue')
  )
);

const { fetchPageDetails } = useWagtail();
const route  = useRoute();

/* ───────────── configuración ───────────── */
const homePageId       = 3;
const noticiasPageId   = 8;
const eventosPageId    = 5;
const maxItemsPerBlock = 4;    // cuántas tarjetas mostrar

/* ───────────── estado ───────────── */
const pageData = ref(null);
const pending  = ref(true);
const error    = ref(null);

const locale = computed(() => (route.path.startsWith('/en') ? 'en' : 'es'));

/* ───────────── helpers ───────────── */
function orderAndTrim (block) {
  if (!block?.value?.noticias) return block;
  block.value.noticias
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .splice(maxItemsPerBlock);            // recorta a N
  return block;
}

function insertBlocks (home, noticiasBlocks, eventosBlocks) {
  const idxCarousel = home.body.findIndex(
    b => b.type?.toLowerCase() === 'carousel'
  );
  const pos = idxCarousel !== -1 ? idxCarousel + 1 : home.body.length;

  home.body.splice(pos, 0, ...noticiasBlocks);
  home.body.splice(pos + noticiasBlocks.length, 0, ...eventosBlocks);
}

/* ───────────── carga principal ───────────── */
async function loadPage (lang) {
  pending.value = true;
  error.value   = null;

  try {
    const [home, noticias, eventos] = await Promise.all([
      fetchPageDetails(homePageId,     lang, true),
      fetchPageDetails(noticiasPageId, lang, true),
      fetchPageDetails(eventosPageId,  lang, true)
    ]);

    /* ── bloques Noticias ── */
    const noticiasBlocks = (noticias.body || [])
      .filter(b => b.type?.toLowerCase() === 'grupo_de_noticias')
      .map(orderAndTrim)
      .map(b => ({
        ...b,
        value: {
          ...b.value,
          show_more: {
            url: `/${lang}/noticias/`,      // respeta locale
            label: 'Ver más noticias'
          }
        }
      }));

    /* ── bloques Eventos ── */
    const eventosBlocks = (eventos.body || [])
      .filter(b => b.type?.toLowerCase() === 'grupo_de_noticias')
      .map(orderAndTrim)
      .map(b => ({
        ...b,
        value: {
          ...b.value,
          show_more: {
            url: `/${lang}/eventos/`,
            label: 'Ver más eventos'
          }
        }
      }));

    /* inserta después del carrusel */
    insertBlocks(home, noticiasBlocks, eventosBlocks);
    pageData.value = home;
  } catch (e) {
    error.value = e;
  } finally {
    pending.value = false;
  }
}

/* ───────────── montaje & cambio de idioma ───────────── */
onMounted(() => {
  loadPage(locale.value);

  if (process.client) {
    window.addEventListener('language-changed', e => {
      const newLang = e?.detail?.language;
      if (newLang) loadPage(newLang);
    });
  }
});
</script>

<style scoped>
.loader-wrapper{
  padding:24px 0 8px;
  text-align:center;
}
</style>
