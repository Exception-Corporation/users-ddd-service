import { IDates } from '@/shared/domain/dates/dates.interface';
import { DayJS, dateType } from '@/shared/infrastructure/dates/dayjs.date';

export const DateLib: IDates<dateType> = DayJS.getInstance();
