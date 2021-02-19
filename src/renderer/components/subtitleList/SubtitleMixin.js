import VmixConnnectionState from "../../vmixConnection/VmixConnectionState";

export default {
  methods: {
    sendSubtitlesToVMix(above, below) {
      const aboveName = this.$store.state.Settings.vmixTitleFieldAbove;
      const belowName = this.$store.state.Settings.vmixTitleFieldBelow;

      this.execVmixCommands([
        {
          Function: "PauseRender",
          Input: this.$store.state.Settings.vmixInputName,
        },
        {
          Function: "SetText",
          Input: this.$store.state.Settings.vmixInputName,
          SelectedName: aboveName,
          Value: above,
        },
        {
          Function: "SetText",
          Input: this.$store.state.Settings.vmixInputName,
          SelectedName: belowName,
          Value: below,
        },
        {
          Function: "ResumeRender",
          Input: this.$store.state.Settings.vmixInputName,
        },
      ]);
    },

    setActiveSubtitle(i) {
      this.$store.dispatch("setActiveSubtitle", {
        songTitle: this.$store.getters.songData.title,
        index: i,
      });
    },

    sendActiveSubtitleToVMix() {
      if ((this.activeSubtitle ?? null) !== null) {
        const { songTitle, index } = this.activeSubtitle;
        const isActiveSongTitle = this.$store.getters.songData?.title === songTitle;

        if (isActiveSongTitle) {
          const { above, below } = this.subtitles[index];
          this.sendSubtitlesToVMix(above, below);
        }
      }
    },

    handleSubtitleSelected(above, below, index) {
      this.sendSubtitlesToVMix(above, below);
      this.setActiveSubtitle(index);
    },

    isActiveSubtitle(i) {
      if (this.activeSubtitle === null) {
        return false;
      }

      const { songTitle, index } = this.activeSubtitle;

      const isActiveSongTitle = this.$store.getters.songData.title === songTitle;
      const isActiveIndex = index === i;

      return isActiveSongTitle && isActiveIndex;
    },

    nextSubtitle() {
      let n = 0;

      if (this.activeSubtitle !== null) {
        n = Math.min(this.activeSubtitle.index + 1, this.subtitles.length - 1);
      }

      const { above, below } = this.subtitles[n];

      this.handleSubtitleSelected(above, below, n);
    },

    previousSubtitle() {
      let n = 0;

      if (this.activeSubtitle !== null) {
        n = Math.max(this.activeSubtitle.index - 1, 0);
      }

      const { above, below } = this.subtitles[n];

      this.handleSubtitleSelected(above, below, n);
    },
  },

  computed: {
    subtitles() {
      return this.$store.getters.songData?.subtitles;
    },

    presentedSubtitles() {
      return this.subtitles.slice(0, this.activeSubtitleIndex);
    },

    presentingSubtitle() {
      return this.subtitles[this.activeSubtitleIndex];
    },

    upcomingSubtitles() {
      return this.subtitles.slice(this.activeSubtitleIndex + 1);
    },

    isLive() {
      return this.$vMixConnection.connected === VmixConnnectionState.LIVE;
    },

    activeSubtitle() {
      return this.$store.state.Songs.activeSubtitle;
    },

    activeSubtitleIndex() {
      return this.activeSubtitle?.index ?? 0;
    },
  },

  watch: {
    activeSubtitle: function activeSubtitle() {
      this.sendActiveSubtitleToVMix();
    },
  },
};
