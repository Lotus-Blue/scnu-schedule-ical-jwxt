import React, { useCallback } from 'react'
import {
	Introduction,
	GettingStarted,
	Navbar,
	Documents,
	ResultPage,
} from './fragments'
import * as Rules from './rules'
import { Progress, useProgressState, useChildWindow } from './stores'
import { useEvent } from 'react-use'

function Debugger() {
	const [, setProgress] = useProgressState()

	return (
		<div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2 }}>
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
	const [, setProgress] = useProgressState()
	const { close } = useChildWindow()

	useEvent(
		'message',
		useCallback(
			({ data, origin }: MessageEvent) => {
				if (origin === Rules.jwxtOrigin) {
					console.log(data)
					setProgress(Progress.Failure)
					close()
				}
			},
			[close, setProgress]
		)
	)

	return (
		<>
			<Debugger />
			<Navbar />
			<Introduction />
			<GettingStarted />
			<Documents />
			<ResultPage />
		</>
	)
}

export default App
