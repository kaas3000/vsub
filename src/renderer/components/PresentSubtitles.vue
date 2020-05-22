<template>
  <v-row align="start" justify="center" style="height: 100%;">
    <v-col class="col-4">
      <v-container class="fill-height" fluid>
        <v-row>
          <v-col>
            <v-list>
              <v-subheader>Liederen</v-subheader>
              <v-list-item-group
                mandatory
                v-model="visibleSong"
                color="primary"
              >
                <v-list-item v-for="(song, i) in songs" :key="i" :value="song"
                  >{{ song }}
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn tile block id="add" @click="isAddingSong = !isAddingSong"
              >+ Nieuw lied</v-btn
            >
          </v-col>
        </v-row>
        <v-row v-if="isAddingSong">
          <v-col>
            <v-text-field v-model="newSongTitle" label="Titel"></v-text-field>
            <v-textarea
              outlined
              label="Tekstregels"
              v-model="newSongLines"
            ></v-textarea>
            <v-btn
              id="Opslaan"
              @click="
                saveSong();
                isAddingSong = !isAddingSong;
              "
              >Opslaan</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-col>

    <v-col class="col-8 overflow-y">
      <v-row>
        <v-container>
          <v-row dense>
            <v-col
              v-for="(regels, i) in songData ? songData.regels : []"
              :key="i"
              cols="12"
            >
              <v-card
                flat
                :class="
                  regels.active ? 'font-weight-bold primary--text active' : null
                "
                @click="setSubtitles(regels.boven, regels.onder)"
              >
                <div>
                  <v-card-text class="py-0">
                    <span
                      v-if="regels.boven === ''"
                      class="font-italic grey--text grey-darken-4--text"
                      >lege regel</span
                    >
                    {{ regels.boven }}
                    <br />
                    <span
                      v-if="regels.onder === ''"
                      class="font-italic grey--text grey-darken-4--text"
                      >lege regel</span
                    >
                    {{ regels.onder }}
                  </v-card-text>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      isAddingSong: false,
      newSongTitle: "",
      newSongLines: "",
    };
  },
  computed: {
    songs() {
      return this.$store.getters.songTitles;
    },
    songData() {
      return this.$store.getters.songData;
    },

    visibleSong: {
      get() {
        return this.$store.visibleSong;
      },
      set(title) {
        return this.$store.dispatch("setVisibleSong", title);
      },
    },
  },
  methods: {
    saveSong() {
      const parsedSongLines = this.newSongLines
        .split("\n\n")
        .map((lines) => lines.split("\n"))
        .map((lines) => {
          if (lines.length === 1) {
            return { boven: "", onder: lines[0] };
          }
          if (lines.length > 1) {
            return { boven: lines[0], onder: lines[1] };
          }
          return { boven: "", onder: "" };
        })
        .filter((val) => val !== null);

      this.$store.dispatch("addSong", {
        title: this.newSongTitle,
        regels: parsedSongLines,
      });
    },

    /**
     * @param {string} above
     * @param {string} below
     */
    setSubtitles(above, below) {
      this.execVmixCommands([
        {
          Function: "PauseRender",
          Input: this.$store.state.Settings.vmixInputName,
        },
        {
          Function: "SetText",
          Input: this.$store.state.Settings.vmixInputName,
          SelectedName: "Headline.Text",
          Value: above,
        },
        {
          Function: "SetText",
          Input: this.$store.state.Settings.vmixInputName,
          SelectedName: "Description.Text",
          Value: below,
        },
        {
          Function: "ResumeRender",
          Input: this.$store.state.Settings.vmixInputName,
        },
      ]);
    },
  },
};
</script>

<style></style>
