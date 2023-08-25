# Reactive Dep Tree

Interactive dependency trees in the browser !

## Description

Reactive-dep-tree is an html component made in Vuejs that allow to easily show interactive dependency trees on any html pages. This is basically an html wrapper of [DependencyTreeJS](https://github.com/kirianguiller/DependencyTreeJS) made with vue. I plan to do a React wrapper to make it available in react as a component.

## Who need that ?

Linguist, NLP researcher/engineer and computer scientist who want to show dependency tree in the browser.
It is currently being used in :

- [Surface Syntactic SUD](https://surfacesyntacticud.github.io) : A guideline on Surface Syntactic Universal Dependencies (SUD). Just check the website and try to interact with the dependency trees to have a live demo :D.
- [Arborator-Grew](https://arboratorgrew.elizia.net/#/) : A web-app for online collaborative dependency parsing that use the same [DependencyTreeJS](https://github.com/kirianguiller/DependencyTreeJS) directly in Quasar/Vue.js

## How to implement in 2 steps

### 1 - Source the CDN repo

Add the link to the CDN library in the head of any HTML file. You can replace `unpkg.com/reactive-dep-tree/dist` by `unpkg.com/reactive-dep-tree@x.y.z/dist` (for example `unpkg.com/reactive-dep-tree@0.4.1/dist`) if you want to import a specific version instead of the latest.

```html
<script
  src="https://unpkg.com/reactive-dep-tree/dist/reactive-dep-tree.umd.js"
  async
  deferred
></script>
```

### 2 - Create a <reactive-dep-tree> html component

Add the reactive-dep-tree component with the wanted parameters

```html
<reactive-dep-tree
  interactive="true"
  conll="# text = I am eating a pineapple
    1	I	_	PRON	_	_	2	suj	_	_
    2	am	_	AUX	_	_	0	root	_	_
    3	eating	_	VERB	_	_	2	aux	_	highlight=red
    4	a	_	DET	_	_	5	det	_	_
    5	pineapple	_	NOUN	_	_	3	obj	_	_
"
></reactive-dep-tree>
```

You should see the corresponding tree appearing on your website :

<img src="docs/I_am_eating_a_pineapple.png"
     alt="Markdown Monster icon"
      />

## Parameters

### conll

Source representation of the tree. Must be a proper conll format.

### interactive

If true, allow any user to modify locally on his browser the dependency tree. It can allow users to do quick edit and then export the tree as PNG, SVG or conll format.


### shown-features
By default, all features are shown. If you want to only show a small subset of feature, you can pass to the **shown-features** parameter a list of comma separated fields of what has to be shown.

```html
<reactive-dep-tree
  interactive="true"
  shown-features="UPOS,LEMMA,FORM,DEPREL,MISC.highlight"
  conll="# text = I am eating a pineapple
    1	I	_	PRON	_	_	2	suj	_	_
    2	am	be	AUX	_	_	0	root	_	_
    3	eating	eat	VERB	_	_	2	aux	_	highlight=red
    4	a	_	DET	_	_	5	det	_	_
    5	pineapple	_	NOUN	_	_	3	obj	_	_
"
></reactive-dep-tree>
```


### hidden-features
If you want to show all features except a small subset, it can be more convenient to keep the behavior of showing everything, and specifying the features that have to be hidden. To achieve this, you can specify the features you wish to hide in the **hidden-features** parameters as comma separated fields.

```html
<reactive-dep-tree
  interactive="true"
  hidden-features="MISC.highlight,LEMMA"
  conll="# text = I am eating a pineapple
    1	I	_	PRON	_	_	2	suj	_	_
    2	am	be	AUX	_	_	0	root	_	_
    3	eating	eat	VERB	_	_	2	aux	_	highlight=red
    4	a	_	DET	_	_	5	det	_	_
    5	pineapple	_	NOUN	_	_	3	obj	_	_
"
></reactive-dep-tree>
```

#### Name of the column
Here the name of the 10 columns : 
ID  FORM  LEMMA UPOS XPOS FEATS HEAD  DEPREL  DEPS MISC

If you want to hide the AlignBegin misc, you need to pass MISC.AlignBegin to **hidden-features** parameter.




### Demo

If you want to see these trees in action, you can go to the [SUD Dependency guidelines](https://surfacesyntacticud.github.io/) and start interacting with the exposed trees.

SUD is an annotation scheme for syntactic dependency treebanks, and has a nearly perfect degree of two-way convertibility with the Universal Dependencies scheme (UD). Contrary to UD, it is based on syntactic criteria (favoring functional heads) and the relations are defined on distributional and functional bases.

This website is a guideline on how to annotate in SUD for some specific languages

## Updates history
### 0.5.3
- update ReactiveDepTree dependency to 2.3.1 (from 2.2.5)
### 0.3.0

- Support for group token

```tsv
1-2 it's  _ _ _ _ _ _ _ _
1 it  _ _ _ _ _ _ _ _
2 's  _ _ _ _ _ _ _ _
```

## Source

Thanks to Kim Gerdes his work on [Arborator-Draft](https://github.com/Arborator/arborator-draft) that was used heavily in this library (conll handling, svg drawing (with snap-svg)). Also thanks to Gaël Guibon, Marine Courtin and the rest of the Arborator-Grew team for their valuable work on AG.

## Contributions

All contributions are welcomed.

### Set the project

```
git clone <url-for-this-repo>
git cd <this-repo>
npm install
```

### Run the dev version

```
npm run serve
```

### Information

- The file that will be render when serving the dev version will be `public/index.html` . You can change it as you please as this is not being compiled.
- For being able to use TS and to compile the code as a JS library, I "had" to create a main.js and a main.ts . main.\*s are usually the entry points in vue projects, but only one is should be necessary. In our case, we need the two of them, but I'm sure we could succeed to keep only main.ts (if somehow we succeed to compile the code in a common.js directly from main.ts)

### TODO

- [x] implement right-to-left logic (for languages such as Hebrew, Arabic, ...)
- [ ] write a better documentation (add information about passable parameters in the <reactive-dep-tree> component)
- [ ] add the possibility to pass the conll in a <conll> tag (for now, it is only passable as an attribute and force to add escaping characters if a quote is in the string of the conll)
- [ ] start implementing test
- [x] export the core logic (reactiveSentence folder) in an external library, so it could be imported in this vue wrapper AND in arborator-grew (and in other wrapper, side libraries, etc ...)
