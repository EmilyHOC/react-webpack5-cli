import Handler from "./Handler";
import { KeyEvent } from "../utils";
import { code } from "../constants";

class ShortCutHandler {
  handler: Handler;
  keyEvent: KeyEvent;
  constructor(handler: Handler) {
    this.handler = handler;
    this.keyEvent = handler.keyEvent;
  }
  /**
   * 是否按下 Escape
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isEscape = (e: KeyboardEvent) => {
    return e.code === code.ESCAPE && this.keyEvent.esc;
  };

  /**
   * 是否按下 Q
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isQ = (e: KeyboardEvent) => {
    return e.code === code.KEY_Q;
  };

  /**
   * 是否按下 W
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isW = (e: KeyboardEvent) => {
    return e.code === code.KEY_W;
  };

  /**
   * 是否按下 Delete 或者 Backpsace
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isDelete = (e: KeyboardEvent) => {
    return (
      (e.code === code.BACKSPACE || e.code === code.DELETE) && this.keyEvent.del
    );
  };

  /**
   * 是否按下 Arrow
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isArrow = (e: KeyboardEvent) => {
    return e.code.includes("Arrow") && this.keyEvent.move;
  };

  /**
   * 是否按下 Ctrl + A
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isCtrlA = (e: KeyboardEvent) => {
    return (
      (e.ctrlKey || e.metaKey) && e.code === code.KEY_A && this.keyEvent.all
    );
  };

  /**
   * 是否按下 Ctrl + C
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isCtrlC = (e: KeyboardEvent) => {
    return (
      (e.ctrlKey || e.metaKey) && e.code === code.KEY_C && this.keyEvent.copy
    );
  };

  /**
   * 是否按下 Ctrl + V
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isCtrlV = (e: KeyboardEvent) => {
    return (
      (e.ctrlKey || e.metaKey) && e.code === code.KEY_V && this.keyEvent.paste
    );
  };

  /**
   * 是否按下 Ctrl + Z
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isCtrlZ = (e: KeyboardEvent) => {
    return (
      (e.ctrlKey || e.metaKey) &&
      e.code === code.KEY_Z &&
      this.keyEvent.transaction
    );
  };

  /**
   * 是否按下 Ctrl + Y
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isCtrlY = (e: KeyboardEvent) => {
    return (
      (e.ctrlKey || e.metaKey) &&
      e.code === code.KEY_Y &&
      this.keyEvent.transaction
    );
  };

  /**
   * 是否按下 Plus Or Equal
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isPlus = (e: KeyboardEvent) => {
    return e.code === code.EQUAL && this.keyEvent.zoom;
  };

  /**
   * 是否按下 Minus
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isMinus = (e: KeyboardEvent) => {
    return e.code === code.MINUS && this.keyEvent.zoom;
  };

  /**
   * 是否按下 O
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isO = (e: KeyboardEvent) => {
    return e.code === code.KEY_O && this.keyEvent.zoom;
  };

  /**
   * 是否按下 P
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isP = (e: KeyboardEvent) => {
    return e.code === code.KEY_P && this.keyEvent.zoom;
  };

  /**
   * 是否按下 Ctrl + X
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public isCtrlX = (e: KeyboardEvent) => {
    return (
      (e.ctrlKey || e.metaKey) && e.code === code.KEY_X && this.keyEvent.cut
    );
  };
}

export default ShortCutHandler;
