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
              :sentenceSVG="sentenceSVG"
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
    },
    arcHeight: {
      type: Number,
      default: 40
    },
    tokenSpacing: {
      type: Number,
      default: 28
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

    sentenceSVGOptions.tokenSpacing = this.tokenSpacing;
    sentenceSVGOptions.arcHeight = this.arcHeight;

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
</style>
