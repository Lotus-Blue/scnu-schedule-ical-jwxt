import React from 'react'
import {
	Introduction,
	GettingStart,
	Navbar,
	HelpDoc,
	ResultPage,
	Footer,
} from './fragments'
import * as Rules from './rules'
import { useAppState, getAppState } from './AppState'
import 'antd/dist/antd.css'
import './App.css'
import { useEventListener } from '@umijs/hooks'
import generator, { CourseDataTransformer } from './generator'
import { useBodyScrollLock } from './hooks'

function Debugger() {
	const setFailure = useAppState(state => state.turnToFailure)

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
	const setFailure = useAppState(state => state.turnToFailure)
	useBodyScrollLock(useAppState(state => state.showingHelpDoc))

	useEventListener('message', ({ data, origin }: MessageEvent) => {
		if (origin === Rules.jwxtOrigin) {
			const appState = getAppState()
			appState.closeChildWindow()
			try {
				const { generateOptions } = getAppState()
				if (generateOptions) {
					const calendar = generator(
						(data as any[]).map(CourseDataTransformer),
						generateOptions
					)
					appState.turnToSuccess(calendar)
				} else throw '错误'
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
			<GettingStart />
			<HelpDoc />
			<ResultPage />
			<Footer />
		</>
	)
}

export default App
