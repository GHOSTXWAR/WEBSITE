document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const buttons = document.querySelectorAll('.custom-btn');
  const sections = document.querySelectorAll('section');

  // toggles sidebar and content when button is clicked
  toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
  toggleBtn.classList.toggle('collapsed');
     toggleBtn.innerHTML = sidebar.classList.contains('collapsed') ? '&#8594;' : '&#8592;';
  });

  // -based on scrol postion highlights sidebar content/buttons
  window.addEventListener('scroll', () => {
    let current = '';
 sections.forEach(section => {
      const sectionTop = section.offsetTop;
   const sectionHeight = section.clientHeight;
     
        if (pageYOffset >= sectionTop - sectionHeight / 2) {
        current = section.getAttribute('id');
      }
    });

    // - updates button styles based on active section
   buttons.forEach(btn => {
     btn.classList.remove('active');
      if (btn.getAttribute('href') === `#${current}`) {
    btn.classList.add('active');
      }
    });
  });

  // hadeling for contact form
    const contactForm = document.getElementById('contactForm');
  if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); 

      // trims field values 
  const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
     const phone = contactForm.phone.value.trim();
       const message = contactForm.message.value.trim();

      // validates required fields
      if (!name || !email) {
      alert('Please fill in the required fields: Name and Email.');
        return;
      }

      // displays confirmation message
        alert(`Message sent!\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`);

      contactForm.reset(); // clears the form
    });
  }

  // loads browser game when load button is clicked
 const loadButton = document.querySelector('.load-button');
    if (loadButton) {
  loadButton.addEventListener('click', () => {
     window.location.href = 'BROWSER GAME/DirkMeintjes_Assignment02/index.html';
    });
  }

  //setup for floating glowing block
     const glowContainer = document.querySelector('.glow-float-container');
  if (!glowContainer) {
     console.error('No glow container found!');
    return;
  }

  // gets existing glowing blocks
  const glowBlocks = Array.from(glowContainer.querySelectorAll('.glow-block'));

  //  prepares the aniamtion data for each glowing block
  const blocks = glowBlocks.map(block => {
      const style = window.getComputedStyle(block);
    const topPercent = parseFloat(style.top);
   const leftPercent = parseFloat(style.left);
    const width = block.offsetWidth;
     const height = block.offsetHeight;

    return {
      element: block,
  x: (leftPercent / 100) * glowContainer.clientWidth,
      y: (topPercent / 100) * glowContainer.clientHeight,
     width,
       height,
        direction: Math.random() > 0.5 ? 1 : -1,
      speed: Math.random() * 0.5 + 0.3,
    };
  });

  // adds 5 blocks dynamicly
  for (let i = 0; i < 5; i++) {
    const newBlock = document.createElement('div');
     newBlock.classList.add('glow-block');
 newBlock.style.position = 'absolute';
      newBlock.style.width = '50px';
    newBlock.style.height = '50px';
   newBlock.style.top = Math.random() * 80 + 10 + '%';
   newBlock.style.left = Math.random() * 80 + 10 + '%';
      newBlock.style.animationDelay = Math.random() * 3 + 's';

    glowContainer.appendChild(newBlock);

  const width = 50;
    const height = 50;
  const topPercent = parseFloat(newBlock.style.top);
    const leftPercent = parseFloat(newBlock.style.left);

    blocks.push({
  element: newBlock,
      x: (leftPercent / 100) * glowContainer.clientWidth,
     y: (topPercent / 100) * glowContainer.clientHeight,
       width,
      height,
    direction: Math.random() > 0.5 ? 1 : -1,
        speed: Math.random() * 0.5 + 0.3,
    });
  }

  //animates the floating blocks vertically within the container
  function animateBlocks() {
      blocks.forEach(block => {
      // updates the position
      block.y += block.direction * block.speed;

      //  when blocks hits the edge of the screen the blocks moves in resverse 
   if (block.y > glowContainer.clientHeight - block.height) {
        block.direction = -1;
      } else if (block.y < 0) {
        block.direction = 1;
      }

      
      block.element.style.top = block.y + 'px';
    });

    // continues  loop
    requestAnimationFrame(animateBlocks);
  }

  
  animateBlocks();
});
