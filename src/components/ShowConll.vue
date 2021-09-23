<template>
  <div v-if="dialog">
    <p class="conll-text">{{ sentenceConll }}</p>
  </div>
</template>

<script>
export default {
  props: ["sentenceBus", "reactiveSentence"],
  data() {
    return {
      dialog: false,
      sentenceConll: ""
    };
  },
  mounted() {
    this.reactiveSentence.attach(this);
    // this.sentenceConll = this.reactiveSentence.exportConll()
    this.sentenceBus.$on("UI:toggle-conll", () => {
      this.dialog = !this.dialog;
    });
  },
  methods: {
    update(reactiveSentence) {
      // this method is called whenever the reactiveSentence instance changes and call the 'update()' method of all his observers
      this.sentenceConll = reactiveSentence.exportConll();
    }
  }
};
</script>

<style scoped>
.conll-text {
  white-space: pre;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  padding: 10px;
}
</style>
