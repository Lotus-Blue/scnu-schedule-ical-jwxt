import React, { CSSProperties, useState } from 'react'
import { useLockBodyScroll, useAsync, useDebounce, useCounter } from 'react-use'
import { IntroductionImageSources } from './fragments.assets'
import Styles from './fragments.module.css'
import {
	useProgressState,
	Progress,
	useDocumentShowState,
	useChildWindow,
} from './stores'
import * as Rules from './rules'
import ReactDOM from 'react-dom'
import MarkdownParser, { ContentWithTocNodesSet } from './MarkdownParser'
import copy from 'copy-to-clipboard'

function Section({
	children,
	style,
}: React.PropsWithChildren<{ style?: CSSProperties }>) {
	return <section className={Styles.Section} {...{ children, style }} />
}

function IntroductionImage({ id }: { id: number }) {
	return (
		<img
			className={Styles.DisplayImage}
			alt="展示效果"
			src={IntroductionImageSources[id - 1]}
		/>
	)
}

export function Navbar() {
	const [, setDocument] = useDocumentShowState()
	const [, setProgress] = useProgressState()

	return (
		<header>
			<nav>
				<ul>
					<li
						onClick={() => {
							setDocument(false)
						}}
					>
						介绍
					</li>
					<li>立即使用</li>
					<li
						onClick={() => {
							setProgress(Progress.Idle)
							setDocument(true)
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

function useCopyFeedback() {
	const [copyTimes, { inc }] = useCounter(0)
	const [display, setDisplay] = useState(false)
	useDebounce(
		() => {
			setDisplay(false)
		},
		2000,
		[copyTimes]
	)

	return [
		display,
		(text: string) => {
			copy(text)
			inc()
			setDisplay(true)
		},
	] as const
}

const scratchScript =
	'javascript:' + Rules.scratchScript.replace(/^\s+/g, '').replace(/\n/g, '')

function CodeCopier({ onCopy }: { onCopy?: () => void }) {
	const code = scratchScript
	const [feedback, copyFn] = useCopyFeedback()

	return (
		<>
			<code>{code}</code>
			<button
				onClick={() => {
					copyFn(scratchScript)
					onCopy?.()
				}}
			>
				复制
			</button>
			<p hidden={!feedback}>已复制</p>
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
	const [copyed, setCopyed] = useState(false)

	return (
		<Section style={{ background: '#333', color: 'white' }}>
			复制如下代码
			<CodeCopier
				onCopy={() => {
					setCopyed(true)
				}}
			/>
			<br />
			<div hidden={!copyed}>
				打开教务信息网，在地址栏内输入这串代码，注意 javascript:
				<ChildWindowOpener />
			</div>
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

	return ReactDOM.createPortal(
		<div hidden={!show}>
			<div className={Styles.ScreenPage}>
				<Navbar></Navbar>
				{children}
			</div>
		</div>,
		document.body
	)
}

export function Document() {
	const [content, setContent] = useState<ContentWithTocNodesSet | undefined>()
	const [error, setError] = useState(false)
	const [show] = useDocumentShowState()

	useAsync(async () => {
		if (show && !content) {
			try {
				setContent(
					MarkdownParser.convert(await (await fetch(Rules.documentPath)).text())
				)
			} catch (error) {
				setError(true)
				console.error(error)
			}
			/* 	unified()
								.use(remarkParse)
								.use(remarkSlug)
								.use(remarkToReact)
								.processSync(raw).contents */
		}
	}, [show, content])

	return (
		<ScreenPage {...{ show }}>
			{error ? (
				'网络错误'
			) : !content ? (
				'加载中'
			) : (
				<div className={Styles.DocumentContainer}>
					<nav style={{ overflowY: 'auto', flex: '0 256px' }}>
						<h1>目录</h1>
						{content.toc}
					</nav>
					<article className={Styles.Article} children={content.body} />
				</div>
			)}
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
