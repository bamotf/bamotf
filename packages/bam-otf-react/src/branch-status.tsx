import React from 'react'
import {BookOpen, Laptop, Target} from 'lucide-react'

interface BranchStatusProps {
  branch: 'Preview' | 'Development' | 'Production'
}

export function BranchStatus({branch}: BranchStatusProps) {
  var icon = null
  var heading = null

  switch (branch) {
    case 'Preview':
      icon = <Laptop size={16} color="#3E4E65" />
      heading = 'Preview'
      break
    case 'Development':
      icon = <BookOpen size={16} color="#3E4E65" />
      heading = 'Development'
      break
    case 'Production':
      icon = <Target size={16} color="#3E4E65" />
      heading = 'Production'
      break
    default:
      break
  }

  return (
    <div className="branch-status">
      <h3 className="branch-status-title">{heading}</h3>
      {icon}
    </div>
  )
}
