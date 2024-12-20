import { makeAutoObservable, runInAction } from "mobx"
import { Activity } from "../models/activity"
import agent from "../api/agent"
import {v4 as uuid} from 'uuid'
import { format } from "date-fns"

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
      .sort((a: Activity, b: Activity) => a.date!.getTime() - b.date!.getTime())
  }

  get groupedActivities() {
    return Object.entries(this.activitiesByDate.reduce((activities, activity) => {
      // let date = activity.date!.toISOString().split("T")[0];
      let date = format(activity.date!, 'dd MMM yyyy');
      activities[date] = activities[date] ? [...activities[date], activity] : [activity]
      return activities
    }, {} as {[key: string]: Activity[]}))
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
    if(activity) {
      this.selectedActivity = activity
      return activity
    }
    else {
      this.setInitialLoading(true)
      try {
        activity = await agent.Activities.getActivity(id)
        this.setActivity(activity)
        this.selectedActivity = activity
        this.setInitialLoading(false)
        return activity
      } catch (err) {
        console.log(err)
        this.setInitialLoading(false)
      }
    }
  }

  private setActivity(activity: Activity) {
    activity.date = new Date(activity.date!)
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
    // activity.date = new Date(activity.date).toISOString()
    activity.id = uuid()

    try {
      await agent.Activities.create(activity)
      runInAction(() => {
        // this.activities = [...this.activities, activity]
        // activity.date = activity.date.split("T")[0]
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
    // activity.date = activity.date.toISOString()

    try {
      await agent.Activities.edit(activity)
      runInAction(() => {
        // activity.date = activity.date.split("T")[0]
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