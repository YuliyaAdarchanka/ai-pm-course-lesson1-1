import { useEffect, useRef, useState } from 'react';
import './App.css';

const WHISPERS = [
  'неопределённость',
  'сигнал в шуме',
  'паттерн',
  'итерация',
  'сомнение',
  'эмерджентность',
  'выбор',
  'отгрузка',
];

export default function App() {
  const canvasRef = useRef(null);
  const [whisperIdx, setWhisperIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setWhisperIdx((i) => (i + 1) % WHISPERS.length);
    }, 3400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const PARTICLE_COUNT = 260;
    const particles = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#07071a';
      ctx.fillRect(0, 0, width, height);
    };

    const spawn = (p) => {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.px = p.x;
      p.py = p.y;
      p.life = 0;
      p.maxLife = 140 + Math.random() * 160;
      p.speed = 0.4 + Math.random() * 0.9;
      p.hueOffset = Math.random() * 60 - 30;
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = {};
      spawn(p);
      particles.push(p);
    }

    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    let rafId = 0;

    const field = (x, y, time) => {
      const sx = x * 0.0035;
      const sy = y * 0.0035;
      const a =
        Math.sin(sx + time * 0.0006) +
        Math.cos(sy * 1.3 - time * 0.0004) +
        Math.sin((sx + sy) * 0.8 + time * 0.0003);
      return a * Math.PI;
    };

    const tick = () => {
      t += 1;

      ctx.fillStyle = 'rgba(7, 7, 26, 0.085)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseHue = (t * 0.05) % 360;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const angle = field(p.x, p.y, t);

        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pullStrength = 0.018;
        const pullX = (dx / (dist + 1)) * pullStrength;
        const pullY = (dy / (dist + 1)) * pullStrength;

        const swirl = 0.6;
        const vx = Math.cos(angle) * p.speed * swirl + pullX;
        const vy = Math.sin(angle) * p.speed * swirl + pullY;

        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy;
        p.life += 1;

        const lifeRatio = p.life / p.maxLife;
        const alpha = Math.sin(lifeRatio * Math.PI) * 0.65;

        const hue = (baseHue + p.hueOffset + dist * 0.15) % 360;
        ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (
          p.life >= p.maxLife ||
          p.x < -20 ||
          p.x > width + 20 ||
          p.y < -20 ||
          p.y > height + 20
        ) {
          spawn(p);
        }
      }

      const pulse = 0.5 + 0.5 * Math.sin(t * 0.018);
      const r = 60 + pulse * 18;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.4);
      grad.addColorStop(0, `hsla(${baseHue + 200}, 90%, 70%, ${0.18 + pulse * 0.12})`);
      grad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.4, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="app">
      <canvas ref={canvasRef} className="canvas" />

      <div className="overlay">
        <header className="header">
          <div className="kicker">Урок 1.1 · AI Product Manager</div>
          <h1>каково это</h1>
        </header>

        <div className="whisper" key={whisperIdx}>
          {WHISPERS[whisperIdx]}
        </div>
      </div>
    </div>
  );
}
