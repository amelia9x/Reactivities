import { makeAutoObservable, runInAction } from "mobx"
import { Activity } from "../models/activity"
import agent from "../api/agent"
import {v4 as uuid} from 'uuid'

export default class AcitivtyStore {
  activities: Activity[] = []
  initialLoading: boolean = false
  loading: boolean = false
  selectedActivity : Activity | undefined = undefined
  editMode = false

  constructor() {
    makeAutoObservable(this)
  }

  loadActivities = async () => {
    this.setInitialLoading(true)
    try {
      let result = await agent.Activities.list()
      console.log("result", result)
      // runInAction(() => {
      //   result.forEach(activity => {
      //     activity.date = activity.date.split("T")[0]
      //     // this.activities.push(activity)
      //     console.log("After", this.activities)
      //   })
      //   this.activities = result
      // })

      result.forEach(activity => {
        activity.date = activity.date.split("T")[0]
        console.log("After", this.activities)
      })
      this.activities = result
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
    this.selectedActivity = this.activities.find(x => x.id === id)
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
        this.activities = [...this.activities, activity]
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
        this.activities = [...this.activities.filter(x => x.id !== activity.id), activity]
        // this.activities.filter(x => x.id !== activity.id)
        // this.activities.push(activity)
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
        this.activities = [...this.activities.filter(x => x.id !== id)]
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