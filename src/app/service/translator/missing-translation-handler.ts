import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

export class UnknownError implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return params.translateService.stream('ERR_UNKNOWN_ERROR_HAS_OCCURED');
  }
}
