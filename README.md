# Reactive Dep Tree

Interactive dependency trees in the browser !

## Description
Reactive-dep-tree is an html component made in Vuejs that allow to easily show interactive dependency trees on any html pages.

## Who need that ?
Linguist, NLP researcher/engineer and computer scientist who want to show dependency tree in the browser. 
It is currently being used in :
- [Arborator-Grew](https://arboratorgrew.elizia.net/#/) : A web-app for online collaborative dependency parsing.
- [Surface Syntactic SUD](https://surfacesyntacticud.github.io) : A guideline on Surface Syntactic Universal Dependencies (SUD). Just check the website and try to interact with the dependency trees to have a live demo :D.

## How to implement in 2 steps

### 1 - Source the CDN repo
Add the link to the CDN library in the head of any HTML file

```html
<script src="https://unpkg.com/reactive-dep-tree@0.2.0/dist/reactive-dep-tree.umd.js" async deferred></script>
```

### 2 - Create a <reactive-dep-tree> html component
Add the reactive-dep-tree component with the wanted parameters
```html
<reactive-dep-tree
  interactive="true"
  conll="# text = I am eating a pineapple
    1	I	_	PRON	_	_	2	suj	_	_
    2	am	_	AUX	_	_	0	root	_	_
    3	eating	_	VERB	_	_	2	aux	_	_
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

### Demo
If you want to see these trees in action, you can go to the [SUD Dependency guidelines](https://surfacesyntacticud.github.io/) and start interacting with the exposed trees. 

SUD is an annotation scheme for syntactic dependency treebanks, and has a nearly perfect degree of two-way convertibility with the Universal Dependencies scheme (UD). Contrary to UD, it is based on syntactic criteria (favoring functional heads) and the relations are defined on distributional and functional bases.

This website is a guideline on how to annotate in SUD for some specific languages

## Updates history
### 0.3.0
- Support for group token
```tsv
1-2 it's  _ _ _ _ _ _ _ _
1 it  _ _ _ _ _ _ _ _
2 's  _ _ _ _ _ _ _ _
```

## Source
Thanks to Kim Gerdes and his work on [Arborator-Draft](https://github.com/Arborator/arborator-draft) that was used heavily in this library (conll handling, svg drawing (with snap-svg)). Also thanks to the Arborator-Grew team and software that was influential for the realization of this repo.