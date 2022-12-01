import { RequireContext } from '@/shared/infrastructure/auto-files/require.context';
import { IAutoFiles } from '@/shared/domain/auto-files/auto.files.interface';

export const RequireService: IAutoFiles<any> = new RequireContext();
