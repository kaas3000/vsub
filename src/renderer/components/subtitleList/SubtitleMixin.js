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
  },

  computed: {
    subtitles() {
      return this.$store.getters.songData.subtitles;
    },

    isLive() {
      return this.$vMixConnection.connected === VmixConnnectionState.LIVE;
    },
  },
};
