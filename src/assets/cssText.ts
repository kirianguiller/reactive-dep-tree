const sharedStyleSheet = `
  .interactive > .FORM,
  .interactive > .LEMMA,
  .interactive > .UPOS,
  .interactive > .DEPREL {
    cursor: pointer;
  }
  
  .FORM {
    font-size: 16px;
    z-index: 99;
  }
  
  .LEMMA {
    font-size: 13px;
    font-style: italic;
  }
  
  .UPOS, .XPOS {
    font: 11px DejaVu Sans;
  }
  
  .XPOS {
      font-style: italic;
  }
  
  
  .DEPREL {
    font: 12px Arial;
    font-family: sans-serif;
    z-index: 99;
  }
  
  .FEATS, .MISC {
    font-size: 10px;
  }
  
  .glossy {
    font-style: italic;
  }
  
  .arrowhead {
    stroke-width: 0.8;
  }
  
  .curve {
    stroke-width: 1.1;
    fill: none;
    z-index: 0;
  }
  
  .dragcurve {
    stroke-width: 2;
    fill: none;
  }
  
  .arrowhead, .curve, .dragcurve {
      stroke: black;
      pointer-events: none;
    }
    `;

export const lightStylesheet =
  sharedStyleSheet +
  `
    .FORM, .LEMMA {
      fill: black;
    }

    .UPOS, .DEPREL {
      fill: #4a0984;;
    }

    .FEATS, .MISC, .XPOS {
      fill: #b352ac;
    }

    .UPOS.diff,
    .DEPREL.diff {
      fill: red;
    }

    .arrowhead {
      fill: white;
    }

    .arrowhead, .curve {
      stroke: black;
    }

    .arrowhead.diff, .curve.diff {
      stroke: red;
    }

    .dragcurve, .dragarrowhead {
      stroke: #ffb424;
    }

    .glossy {
      fill: #ffb424;
    }
 `;

export const darkStylesheet =
  sharedStyleSheet +
  `
      .FORM, .LEMMA {
      fill: #e6e2e2;
    }

    .UPOS, .DEPREL {
      fill: #ea6ff4;
    }

    .FEATS, .MISC, .XPOS {
      fill: #a47da3;
    }

    .FORM.diff, .UPOS.diff, .DEPREL.diff {
      fill: #ff2020;
    }

    .arrowhead {
      fill: black;
    }

    .arrowhead, .curve {
      stroke: #e6e2e2;
    }

    .arrowhead.diff, .curve.diff {
      stroke: #ff2020;
    }

    .dragarrowhead, .dragcurve {
      stroke: #ffb424;
    }

    .glossy {
      fill: #ffb424;
    }
        `;

export const cssText = `
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

.svgbox {
  overflow-x: auto;
}
`;
