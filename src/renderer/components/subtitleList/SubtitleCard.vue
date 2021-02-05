<template>
  <div class="subtitle-card headline text-center d-flex flex-column align-stretch">
    <div
      v-for="(line, i) in lines"
      :key="i"
      class="subtitle-line py-3 mb-1"
      :style="`font-family: ${subtitleFontFamily};`"
    >
      {{ line || "\xa0" }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    above: {
      type: String,
      default: "",
    },
    below: {
      type: String,
      default: "",
    },
  },

  computed: {
    lines() {
      return [this.above, this.below];
    },

    subtitleFontFamily() {
      return this.$store.state.Settings.subtitleEditorFontFamily;
    },
  },

  methods: {
    selectSubtitle() {
      this.$emit("subtitle-selected");
    },
  },
};
</script>

<style scoped>
.subtitle-line {
  position: relative;
  white-space: nowrap;
}

.subtitle-line::before {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  content: "";
  background: currentColor;
  opacity: 0.2;
}
</style>
