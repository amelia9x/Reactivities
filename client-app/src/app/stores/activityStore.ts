import { makeAutoObservable, runInAction } from "mobx"
import { Activity } from "../models/activity"
import agent from "../api/agent"
import {v4 as uuid} from 'uuid'

export default class AcitivtyStore {
  activityRegistry: Map<string, Activity> = new Map()
  initialLoading: boolean = true
  loading: boolean = false
  selectedActivity : Activity | undefined = undefined
  editMode = false

  constructor() {
    makeAutoObservable(this)
  }

  get activitiesByDate () {
    return Array.from(this.activityRegistry.values())
      .sort((a: Activity, b: Activity) => Date.parse(a.date) - Date.parse(b.date))
  }

  loadActivities = async () => {
    this.setInitialLoading(true)
    try {
      let result = await agent.Activities.list()

      result.forEach(activity => {
        this.setActivity(activity)
      })
    } catch (err) {
      console.log(err)
    } finally {
      this.setInitialLoading(false)
    }
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id)
    if(activity) this.selectedActivity = activity
    else {
      this.setInitialLoading(true)
      try {
        activity = await agent.Activities.getActivity(id)
        this.setActivity(activity)
        this.selectedActivity = activity
        this.setInitialLoading(false)
      } catch (err) {
        console.log(err)
        this.setInitialLoading(false)
      }
    }
  }

  private setActivity(activity: Activity) {
    activity.date = activity.date.split("T")[0]
    this.activityRegistry.set(activity.id, activity)
  }

  private getActivity(id: string) {
    return this.activityRegistry.get(id)
  }

  setInitialLoading = (state: boolean) => {
    this.initialLoading = state
  }


  createActivity = async (activity: Activity) => {
    this.loading = true
    activity.date = new Date(activity.date).toISOString()
    activity.id = uuid()

    try {
      await agent.Activities.create(activity)
      runInAction(() => {
        // this.activities = [...this.activities, activity]
        activity.date = activity.date.split("T")[0]
        this.activityRegistry.set(activity.id, activity)
        this.editMode = false
        this.selectedActivity = activity
        this.loading = false
      })
    } catch (err) {
      console.log(err)
      runInAction(() => {
        this.loading = false
      })
    }
  }

  editActivity = async (activity: Activity) => {
    this.loading = true
    activity.date = new Date(activity.date).toISOString()

    try {
      await agent.Activities.edit(activity)
      runInAction(() => {
        activity.date = activity.date.split("T")[0]
        this.activityRegistry.set(activity.id, activity)
        this.editMode = false
        this.selectedActivity = activity
        this.loading = false
      })
    } catch (err) {
      console.log(err)
      runInAction(() => {
        this.loading = false
      })
    }
  }

  deleteActivity = async (id: string) => {
    this.loading = true
    try {
      await agent.Activities.delete(id)
      runInAction(() => {
        this.activityRegistry.delete(id)
        this.loading = false
      })
    } catch (err) {
      console.log(err)
      runInAction(() => {
        this.loading = false
      })
    }
  }
  
}