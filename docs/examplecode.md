# html 

<section class="section gradient-green"></section>
<section class="section pin-section">
  <div class="content">
    <ul class="list">
      <li>Lorem, ipsum.</li>
      <li>Dolore, sunt!</li>
      <li>Delectus, accusamus.</li>
      <li>Hic, quos.</li>
    </ul>
    <div class="fill"></div>
    <div class="right">
      <div class="slide center gradient-green">
        <h1>SLIDE ONE</h1>
      </div>
      <div class="slide center gradient-blue">
        <h1>SLIDE TWO</h1>
      </div>
      <div class="slide center gradient-purple">
        <h1>SLIDE THREE</h1>
      </div>
      <div class="slide center gradient-orange">
        <h1>SLIDE FOUR</h1>
      </div>
    </div>
  </div>
</section>
<section class="section pin-section">
  <div class="content">
    <ul class="list">
      <li>Odio, iusto?</li>
      <li>Delectus, molestias!</li>
      <li>Cupiditate, consequatur!</li>
      <li>Cumque, labore?</li>
    </ul>
    <div class="fill"></div>
    <div class="right">
      <div class="slide center gradient-green">
        <h1>SLIDE ONE</h1>
      </div>
      <div class="slide center gradient-blue">
        <h1>SLIDE TWO</h1>
      </div>
      <div class="slide center gradient-purple">
        <h1>SLIDE THREE</h1>
      </div>
      <div class="slide center gradient-orange">
        <h1>SLIDE FOUR</h1>
      </div>
    </div>
  </div>
</section>
<section class="section gradient-green"></section>

## css
.content ul {
  font-size: 30px;
  color: #008080;
  margin: 0;
  padding: 0;
  padding-right: 10px;
  list-style: none;
  flex-grow: 0;
}

.content .fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background-color: #008080;
}

.content .right {
  flex-grow: 1;
  color: black;
  position: relative;
}

.right .slide {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  opacity: 0;
  visibility: hidden;
}

## js

console.clear();

gsap.registerPlugin(ScrollTrigger);

const pinSections = gsap.utils.toArray(".pin-section");
const lists = gsap.utils.toArray(".list");

pinSections.forEach((section, i) => {
  const list = lists[i];
  const fill = section.querySelector(".fill");
  const listItems = gsap.utils.toArray("li", list);
  const slides = gsap.utils.toArray(".slide", section);
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=" + listItems.length * 50 + "%",
      pin: true,
      scrub: true,
      id: i + 1,
      markers: { indent: 150 * i }
    }
  });

  fill && gsap.set(fill, { scaleY: 0 });
  listItems.forEach((item, j) => {
    if (listItems[j - 1]) {
      tl.set(item, { color: "#000" }, 0.5 * j)
        .to(
          slides[j],
          {
            autoAlpha: 1,
            duration: 0.2
          },
          "<"
        )
        .set(listItems[j - 1], { color: "#008080" }, "<")
        .to(
          slides[j - 1],
          {
            autoAlpha: 0,
            duration: 0.2
          },
          "<"
        );
    } else {
      tl.set(item, { color: "#000" }, 0.01).to(
        slides[j],
        {
          autoAlpha: 1,
          duration: 0.2
        },
        "<"
      );
    }
  });
  tl.to({}, {}).to(
    fill,
    {
      scaleY: 1,
      transformOrigin: "top left",
      ease: "none",
      duration: tl.duration() - 0.5
    },
    0
  );
});

