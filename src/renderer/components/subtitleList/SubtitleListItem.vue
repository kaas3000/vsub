<template>
  <v-list-item @click="selectSubtitle" :class="active ? 'active' : ''">
    <v-list-item-icon>
      <v-icon v-if="active">mdi-arrow-right</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <div
        v-for="(line, i) in lines"
        :key="i"
        :class="{
          ['empty-line']: line === '',
        }"
      >
        {{ line || placeholder }}
      </div>
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
    placeholder: {
      type: String,
      default: "\xa0",
    },
  },

  computed: {
    lines() {
      return [this.above, this.below];
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

.empty-line {
  font-style: italic;
  opacity: 0.4;
}
</style>
