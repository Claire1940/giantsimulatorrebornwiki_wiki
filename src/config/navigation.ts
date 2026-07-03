import type { LucideIcon } from 'lucide-react'
import {
	Gift,
	BookOpen,
	Repeat,
	TrendingUp,
	Wheat,
	PartyPopper,
	PawPrint,
	Map,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：8 个内容分类，对应 content/{locale}/ 下的目录
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: Gift, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'rebirth', path: '/rebirth', icon: Repeat, isContentType: true },
	{ key: 'leveling', path: '/leveling', icon: TrendingUp, isContentType: true },
	{ key: 'farming', path: '/farming', icon: Wheat, isContentType: true },
	{ key: 'event', path: '/event', icon: PartyPopper, isContentType: true },
	{ key: 'pets', path: '/pets', icon: PawPrint, isContentType: true },
	{ key: 'locations', path: '/locations', icon: Map, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['codes', 'guide', 'rebirth', ...]

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
