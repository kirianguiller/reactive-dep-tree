<template>
  <div v-if="dialog" style="display: inline-block">
    <label for="">New upos : </label>
    <input
      ref="input"
      type="text"
      v-on:keyup.enter="onValidate"
      v-model="tagValue"
    />
  </div>
</template>

<script>
export default {
  props: ["sentenceBus"],
  data() {
    return {
      dialog: false,
      tagValue: "",
      token: {}
    };
  },
  mounted() {
    this.sentenceBus.$on("open:uposDialog", token => {
      this.dialog = true;
      this.token = token;
      this.focusInput();
    });
    this.sentenceBus.$on("reset:allDialog", () => {
      this.dialog = false;
      this.token = {};
    });
  },
  methods: {
    onValidate() {
      let newUpos = this.tagValue;
      if (newUpos === "") {
        newUpos = "X";
      }
      this.token.UPOS = newUpos.toUpperCase();
      this.sentenceBus.$emit("update:token", this.token);
      this.token = {};
      this.dialog = false;
    },
    focusInput() {
      setTimeout(() => {
        this.$refs.input.focus();
      }, 100);
    }
  }
};
</script>

<style></style>
