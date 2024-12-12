import { Fragment } from 'react'
import './styles.css'
import { Container } from 'semantic-ui-react'
import NavBar from './NavBar'
import { observer } from 'mobx-react-lite'
import { Outlet, useLocation } from 'react-router-dom'
import HomePage from './HomePage'
import { ToastContainer } from 'react-toastify'

function App() {
  const location = useLocation()

  return (
    <Fragment>
      <ToastContainer position='bottom-right'/>
      {location.pathname === '/' ? <HomePage/> : (
        <>
          <NavBar/>
          <Container style={{marginTop: '7em'}}>
            <Outlet/>
          </Container>
        </>
      )}
    </Fragment>
  )
}

export default observer(App)
