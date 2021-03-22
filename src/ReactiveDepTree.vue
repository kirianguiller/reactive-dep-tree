<template>
  <div class="component-wrapper">
    <div class="meta_container">
      <SettingsDropdown
        class="meta_dropdown"
        :sentenceBus="sentenceBus"
        :sentenceCaretaker="sentenceCaretaker"
      />
      <span class="meta__text">{{ sentenceText }}</span>
    </div>
    <svg ref="svgWrapper" class="svg-tree" xmlns="http://www.w3.org/2000/svg" />
    <DeprelDialog :sentenceBus="sentenceBus" />
    <UposDialog :sentenceBus="sentenceBus" />
    <ShowConll
      :reactiveSentence="reactiveSentence"
      :sentenceBus="sentenceBus"
    />
  </div>
</template>

<script>
import Vue from "vue";

import {
  ReactiveSentence,
  SentenceCaretaker,
} from "./reactiveSentence/ReactiveSentence.ts";
import {
  SentenceSVG,
  SentenceSVGOptions,
  defaultSentenceSVGOptions,
} from "./reactiveSentence/SentenceSVG";
import DeprelDialog from "./components/DeprelDialog.vue";
import UposDialog from "./components/UposDialog.vue";
import SettingsDropdown from "./components/SettingsDropdown.vue";
import ShowConll from "./components/ShowConll.vue";

export default {
  components: { DeprelDialog, UposDialog, SettingsDropdown, ShowConll },
  props: ["conll", "interactive", "shown-features"],
  data() {
    return {
      reactiveSentence: new ReactiveSentence(),
      sentenceSVG: null,
      sentenceBus: new Vue(),
      sentenceCaretaker: null,
      sentenceText: "",
      show: false,
      hover: true,
    };
  },
  mounted() {
    const svgWrapper = this.$refs.svgWrapper;
    // add the component to the list of reactiveSentence observers
    this.reactiveSentence.attach(this);

    const sentenceSVGOptions = defaultSentenceSVGOptions()
    if (this.shownFeatures) {
      sentenceSVGOptions.shownFeatures = this.shownFeatures.split(",")

    }
    sentenceSVGOptions.interactive = this.interactive

    this.sentenceSVG = new SentenceSVG(svgWrapper, this.reactiveSentence, sentenceSVGOptions);
    this.reactiveSentence.fromSentenceConll(this.conll);

    this.sentenceCaretaker = new SentenceCaretaker(this.reactiveSentence);

    this.sentenceSVG.addEventListener("svg-click", (e) => {
      const targetLabel = e.detail.targetLabel;
      const tokenId = e.detail.clicked;
      if (targetLabel === "UPOS") {
        this.sentenceBus.$emit("open:uposDialog", {
          ID: tokenId,
        });
      } else if (targetLabel === "DEPREL") {
        this.sentenceBus.$emit("open:deprelDialog", {
          ID: tokenId,
        });
      }
      // this.svgClick(e);
    });
    this.sentenceSVG.addEventListener("svg-drop", (e) => {
      let tokenId;
      let headId;
      if (e.detail.hovered == 0) {
        tokenId = e.detail.dragged;
        headId = e.detail.hovered;
      } else if (e.detail.hovered > 0) {
        tokenId = e.detail.hovered;
        headId = e.detail.dragged;
      } else {
        console.log("Error, hoveredId has a wrong value (< 0)");
        return;
      }
      if (tokenId >= 0 && headId >= 0) {
        this.sentenceBus.$emit("open:deprelDialog", {
          ID: tokenId,
          HEAD: headId,
        });
      }
    });
    this.sentenceBus.$on("update:token", (token) => {
      this.sentenceCaretaker.backup();
      this.reactiveSentence.updateToken(token);
    });
  },
  methods: {
    svgClick(e) {
      console.log(e);
    },
    update(reactiveSentence) {
      this.sentenceText = reactiveSentence.state.metaJson.text;
    },
  },
};
</script>
<style>
* {
  box-sizing: border-box;
}

.component-wrapper {
  padding-left: 20px;
}

.svg-tree {
  margin-left: -20px;
}

.meta_container {
  margin-bottom: 0.6em;
  border-bottom: 1px solid lightgrey;
  padding: 0.5em 0 0.17em 0;
}

.meta_dropdown {
  padding: 0 20px;
}

.meta_dropdown,
.meta_text {
  display: inline-block;
  vertical-align: middle;
}

.meta__text {
  font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.5;
}
.FORM {
  /* 	font: 18px DejaVu Sans; */
  /* 	fill: black; */
  /* 	font-family:sans-serif; */
  --wordDistance: 55;
  fill: black;
  text-align: center;
  position: relative;
  z-index: 99;
}

.interactive > .FORM,
.interactive > .LEMMA,
.interactive > .UPOS,
.interactive > .DEPREL {
  cursor: pointer;
}

.dark .FORM {
  /* 	font: 18px DejaVu Sans; */
  /* 	fill: black; */
  /* 	font-family:sans-serif; */
  --wordDistance: 55;
  fill: rgb(255, 255, 255);
  text-align: center;
  position: relative;
  z-index: 99;
}

.LEMMA {
  font: 15px DejaVu Sans;
  fill: black;
  font-family: sans-serif;
  text-align: center;
  /* cursor: pointer; */
  font-style: italic;
  --wordDistance: 22;
}

.dark .LEMMA {
  font: 15px DejaVu Sans;
  fill: rgb(238, 232, 232);
  font-family: sans-serif;
  text-align: center;
  font-style: italic;
  --wordDistance: 22;
}

.MISC-Gloss {
  font: 15px DejaVu Sans;
  fill: rgb(124, 96, 86);
  font-family: sans-serif;
  text-align: center;
  font-style: italic;
  --wordDistance: 11;
}

.UPOS {
  font: 11px DejaVu Sans;
  fill: rgb(80, 29, 125);
  /* cursor: pointer; */
  text-align: center;
  --wordDistance: 22;
}

.UPOSselected {
  font: 11px DejaVu Sans;
  fill: #dd137bff;
  font-weight: bold;
  text-align: center;
}

.DEPREL {
  font: 12px Arial;
  fill: #501d7d;
  font-style: oblique;
  font-family: sans-serif;
  /* cursor: pointer; */
  position: relative;
  z-index: 99;
  --funcCurveDist: 3; /* distance between the function name and the curves highest point */
}

.dark .DEPREL {
  font: 12px Arial;
  fill: #aab3ff;
  font-style: oblique;
  font-family: sans-serif;
  /* cursor: pointer; */
  z-index: 99;
  --funcCurveDist: 3; /* distance between the function name and the curves highest point */
}

.glossy {
  font: 15px DejaVu Sans;
  fill: coral;
  font-family: sans-serif;
  text-align: center;
  font-style: italic;
  --wordDistance: 11;
}

.xdeprel {
  fill: #21ba45;
  z-index: 99;
}

.xdep {
  stroke: #21ba45;
  fill: none;
}

.DEPRELselected {
  fill: #dd137b;
  z-index: 99;
  /* font-weight: bold; */
}

.arrowhead {
  fill: white;
  stroke: black;
  stroke-width: 0.8;
}

.curve {
  stroke: black;
  stroke-width: 1;
  fill: none;
  position: relative;
  z-index: 0;
  --startOffset: 8;
  --tokDepDist: 15; /* distance between tokens and depdendency relation */
  --depMinHeight: 15; /* minimum height for dependency */
  --wordDistanceFactor: -1; /* distant words get higher curves. this factor fixes how much higher */
}

.dark .curve {
  stroke: rgb(248, 244, 244);
  stroke-width: 1;
  fill: none;
  --startOffset: 8;
  --tokDepDist: 15; /* distance between tokens and depdendency relation */
  --depMinHeight: 15; /* minimum height for dependency */
  --wordDistanceFactor: -1; /* distant words get higher curves. this factor fixes how much higher */
}

.dragcurve {
  stroke: #dd137bff;
  stroke-width: 1.5;
  fill: none;
}
.draggov {
  fill: #dd137bff;
  text-align: center;
}

.conll {
  display: none; /*toggles to inline*/
  unicode-bidi: embed;
  font-family: monospace;
  white-space: pre;
  margin-bottom: 0.6em;
  border-bottom: 1px solid #aaa;
  padding: 0.5em 0 0.17em 0;
  tab-size: 12;
  background-color: #fff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
}

.sentencebox {
  margin-bottom: 0.6em;
  border-bottom: 1px solid #aaa;
  padding: 0.5em 0 0.17em 0;
  margin-top: 1em;
}

/* Button */
.button {
  display: inline-block;
  position: relative;
  width: 120px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  font-size: 0.9em;
  background-color: #fff;
  color: #646464;
  cursor: pointer;
}

.button > paper-ripple {
  border-radius: 2px;
  overflow: hidden;
}

.button.raised {
  transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.2s;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
}

.button.raised:active {
  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2);
  transition-delay: 0s;
}

.center {
  text-align: center;
}

/* logo animation transitions */
.arboratorlogo {
  transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
}

.arboratorlogo:hover {
  transform: scale(1.1);
  transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  opacity: 0.9;
}

.svgbox {
  overflow-x: auto;
}

.curve.diff,
.arrowhead.diff {
  stroke: red;
  stroke-width: 1;
  fill: none;
  position: relative;
}

.UPOS.diff,
.DEPREL.diff {
  fill: red;
}
</style>
