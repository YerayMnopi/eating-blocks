import { createFileRoute, Link } from '@tanstack/react-router'
import './index.css'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (<>
    <section className="section">
      <div className="index__image">
        <img
          className="index__image"
          src="main.webp"
          alt="Healthy food"
        />
      </div>
      <div className="copy">
        <h1 className="index__heading">Diet, Easy.</h1>

        <p className="subheading">
          An AI powered meal planner.
        </p>
        <div>
          <Link
            to="/register"
          >Start here</Link>
        </div>
      </div>

    </section>
    <section className="section">
      <h2 className="index__heading">What you get</h2>
      <ul>
		<li>You’ll have a curated lists of meals that fit your diet.</li>
		<li>You’ll be able to create many variations of your meals, so you will always stick to your diet.</li>
		<li>Know how many grams of any meal you can eat</li>
	  </ul>
    </section>
    </>)
}