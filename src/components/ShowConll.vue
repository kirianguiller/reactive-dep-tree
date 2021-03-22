<template>
    <div v-if="dialog">
      <p class="conll-text">
        {{sentenceConll}}
      </p>
    </div>
</template>

<script>
export default {
  props: ["sentenceBus", "reactiveSentence"],
  data() {
    return {
      dialog: false,
      sentenceConll: "",
    }
  },
  mounted() {
    this.reactiveSentence.attach(this)
    // this.sentenceConll = this.reactiveSentence.exportConll()
    this.sentenceBus.$on("UI:toggle-conll", ()=> {
      this.dialog = !this.dialog
    })


  },
  methods: {
    update(reactiveSentence) {
      this.sentenceConll = reactiveSentence.exportConll()
    }
  }
}
</script>

<style scoped>
.conll-text {
  white-space: pre
}
</style>