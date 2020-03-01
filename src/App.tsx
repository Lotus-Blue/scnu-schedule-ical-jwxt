import React, { CSSProperties } from 'react'
import { Introduction, GettingStarted, Navbar, HelpDocs, ResultPage } from './fragments'

function App() {
	return (
		<>
			<Navbar />
			<Introduction />
			<GettingStarted />
			<ResultPage />
			<HelpDocs />
		</>
	)
}

export default App
