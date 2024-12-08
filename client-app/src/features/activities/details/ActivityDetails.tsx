import { Button, Card, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

export default observer (function ActivityDetails() {
  const { activityStore } = useStore()
  const {selectedActivity : activity, initialLoading, loadActivity} = activityStore

  const {id} = useParams()

  useEffect(() => {
    if(id) loadActivity(id)
  }, [id, loadActivity])

  if(initialLoading || !activity) return <></>

  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date}</span>
        </Card.Meta>
        <Card.Description>
          {activity.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <Button as={Link} to={`/manage/${activity.id}`} basic color="blue" content="Edit"/>
          <Button as={Link} to='/activities' basic color="grey" content="Cancel"/>
        </Button.Group>
      </Card.Content>
    </Card>
  )
})