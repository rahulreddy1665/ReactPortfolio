import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './Galaxy.module.scss';

const Galaxy = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const spaceshipRef = useRef(null);
  const keysRef = useRef({});
  const gameOverRef = useRef(false);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const planetsRef = useRef([]);
  const starsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastPositionRef = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 10, 1000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;

    // Create galaxy background with particles (stars)
    const createStarField = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 5000;
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        // Random positions in a sphere
        const radius = Math.random() * 2000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Random colors (white to blue)
        const color = new THREE.Color();
        color.setHSL(0.6, 0.5, Math.random() * 0.5 + 0.5);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        sizes[i] = Math.random() * 3 + 1;
      }

      starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const starMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        vertexColors: true,
      });

      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      starsRef.current = stars;
    };

    // Create planets
    const createPlanets = () => {
      const planetCount = 15;
      const planetMeshes = [];

      for (let i = 0; i < planetCount; i++) {
        const size = Math.random() * 2 + 1;
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        
        // Create different textures for planets
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
          emissive: new THREE.Color().setHSL(Math.random(), 0.5, 0.2),
          roughness: 0.7,
          metalness: 0.3,
        });

        const planet = new THREE.Mesh(geometry, material);
        
        // Random position in space
        const angle = (Math.PI * 2 * i) / planetCount;
        const radius = 20 + Math.random() * 50;
        planet.position.set(
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 30,
          Math.sin(angle) * radius
        );

        planet.userData = {
          rotationSpeed: Math.random() * 0.02 + 0.01,
          orbitSpeed: Math.random() * 0.005 + 0.002,
          initialAngle: angle,
          radius: radius,
          size: size,
        };

        scene.add(planet);
        planetMeshes.push(planet);
      }

      planetsRef.current = planetMeshes;
    };

    // Create spaceship
    const createSpaceship = () => {
      const group = new THREE.Group();

      // Body
      const bodyGeometry = new THREE.ConeGeometry(0.3, 1, 8);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x004444,
        metalness: 0.8,
        roughness: 0.2,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.x = Math.PI;
      group.add(body);

      // Wings
      const wingGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.8);
      const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x002244,
      });
      
      const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
      leftWing.position.set(-0.4, 0, 0);
      group.add(leftWing);

      const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
      rightWing.position.set(0.4, 0, 0);
      group.add(rightWing);

      // Engine glow
      const engineGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const engineMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff3300,
      });
      const engine = new THREE.Mesh(engineGeometry, engineMaterial);
      engine.position.set(0, -0.6, 0);
      group.add(engine);

      group.position.set(0, 0, 0);
      scene.add(group);
      spaceshipRef.current = group;

      return group;
    };

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Create star field and planets
    createStarField();
    createPlanets();
    createSpaceship();

    // Keyboard controls
    const handleKeyDown = (event) => {
      keysRef.current[event.key.toLowerCase()] = true;
      if (event.key.toLowerCase() === 'w') {
        event.preventDefault();
      }
    };

    const handleKeyUp = (event) => {
      keysRef.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Spaceship movement
    const spaceshipSpeed = 0.2;
    const spaceshipRotationSpeed = 0.05;
    const spaceshipVelocity = new THREE.Vector3(0, 0, 0);

    // Collision detection
    const checkCollisions = (spaceshipPosition) => {
      const spaceshipRadius = 0.5;
      
      for (const planet of planetsRef.current) {
        const distance = spaceshipPosition.distanceTo(planet.position);
        const minDistance = spaceshipRadius + planet.userData.size;
        
        if (distance < minDistance) {
          return true;
        }
      }

      // Check collision with stars (simplified - check if too close to star field center)
      const starDistance = spaceshipPosition.length();
      if (starDistance > 1000) {
        return true;
      }

      return false;
    };

    // Wormhole effect
    const triggerWormhole = () => {
      if (!spaceshipRef.current) return;
      
      // Create wormhole visual effect
      const wormholeGeometry = new THREE.RingGeometry(2, 5, 64);
      const wormholeMaterial = new THREE.MeshBasicMaterial({
        color: 0x9900ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const wormhole = new THREE.Mesh(wormholeGeometry, wormholeMaterial);
      wormhole.position.copy(spaceshipRef.current.position);
      wormhole.lookAt(camera.position);
      scene.add(wormhole);

      // Animate wormhole
      const animateWormhole = () => {
        wormhole.rotation.z += 0.1;
        wormhole.scale.multiplyScalar(1.1);
        wormhole.material.opacity -= 0.02;
        
        if (wormhole.material.opacity > 0) {
          requestAnimationFrame(animateWormhole);
        } else {
          scene.remove(wormhole);
        }
      };
      animateWormhole();

      // Teleport spaceship to random location
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 40;
      spaceshipRef.current.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 20,
        Math.sin(angle) * radius
      );
      
      // Reset velocity
      spaceshipVelocity.set(0, 0, 0);
    };

    // Animation loop
    const clock = new THREE.Clock();
    let lastWormholeTime = 0;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update star field
      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0001;
        starsRef.current.material.uniforms.time.value = elapsedTime;
      }

      // Update planets rotation and orbit
      planetsRef.current.forEach((planet) => {
        planet.rotation.y += planet.userData.rotationSpeed;
        const angle = planet.userData.initialAngle + elapsedTime * planet.userData.orbitSpeed;
        planet.position.x = Math.cos(angle) * planet.userData.radius;
        planet.position.z = Math.sin(angle) * planet.userData.radius;
      });

      // Spaceship controls (only if game is not over)
      if (spaceshipRef.current && !gameOverRef.current) {
        const keys = keysRef.current;
        const spaceship = spaceshipRef.current;

        // Movement
        if (keys['w']) {
          spaceshipVelocity.add(spaceship.getWorldDirection(new THREE.Vector3()).multiplyScalar(spaceshipSpeed));
        }
        if (keys['s']) {
          spaceshipVelocity.add(spaceship.getWorldDirection(new THREE.Vector3()).multiplyScalar(-spaceshipSpeed * 0.5));
        }
        if (keys['a']) {
          spaceship.rotation.z += spaceshipRotationSpeed;
        }
        if (keys['d']) {
          spaceship.rotation.z -= spaceshipRotationSpeed;
        }

        // Apply velocity with damping
        spaceship.position.add(spaceshipVelocity);
        spaceshipVelocity.multiplyScalar(0.95);

        // Update camera to follow spaceship
        const cameraOffset = new THREE.Vector3(0, 1, 5);
        cameraOffset.applyQuaternion(spaceship.quaternion);
        camera.position.lerp(spaceship.position.clone().add(cameraOffset), 0.1);
        camera.lookAt(spaceship.position);

        // Calculate distance traveled
        const currentPosition = spaceship.position.clone();
        const distanceTraveled = currentPosition.distanceTo(lastPositionRef.current);
        setDistance((prev) => {
          const newDistance = prev + distanceTraveled;
          setScore(Math.floor(newDistance / 10));
          return newDistance;
        });
        lastPositionRef.current = currentPosition.clone();

        // Check collisions
        if (checkCollisions(spaceship.position)) {
          gameOverRef.current = true;
          setGameOver(true);
        }

        // Random wormhole trigger (every 10-15 seconds)
        if (elapsedTime - lastWormholeTime > 10 + Math.random() * 5) {
          triggerWormhole();
          lastWormholeTime = elapsedTime;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          object.material?.dispose();
        }
      });
      
      renderer.dispose();
    };
  }, []);

  const resetGame = () => {
    gameOverRef.current = false;
    setGameOver(false);
    setScore(0);
    setDistance(0);
    lastPositionRef.current = new THREE.Vector3(0, 0, 0);
    if (spaceshipRef.current) {
      spaceshipRef.current.position.set(0, 0, 0);
      spaceshipRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className={styles.galaxyContainer}>
      <div ref={mountRef} className={styles.galaxyCanvas} />
      <div className={styles.galaxyUi}>
        <div className={styles.scorePanel}>
          <h2>Galaxy Explorer</h2>
          <div className={styles.scoreInfo}>
            <div className={styles.scoreItem}>
              <span className={styles.label}>Distance:</span>
              <span className={styles.value}>{Math.floor(distance)} units</span>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.label}>Score:</span>
              <span className={styles.value}>{score}</span>
            </div>
          </div>
        </div>
        <div className={styles.controlsPanel}>
          <h3>Controls</h3>
          <div className={styles.controlsGrid}>
            <div className={styles.controlItem}>
              <kbd>W</kbd>
              <span>Forward</span>
            </div>
            <div className={styles.controlItem}>
              <kbd>S</kbd>
              <span>Backward</span>
            </div>
            <div className={styles.controlItem}>
              <kbd>A</kbd>
              <span>Rotate Left</span>
            </div>
            <div className={styles.controlItem}>
              <kbd>D</kbd>
              <span>Rotate Right</span>
            </div>
          </div>
          <div className={styles.wormholeInfo}>
            <p>⚠️ Watch out for wormholes!</p>
            <p>They will teleport you randomly</p>
          </div>
        </div>
        {gameOver && (
          <div className={styles.gameOver}>
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            <p>Distance Traveled: {Math.floor(distance)} units</p>
            <button onClick={resetGame} className={styles.resetButton}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Galaxy;

