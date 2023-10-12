import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState, useEffect } from 'react'

const Books = (props) => {
  const [genresList, setAllGenres] = useState([])
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS, { variables: { genre: genre }})

  //this is to only fetch allGenres with the first ALL_BOOKS query
  useEffect(() => { 
    if (!result.loading && result.data && !genre) {
      // Extract all the genres from the data
      const books = result.data.allBooks
      const genres = books.flatMap(book => book.genres)
      // Create an array of unique genres
      const uniqueGenres = [...new Set(genres)].sort()
      setAllGenres(uniqueGenres)
    }
  }, [genre, result])

  if (!props.show) {
    return null
  }
  if (result.loading)  {
    return <div>loading...</div>
  }
  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      {genre && <p>in genre <strong>{genre}</strong></p>}
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
      {genresList.map((a) => <button key={a} onClick={() => setGenre(a)}>{a}</button>)}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
//