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

/**
 * Service class for calculating up and down casts from pressure data.
 */
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

  /**
   * Executes the calculation of up and down casts.
   *
   * @param {DataPoint[]} data - The array of data points to process.
   * @returns {CastData} - The resulting cast data.
   */
  execute(data: DataPoint[]): CastData {
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

  /**
   * Calculates the averaged vertical speed for the data points.
   *
   * @param {DataPoint[]} data - The array of data points to process.
   */
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
        1000; // Convert to seconds

      this.data[i].speed_down_av = dt > 0 ? dDepth / dt : 0; // Avoid division by zero
      this.data[i].depth = Number(getDepthFromPressure(this.data[i]?.pressure).val);
    }
  }

  /**
   * Compares the averaged vertical speed to the threshold and sets flags.
   */
  private compareSpeedToThreshold(): void {
    this.data.forEach((point) => {
      point.threshold_exceeded_down = (point.speed_down_av || 0) > this.threshold;
      point.threshold_exceeded_up = (point.speed_down_av || 0) < -this.threshold;
    });
  }

  /**
   * Retrieves the exceeded down casts.
   *
   * @returns {Cast[]} - The array of exceeded down casts.
   */
  private getExceededDownCasts(): Cast[] {
    return this.getExceededCasts("threshold_exceeded_down");
  }

  /**
   * Retrieves the exceeded up casts.
   *
   * @returns {Cast[]} - The array of exceeded up casts.
   */
  private getExceededUpCasts(): Cast[] {
    return this.getExceededCasts("threshold_exceeded_up");
  }

  /**
   * Retrieves the exceeded casts based on the given condition key.
   *
   * @param {"threshold_exceeded_down" | "threshold_exceeded_up"} conditionKey - The key to check the condition.
   * @returns {Cast[]} - The array of exceeded casts.
   */
  private getExceededCasts(conditionKey: "threshold_exceeded_down" | "threshold_exceeded_up"): Cast[] {
    return this.data.reduce((acc: Cast[], point: DataPoint, index: number) => {
      if (point[conditionKey]) {
        acc.push({ index, point });
      }
      return acc;
    }, []);
  }

  /**
   * Finds the longest cast in the given array of casts.
   *
   * @param {Cast[]} cast - The array of casts to search.
   * @returns {[number, number]} - The start and end index of the longest cast.
   */
  private findLongestCast(cast: Cast[]): [number, number] {
    let maxLength = 0;
    let currentLength = 1;
    let startIndex = 0;
    let endIndex = 0;
    const castLength = cast.length;

    for (let i = 1; i < cast.length; i++) {
      if (cast?.[i]?.index - cast?.[i - 1]?.index === 1) {
        currentLength++;
      } else {
        if (currentLength > maxLength) {
          maxLength = currentLength;
          endIndex = cast?.[i - 1]?.index;
          startIndex = cast?.[i - currentLength]?.index;
        }
        currentLength = 1;
      }
    }

    if (currentLength > maxLength) {
      maxLength = currentLength;
      endIndex = cast?.[castLength - 1]?.index;
      startIndex = cast?.[castLength - currentLength]?.index;
    }
    return [startIndex, endIndex];
  }

  /**
   * Finds all consecutive casts in the given array of casts.
   *
   * @param {Cast[]} casts - The array of casts to search.
   * @returns {IndexRange[]} - The array of index ranges for consecutive casts.
   */
  private findAllConsecutiveCasts(casts: Cast[]): IndexRange[] {
    const sequences: IndexRange[] = [];
    let currentStartIndex = casts.length > 0 ? casts[0]?.index : 0;
    let currentLength = casts.length > 0 ? 1 : 0;

    for (let i = 1; i < casts.length; i++) {
      if (casts[i]?.index - casts[i - 1]?.index === 1) {
        currentLength++;
      } else {
        if (currentLength > 0) {
          sequences.push({
            start: casts[i - currentLength]?.index,
            end: casts[i - 1]?.index,
            length: currentLength,
          });
        }
        currentStartIndex = casts[i]?.index;
        currentLength = 1;
      }
    }

    if (currentLength > 0) {
      sequences.push({
        start: casts[casts.length - currentLength]?.index,
        end: casts[casts.length - 1]?.index,
        length: currentLength,
      });
    }

    return sequences;
  }

  /**
   * Determines the boundaries of the casts.
   *
   * @param {number} downStartIndex - The start index of the down cast.
   * @param {number} downEndIndex - The end index of the down cast.
   * @param {number} upStartIndex - The start index of the up cast.
   * @param {number} upEndIndex - The end index of the up cast.
   * @returns {Object} - An object containing the indices of the casts.
   */
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

  /**
   * Calculates the averaged vertical speed for plotting purposes.
   */
  private calculateAveragedVerticalSpeedForPlotting(): void {
    for (let i = 0; i < this.data.length; i++) {
      const iBegin = Math.max(i - this.windowHalfSize, 0);
      const iEnd = Math.min(i + this.windowHalfSize, this.data.length - 1);

      const dDepth = this.data[iEnd]?.pressure - this.data[iBegin]?.pressure;
      const dt =
        (new Date(this.data[iEnd]?.measuring_time).getTime() - new Date(this.data[iBegin]?.measuring_time).getTime()) /
        1000; // Convert to seconds

      this.data[i].speed_down_av = dt > 0 ? dDepth / dt : 0; // Avoid division by zero
    }
  }

  /**
   * Calculates the vertical speed for the data points.
   */
  private calculateVerticalSpeed(): void {
    for (let i = 0; i < this.data.length - 1; i++) {
      const dDepth = this.data[i + 1]?.pressure - this.data[i]?.pressure;
      const dt =
        (new Date(this.data[i + 1]?.measuring_time).getTime() - new Date(this.data[i]?.measuring_time).getTime()) /
        1000;

      this.data[i].speed_down = dt > 0 ? dDepth / dt : 0; // Avoid division by zero
    }

    if (this.data.length > 0) {
      this.data[this.data.length - 1].speed_down = this.data[this.data.length - 2]?.speed_down || 0;
    }
  }

  /**
   * Sets the threshold value.
   *
   * @param {number} threshold - The new threshold value.
   */
  set threshold(threshold: number) {
    this._threshold = threshold;
  }

  /**
   * Gets the threshold value.
   *
   * @returns {number} - The current threshold value.
   */
  get threshold(): number {
    return this._threshold;
  }

  /**
   * Sets the window half size value.
   *
   * @param {number} windowHalfSize - The new window half size value.
   */
  set windowHalfSize(windowHalfSize: number) {
    this._windowHalfSize = windowHalfSize;
  }

  /**
   * Gets the window half size value.
   *
   * @returns {number} - The current window half size value.
   */
  get windowHalfSize(): number {
    return this._windowHalfSize;
  }
}
