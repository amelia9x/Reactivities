import { makeAutoObservable, runInAction } from "mobx"
import { Activity } from "../models/activity"
import agent from "../api/agent"
import {v4 as uuid} from 'uuid'

export default class AcitivtyStore {
  activityRegistry: Map<string, Activity> = new Map()
  initialLoading: boolean = false
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
        activity.date = activity.date.split("T")[0]
        this.activityRegistry.set(activity.id, activity)
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

  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id)
  }

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined
  }

  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectedActivity()
    this.editMode = true
  }

  closeForm = () => {
    this.editMode = false
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
        if(this.selectedActivity?.id === id) this.cancelSelectedActivity()
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