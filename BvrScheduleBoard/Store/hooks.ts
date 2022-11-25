import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDespatch, RootState } from './store';

export const useAppDispatch: () => AppDespatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
