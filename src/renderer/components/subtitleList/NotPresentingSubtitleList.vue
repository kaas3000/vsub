<template>
  <v-col class="col-8 mh-100 overflow-auto" v-if="isLive">
    <v-row>
      <v-container>
        <v-row dense>
          <v-col>
            <v-row>
              <v-row v-for="(subtitle, i) in subtitles" :key="i" class="col-12">
                <subtitle-card
                  :above="subtitle.above"
                  :below="subtitle.below"
                  @displaySubtitles="sendSubtitlesToVMix(subtitle.above, subtitle.below)"
                ></subtitle-card>
              </v-row>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
  </v-col>
  <v-col class="col-8 mh-100 overflow-auto" v-else>
    <v-list>
      <template v-for="({ above, below }, i) in subtitles">
        <subtitle-list-item
          :above="above"
          :below="below"
          :key="'subtitle-item-' + i"
          @subtitle-selected="sendSubtitlesToVMix(above, below)"
        ></subtitle-list-item>
        <v-divider :key="'divider-' + i"></v-divider>
      </template>
    </v-list>
  </v-col>
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

  methods: {
    doeIets() {
      console.log("klik");
      console.log(this.subtitles);
    },
  },

  mixins: [SubtitleMixin],
};
</script>
