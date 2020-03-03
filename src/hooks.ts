import { useEffect } from 'react'

export function useBodyScrollLock(open: boolean = true) {
	useEffect(() => {
		document.body.style.overflowY = open ? 'hidden' : ''
	}, [open])
}
