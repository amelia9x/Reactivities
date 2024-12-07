import { Fragment, useEffect, useState } from 'react'
import './styles.css'
import { Container } from 'semantic-ui-react'
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
  const { loadActivities } = activityStore

  const [activities, setActivities] = useState<Activity[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    activityStore.loadActivities()
  }, [activityStore])

  const handleDeleteActivity = (id: string) => {
    setSubmitting(true)
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false)
    })
  }

  if(activityStore.loading) return <LoadingComponent content='Loading app'/>

  return (
    <Fragment>
      <NavBar/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard activities={activityStore.activities} deleteActivity={handleDeleteActivity}/>
      </Container>
    </Fragment>
  )
}

export default observer(App)
