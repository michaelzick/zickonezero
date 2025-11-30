import Link from 'next/link';
import { ReactElement, useEffect, useRef } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import { WorksData } from '../types';
import { Thumb } from '../../styles';

type AdditionalThumbProps = {
  index: number,
  onThumbClick: Function;
  link?: string;
  linkOut?: boolean;
};

const Thumbnail = (props: WorksData & AdditionalThumbProps): ReactElement => {
  const { imgs, group, link, linkOut, thumb, header, desc, index, onThumbClick } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const cursorDot = cursorDotRef.current;

    if (!container || !canvas || !cursorDot) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (prefersReducedMotion || !hasFinePointer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type Segment = {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      life: number;
      width: number;
      hue: number;
    };

    const pickNeonHue = () => 120 + Math.random() * 220;

    let segments: Segment[] = [];
    let rafId = 0;
    let dpr = 1;
    let lastPos: { x: number; y: number } | null = null;
    let currentHue = pickNeonHue();

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updateCursorDot = (x: number, y: number, visible: boolean, hue: number) => {
      cursorDot.style.opacity = visible ? '1' : '0';
      cursorDot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      cursorDot.style.background = `hsla(${hue}, 100%, 65%, 0.95)`;
      cursorDot.style.boxShadow = `0 0 14px hsla(${hue}, 100%, 65%, 0.8)`;
    };

    setSize();
    container.style.cursor = 'none';
    updateCursorDot(0, 0, false, currentHue);

    const imageEl = container.querySelector('img');
    if (imageEl) {
      if (imageEl.complete) {
        setSize();
      } else {
        imageEl.addEventListener('load', setSize);
      }
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.globalCompositeOperation = 'lighter';

      segments = segments
        .map((s) => ({
          ...s,
          life: s.life - 0.015
        }))
        .filter((s) => s.life > 0);

      for (const s of segments) {
        const alpha = Math.max(s.life, 0);
        const grad = ctx.createLinearGradient(s.x1, s.y1, s.x2, s.y2);
        grad.addColorStop(0, `hsla(${s.hue}, 100%, 65%, ${alpha})`);
        grad.addColorStop(1, `hsla(${s.hue}, 100%, 50%, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.shadowColor = `hsla(${s.hue}, 100%, 65%, ${alpha * 0.8})`;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
        ctx.stroke();
      }

      if (segments.length) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      rafId = 0;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    };

    const addStreak = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const maxSegments = 90;

      if (!lastPos) {
        lastPos = { x, y };
        currentHue = pickNeonHue();
        updateCursorDot(x, y, true, currentHue);
        return;
      }

      const width = 9 + Math.random() * 3;
      segments.push({
        x1: lastPos.x,
        y1: lastPos.y,
        x2: x,
        y2: y,
        life: 1,
        width,
        hue: currentHue
      });

      lastPos = { x, y };
      updateCursorDot(x, y, true, currentHue);

      if (segments.length > maxSegments) {
        segments = segments.slice(segments.length - maxSegments);
      }

      if (!rafId) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const handleMouseEnter = () => {
      currentHue = pickNeonHue();
      if (lastPos) updateCursorDot(lastPos.x, lastPos.y, true, currentHue);
      if (!rafId && segments.length) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const handleMouseLeave = () => {
      lastPos = null;
      updateCursorDot(0, 0, false, currentHue);
      if (!rafId && segments.length) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const handleResize = () => setSize();

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousemove', addStreak);
    window.addEventListener('resize', handleResize);

    return () => {
      if (imageEl) {
        imageEl.removeEventListener('load', setSize);
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousemove', addStreak);
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      container.style.cursor = '';
      updateCursorDot(0, 0, false, currentHue);
    };
  }, []);

  return (
    <Thumb onClick={() => onThumbClick(index)}>
      {imgs && link ?
        <Link href={link || `/${group}`}
          target={linkOut ? '_blank' : '_self'} rel={linkOut ? 'noopener noreferrer' : undefined}>
          <div className='thumb-media' ref={containerRef}>
            <img src={thumb} width='240' height='240' alt={group} className='thumb' />
            <canvas ref={canvasRef} className='neon-trail-thumb' aria-hidden='true' />
            <div ref={cursorDotRef} className='cursor-dot thumb-dot' aria-hidden='true' />
          </div>
        </Link> :
        <div className='thumb-media' ref={containerRef}>
          <img src={thumb} width='240' height='240' alt={group} className='thumb' />
          <canvas ref={canvasRef} className='neon-trail-thumb' aria-hidden='true' />
          <div ref={cursorDotRef} className='cursor-dot thumb-dot' aria-hidden='true' />
        </div>}

      <h3>{link ? <Link href={link || `/${group}`} target={linkOut ? '_blank' : '_self'} rel={linkOut ? 'noopener noreferrer' : undefined}>
        {header}</Link> : header}
      </h3>

      <p>
        {link ? <Link href={link || `/${group}`} target={linkOut ? '_blank' : '_self'} rel={linkOut ? 'noopener noreferrer' : undefined}>
          {desc}</Link> : desc}
        {linkOut ? (
          <span className='external-link-icon' aria-hidden='true'>
            <OpenInNewWindowIcon />
          </span>
        ) : null}
      </p>
    </Thumb>
  );
};

export default Thumbnail;
