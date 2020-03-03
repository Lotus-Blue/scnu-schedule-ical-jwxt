import React, { useCallback } from 'react'
import {
	Introduction,
	GettingStarted,
	Navbar,
	Document,
	ResultPage,
	Footer,
} from './fragments'
import * as Rules from './rules'
import { useProgressStore, ProgressStore, ChildWindowStore } from './stores'
import 'antd/dist/antd.css'
import './App.css'
import { useEventListener } from '@umijs/hooks'
import generator, { CourseDataTransformer } from './generator'

function Debugger() {
	const setFailure = useProgressStore(state => state.toFailure)

	return (
		<div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2 }}>
			<button
				onClick={() => {
					setFailure()
				}}
			>
				失败模拟
			</button>
		</div>
	)
}

function App() {
	const setFailure = useProgressStore(state => state.toFailure)

	useEventListener('message', ({ data, origin }: MessageEvent) => {
		if (origin === Rules.jwxtOrigin) {
			ChildWindowStore.getState().close()
			try {
				const calendar = generator((data as any[]).map(CourseDataTransformer))
				ProgressStore.getState().success(calendar)
			} catch (error) {
				setFailure({ code: error.toString() })
			}
		}
	})

	return (
		<>
			<Debugger />
			<Navbar />
			<Introduction />
			<GettingStarted />
			<Document />
			<ResultPage />
			<Footer />
		</>
	)
}

export default App
