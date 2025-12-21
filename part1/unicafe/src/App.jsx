import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine  = ({ text, number }) => {
	return (
		<tr>
			<td>{text}</td>
			<td>{number}</td>
		</tr>
	)
}

const Statistics = ({ good, neutral, bad}) => {
	const all = good + neutral + bad

  if (all === 0) return <div>No feedback given</div>

	const average = (good - bad) / all
  const positive = (good / all) * 100

	return (
		<table>
			<tbody>
				<StatisticLine text="good" number={good} />
				<StatisticLine text="neutral" number={neutral} />
				<StatisticLine text="bad" number={bad} />
				<StatisticLine text="all" number={all} />
				<StatisticLine text="average" number={average} />
				<StatisticLine text="positive" number={positive + " %"} />
			</tbody>
		</table>
	)
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

	const handleGood = () => {
		setGood(good + 1)
	}

	const handleNeutral = () => {
		setNeutral(neutral + 1)
	}

	const handleBad = () => {
		setBad(bad + 1)
	}

  return (
    <div>
      <h2>give feedback</h2>
			<Button onClick={handleGood} text='good' />
			<Button onClick={handleNeutral} text='neutral' />
			<Button onClick={handleBad} text='bad' />

			<h2>statistics</h2>
			<Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App