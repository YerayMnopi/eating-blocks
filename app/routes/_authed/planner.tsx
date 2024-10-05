import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/planner')({
  component: PlannerPage,
})


function PlannerPage() {
  return (
    <div>
      <h1>Planner</h1>
      <p>Plan your meals here</p>
    </div>
  )
}