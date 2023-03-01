import { Spinner, SpinnerSize } from '@fluentui/react';
import * as React from 'react';

export const BoardSpinner: React.FunctionComponent = () =>
  <div className='bvrBoard_Loading'>
    <Spinner size={SpinnerSize.large} />
    <p className='loadingText'>  Loading ...</p>
  </div>;
