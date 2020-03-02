import React, { CSSProperties, useState, useRef } from 'react'
import { useAsync, useDebounceFn, useToggle } from '@umijs/hooks'
import { IntroductionImageSources } from './fragments.assets'
import Styles from './fragments.module.css'
import './App.css'
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
import { Button, Layout, Menu, Tooltip } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

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
			<Menu mode="horizontal">
				<Menu.Item
					onClick={() => {
						setDocument(false)
					}}
				>
					介绍
				</Menu.Item>
				<Menu.Item>立即使用</Menu.Item>
				<Menu.Item
					onClick={() => {
						setProgress(Progress.Idle)
						setDocument(true)
					}}
				>
					{' '}
					帮助文档
				</Menu.Item>
				<Menu.Item>
					<a href="https://i.scnu.edu.cn/" target="_about">
						关于我们
					</a>
				</Menu.Item>
			</Menu>
		</header>
	)
}

export function Introduction() {
	return (
		<>
			<Section style={{ padding: '3rem' }}>
				<h1>绿色、简洁、无毒的日历</h1>
				<p>
					无需下载第三方APP、无流氓推广、没有多余的社交功能、耗电量极低，没有任何副作用
				</p>
				<IntroductionImage id={1} />
			</Section>
			<Section style={{ background: '#09f', color: 'white', padding: '3rem' }}>
				<h1 style={{ color: 'white' }}>跨平台的云课表</h1>
				<p>手机与电脑云端同步。随时随地在手机上查看我的课程！</p>
				<div>
					<IntroductionImage id={3} />
					<IntroductionImage id={2} />
				</div>
			</Section>
			<Section style={{ padding: '3rem' }}>
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
			<div style={{ height: '8rem', paddingTop: '2rem', textAlign: 'center' }}>
				<h1>开始尝试 ↓</h1>
			</div>
		</>
	)
}

const scratchScript =
	// eslint-disable-next-line
	'javascript:' + Rules.scratchScript.replace(/^\s+/g, '').replace(/\n/g, '')

const { Content } = Layout

function CodeCopier({ onCopy }: { onCopy?: () => void }) {
	const code = scratchScript
	const textAreaRef = useRef<HTMLTextAreaElement>(null)

	return (
		<Content>
			<div>
				<textarea
					ref={textAreaRef}
					style={{ resize: 'none', color: 'black' }}
					rows={3}
					children={code}
					onClick={() => {
						textAreaRef.current?.select()
					}}
				/>
			</div>
			<Tooltip title="已复制" trigger="click">
				<Button
					type="primary"
					shape="round"
					icon={<FontAwesomeIcon icon={faCopy} />}
					onClick={() => {
						copy(code)
						onCopy?.()
					}}
				>
					复制
				</Button>
			</Tooltip>
		</Content>
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
		<Section style={{ background: '#333', color: 'white', paddingTop: '3rem' }}>
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
	style,
}: React.PropsWithChildren<{ show: boolean; style?: CSSProperties }>) {
	// TODO 滚动锁
	// useLockBodyScroll(show)

	return ReactDOM.createPortal(
		<div hidden={!show}>
			<div className={Styles.ScreenPage} {...{ style }}>
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
				style={{ background: '#0e3' }}
				hidden={progress !== Progress.Success}
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
			<div
				style={{ background: '#e33' }}
				hidden={progress !== Progress.Failure}
			>
				<h1>Oops, 出现了故障</h1>
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

export function Footer() {
	return (
		<footer>
			Copyright © 2008-2018
			<a href="https://i.scnu.edu.cn/about/" target="_about">
				ISCNU
			</a>
			. All rights Reserved.
			<br />
			华南师范大学网络协会 版权所有
		</footer>
	)
}
