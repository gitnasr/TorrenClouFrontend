'use client'

import * as React from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'

// Default colors matching TorreClou professional dark theme
const CHART_COLORS = [
    '#128775', // primary (teal)
    '#22946e', // success (green)
    '#a87a2a', // warning (amber)
    '#9c2121', // danger (red)
    '#21498a', // info (blue)
]

interface ChartDataPoint {
    label: string
    value: number
    [key: string]: string | number
}

interface BaseChartProps {
    data: ChartDataPoint[]
    className?: string
    height?: number
}

interface LineChartProps extends BaseChartProps {
    type: 'line'
    dataKey?: string
    strokeColor?: string
}

interface BarChartProps extends BaseChartProps {
    type: 'bar'
    dataKey?: string
    fillColor?: string
}

interface PieChartProps extends BaseChartProps {
    type: 'pie'
    dataKey?: string
    colors?: string[]
}

type ChartProps = LineChartProps | BarChartProps | PieChartProps

export function Chart(props: ChartProps) {
    const { data, className, height = 300 } = props

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border bg-background p-2 shadow-lg">
                    <p className="text-sm font-medium">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm text-muted-foreground">
                            {entry.name}: {entry.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    if (props.type === 'line') {
        const { dataKey = 'value', strokeColor = CHART_COLORS[0] } = props
        return (
            <div className={cn('w-full', className)} style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis
                            dataKey="label"
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                        />
                        <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={strokeColor}
                            strokeWidth={2}
                            dot={{ r: 4, fill: strokeColor }}
                            activeDot={{ r: 6, fill: strokeColor }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }

    if (props.type === 'bar') {
        const { dataKey = 'value', fillColor = CHART_COLORS[0] } = props
        return (
            <div className={cn('w-full', className)} style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis
                            dataKey="label"
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                        />
                        <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey={dataKey} fill={fillColor} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }

    if (props.type === 'pie') {
        const { dataKey = 'value', colors = CHART_COLORS } = props
        return (
            <div className={cn('w-full', className)} style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey={dataKey}
                            label={(entry: any) =>
                                `${entry.name || entry.label}: ${(entry.percent * 100).toFixed(0)}%`
                            }
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        )
    }

    return null
}

// Simple stat chart for dashboard cards
interface StatChartProps {
    data: number[]
    color?: string
    className?: string
}

export function SparklineChart({ data, color = CHART_COLORS[0], className }: StatChartProps) {
    const chartData = data.map((value, index) => ({ value, index }))

    return (
        <div className={cn('h-12 w-24', className)}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

