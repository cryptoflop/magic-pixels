import { Component, onMount } from 'solid-js';

import * as THREE from 'three';
import { IUniform } from 'three';

import frag from '../assets/shader/frag';
import vert from '../assets/shader/vert';

const NetherBack: Component = () => {
  let resizeContainer: HTMLDivElement;
  let container: HTMLDivElement;

  onMount(() => {
    // currently this is done with THREE but could be omptimized with using solely WebGL
    const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(45, aspect, 1, 10000);
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(resizeContainer.clientWidth, resizeContainer.clientHeight);
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { type: 'float', value: 0 } as IUniform<unknown>,
        aspect: { type: 'float', value: container.clientWidth / container.clientHeight } as IUniform<unknown>
      },
      fragmentShader: frag,
      vertexShader: vert,
      depthWrite: false,
      depthTest: false
    });

    const quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2, 1, 1), material);
    scene.add(quad);

    const clock = new THREE.Clock();
    let delta = 0;
    const interval = 1 / 30;
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

    const resizeCanvasToDisplaySize = () => {
      renderer.setSize(resizeContainer.clientWidth, resizeContainer.clientHeight, true);
      renderer.render(scene, camera);
      // camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resizeCanvasToDisplaySize);
    resizeObserver.observe(resizeContainer);
  });

  return <>
    <div class='absolute h-[100vh] w-[100vw]' ref={resizeContainer!}></div>
    <div class='absolute h-[100vh] w-[100vw]' ref={container!} />
  </>;
};

export default NetherBack;