import conllup from "conllup";
const { sentenceConllToJson, sentenceJsonToConll } = conllup;

import {
  SentenceJson,
  MetaJson,
  TreeJson,
  TokenJson,
  FeatureJson
} from "conllup/lib/conll";

import { EventDispatcher } from "./EventDispatcher";
// import { TreeJson, MetaJson } from "./Conll";

///////////////                            ////////////////
///////////////    ReactiveSentence    ////////////////
///////////////                            ////////////////

export class ReactiveSentence extends EventDispatcher {
  treeJson: TreeJson = {};
  treeJsonTemp: TreeJson = {};
  metaJson: MetaJson = {};
  sentenceConll = "";

  constructor() {
    super();
  }

  fromConll(sentenceConll: string) {
    this.sentenceConll = sentenceConll;

    const sentenceJson: SentenceJson = sentenceConllToJson(this.sentenceConll);
    Object.assign(this.treeJson, sentenceJson.treeJson);
    Object.assign(this.metaJson, sentenceJson.metaJson);
    this.treeJsonTemp = JSON.parse(JSON.stringify(this.treeJson));
    this._emitEvent();
  }

  updateToken(tokenJson: TokenJson, update = true): void {
    this.treeJson[tokenJson.ID] = tokenJson;
    this.treeJsonTemp = JSON.parse(JSON.stringify(this.treeJson));
    if (update) this._emitEvent();
    // this._emitEvent({ tokenJson: this.treeJson[tokenJson.ID] });
  }

  getToken(ID: number) {
    const token = { ...this.treeJsonTemp[ID] };
    return token;
  }
  updateTree(treeJson: TreeJson): void {
    // for (const [tokenIndex, tokenJson] of Object.entries(treeJson)) {
    //   this.treeJson[tokenIndex] = tokenJson;
    //   Object.assign(this.treeJson[tokenIndex], tokenJson);
    // }

    for (const tokenIndex in treeJson) {
      // this.treeJson[tokenIndex] = treeJson[tokenIndex];
      Object.assign(this.treeJson[tokenIndex], treeJson[tokenIndex]);
    }
    this.treeJsonTemp = JSON.parse(JSON.stringify(this.treeJson));
    this._emitEvent();
  }

  replaceArrayOfTokens(
    tokenIds: number[],
    firstToken: number,
    tokensToReplace: any // TODO : type this
  ): void {
    const id2newid: { [key: number]: number } = { 0: 0 };
    for (const idStr in this.treeJson) {
      const id = parseInt(idStr);

      if (id < tokenIds[0]) id2newid[id] = id;
      else if (tokenIds.includes(id)) {
        if (tokenIds.indexOf(id) < tokensToReplace.length) id2newid[id] = id;
        else id2newid[id] = firstToken;
      } else id2newid[id] = id + tokensToReplace.length - tokenIds.length;
    }
    const newtree: TreeJson = {};
    for (const idStr in this.treeJson) {
      const id = parseInt(idStr);
      if (
        tokenIds.includes(id) &&
        tokenIds.indexOf(id) >= tokensToReplace.length
      )
        continue;
      const node = this.treeJson[id];
      node.ID = id2newid[id];
      node.HEAD = id2newid[node.HEAD];
      const newdeps: any = {};
      for (const gidStr in node.DEPS) {
        const gid = parseInt(gidStr);
        newdeps[id2newid[gid]] = node.DEPS[gid];
      }
      node.DEPS = newdeps;
      if (tokenIds.includes(id)) {
        node.FORM = tokensToReplace[tokenIds.indexOf(id)];
      }
      newtree[id2newid[id]] = node;
    }
    // now the case where more tokens were inserted than replaced:
    const basenode = this.treeJson[id2newid[tokenIds[tokenIds.length - 1]]];
    for (let i = tokenIds.length; i < tokensToReplace.length; ++i) {
      const newnode = JSON.parse(JSON.stringify(basenode));
      newnode.ID = tokenIds[0] + i;
      newnode.FORM = tokensToReplace[i];
      newnode.HEAD = 0;
      newnode.DEPREL = "root";
      newnode.DEPS = {};
      if (newnode.MISC.Gloss) newnode.MISC.Gloss = newnode.FORM;
      newtree[tokenIds[0] + i] = newnode;
    }
    if (!Object.keys(newtree).length) return; // forbid to erase entire tree TODO : throw an error

    // this is necessary, because a simple 'this.treeJson = newtree;' would break the ===
    // for (const tokenIndex in newtree) {
    //   Object.assign(this.treeJson[tokenIndex], newtree[tokenIndex]);
    // }

    this.treeJson = newtree;

    // // TODO handle new meta text
    this.metaJson.text = "TODO !!!!";
    // this.metaJson.text = getSentenceTextFromJson(newtree);

    const event = new CustomEvent("tree-updated");
    this.dispatchEvent(event);

    return;
  }

  _emitEvent(): void {
    const event = new CustomEvent(
      "token-updated"
      // {
      // detail: {
      //   treeJson,
      //   tokenJson,
      // },
      // }
    );

    this.dispatchEvent(event);
  }

  resetRecentChanges(): void {
    const sentenceJson = sentenceConllToJson(this.sentenceConll);
    Object.assign(this.treeJson, sentenceJson.treeJson);
    Object.assign(this.metaJson, sentenceJson.metaJson);
    this._emitEvent();
  }

  exportConllWithModifiedMeta(newMetaJson: MetaJson): string {
    for (const [metaName, metaValue] of Object.entries(this.metaJson)) {
      if (!Object.keys(newMetaJson).includes(metaName)) {
        newMetaJson[metaName] = metaValue;
      }
    }

    const sentenceJsonToExport: SentenceJson = {
      treeJson: this.treeJson,
      metaJson: newMetaJson
    };

    return sentenceJsonToConll(sentenceJsonToExport);
  }
}
