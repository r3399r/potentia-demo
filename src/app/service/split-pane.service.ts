import { Injectable } from '@angular/core';

@Injectable()
export class SplitPaneService {
  private disable: boolean;

  constructor() {
    this.disable = true;
  }

  public getDisableStatus(): boolean {
    return this.disable;
  }

  public setDisable(status: boolean): void {
    this.disable = status;
  }
}
