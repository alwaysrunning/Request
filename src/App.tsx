import { useState } from 'react'
import  { useRequest } from './components/hook/useRequest'

function App() {
  const [user, setUser] = useState([])
  const [{data, loading, error }, getUsers] = useRequest(
    {
      url: 'https://reqres.in/api/users',
    },
    {
      manual: true
    }
  )

  const onGetUsers = async () => {
    const res = await getUsers({
      params: { page: 1 },
    })
    setUser(res.data)
  }

  return (
    <div>
      <button onClick={() => {onGetUsers()}}>load more</button>
      { !!user.length && JSON.stringify(user, null,2) }
    </div>
  )
}

export default App