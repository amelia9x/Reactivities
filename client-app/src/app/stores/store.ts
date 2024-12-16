import { createContext, useContext } from "react";
import AcitivtyStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";

interface Store {
  activityStore: AcitivtyStore,
  commonStore: CommonStore,
  userStore: UserStore,
  modalStore: ModalStore
}

export const store: Store = {
  activityStore: new AcitivtyStore(),
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  modalStore: new ModalStore()
}

export const StoreContext = createContext(store)

export function useStore() {
  return useContext(StoreContext)
}