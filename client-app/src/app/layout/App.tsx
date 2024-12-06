import { Fragment, useEffect, useState } from 'react'
import './styles.css'
import { Button, Container } from 'semantic-ui-react'
import { Activity } from '../models/activity'
import NavBar from './NavBar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import {v4 as uuid} from 'uuid'
import agent from '../api/agent'
import LoadingComponent from './LoadingComponent'
import { useStore } from '../stores/store'
import { observer } from 'mobx-react-lite'

function App() {
  const {activityStore} = useStore();

  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity]= useState<Activity | undefined>(undefined)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    activityStore.loadActivities()
  }, [activityStore])

  const selectActivityHandle = (id: string) => {
    setSelectedActivity(activities.find(activity => activity.id === id));
  }
  const cancelSelectActivity = () => setSelectedActivity(undefined);
  const handleOpenForm = (id?: string) => {
    id ? setEditMode(true) : cancelSelectActivity()
  }

  const handleCloseForm = () => {
    setEditMode(false)
  }

  const handleCreateOrEditForm = (activity: Activity) => {
    setSubmitting(true)
    activity.date = new Date(activity.date).toISOString()
    if(activity.id) {
      agent.Activities.edit(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        setEditMode(false)
        setSelectedActivity(activity)
        setSubmitting(false)
      })
    } else {
      activity.id = uuid()
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity])
        setEditMode(false)
        setSelectedActivity(activity)
        setSubmitting(false)
      })
    }
  }

  const handleDeleteActivity = (id: string) => {
    setSubmitting(true)
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false)
    })
  }

  if(activityStore.initialLoading) return <LoadingComponent content='Loading app'/>

  return (
    <Fragment>
      <NavBar openForm={handleOpenForm}/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard activities={activityStore.activities} selectedActivity={selectedActivity} selectActivity={selectActivityHandle} cancelSelectActivity={cancelSelectActivity} openForm={handleOpenForm} closeForm={handleCloseForm} editMode={editMode} createOrEdit={handleCreateOrEditForm} deleteActivity={handleDeleteActivity} submitting={submitting}/>
      </Container>
    </Fragment>
  )
}

export default observer(App)
