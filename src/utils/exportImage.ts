import html2canvas from 'html2canvas';
import { useSongStore } from '../store/songStore';

export const exportAsImage = async () => {
  const { sections, keyRoot, scaleType, genre, tempo } = useSongStore.getState();

  if (sections.length === 0) {
    alert('请先生成歌曲结构');
    return;
  }

  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    background: #1a1a1f;
    padding: 40px;
    width: 1200px;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  let html = '<div style="color: white;">';
  html += '<h1 style="font-size: 32px; margin-bottom: 20px; text-align: center;">和弦生成器 - 歌曲结构</h1>';
  html += `<div style="display: flex; gap: 30px; margin-bottom: 30px; font-size: 14px; background: #2d2d35; padding: 20px; border-radius: 8px;">`;
  html += `<div><strong>调性:</strong> ${keyRoot} ${scaleType === 'major' ? '大调' : '小调'}</div>`;
  html += `<div><strong>风格:</strong> ${genre}</div>`;
  html += `<div><strong>速度:</strong> ${tempo} BPM</div>`;
  html += '</div>';

  // Add Flow Diagram
  html += '<div style="margin-bottom: 30px; background: #2d2d35; padding: 20px; border-radius: 8px;">';
  html += '<h3 style="font-size: 16px; margin-bottom: 15px; color: #00cec9;">Song Flow</h3>';
  html += '<div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">';
  sections.forEach((section, idx) => {
    html += `<div style="background: #3d3d45; padding: 10px 15px; border-radius: 6px; font-size: 14px;">`;
    html += `${section.name} (${section.chords.length})`;
    html += `</div>`;
    if (idx < sections.length - 1) {
      html += '<div style="color: #666;">→</div>';
    }
  });
  html += '</div></div>';

  sections.forEach((section) => {
    html += `<div style="margin-bottom: 30px; background: #2d2d35; padding: 20px; border-radius: 12px; border-left: 4px solid #6c5ce7;">`;
    html += `<h2 style="font-size: 20px; margin-bottom: 15px; color: #00cec9;">${section.name}</h2>`;
    html += '<div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 10px;">';

    section.chords.forEach((chord, cIdx) => {
      html += '<div style="background: #3d3d45; padding: 15px; border-radius: 8px; text-align: center;">';
      html += `<div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${chord.symbol}</div>`;
      html += `<div style="font-size: 12px; color: #999;">小节 ${cIdx + 1}</div>`;
      html += '</div>';
    });

    html += '</div></div>';
  });

  html += `<div style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;">生成时间: ${new Date().toLocaleString('zh-CN')}</div>`;
  html += '</div>';

  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      backgroundColor: '#1a1a1f',
      scale: 2,
    });

    const link = document.createElement('a');
    link.download = `song-structure-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    console.log('图片导出成功!');
  } catch (error) {
    console.error('导出失败:', error);
    alert('导出失败，请重试');
  } finally {
    document.body.removeChild(container);
  }
};
