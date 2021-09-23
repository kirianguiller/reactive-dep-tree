<template>
  <div class="scroll-wrapper">
    <div class="component-wrapper">
      <template v-if="minimal == false">
        <div class="meta">
          <div class="meta__header">
            <SettingsDropdown
              class="meta__dropdown"
              :sentenceBus="sentenceBus"
              :sentenceCaretaker="sentenceCaretaker"
              :interactive="interactive"
              :reactiveSentence="reactiveSentence"
            />
            <span class="meta__text">{{ sentenceText }}</span>
          </div>
          <div class="meta__infos">
            <span v-for="(metaValue, metaKey) of shownMetasObj" :key="metaKey"
              >{{ metaKey }} = {{ metaValue }}<br
            /></span>
          </div>
        </div>
        <svg
          ref="svgWrapper"
          class="svg-tree"
          xmlns="http://www.w3.org/2000/svg"
        />
        <DeprelDialog :sentenceBus="sentenceBus" />
        <UposDialog :sentenceBus="sentenceBus" />
        <ShowConll
          :reactiveSentence="reactiveSentence"
          :sentenceBus="sentenceBus"
        />
        <v-style ref="stylee"> </v-style>
      </template>
      <template v-else>
        <svg
          ref="svgWrapper"
          class="svg-tree"
          xmlns="http://www.w3.org/2000/svg"
        />
      </template>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import {
  ReactiveSentence,
  SentenceCaretaker,
  SentenceSVG,
  defaultSentenceSVGOptions
} from "dependencytreejs/lib";
import DeprelDialog from "./components/DeprelDialog.vue";
import UposDialog from "./components/UposDialog.vue";
import SettingsDropdown from "./components/SettingsDropdown.vue";
import ShowConll from "./components/ShowConll.vue";

export default {
  components: { DeprelDialog, UposDialog, SettingsDropdown, ShowConll },
  // props: ["conll", "interactive", "shown-features"],
  props: {
    conll: String,
    interactive: Boolean,
    shownFeatures: String,
    hiddenFeatures: String,
    shownMetas: String,
    minimal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      reactiveSentence: new ReactiveSentence(),
      sentenceSVG: null,
      sentenceBus: new Vue(),
      sentenceCaretaker: null,
      sentenceText: "",
      show: false,
      hover: true,
      shownMetasObj: {}
    };
  },
  mounted() {
    const svgWrapper = this.$refs.svgWrapper;
    // add the component to the list of reactiveSentence observers
    this.reactiveSentence.attach(this);
    this.reactiveSentence.fromSentenceConll(this.conll);

    const sentenceSVGOptions = defaultSentenceSVGOptions();
    const shownFeatures = this.processFeaturesInput(this.shownFeatures);
    const hiddenFeatures = this.processFeaturesInput(this.hiddenFeatures);

    if (shownFeatures.length === 0) {
      sentenceSVGOptions.shownFeatures = this.reactiveSentence.getAllFeaturesSet();
    } else {
      sentenceSVGOptions.shownFeatures = shownFeatures;
    }

    sentenceSVGOptions.shownFeatures = sentenceSVGOptions.shownFeatures.filter(
      x => !hiddenFeatures.includes(x)
    );
    sentenceSVGOptions.interactive = this.interactive;

    this.sentenceSVG = new SentenceSVG(
      svgWrapper,
      this.reactiveSentence,
      sentenceSVGOptions
    );
    // this.reactiveSentence.fromSentenceConll(this.conll);

    this.sentenceCaretaker = new SentenceCaretaker(this.reactiveSentence);
    this.sentenceCaretaker.backup();

    this.sentenceSVG.addEventListener("svg-click", e => {
      this.sentenceBus.$emit("reset:allDialog");
      const targetLabel = e.detail.targetLabel;
      const tokenId = e.detail.clicked;
      if (targetLabel === "UPOS") {
        this.sentenceBus.$emit("open:uposDialog", {
          ID: tokenId
        });
      } else if (targetLabel === "DEPREL") {
        this.sentenceBus.$emit("open:deprelDialog", {
          ID: tokenId
        });
      }
      // this.svgClick(e);
    });
    this.sentenceSVG.addEventListener("svg-drop", e => {
      this.sentenceBus.$emit("reset:allDialog");
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
          HEAD: headId
        });
      }
    });
    this.sentenceBus.$on("update:token", token => {
      this.reactiveSentence.updateToken(token);
      this.sentenceCaretaker.backup();
    });
  },
  computed: {
    shownMetasList() {
      return this.processFeaturesInput(this.shownMetas);
    }
  },
  methods: {
    update(reactiveSentence) {
      // this method is called whenever the reactiveSentence instance changes and call the 'update()' method of all his observers
      this.sentenceText = reactiveSentence.getSentenceText();
      this.shownMetasObj = {};
      for (const shownMeta of this.shownMetasList) {
        if (reactiveSentence.state.metaJson[shownMeta]) {
          this.shownMetasObj[shownMeta] =
            reactiveSentence.state.metaJson[shownMeta];
        }
      }
    },
    processFeaturesInput(features) {
      let processedFeatures;
      if (features) {
        processedFeatures = features.split(",");
      } else {
        processedFeatures = [];
      }
      return processedFeatures;
    }
  }
};
</script>
<style>
* {
  box-sizing: border-box;
}
.scroll-wrapper {
  overflow-x: auto;
}
.component-wrapper {
  /* padding-left: 20px; */
  width: fit-content;
}

.svg-tree {
  /* margin-left: -20px; */
}

.meta {
  margin-bottom: 0.6em;
  border-bottom: 1px solid lightgrey;
  padding: 0.5em 0 0.17em 0;
}

.meta__header {
  margin-bottom: 10px;
}

.meta__dropdown {
  padding: 0 20px;
}

.meta__dropdown,
.meta__text {
  display: inline-block;
  vertical-align: middle;
}

.meta__text {
  line-height: 1.5;
}

.meta__infos {
  font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 0.9em;
  font-style: italic;
  padding-left: 65px;
}

.FORM {
  font: 18px "DejaVu Sans";
  fill: black;
  text-align: center;
  position: relative;
  z-index: 99;
  --wordDistance: 55;
}

.interactive {
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
  font: 15px "DejaVu Sans";
  fill: black;
  font-family: sans-serif;
  text-align: center;
  /* cursor: pointer; */
  font-style: italic;
  --wordDistance: 22;
}

.dark .LEMMA {
  font: 15px "DejaVu Sans";
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

.UPOS,
.XPOS {
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

.FEATS,
.MISC {
  font-size: 10px;
  fill: #6d346d;
}
</style>
