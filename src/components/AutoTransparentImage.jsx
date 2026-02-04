import React, { useEffect, useRef, useState } from 'react';

const AutoTransparentImage = ({ src, alt, className, style, tolerance = 20 }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = src;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            // 绘制原图
            ctx.drawImage(img, 0, 0);

            // 获取像素数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // 遍历像素，去除白色背景
            // 白色范围：RGB 都接近 255
            const threshold = 255 - tolerance;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // 如果像素足够白，将其透明度设为 0
                if (r > threshold && g > threshold && b > threshold) {
                    data[i + 3] = 0; // Alpha
                }
            }

            // 将处理后的数据放回 Canvas
            ctx.putImageData(imageData, 0, 0);

            // 转为 Data URL
            setImageSrc(canvas.toDataURL());
        };
    }, [src, tolerance]);

    if (!imageSrc) {
        // 加载中占位或原图（防止闪烁）
        return <img src={src} alt={alt} className={className} style={{ ...style, opacity: 0 }} />;
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            style={style}
        />
    );
};

export default AutoTransparentImage;
