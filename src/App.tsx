import React from 'react'
import {
	Introduction,
	GettingStarted,
	Navbar,
	HelpDocs,
	ResultPage,
} from './fragments'
import { Progress, useProgressSetter } from './stores'

function Debugger() {
	const setProgress = useProgressSetter()

	return (
		<div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1 }}>
			<button
				onClick={() => {
					setProgress(Progress.Success)
				}}
			>
				成功模拟
			</button>
			<button
				onClick={() => {
					setProgress(Progress.Failure)
				}}
			>
				失败模拟
			</button>
		</div>
	)
}

function App() {
	return (
		<>
			<Debugger />
			<Navbar />
			<Introduction />
			<GettingStarted />
			<ResultPage />
			<HelpDocs />
		</>
	)
}

export default App
