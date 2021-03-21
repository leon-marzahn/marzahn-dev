import { produceOn } from '@marzahn-dev/ngrx-xs';
import { createAction } from '@ngrx/store';

describe('ProduceOn', () => {
  it('should produce on', () => {
    const testAction = createAction('test');
    const reducer = produceOn(testAction, draft => draft = true);
    expect(reducer.reducer(false, testAction)).toEqual(true);
  });
});
