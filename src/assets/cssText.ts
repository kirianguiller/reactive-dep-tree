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
.svg-tree {
  background-color: white;
}
`;
