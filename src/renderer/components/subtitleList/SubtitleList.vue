<template>
  <v-list class="h-100">
    <span v-shortkey="['arrowup']" @shortkey="previousSubtitle()"></span>
    <span v-shortkey="['arrowdown']" @shortkey="nextSubtitle()"></span>
    <span v-shortkey="['home']" @shortkey="firstSubtitle()"></span>

    <v-subheader>Ondertitels</v-subheader>
    <v-divider></v-divider>
    <div class="overflow-y subtitles-scroll-container" ref="scrollContainer">
      <template v-for="({ above, below }, i) in subtitles">
        <subtitle-list-item
          :above="above"
          :below="below"
          :active="isActiveSubtitle(i)"
          :key="'subtitle-item-' + i"
          @subtitle-selected="handleSubtitleSelected(above, below, i)"
        ></subtitle-list-item>
        <v-divider :key="'divider-' + i"></v-divider>
      </template>
    </div>
  </v-list>
</template>

<script>
import SubtitleMixin from "./SubtitleMixin";
import SubtitleListItem from "./SubtitleListItem";

export default {
  components: {
    SubtitleListItem,
  },

  methods: {
    scrollToActiveElement() {
      const scrollOffset = 252;
      const activeElement = this.$refs.scrollContainer.querySelector(".active");
      const activeLocation = activeElement?.offsetTop ?? null;

      if (activeLocation !== null) {
        this.$refs.scrollContainer.scrollTop = activeLocation - scrollOffset;
      }
    },
  },

  mixins: [SubtitleMixin],

  updated() {
    if ((this.subtitles ?? null) !== null) {
      this.scrollToActiveElement();
    }
  },
};
</script>

<style lang="scss" scoped>
.subtitles-scroll-container {
  padding-bottom: 2em;
}
</style>
