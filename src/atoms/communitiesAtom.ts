import { atom } from 'recoil';

export interface communityState {
  open: boolean;
  view: ModalView;
}
export type ModalView = 'login' | 'signup' | 'resetPassword';

const defaultModalState: communityState = {
  open: false,
  view: 'login',
};

export const communityState = atom<communityState>({
  key: 'communityState',
  default: defaultModalState,
});
