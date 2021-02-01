<template>
  <v-list-item @click="selectSubtitle" :class="active ? 'active' : ''">
    <v-list-item-content>
      <v-list-item-title v-text="above || '\xa0'"></v-list-item-title>
      <v-list-item-title v-text="below || '\xa0'"></v-list-item-title>
    </v-list-item-content>
  </v-list-item>
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
    active: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    lines() {
      return [this.above];
    },
  },

  methods: {
    selectSubtitle() {
      this.$emit("subtitle-selected");
    },
  },
};
</script>

<style lang="css" scoped>
.active {
  background-color: #dadada;
}
</style>
