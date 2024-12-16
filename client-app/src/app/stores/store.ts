import { createContext, useContext } from "react";
import AcitivtyStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";

interface Store {
  activityStore: AcitivtyStore,
  commonStore: CommonStore,
  userStore: UserStore
}

export const store: Store = {
  activityStore: new AcitivtyStore(),
  commonStore: new CommonStore(),
  userStore: new UserStore()
}

export const StoreContext = createContext(store)

export function useStore() {
  return useContext(StoreContext)
}