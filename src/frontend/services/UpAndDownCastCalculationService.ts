import { getDepthFromPressure } from "../utils";

export interface DataPoint {
  pressure: number;
  measuring_time: Date;
  speed_down_av?: number;
  speed_down?: number;
  threshold_exceeded_down?: boolean;
  threshold_exceeded_up?: boolean;
  depth: number;
  value: string;
}
interface IndexRange {
  start: number;
  end: number;
  length: number;
}
interface Cast {
  point: DataPoint;
  index: number;
}
export interface CastData {
  data: DataPoint[];
  downStartIndex: number;
  downEndIndex: number;
  upStartIndex: number;
  upEndIndex: number;
}

export class UpAndDownCastCalculationService {
  private _threshold: number;
  private _windowHalfSize: number;
  downcastsIndexes: IndexRange[] = [];
  upcastsIndexes: IndexRange[] = [];
  data: DataPoint[] = [];

  constructor(threshold: number, windowHalfSize: number) {
    this._threshold = threshold;
    this._windowHalfSize = windowHalfSize;
  }

  execute(data: DataPoint[]) {
    this.calculateAveragedVerticalSpeed(data);
    this.compareSpeedToThreshold();
    const downCastsExeeded = this.getExceededDownCasts();
    const upCastsExeeded = this.getExceededUpCasts();
    const [downStartIndex, downEndIndex] = this.findLongestCast(downCastsExeeded);
    const [upStartIndex, upEndIndex] = this.findLongestCast(upCastsExeeded);
    this.upcastsIndexes = this.findAllConsecutiveCasts(upCastsExeeded);
    this.downcastsIndexes = this.findAllConsecutiveCasts(downCastsExeeded);
    this.determineCastsBoundaries(downStartIndex, downEndIndex, upStartIndex, upEndIndex);
    this.calculateAveragedVerticalSpeedForPlotting();
    this.calculateVerticalSpeed();

    return {
      data: this.data,
      downStartIndex: downStartIndex,
      downEndIndex: downEndIndex,
      upStartIndex: upStartIndex,
      upEndIndex: upEndIndex,
    };
  }

  private calculateAveragedVerticalSpeed(data: DataPoint[]): void {
    this.data = data;
    for (let i = 0; i < this.data.length; i++) {
      const iBegin = Math.max(i - this.windowHalfSize, 0);
      const iEnd = Math.min(i + this.windowHalfSize, this.data.length - 1);
      const endDepth = getDepthFromPressure(Number(this.data[iEnd]?.pressure)).val;
      const beginDepth = getDepthFromPressure(Number(this.data[iBegin]?.pressure)).val;
      const dDepth = Number(endDepth) - Number(beginDepth);

      const dt =
        (new Date(this.data[iEnd]?.measuring_time).getTime() - new Date(this.data[iBegin]?.measuring_time).getTime()) /
        1000; // Umwandlung in Sekunden

      this.data[i].speed_down_av = dt > 0 ? dDepth / dt : 0; // Vermeiden Division durch Null
      this.data[i].depth = Number(getDepthFromPressure(this.data[i]?.pressure).val);
    }
  }

  private compareSpeedToThreshold(): void {
    this.data.forEach((point) => {
      point.threshold_exceeded_down = (point.speed_down_av || 0) > this.threshold;
      point.threshold_exceeded_up = (point.speed_down_av || 0) < -this.threshold;
    });
  }

  private getExceededDownCasts() {
    return this.getExceededCasts("threshold_exceeded_down");
  }

  private getExceededUpCasts() {
    return this.getExceededCasts("threshold_exceeded_up");
  }

  private getExceededCasts(conditionKey: "threshold_exceeded_down" | "threshold_exceeded_up"): Cast[] {
    return this.data.reduce((acc: Cast[], point: DataPoint, index: number) => {
      if (point[conditionKey]) {
        acc.push({ index, point });
      }
      return acc;
    }, []);
  }

  private findLongestCast(cast: Cast[]) {
    let maxLength = 0;
    let currentLength = 1;
    let startIndex = 0;
    let endIndex = 0;
    const castLength = cast.length;

    // Starte von dem zweiten Element, da wir das aktuelle Element mit dem vorherigen vergleichen
    for (let i = 1; i < cast.length; i++) {
      // Überprüfe, ob die aktuelle Sequenz fortgesetzt wird
      if (cast?.[i]?.index - cast?.[i - 1]?.index === 1) {
        currentLength++;
      } else {
        // Überprüfe, ob die aktuelle Sequenz die längste ist
        if (currentLength > maxLength) {
          maxLength = currentLength;
          endIndex = cast?.[i - 1]?.index; // Ende der längsten Sequenz
          startIndex = cast?.[i - currentLength]?.index; // Anfang der längsten Sequenz
        }
        // Starte die Zählung einer neuen Sequenz
        currentLength = 1;
      }
    }

    // Überprüfe am Ende noch einmal, ob die letzte Sequenz die längste war
    if (currentLength > maxLength) {
      maxLength = currentLength;
      endIndex = cast?.[castLength - 1]?.index;
      startIndex = cast?.[castLength - currentLength]?.index;
    }
    return [startIndex, endIndex];
  }

  private findAllConsecutiveCasts(casts: Cast[]): IndexRange[] {
    const sequences: IndexRange[] = [];
    let currentStartIndex = casts.length > 0 ? casts[0]?.index : 0;
    let currentLength = casts.length > 0 ? 1 : 0;

    // Starte von dem zweiten Element, da wir das aktuelle Element mit dem vorherigen vergleichen
    for (let i = 1; i < casts.length; i++) {
      // Überprüfe, ob die aktuelle Sequenz fortgesetzt wird
      if (casts[i]?.index - casts[i - 1]?.index === 1) {
        currentLength++;
      } else {
        // Speichere die aktuelle Sequenz, wenn sie beendet ist
        if (currentLength > 0) {
          sequences.push({
            start: casts[i - currentLength]?.index,
            end: casts[i - 1]?.index,
            length: currentLength,
          });
        }
        // Starte die Zählung einer neuen Sequenz
        currentStartIndex = casts[i]?.index;
        currentLength = 1;
      }
    }

    // Überprüfe am Ende noch einmal, ob eine Sequenz im Gang ist
    if (currentLength > 0) {
      sequences.push({
        start: casts[casts.length - currentLength]?.index,
        end: casts[casts.length - 1]?.index,
        length: currentLength,
      });
    }

    return sequences;
  }

  private determineCastsBoundaries(
    downStartIndex: number,
    downEndIndex: number,
    upStartIndex: number,
    upEndIndex: number
  ): {
    i_down: number;
    i_down_end: number;
    i_up: number;
    i_up_end: number;
  } {
    let i_down: number, i_down_end: number, i_up: number, i_up_end: number;

    if (this.downcastsIndexes.length > 0) {
      i_down = downStartIndex;
      i_down_end = downEndIndex;
    } else {
      i_down = 0;
      i_down_end = Math.round(this.data.length / 2);
    }

    if (this.upcastsIndexes.length > 0) {
      i_up = upStartIndex;
      i_up_end = upEndIndex;
    } else {
      i_up = Math.round(this.data.length / 2) + 1;
      i_up_end = this.data.length - 1;
    }

    return { i_down, i_down_end, i_up, i_up_end };
  }

  private calculateAveragedVerticalSpeedForPlotting(): void {
    for (let i = 0; i < this.data.length; i++) {
      const iBegin = Math.max(i - this.windowHalfSize, 0);
      const iEnd = Math.min(i + this.windowHalfSize, this.data.length - 1);

      const dDepth = this.data[iEnd]?.pressure - this.data[iBegin]?.pressure;
      const dt =
        (new Date(this.data[iEnd]?.measuring_time).getTime() - new Date(this.data[iBegin]?.measuring_time).getTime()) /
        1000; // Umwandlung in Sekunden

      this.data[i].speed_down_av = dt > 0 ? dDepth / dt : 0; // Vermeiden Sie Division durch Null
    }
  }

  private calculateVerticalSpeed(): void {
    for (let i = 0; i < this.data.length - 1; i++) {
      // Beachte, dass wir hier bis length - 1 gehen
      const dDepth = this.data[i + 1]?.pressure - this.data[i]?.pressure;
      const dt =
        (new Date(this.data[i + 1]?.measuring_time).getTime() - new Date(this.data[i]?.measuring_time).getTime()) /
        1000;

      this.data[i].speed_down = dt > 0 ? dDepth / dt : 0; // Vermeiden Sie Division durch Null
    }
    // Hinweis: Das letzte Element bekommt keinen 'speed_down' Wert, da es keinen nächsten Punkt gibt.
    // Du könntest entscheiden, es auf 0 zu setzen, den vorherigen Wert zu kopieren oder es undefiniert zu lassen.
    if (this.data.length > 0) {
      this.data[this.data.length - 1].speed_down = this.data[this.data.length - 2]?.speed_down || 0;
    }
  }

  set threshold(threshold: number) {
    this._threshold = threshold;
  }

  get threshold(): number {
    return this._threshold;
  }

  set windowHalfSize(windowHalfSize: number) {
    this._windowHalfSize = windowHalfSize;
  }

  get windowHalfSize(): number {
    return this._windowHalfSize;
  }
}
