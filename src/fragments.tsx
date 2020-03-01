import React, { CSSProperties } from 'react'
import { useLockBodyScroll } from 'react-use'
import { IntroductionImageSources } from './fragments.assets'
import styles from './fragments.module.css'
import {
	useProgressState,
	Progress,
	useDocsState,
	useChildWindow,
} from './stores'
import * as Rules from './rules'

function Section({
	children,
	style,
}: React.PropsWithChildren<{ style?: CSSProperties }>) {
	return <section className={styles.section} {...{ children, style }} />
}

function IntroductionImage({ id }: { id: number }) {
	return (
		<img
			className={styles.displayImage}
			alt="展示效果"
			src={IntroductionImageSources[id - 1]}
		/>
	)
}

export function Navbar() {
	const [, setDocs] = useDocsState()
	const [, setProgress] = useProgressState()

	return (
		<header>
			<nav>
				<ul>
					<li
						onClick={() => {
							setDocs(false)
						}}
					>
						介绍
					</li>
					<li>立即使用</li>
					<li
						onClick={() => {
							setProgress(Progress.Idle)
							setDocs(true)
						}}
					>
						帮助文档
					</li>
					<li>反馈</li>
					<li>
						<a href="https://i.scnu.edu.cn/" target="_about">
							关于我们
						</a>
					</li>
				</ul>
			</nav>
		</header>
	)
}

export function Introduction() {
	return (
		<>
			<Section>
				<h1>绿色、简洁、无毒的日历</h1>
				<p>
					无需下载第三方APP、无流氓推广、没有多余的社交功能、耗电量极低，没有任何副作用
				</p>
				<IntroductionImage id={1} />
			</Section>
			<Section style={{ background: '#09f', color: 'white' }}>
				<h1>跨平台的云课表</h1>
				<p>手机与电脑云端同步。随时随地在手机上查看我的课程！</p>
				<div>
					<IntroductionImage id={3} />
					<IntroductionImage id={2} />
				</div>
			</Section>
			<Section>
				<h1>还有……</h1>
				<p>
					将课表导入日历以后，Siri, Cortana
					这些智能助理也能派上用场啦！更多惊喜，待您发现
					<span role="img" aria-label="开心">
						😋
					</span>
				</p>
				<div>
					<IntroductionImage id={7} />
					<IntroductionImage id={6} />
				</div>
			</Section>
			<Section style={{ height: '8rem', paddingTop: '2rem' }}>
				<h1>开始尝试 ↓</h1>
			</Section>
		</>
	)
}

function CodeCopier() {
	return (
		<>
			<input value={'123'} readOnly />
			<button>复制</button>
		</>
	)
}

function ChildWindowOpener() {
	const { window, open } = useChildWindow()

	return (
		<button
			onClick={() => {
				open(Rules.jwxtUrl)
			}}
			disabled={Boolean(window)}
		>
			打开教务处官网
		</button>
	)
}

export function TroubleOnGettingStarted() {
	const { window, close } = useChildWindow()

	return (
		<details hidden={!window}>
			<summary>遇到问题吗？</summary>
			<button>TODO</button>
			{/* TODO */}
			<button
				onClick={() => {
					close()
				}}
			>
				重试
			</button>
		</details>
	)
}

export function GettingStarted() {
	return (
		<Section style={{ background: '#333', color: 'white' }}>
			复制如下代码
			<CodeCopier />
			<br />
			打开教务信息网，在地址栏内输入这串代码，注意 javascript:
			<ChildWindowOpener />
			<TroubleOnGettingStarted />
			<br />
			我们承诺不会收集教务网其他非课程相关的数据，您教务网的所有其他数据也不会被后台服务器采集。
		</Section>
	)
}

export function ScreenPage({
	show,
	children,
}: React.PropsWithChildren<{ show: boolean }>) {
	useLockBodyScroll(show)

	return (
		<div
			style={{
				display: show ? 'initial' : 'none',
				position: 'fixed',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				zIndex: 1,
				background: 'white',
			}}
		>
			<Navbar></Navbar>
			{children}
		</div>
	)
}

export function Documents() {
	const [show] = useDocsState()

	return (
		<ScreenPage {...{ show }}>
			<article>帮助</article>
		</ScreenPage>
	)
}

export function ResultPage() {
	const [progress, setProgress] = useProgressState()

	return (
		<ScreenPage show={progress !== Progress.Idle}>
			<div
				style={
					progress === Progress.Success
						? { background: '#0e3' }
						: { background: '#e33' }
				}
			>
				<h1>结果页面</h1>
				<button
					onClick={() => {
						setProgress(Progress.Idle)
					}}
				>
					完成
				</button>
			</div>
		</ScreenPage>
	)
}
