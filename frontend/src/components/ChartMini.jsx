import React from 'react'

export default function ChartMini({ values=[4,8,6,10,12,9,14,11,16,13], color='#3B82F6' }){
  const max = Math.max(...values, 1)
  const points = values.map((v, i) => {
    const x = (i/(values.length-1)) * 100
    const y = 100 - (v/max) * 100
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox="0 0 100 40" className="w-full h-40">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2" points={points.replace(/(\d+),(\d+)/g,(m,x,y)=>`${x},${(y/2).toFixed(2)}`)} />
      <polygon fill="url(#g)" points={`0,40 ${points.replace(/(\d+),(\d+)/g,(m,x,y)=>`${x},${(y/2).toFixed(2)}`)} 100,40`} />
      <g fill={color}>
        {values.map((v,i)=>{
          const x = (i/(values.length-1)) * 100
          const y = (100 - (v/Math.max(...values,1))*100)/2
          return <circle key={i} cx={x} cy={y} r="1.5" />
        })}
      </g>
    </svg>
  )
}


