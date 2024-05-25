<template>
  <component :is="FileComponent" v-bind="attrs" />
  <span class="preview-container">
    <p class="preview-ext" @click.stop="previewDrawerActive = true">Preview</p>
    <a :href="fileUrl" target="_blank" rel="noopener noreferrer">
      <v-icon
        v-tooltip="'Open in new tab'"
        name="open_in_new"
        class="preview-icon small"
      />
    </a>
  </span>

  <v-drawer
    v-if="src"
    v-model:modelValue="previewDrawerActive"
    subtitle="Document Preview"
    :title="title"
    icon="quick_reference"
    persistent
    @cancel="previewDrawerActive = false"
  >
    <template #actions:prepend>
      <v-button
        class="cancel"
        v-tooltip.bottom="'Refresh'"
        icon
        rounded
        primary
        @click.stop="refreshIframe()"
      >
        <v-icon name="refresh" />
      </v-button>
    </template>

    <span v-if="loading" class="loader"></span>

    <iframe
      class="doc"
      :src="`https://docs.google.com/gview?embedded=true&url=${src}`"
      @load="handleIframeLoad"
      ref="iframe"
    >
    </iframe>
  </v-drawer>
</template>

<script lang="ts">
import { useExtensions } from "@directus/extensions-sdk";
import { RefSymbol } from "@vue/reactivity";
import { defineComponent } from "@vue/runtime-core";
import { computed, ref, watch } from "vue";

function getRootPath(): string {
  const path = window.location.pathname;
  const parts = path.split("/");
  const adminIndex = parts.indexOf("admin");
  return parts.slice(0, adminIndex).join("/") + "/";
}
function addQueryToPath(path: string, query: Record<string, string>): string {
  const queryParams = new URLSearchParams(path.split("?")[1] || "");
  for (const [key, value] of Object.entries(query)) {
    queryParams.set(key, value);
  }
  return path.split("?")[0] + "?" + queryParams;
}

function addTokenToURL(url: string, token?: string): string {
  return token ? addQueryToPath(url, { access_token: token }) : url;
}

export default defineComponent({
  props: {
    token: {
      type: String,
      default: "",
    },
  },
  setup(props, { attrs, emit }) {
    const fileId = ref(attrs.value);
    const fieldName = ref(attrs.field);
    const loading = ref(true);

    const token = props.token;

    watch(() => {
      fileId.value = attrs.value;
      fieldName.value = attrs.field;
    });

    const fileUrl = computed(() => {
      return window.location.origin + getRootPath() + `assets/${fileId.value}`;
    });

    const src = computed(() => {
      if (!fileId.value) return null;
      return addTokenToURL(fileUrl.value, token);
    });

    const title = computed(() => {
      return fieldName.value;
    });

    // drawer toggle
    const previewDrawerActive = ref(false);

    // check if FileComponent
    const { interfaces } = useExtensions();
    const { component: FileComponent } = interfaces.value.find(
      (i) => i.id === "file",
    );

    return {
      attrs,
      FileComponent,
      previewDrawerActive,
      src,
      title,
      loading,
      fileUrl,
    };
  },
  methods: {
    refreshIframe() {
      const iframe = this.$refs.iframe as HTMLIFrameElement;
      if (iframe) {
        this.loading = true;
        iframe.src = iframe.src; // Reload the iframe
      }
    },
    handleIframeLoad() {
      this.loading = false;
    },
  },
});
</script>

<style scoped>
/* Add your styles here if needed */

.preview-container {
  display: flex;
  gap: 4px;
  align-items: center;
}

.preview-ext {
  color: var(--project-color);
  cursor: pointer;
}

.preview-icon {
  --v-icon-color: var(--theme--form--field--input--foreground-subdued);
  &:hover {
    --v-icon-color: var(--theme--form--field--input--foreground);
  }
}

.doc {
  width: 100%;
  height: 100vh;
}

.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: block;
  margin: 15px auto;
  position: relative;
  background: #fff;
  box-shadow:
    -24px 0 #fff,
    24px 0 #fff;
  box-sizing: border-box;
  animation: shadowPulse 2s linear infinite;
}

@keyframes shadowPulse {
  33% {
    background: #fff;
    box-shadow:
      -24px 0 var(--project-color),
      24px 0 #fff;
  }
  66% {
    background: var(--project-color);
    box-shadow:
      -24px 0 #fff,
      24px 0 #fff;
  }
  100% {
    background: #fff;
    box-shadow:
      -24px 0 #fff,
      24px 0 var(--project-color);
  }
}
</style>
