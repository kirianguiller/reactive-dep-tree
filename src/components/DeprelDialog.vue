<template>
  <div>
    <input
      ref="input"
      v-if="dialog"
      type="text"
      v-on:keyup.enter="onValidate"
      v-model="tagValue"
    />
  </div>
</template>

<script>
export default {
  name: "DeprelDialog",
  props: ["sentenceBus"],
  data() {
    return {
      dialog: false,
      tagValue: "",
      token: {},
    }
  },
  mounted() {
    this.sentenceBus.$on("open:deprelDialog", (token) => {
      this.dialog = true
      this.token = token
      this.focusInput()
    })
  },
  methods: {
    onValidate() {
      console.log("KK deprel validate")
      let newDeprel = this.tagValue;
      if (newDeprel === "") {
        newDeprel = "X";
      }
      this.token.DEPREL = newDeprel
      this.sentenceBus.$emit("update:token", this.token)
      this.token = {}
      this.dialog = false
    },
    focusInput() {
      setTimeout(()=> {
        this.$refs.input.focus()
      },100)
    }
  }
};
</script>

<style>
</style>