import { XsPropsAction } from '../util';
import { XsStoreErrorPayload } from './xs-store.payloads';

export interface XsStoreActions {
  error: XsPropsAction<XsStoreErrorPayload>;
}
