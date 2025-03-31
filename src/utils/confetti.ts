
// Simple confetti effect
const confetti = () => {
  const colors = ['#9b87f5', '#7E69AB', '#E5DEFF', '#33C3F0'];
  const numConfetti = 150;
  
  for (let i = 0; i < numConfetti; i++) {
    createConfettiPiece(colors);
  }
};

const createConfettiPiece = (colors: string[]) => {
  const confetti = document.createElement('div');
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 10 + 5;
  const transformX = Math.random() * 360;
  const transformY = Math.random() * 360;
  
  confetti.classList.add('confetti');
  confetti.style.backgroundColor = color;
  confetti.style.width = `${size}px`;
  confetti.style.height = `${size}px`;
  confetti.style.top = '0';
  confetti.style.left = `${Math.random() * 100}vw`;
  confetti.style.transform = `rotate(${transformX}deg)`;
  confetti.style.opacity = '1';
  confetti.style.transition = 'transform 3s ease-out, opacity 3s ease-out, top 3s ease-out';
  
  document.body.appendChild(confetti);
  
  // Animation
  setTimeout(() => {
    confetti.style.transform = `translateY(100vh) rotate(${transformY}deg)`;
    confetti.style.opacity = '0';
  }, 100);
  
  // Cleanup
  setTimeout(() => {
    confetti.remove();
  }, 3000);
};

export default confetti;
