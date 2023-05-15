import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const InfiniteLoadingScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const setupScene = (width: number, height: number) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff);
    containerRef.current?.appendChild(renderer.domElement);

    return { scene, camera, renderer };
  };

  const createCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(geometry, material);

    return cube;
  };

  const animate = (cube: THREE.Mesh, renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) => {
    const animateFrame = () => {
      requestAnimationFrame(animateFrame);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      const time = Date.now() * 0.001;
      const color = new THREE.Color();
      color.setHSL(time * 0.1 % 1, 0.5, 0.5);

      cube.material.color = color;

      renderer.render(cube.parent as THREE.Scene, camera);
    };

    animateFrame();
  };

  const handleResize = (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
    const { offsetWidth, offsetHeight } = containerRef.current!;
    camera.aspect = offsetWidth / offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(offsetWidth, offsetHeight);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.offsetWidth;
    let height = containerRef.current.offsetHeight;

    const { scene, camera, renderer } = setupScene(width, height);
    const cube = createCube();
    scene.add(cube);
    animate(cube, renderer, camera);

    const handleResize = () => {
      const { offsetWidth, offsetHeight } = containerRef.current!;
      camera.aspect = offsetWidth / offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(offsetWidth, offsetHeight);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      rendererRef.current = null;
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ height: '100vh' }} />;
};

export default InfiniteLoadingScreen;
