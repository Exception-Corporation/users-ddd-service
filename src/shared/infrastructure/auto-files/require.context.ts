import { IAutoFiles } from "@/shared/domain/interfaces/auto.files.interface";
import { importAll } from "@/shared/infrastructure/utils/import.all";

const autoLoad = require("require-context");

export class RequireContext implements IAutoFiles<any> {
  getFiles(directory: string, useSubdirectories: boolean, regExp: RegExp) {
    return importAll(autoLoad(directory, useSubdirectories, regExp));
  }
}
