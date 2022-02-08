import { useEffect } from 'react';

import * as THREE from 'three';

export default function useThreeQuad(
  containerRef: React.RefObject<HTMLElement>,
  rendererRef: React.RefObject<HTMLElement>,
  frag: string,
  vert: string,
  resizeContainer?: HTMLElement,
  cb?: (renderer: THREE.WebGLRenderer) => void
) {
  useEffect(() => {
    const container = containerRef.current!;
    const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(45, aspect, 1, 10000);
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    rendererRef.current!.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { type: 'float', value: 0 },
        aspect: { type: 'float', value: container.clientWidth / container.clientHeight }
      } as any,
      fragmentShader: frag,
      vertexShader: vert,
      depthWrite: false,
      depthTest: false
    });

    const quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2, 1, 1), material);
    scene.add(quad);

    let clock = new THREE.Clock();
    let delta = 0;
    let interval = 1 / 30;
    const animate = (d: number) => {
      delta += clock.getDelta();
      if (delta > interval) {
        delta = delta % interval;
        quad.material.uniforms.time.value = d / 1000;
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };
    animate(0);

    if (resizeContainer) {
      const resizeCanvasToDisplaySize = () => {
        renderer.setSize(container.clientWidth, container.clientHeight, true);
        // camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
      };

      const resizeObserver = new ResizeObserver(resizeCanvasToDisplaySize);
      resizeObserver.observe(resizeContainer);
    }

    cb && cb(renderer);

    return () => {
      renderer.dispose();
      rendererRef?.current?.children[0].remove();
    };
  });
}
