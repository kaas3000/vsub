<template>
  <v-card @click="displaySubtitles" width="100%" class="mx-1" outlined>
    <v-card-text class="headline text-center">
      <template v-for="(line, i) in lines">
        <div :key="i">{{ line || "\xa0" }}</div>
      </template>
    </v-card-text>
  </v-card>
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
  },

  methods: {
    displaySubtitles() {
      this.$emit("displaySubtitles");
    },
  },
};
</script>
