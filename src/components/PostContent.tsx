"use client";

import { useState, useEffect, useRef } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import hljs from "highlight.js";
import "highlight.js/styles/tokyo-night-dark.css"; 

export default function PostContent({ htmlContent }: { htmlContent: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<{ src: string; alt: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const processBlocks = () => {
      // Tạm dừng observer để tránh vòng lặp vô hạn khi chúng ta thay đổi DOM bên trong
      observerRef.current?.disconnect();

      const blocks = containerRef.current?.querySelectorAll('pre code');
      
      blocks?.forEach((block) => {
        if (block.classList.contains('processed')) return;

        const rawText = block.textContent || "";
        const lines = rawText.split('\n');
        
        // 1. Xóa nội dung cũ và tạo fragment để render nhanh hơn
        block.innerHTML = '';
        const fragment = document.createDocumentFragment();

        lines.forEach((lineText) => {
          const lineDiv = document.createElement('div');
          lineDiv.className = 'line';
          lineDiv.textContent = lineText || ' '; // Giữ khoảng trống để dòng không bị sụp
          fragment.appendChild(lineDiv);
        });
        block.appendChild(fragment);

        // 2. Highlight từng dòng riêng biệt để giữ cấu trúc line-by-line
        const lineElements = block.querySelectorAll('.line');
        lineElements.forEach((lineEl: any) => {
          hljs.highlightElement(lineEl);
        });
        
        block.classList.add('processed');

        // 3. Xử lý nút copy cố định
        const pre = block.parentElement as HTMLElement;
        if (pre && !pre.querySelector('.copy-btn')) {
          pre.style.position = 'relative';
          
          const btn = document.createElement('button');
          btn.className = 'copy-btn';
          btn.innerText = 'Sao chép';
          btn.type = 'button';
          
          btn.onclick = (e: Event) => {
            e.stopPropagation();
            navigator.clipboard.writeText(rawText);
            btn.innerText = 'Đã chép!';
            setTimeout(() => btn.innerText = 'Sao chép', 2000);
          };
          pre.appendChild(btn);
        }
      });

      // Kết nối lại observer sau khi xử lý xong
      if (containerRef.current) {
        observerRef.current?.observe(containerRef.current, { childList: true, subtree: true });
      }
    };

    // Khởi tạo observer lần đầu
    observerRef.current = new MutationObserver(processBlocks);
    processBlocks();

    // Quét ảnh cho lightbox
    const imgs = containerRef.current.querySelectorAll("img");
    setSlides(Array.from(imgs).map(img => ({
      src: img.getAttribute("src") || "",
      alt: img.getAttribute("alt") || "Wiki Image",
    })));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [htmlContent]);

  const handleImageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const src = target.getAttribute("src");
      const imgIndex = slides.findIndex((s) => s.src === src);
      if (imgIndex !== -1) {
        setIndex(imgIndex);
        setOpen(true);
      }
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="post-content-wrapper prose max-w-none cursor-zoom-in"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        onClick={handleImageClick}
      />

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom]}
        zoom={{ 
          maxZoomPixelRatio: 2, 
          scrollToZoom: true,
          wheelZoomDistanceFactor: 600 
        }}
      />
    </>
  );
}