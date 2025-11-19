import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import profileReducer from '@/app/store/profileSlice'
import publicProfileReducer from '@/app/store/publicProfileSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    publicProfile: publicProfileReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
