import SearchSection from "../components/SearchSection";
import Home_Featured from "../components/HomeProject";
import ProductList from "../components/ProductList";
import Project_Featured from "../components/ProjectFeaturedPage";
import ProjectList from "../components/ProjectList";
import News from "../components/News";
import Reveal from "../layouts/Reveal";

export default function Home() {
  return (
    <div className="relative">
      <section id="search">
        <Reveal>
          <SearchSection />
        </Reveal>
      </section>

      <section id="project_featured">
        <Reveal>
          <Project_Featured />
        </Reveal>
      </section>

      <section id="project">
        <Reveal>
          <ProjectList />
        </Reveal>
      </section>

      <section id="product_featured">
        <Reveal>
          <Home_Featured />
        </Reveal>
      </section>

      <section id="products">
        <Reveal>
          <ProductList />
        </Reveal>
      </section>

      <section id="news">
        <Reveal>
          <News />
        </Reveal>
      </section>
    </div>
  );
}