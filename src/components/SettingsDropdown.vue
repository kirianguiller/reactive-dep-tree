<template>
  <dropdown-menu v-model="show" :right="right" :hover="hover">
    <svg
      class="dropdown__extern"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:cc="http://creativecommons.org/ns#"
      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      xmlns:svg="http://www.w3.org/2000/svg"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="-4202 0 5704.1939 1840.839"
      style="image-rendering: optimizeQuality"
      height="13"
      width="27"
      xml:space="preserve"
    >
      <path
        style="
          fill: none;
          stroke: #4a2769;
          stroke-width: 128.73750305;
          stroke-linecap: butt;
          stroke-linejoin: miter;
          stroke-miterlimit: 4;
        "
        d="m -1890.5398,1002.7933 -1822.5445,615.288 c -261.3344,-190.4146 -424.5469,-433.2903 -424.5469,-661.59345 0,-685.88115 1244.2446,-1296.6446 2780.191,-1296.6446 1534.97478,0 2795.2653,610.76345 2795.2653,1296.6446 0,685.88105 -1252.26757,1244.49535 -2787.2424,1244.49535 -239.9613,0 -490.6091,-19.4301 -718.9123,-43.7176 L -751.94297,618.40481 -882.8496,663.4494"
      ></path>
      <path
        style="
          fill: none;
          stroke: #dd137b;
          stroke-width: 128.73750305;
          stroke-miterlimit: 4;
        "
        d="M -864.53567,745.22843 C -964.68477,501.46149 -1354.4152,-183.90675 -1694.5756,-3.2652517 -2014.6556,165.68318 -2049.9732,423.17981 -1871.2632,1084.3717 c 67.0564,232.3776 161.3346,398.0135 238.7197,540.6756"
      ></path>
      <path
        style="
          fill: none;
          stroke: #4a2769;
          stroke-width: 128.73750305;
          stroke-linecap: butt;
          stroke-linejoin: miter;
          stroke-miterlimit: 4;
        "
        d="M -2068.3297,2157.2657 -751.94297,618.40481"
      ></path>
    </svg>
    <div slot="dropdown" class="dropdown__container">
      <span class="dropdown__item" @click="toggleConll">{{
        conllShowed ? "Hide Conll" : "Show Conll"
      }}</span>
      <span class="dropdown__item" @click="exportSVG">Export SVG</span>
      <span class="dropdown__item" @click="exportPNG">Export PNG</span>

      <template v-if="interactive">
        <span class="dropdown__item" @click="undo">Undo</span>
        <span class="dropdown__item" @click="redo">Redo</span>
      </template>
      <span class="dropdown__item" @click="aboutReactiveDepTree"
        >About ReactiveDepTree</span
      >
    </div>
  </dropdown-menu>
</template>

<script>
import DropdownMenu from "@innologica/vue-dropdown-menu";
import { cssText, lightStylesheet } from "../assets/cssText";
export default {
  components: { DropdownMenu },
  props: [
    "sentenceBus",
    "sentenceCaretaker",
    "interactive",
    "reactiveSentence"
  ],
  data() {
    return {
      show: false,
      hover: true,
      right: false,
      conllShowed: false
    };
  },
  methods: {
    toggleConll() {
      this.conllShowed = !this.conllShowed;
      this.sentenceBus.$emit("UI:toggle-conll");
    },
    undo() {
      this.sentenceCaretaker.undo();
    },
    redo() {
      this.sentenceCaretaker.redo();
    },
    getSVGblob() {
      const svgText = this.$parent.$refs.svgWrapper.outerHTML;

      const exportedSvg = svgText.replace(
        "<defs></defs>",
        `<style>${cssText}${lightStylesheet}</style><defs></defs>`
      );
      const blob = new Blob([exportedSvg], { type: "image/svg+xml" });
      return blob;
    },
    exportPNG() {
      const svgImage = document.createElement("img");
      document.body.appendChild(svgImage);
      const blob = this.getSVGblob();
      const DOMURL = window.URL || window.webkitURL || window;
      const url = DOMURL.createObjectURL(blob);
      svgImage.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = svgImage.clientWidth;
        canvas.height = svgImage.clientHeight;
        const canvasCtx = canvas.getContext("2d");
        canvasCtx.drawImage(svgImage, 0, 0);
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = this.reactiveSentence.getUndescoredText() + ".png";
        link.click();
        document.body.removeChild(svgImage);
      };
      svgImage.src = url;
    },
    exportSVG() {
      const blob = this.getSVGblob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = this.reactiveSentence.getUndescoredText() + ".svg";
      link.click();
      URL.revokeObjectURL(link.href);
    },
    aboutReactiveDepTree() {
      window.open(
        "https://github.com/kirianguiller/reactive-dep-tree",
        "_blank"
      );
    }
  }
};
</script>

<style scoped>
.dropdown__extern:hover {
  background-color: rgb(230, 230, 230);
  border-radius: 10px;
  cursor: pointer;
}
.dropdown__container {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
}

.dropdown__item {
  font: normal 16px sans-serif;
  padding: 20px;
}

.dropdown__item:hover {
  background-color: rgb(230, 230, 230);
  cursor: pointer;
}

.dropdown__item:active {
  background-color: rgb(214, 214, 214);
  cursor: pointer;
}
</style>
