import { useState, useEffect } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import UserRecs from './components/UserRecs'
import { BOOK_ADDED } from './queries'
import { ALL_BOOKS } from './queries'

const App = () => {
  const result = useQuery(ALL_BOOKS)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  
  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.resetStore()
    setPage('books')
  }
  
  useEffect(() => { //logged in view stays after updating the page
    if (!token ) {
      setToken(localStorage.getItem('library-user-token'))  
    }
  }, [token])

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recs')}>recommended</button>}
        {token && <button onClick={logout}>logout</button>} 
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} />

      <UserRecs show={page === 'recs'}/>

    </div>
  )
}

export default App