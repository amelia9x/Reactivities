import { action, makeAutoObservable, makeObservable, observable } from "mobx"
import { Activity } from "../models/activity"
import agent from "../api/agent"

export default class AcitivtyStore {
  activities: Activity[] = []
  initialLoading: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  loadActivities = async () => {
    this.setInitialLoading(true)
    try {
      let activities = await agent.Activities.list()
      activities.forEach(activity => {
        activity.date = activity.date.split("T")[0]
        this.activities.push(activity)
      })
    } catch (err) {
      console.log(err)
    } finally {
      this.setInitialLoading(false)
    }
  }

  setInitialLoading = (state: boolean) => {
    this.initialLoading = state
  }
}