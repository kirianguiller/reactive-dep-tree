// import conllup from '../../../conllup-js/lib/index';
import conllup from "@/localConllup";
const { emptySentenceJson } = conllup;

// import { SentenceJson, TreeJson, TokenJson } from "conllup/lib/conll";
import { SentenceJson, TreeJson, TokenJson } from "@/localConllup/conll";
import { IOriginator, IMemento, ICaretaker } from "./MementoPattern";
import { ISubject, IObserver } from "./ObserverPattern";

/**
 * The Concrete Memento contains the infrastructure for storing the Originator's
 * state.
 */
export class SentenceMemento implements IMemento {
  private state: SentenceJson;

  private date: string;

  constructor(state: SentenceJson) {
    this.state = state;
    this.date = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  }

  /**
   * The Originator uses this method when restoring its state.
   */
  public getState(): SentenceJson {
    return this.state;
  }

  /**
   * The rest of the methods are used by the Caretaker to display metadata.
   */
  public getName(): string {
    return `${this.date}`;
    // return `${this.date} / (${this.state.substr(0, 9)}...)`;
  }

  public getDate(): string {
    return this.date;
  }
}

/**
 * The Subject owns some important state and notifies observers when the state
 * changes.
 */

export class ReactiveSentence implements IOriginator, ISubject {
  /**
   * @type {number} For the sake of simplicity, the Subject's state, essential
   * to all subscribers, is stored in this variable.
   */
  public state: SentenceJson = emptySentenceJson();

  /**
   * @type {Observer[]} List of subscribers. In real life, the list of
   * subscribers can be stored more comprehensively (categorized by event
   * type, etc.).
   */
  private observers: IObserver[] = [];

  /**
   * The subscription management methods.
   */
  public attach(observer: IObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log("Subject: Observer has been attached already.");
    }

    console.log("Subject: Attached an observer.");
    this.observers.push(observer);
  }

  public detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log("Subject: Nonexistent observer.");
    }

    this.observers.splice(observerIndex, 1);
    console.log("Subject: Detached an observer.");
  }

  /**
   * Trigger an update in each subscriber.
   */
  public notify(): void {
    console.log("Subject: Notifying observers...");
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  /**
   * Originator implementation
   */
  public save(): IMemento {
    return new SentenceMemento(JSON.parse(JSON.stringify(this.state)));
  }

  /**
   * Restores the Originator's state from a memento object.
   */
  public restore(memento: IMemento): void {
    this.state = memento.getState();
    console.log(`Originator: My state has changed to`, this.state);
    this.notify();
  }

  /**
   * Usually, the subscription logic is only a fraction of what a Subject can
   * really do. Subjects commonly hold some important business logic, that
   * triggers a notification method whenever something important is about to
   * happen (or after it).
   */
  public fromSentenceConll(sentenceConll: string): void {
    console.log("\nSubject: I'm doing something important.");
    this.state = conllup.sentenceConllToJson(sentenceConll);

    console.log(`Subject: My state has just changed to: ${this.state}`);
    this.notify();
  }

  public updateToken(tokenJson: TokenJson): void {
    const tokenId = tokenJson.ID;
    Object.assign(this.state.treeJson[tokenId], tokenJson);
    console.log("Subject: my token changed :", tokenJson);
    this.notify();
  }

  public updateTree(treeJson: TreeJson): void {
    this.state.treeJson = JSON.parse(JSON.stringify(treeJson));
    console.log("Subject: my tree changed :", treeJson);
    this.notify();
  }

  public exportConll() {
    return conllup.sentenceJsonToConll({
      treeJson: this.state.treeJson,
      metaJson: this.state.metaJson
    });
  }

  public getUndescoredText(): string {
    const tokensForms = []
    for (const tokenId in this.state.treeJson) {
      const token = this.state.treeJson[tokenId]
      tokensForms.push(token.FORM)
    }
    const underscoredText = tokensForms.join("_")
    return underscoredText
  }
}

export class SentenceCaretaker implements ICaretaker {
  private mementos: IMemento[] = [];

  private originator: IOriginator;

  constructor(originator: IOriginator) {
    this.originator = originator;
  }

  public backup(): void {
    console.log("\nCaretaker: Saving Originator's state...");
    this.mementos.push(this.originator.save());
  }

  public undo(): void {
    if (!this.mementos.length) {
      return;
    }
    const memento = this.mementos.pop();
    if (memento) {
      console.log(`Caretaker: Restoring state to: ${memento.getName()}`);
      this.originator.restore(memento);
    }
  }

  public showHistory(): void {
    console.log("Caretaker: Here's the list of mementos:");
    for (const memento of this.mementos) {
      console.log(memento.getName(), memento.getState());
    }
  }
}
