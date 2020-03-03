import React, {
	CSSProperties,
	useState,
	useRef,
	useMemo,
	useEffect,
} from 'react'
import { useAsync, useResponsive, useToggle, useInViewport } from '@umijs/hooks'
import { IntroductionImageSources } from './fragments.assets'
import Styles from './fragments.module.css'
import { useAppState, getAppState, ProgressState } from './AppState'
import * as Rules from './rules'
import ReactDOM from 'react-dom'
import MarkdownParser, { ContentWithTocNodesSet } from './MarkdownParser'
import copy from 'copy-to-clipboard'
import {
	Button,
	Layout,
	Menu,
	Tooltip,
	Select,
	Affix,
	Form,
	Checkbox,
	InputNumber,
	Switch,
} from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import SubMenu from 'antd/lib/menu/SubMenu'
import SmoothScroll from 'smooth-scroll'

const { animateScroll } = new SmoothScroll()

const Section = React.forwardRef<
	HTMLElement,
	React.PropsWithChildren<{
		className?: string
		style?: CSSProperties
	}>
>(({ children, style, className }, ref) => {
	return (
		<section
			{...{ ref }}
			className={className ? `${Styles.Section} ${className}` : Styles.Section}
			{...{ children, style }}
		/>
	)
})

function IntroductionImage({ id }: { id: number }) {
	return (
		<img
			className={Styles.DisplayImage}
			alt="展示效果"
			src={IntroductionImageSources[id - 1]}
		/>
	)
}

enum MenuItem {
	Introduction,
	GettingStart,
	Help,
	AboutUs,
}

export function Navbar() {
	const biggerThanXs = useResponsive().sm
	const { state: collapsed, toggle: toggleCollapsed } = useToggle()
	const showingHelpDoc = useAppState(state => state.showingHelpDoc)
	const [watchingGettingStart] = useInViewport(
		useAppState(state => state.gettingStartElement)
	)

	const menuItems = useMemo(
		() => [
			<Menu.Item
				onClick={() => {
					getAppState().hideHelpDoc()
					animateScroll(getAppState().introductionElement)
				}}
				key={`${MenuItem.Introduction}`}
			>
				介绍
			</Menu.Item>,
			<Menu.Item
				key={`${MenuItem.GettingStart}`}
				onClick={() => {
					getAppState().hideHelpDoc()
					animateScroll(getAppState().gettingStartElement)
				}}
			>
				立即使用
			</Menu.Item>,
			<Menu.Item
				onClick={() => {
					const appState = getAppState()
					appState.showHelpDoc()
					appState.turnToIdle()
				}}
				key={`${MenuItem.Help}`}
			>
				帮助文档
			</Menu.Item>,
			<Menu.Item key={`${MenuItem.AboutUs}`}>
				<a href="https://i.scnu.edu.cn/" target="_about">
					关于我们
				</a>
			</Menu.Item>,
		],
		[]
	)

	return (
		<Affix>
			<header>
				<Menu
					mode="horizontal"
					style={{ textAlign: 'right' }}
					selectedKeys={[
						showingHelpDoc
							? `${MenuItem.Help}`
							: watchingGettingStart
							? `${MenuItem.GettingStart}`
							: `${MenuItem.Introduction}`,
					]}
				>
					{biggerThanXs ? (
						menuItems
					) : (
						<SubMenu title={'todo' /* todo */}>{menuItems}</SubMenu>
					)}
				</Menu>
			</header>
		</Affix>
	)
}

export function Introduction() {
	return (
		<div ref={_ => getAppState().setIntroductionElement(_)}>
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
					{/* cspell:words Siri Cortana */}
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
		</div>
	)
}

const scratchScript =
	// eslint-disable-next-line
	'javascript:' +
	Rules.scratchScript.replace(/^[\s\t]+/g, '').replace(/\n?\r?/g, '')

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
					value={code}
					onClick={() => {
						textAreaRef.current?.select()
						onCopy?.()
					}}
					readOnly
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
	const hasWindow = Boolean(useAppState(state => state.window))
	const openChildWindow = useAppState(state => state.openChildWindow)

	return hasWindow ? null : (
		<div>
			<Button
				onClick={() => {
					openChildWindow(Rules.jwxtUrl)
				}}
			>
				打开教务处官网
			</Button>
		</div>
	)
}

export function TroubleOnGettingStart() {
	return (
		<details style={{ paddingTop: '1rem' }}>
			<summary>遇到问题吗？</summary>
			已知在某些浏览器可能会把前缀
			<code>javascript:</code>
			去掉，请补上后粘贴
			<br />
			一些出于安全考虑，禁用 javascript url 的浏览器也无法使用
			{/* TODO */}
		</details>
	)
}

const { Option } = Select

export function GettingStart() {
	const closeWindow = useAppState(state => state.closeChildWindow)
	const [selectedCampus, setCampus] = useState<Rules.Campus | undefined>()
	const [enableAlarm, setAlarm] = useState(false)
	const [minutes, setMinutes] = useState(30)
	const [copied, setCopied] = useState(false)
	const [showTeacherName, setTeacherName] = useState(false)

	useEffect(() => {
		if (selectedCampus)
			getAppState().setGenerateOptions({
				alarm: enableAlarm ? minutes : 0,
				teacherInName: showTeacherName,
				campus: selectedCampus,
			})
	}, [selectedCampus, enableAlarm, minutes, showTeacherName])

	return (
		<Section
			className={Styles.GettingStart}
			style={{ background: '#333', color: 'white', paddingTop: '3rem' }}
			ref={_ => getAppState().setGettingStartElement(_)}
		>
			<Form
				style={{ textAlign: 'center' }}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
			>
				<Form.Item
					label={
						<Checkbox
							checked={enableAlarm}
							onChange={event => {
								setAlarm(event.target.checked)
							}}
						>
							提前提醒我
						</Checkbox>
					}
				>
					<InputNumber
						step={5}
						min={5}
						max={60}
						value={minutes}
						onChange={_ => {
							setMinutes(_ ?? 30)
						}}
						disabled={!enableAlarm}
						formatter={value => `${value} 分钟`}
					/>
				</Form.Item>
				<Form.Item label="在课名后面备注教师名字">
					<Switch
						checked={showTeacherName}
						onChange={_ => {
							setTeacherName(_)
						}}
					></Switch>
				</Form.Item>
				<Form.Item label="你的校区：">
					<Select
						value={selectedCampus}
						style={{ width: 120 }}
						onChange={_ => {
							setCampus(_)
						}}
					>
						<Option value={Rules.Campus.Shipai}>石牌</Option>
						<Option value={Rules.Campus.Daxuecheng}>大学城</Option>
						<Option value={Rules.Campus.Nanhai}>南海</Option>
					</Select>
				</Form.Item>
			</Form>
			{useAppState(state => state.generateOptions) && (
				<>
					复制如下代码
					<CodeCopier
						onCopy={() => {
							setCopied(true)
						}}
					/>
					<br />
					<div hidden={!copied}>
						打开教务信息网，登陆后，在地址栏内输入这串代码
						<br />
						（建议使用电脑版的 Chrome 浏览器/老板 Firefox 完成操作）
						<ChildWindowOpener />
					</div>
					<TroubleOnGettingStart />
					<div>
						<Button
							onClick={() => {
								closeWindow()
							}}
						>
							重试
						</Button>
					</div>
					<br />
					我们承诺不会收集教务网其他非课程相关的数据，您教务网的所有其他数据也不会被后台服务器采集。
					<div style={{ height: '3rem' }} />
				</>
			)}
		</Section>
	)
}

export function ScreenPage({
	show,
	children,
	style,
}: React.PropsWithChildren<{
	show: boolean
	style?: CSSProperties
}>) {
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

export function HelpDoc() {
	const [content, setContent] = useState<ContentWithTocNodesSet | undefined>()
	const [error, setError] = useState(false)
	const show = useAppState(state => state.showingHelpDoc)

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
		}
	}, [show, content])

	return (
		<ScreenPage {...{ show }}>
			{error ? (
				'网络错误'
			) : !content ? (
				'加载中'
			) : (
				<div className={Styles.HelpDocContainer}>
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
	const progress = useAppState(state => state.progress)
	const turnToIdle = useAppState(state => state.turnToIdle)
	const url = useAppState(state => state.downloadableBlobUrl)

	return (
		<ScreenPage show={progress !== ProgressState.Idle}>
			<div
				style={{ background: '#0e3' }}
				hidden={progress !== ProgressState.Success}
			>
				<h1>恭喜！你的精品日历已做好</h1>
				<div>
					<a href={url ?? '#'} download="测试日历.ics">
						<Button size="large">下载日历</Button>
					</a>
				</div>
				<button
					onClick={() => {
						turnToIdle()
					}}
				>
					返回
				</button>
			</div>
			<div
				style={{ background: '#e33' }}
				hidden={progress !== ProgressState.Failure}
			>
				<h1>Oops, 出现了故障</h1>
				<button
					onClick={() => {
						turnToIdle()
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
