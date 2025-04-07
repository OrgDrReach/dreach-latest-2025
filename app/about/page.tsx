import WhoWeAre from "@/components/page-components/about/WhoWeAre";

export default function AboutUs() {
  return (
    <main>
      <div className={`about`}>
        <div className={`about-hero`}>
          <div>
            <h1>Welcome to Dr. Reach</h1>
            <p>Revolutionizing healthcare management for a better tomorrow</p>
          </div>
        </div>
      </div>
      {/* stacked about components */}
      <div>
        <WhoWeAre />
      </div>
    </main>
  );
}
