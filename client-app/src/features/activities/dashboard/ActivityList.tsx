import React, { SyntheticEvent, useState } from "react"
import { Activity } from "../../../app/models/activity"
import { Button, Item, Label, Segment } from "semantic-ui-react"
import { useStore } from "../../../app/stores/store"

interface Props {
  activities: Activity[]
  deleteActivity: (id: string) => void
}

export default function ActivityList({ activities, deleteActivity } : Props) {
  const { activityStore } = useStore()
  const { selectActivity, loading } = activityStore

  const [target, setTarget] = useState("")
  const handleDeleteAction = (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setTarget(e.currentTarget.name)
    deleteActivity(id)
  } 
  
  return (
    <Segment style={{marginLeft: "20px"}}>
      <Item.Group divided>
        {activities.map(activity => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as='a'>{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>{activity.city}, {activity.venue}</div>
              </Item.Description>
              <Item.Extra>
                <Button onClick={() => selectActivity(activity.id)} floated="right" color="blue" content="View"/>
                <Button loading={loading && target === activity.id} 
                        name={activity.id}
                        onClick={(e) => 
                          handleDeleteAction(e, activity.id)} 
                          floated="right" 
                          color="red" 
                          content="Delete"/>
                <Label content={activity.category}/>
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  )
}