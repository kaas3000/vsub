<template>
  <v-list>
    <span v-shortkey="['arrowup']" @shortkey="previousSubtitle()"></span>
    <span v-shortkey="['arrowdown']" @shortkey="nextSubtitle()"></span>

    <v-subheader>Ondertitels</v-subheader>
    <v-divider></v-divider>
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
  </v-list>
</template>

<script>
import SubtitleMixin from "./SubtitleMixin";
import SubtitleListItem from "./SubtitleListItem";
import SubtitleCard from "./SubtitleCard.vue";

export default {
  components: {
    SubtitleListItem,
    SubtitleCard,
  },

  methods: {},

  mixins: [SubtitleMixin],
};
</script>
