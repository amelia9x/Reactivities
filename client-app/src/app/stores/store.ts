import { createContext, useContext } from "react";
import AcitivtyStore from "./activityStore";
import CommonStore from "./commonStore";

interface Store {
  activityStore: AcitivtyStore,
  commonStore: CommonStore
}

export const store: Store = {
  activityStore: new AcitivtyStore(),
  commonStore: new CommonStore()
}

export const StoreContext = createContext(store)

export function useStore() {
  return useContext(StoreContext)
}