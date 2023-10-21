import { useQuery } from '@apollo/client'
import { ALL_BOOKS, USER } from '../queries'
import { useState, useEffect } from 'react'

const UserRecs = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS, { variables: { genre: genre }})
  const user = useQuery(USER, {skip: !localStorage.getItem('library-user-token')} ,)

  //fetch user's favorite at the start
  useEffect(() => { 
    if (!user.loading && user.data ) {
      const favgenre = user.data.me.favoriteGenre
      setGenre(favgenre)
    }
  }, [user])
  

  if (!props.show) {
    return null
  }
  if (result.loading)  {
    return <div>loading...</div>
  }
 
  const books = result.data.allBooks
  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{genre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserRecs