import React from 'react'

const cn = (cls='') => `w-5 h-5 ${cls}`

export const IconDashboard = (p) => (
  <svg className={cn(p.className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
  </svg>
)

export const IconUsers = (p) => (
  <svg className={cn(p.className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11zM8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
  </svg>
)

export const IconStore = (p) => (
  <svg className={cn(p.className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16l-1 5H5L4 4zm1 7h14v9H5v-9zm3 2v5h4v-5H8z" fill="currentColor"/>
  </svg>
)

export const IconProfile = (p) => (
  <svg className={cn(p.className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.76 0 5-2.69 5-6s-2.24-6-5-6-5 2.69-5 6 2.24 6 5 6zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" fill="currentColor"/>
  </svg>
)

export const IconLogout = (p) => (
  <svg className={cn(p.className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 13v-2H7V7l-5 5 5 5v-4h9zm3-10H11v2h8v14h-8v2h8c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z" fill="currentColor"/>
  </svg>
)

export const IconSearch = (p) => (
  <svg className={cn(p.className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
  </svg>
)


