import { Fragment, act, useEffect, useState } from 'react'
import './styles.css'
import axios from 'axios'
import { Container } from 'semantic-ui-react'
import { Activity } from '../models/activity'
import NavBar from './NavBar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import {v4 as uuid} from 'uuid'

function App() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity]= useState<Activity | undefined>(undefined)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    axios.get<Activity[]>("http://localhost:5000/api/activities")
    .then(res => {
      setActivities(res.data)
    })
  }, [])

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
    activity.id ? 
      setActivities([...activities.filter(x => x.id !== activity.id), activity]) :
      setActivities([...activities, {...activity, id: uuid()}])
    setEditMode(false)
    setSelectedActivity(activity)
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(x => x.id !== id)])
  }

  return (
    <Fragment>
      <NavBar openForm={handleOpenForm}/>
      <Container style={{marginTop: '7em'}}/>
      <ActivityDashboard activities={activities} selectedActivity={selectedActivity} selectActivity={selectActivityHandle} cancelSelectActivity={cancelSelectActivity} openForm={handleOpenForm} closeForm={handleCloseForm} editMode={editMode} createOrEdit={handleCreateOrEditForm} deleteActivity={handleDeleteActivity}/>
    </Fragment>
  )
}

export default App
