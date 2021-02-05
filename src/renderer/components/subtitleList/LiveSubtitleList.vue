<template>
  <div class="text-center d-flex flex-column live-subtitle-container h-100" style="max-width: 777px;">
    <span v-shortkey="['arrowup']" @shortkey="previousSubtitle()"></span>
    <span v-shortkey="['arrowdown']" @shortkey="nextSubtitle()"></span>

    <div class="flex-shrink-0 flex-grow-0">
      <v-subheader>Gezongen ondertitels</v-subheader>
      <div id="past-subtitle-container" ref="pastSubtitleContainer">
        <v-list>
          <div v-for="({ above, below }, i) in presentedSubtitles" :key="'past-subtitle-' + i">
            <subtitle-list-item
              :above="above"
              :below="below"
              placeholder="lege regel"
              @subtitle-selected="handleSubtitleSelected(above, below, i)"
            ></subtitle-list-item>
          </div>
        </v-list>
      </div>
    </div>

    <div>
      <v-subheader>Huidige ondertitels</v-subheader>
      <subtitle-card
        :above="presentingSubtitle.above"
        :below="presentingSubtitle.below"
        @subtitle-selected="sendSubtitlesToVMix(subtitle.above, subtitle.below)"
      ></subtitle-card>
    </div>

    <div class="overflow-y">
      <v-subheader>Aankomende ondertitels ({{ upcomingSubtitles.length }})</v-subheader>
      <v-list dense>
        <template v-for="({ above, below }, i) in upcomingSubtitles">
          <subtitle-list-item
            :above="above"
            :below="below"
            :key="'upcoming-subtitle-' + i"
            placeholder="lege regel"
            @subtitle-selected="handleSubtitleSelected(above, below, activeSubtitleIndex + i + 1)"
          ></subtitle-list-item>
        </template>
      </v-list>
    </div>
  </div>
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

  updated() {
    // Scroll the the latest past-subtitle
    this.$refs.pastSubtitleContainer.scrollTop = this.$refs.pastSubtitleContainer.scrollHeight;
  },
};
</script>

<style lang="scss" scoped>
#past-subtitle-container {
  height: 129px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-content: flex-end;

  & > :first-child {
    margin-top: auto;
  }
}

.v-list-item__content {
  padding: 0;
}
</style>
