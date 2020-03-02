import ical from 'ical-generator'
import * as Rules from './rules'

export interface CourseData {
	/** 课程名称 */
	name: string
	/** 星期
	 * @example 星期一为1
	 */
	day: number
	/** 开始周 */
	startWeek: number
	/** 结束周 */
	endWeek: number
	/** 上课时间 */
	startTime: string
	/** 下课时间 */
	endTime: string
	/** 教师名 */
	teacher: string
	/** 单双周信息 */
	singleOrDouble: number
	/** 上课地点 */
	place: string
}

export default function(
	courseList: CourseData[],
	options: {
		/** 提醒时间 */
		alarm?: number
		teacherInName?: boolean
	} = {}
) {
	const { alarm, teacherInName } = options
	const cal = ical(Rules.calendarData)
	courseList.forEach(course => {
		// 开课日期与第一个周一的偏移天数
		const startDayOffset = course.day - 1 + 7 * (course.startWeek - 1)
		// 结课日期与第一个周一的偏移天数
		const endDayOffset = course.day - 1 + 7 * (course.endWeek - 1)
		// 一天的开始时刻
		const startTime = new Date(
			getDateAfterStartTime(course.startTime).getTime() +
				startDayOffset * 86400000
		)
		// 一天的结束时刻
		const endTime = new Date(
			getDateAfterStartTime(course.endTime).getTime() +
				startDayOffset * 86400000
		)
		const event = cal.createEvent({
			start: startTime,
			end: endTime,
			summary: course.name + (teacherInName ? ` (${course.teacher})` : ''),
			description:
				course.teacher +
				(course.singleOrDouble === 1
					? '\n单周'
					: course.singleOrDouble === 2
					? '\n双周'
					: '') +
				'\n' +
				'-- Powered by ISCNU',
			location: course.place,
			repeating: {
				freq: 'WEEKLY', // 以周为周期
				interval: course.singleOrDouble === 0 ? 1 : 2, // 单双周
				until: new Date(
					getDateAfterStartTime('23:59').getTime() + endDayOffset * 86400000
				),
			},
		})
		if (alarm)
			event.createAlarm({ type: 'display', trigger: Math.ceil(alarm * 60) })
	})
	return cal
}

function getDateAfterStartTime(time: string) {
	return new Date(
		Rules.firstMonday +
			'T' +
			(time.split(':')[0].length === 1 ? `0${time}` : time) +
			':00+08:00'
	)
}

function parseWeekDuration(value: string) {
	const iterator = value.matchAll(/\d+/g)
	const start: number = iterator.next().value[0]
	const end: number = iterator.next().value[0]
	return [start, end] as const
}

function parseTimeDuration(value: string) {
	const iterator = value.matchAll(/\d+/g)
	const start = iterator.next().value[0] as string
	const end = iterator.next().value[0] as string
	return [start, end] as const
}

export function CourseDataTransformer(
	data: Record<'cdmc' | 'kcmc' | 'xqj' | 'zcd' | 'jcs' | 'xm', string>
): CourseData {
	const { cdmc, kcmc, xqj, zcd, jcs, xm } = data
	const [startWeek, endWeek] = parseWeekDuration(zcd)
	const [startTime, endTime] = parseTimeDuration(jcs)

	return {
		name: kcmc,
		place: cdmc,
		day: parseInt(xqj),
		singleOrDouble: 0,
		startWeek,
		endWeek,
		startTime,
		endTime,
		teacher: xm,
	}
}
