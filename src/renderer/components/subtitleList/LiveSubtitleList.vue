<template>
  <v-row>
    <v-container>
      <v-row dense>
        <v-col>
          <v-row>
            <v-row v-for="(subtitle, i) in subtitles" :key="i" class="col-12">
              <subtitle-card
                :above="subtitle.above"
                :below="subtitle.below"
                @subtitle-selected="sendSubtitlesToVMix(subtitle.above, subtitle.below)"
              ></subtitle-card>
            </v-row>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
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
