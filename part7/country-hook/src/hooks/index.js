import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      return
    }

    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        const formattedData = {
          name: response.data.name.common,
          capital: response.data.capital[0],
          population: response.data.population,
          flag: response.data.flags.png
        }

        setCountry({ found: true, data: formattedData })
      })
      .catch(error => {
        setCountry({ found: false })
      })
  }, [name])

  return country
}