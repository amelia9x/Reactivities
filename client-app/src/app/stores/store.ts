import { createContext, useContext } from "react";
import AcitivtyStore from "./activityStore";

interface Store {
  activityStore: AcitivtyStore
}

export const store: Store = {
  activityStore: new AcitivtyStore()
}

export const StoreContext = createContext(store)

export function useStore() {
  return useContext(StoreContext)
}