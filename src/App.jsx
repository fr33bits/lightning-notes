import './App.css' // somehow styles from other CSS files are also availible
import './styles/Global.css'

import { Auth } from './components/Auth.jsx'
import { Loading } from './components/Loading.jsx'
import { SignedIn } from './components/SignedIn.jsx'

import { useUser } from './context/UserContext.js'

import Cookies from 'universal-cookie'
const cookies = new Cookies()

function App() {
  const { user, loading } = useUser()
  
  let view
  if (loading) {
    // console.log("APP: loading...")
    view = <Loading/>;
  } else if (!user) {
    // console.log("APP: UserContext not set")
    view = <Auth/>
  } else {
    // console.log("APP: UserContext set", user)
    view = <SignedIn/>
  }

  return (
    <div className="App">
      {view}
    </div>
  )
}

export default App;
