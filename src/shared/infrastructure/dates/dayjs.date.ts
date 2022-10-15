import dayjs, { ManipulateType } from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IDates } from "@/shared/domain/dates/dates.interface";

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

export type dateType = ManipulateType;

export class DayJS implements IDates<ManipulateType> {
  private static instance: DayJS | undefined;

  private constructor() {}

  static getInstance() {
    if (DayJS.instance) return DayJS.instance;

    DayJS.instance = new DayJS();

    return DayJS.instance;
  }

  getData(numberToAsign: number, dateType: ManipulateType): number {
    return dayjs().add(numberToAsign, dateType).unix();
  }
}
