import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

type BackgroundOptions = {
  shadows: boolean;
  toneMapping: boolean;
  pixelRatio: number;
  spheres: boolean;
  animated: boolean;
};

const defaultOptions = {
  shadows: false,
  toneMapping: false,
  pixelRatio: Math.min(devicePixelRatio, 1),
  spheres: true,
  animated: true,
};

export async function initBackgroundScene(
  element: HTMLElement,
  overiddenOptions: Partial<BackgroundOptions>,
) {
  // TODO in future might detect what we are running on and pick this accordingly
  const options = {
    ...defaultOptions,
    ...overiddenOptions,
  };

  console.log(options);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(options.pixelRatio);
  if (options.toneMapping) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
  }
  renderer.shadowMap.enabled = options.shadows;
  element.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.set(0, 3, 8);
  const TARGET = new THREE.Vector3(0, 0, 0);
  camera.lookAt(TARGET);

  // NOTE we don't really need this, but its nice to play with
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.enableDamping = false;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.dampingFactor = 0.05;
  controls.target.copy(TARGET);
  controls.update();

  // Materials:

  const colors = {
    brandPrimary: 0x009689,
    brandDarkGrey: 0x1d293d,
    brandLightFrey: 0xcad5e2,
    primary: 0x00786f,
    secondary: 0x00bba7,
    accent: 0x00bba7,
    neutral: 0x45556c,
    info: 0x0092b8,
    success: 0x009966,
    warning: 0xe17100,
    error: 0xe7000b,
    white: 0xffffff,
    black: 0x000000,
  };

  const textureFiles = [
    "background/texture_01.png",
    "background/texture_03.png",
    "background/texture_04.png",
    "background/texture_05.png",
    "background/texture_06.png",
    "background/texture_07.png",
  ];
  const loader = new THREE.TextureLoader();

  const textures = await Promise.all(textureFiles.map((x) => loader.loadAsync(x)));
  const materials = textures.map((texture) => {
    // this is correct... but we don't change the box uv mappins so it won't do anything
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return new THREE.MeshStandardMaterial({
      map: texture,
      flatShading: true,
    });
  });

  function randomBoxMaterial() {
    const index = Math.floor(Math.random() * materials.length);
    return materials[index];
  }

  const sphereMaterial = new THREE.MeshStandardMaterial({
    emissive: colors.brandPrimary,
    emissiveIntensity: 3,
    flatShading: true,
  });

  // Dimensions

  // TOD this is going to stretch out texture :(... we'd need to get the edits
  const boxHeight = 2;
  const sphereRadius = 0.2;
  const boxGeometry = new THREE.BoxGeometry(1, boxHeight, 1); // TODO we need to adjust the UV so we map from 0->2 on the Y
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 4, 3);
  const maxBoxes = 20 * 20;
  const maxSpheres = maxBoxes * 0.25; // 1 to -1 => < 0.5 == about a quarter have sphere

  // Scene
  const scene = new THREE.Scene();
  scene.background = null;
  // TODO colors.goldDark is interesting
  scene.fog = new THREE.Fog(colors.black, 8, 15);

  // Meshes

  const boxInstances = new THREE.InstancedMesh(
    boxGeometry,
    randomBoxMaterial(),
    20 * 20,
  );
  const sphereInstances = new THREE.InstancedMesh(
    sphereGeometry,
    sphereMaterial,
    maxSpheres,
  );
  scene.add(boxInstances);
  if (options.spheres) {
    scene.add(sphereInstances);
  }
  const matrix = new THREE.Matrix4();

  let boxIndex = 0;
  let sphereIndex = 0;
  const ySteps = 8; // the textures have marks on so we want to feel like we are aligned to things
  for (let j = -10; j < 10; j += 1) {
    for (let i = -10; i < 10; i += 1) {
      const y = Math.floor(ySteps * (Math.random() * 2 - 1)) / ySteps;

      matrix.makeTranslation(i, y, j);
      boxInstances.setMatrixAt(boxIndex++, matrix);

      if (y < -0.5 && sphereIndex < maxSpheres) {
        matrix.makeTranslation(i, y + boxHeight / 2 + sphereRadius * 1.5, j);
        sphereInstances.setMatrixAt(sphereIndex++, matrix);
      }
    }
  }

  boxInstances.instanceMatrix.needsUpdate = true;
  sphereInstances.instanceMatrix.needsUpdate = true;

  // ========== SCENE LIGHTING ==========
  // Ambient light
  const ambientLight = new THREE.AmbientLight(colors.white, 0.2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(colors.primary, 1);
  keyLight.position.set(5, 4, 5);
  keyLight.castShadow = options.shadows;
  if (options.shadows) {
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 16;
  }
  scene.add(keyLight);

  // Fill light from opposite side
  const fillLight = new THREE.DirectionalLight(colors.secondary, 0.3);
  fillLight.position.set(-5, 3, -5);
  scene.add(fillLight);

  // Bloom pass
  // Expensive - We could drop it is we also drop the spheres
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  composer.setPixelRatio(1);

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(innerWidth, innerHeight),
    1.5,
    0.5,
    0.2,
  );

  composer.setSize(window.innerWidth, window.innerHeight);
  bloom.resolution.set(window.innerWidth, window.innerHeight);
  composer.addPass(bloom);

  // Rendering
  //
  let last = 0;
  const MAX_FPS = 15;
  const FRAME_TIME = 1000 / MAX_FPS;
  let animationId: number | null = null;

  function render() {
    controls.update();
    if (options.spheres) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  }

  function animate() {
    if (document.hidden) {
      return;
    }
    animationId = requestAnimationFrame(animate);

    // Cap to max fps
    const now = Date.now();
    if (now - last < FRAME_TIME) return;
    last = now;

    render();
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    bloom.resolution.set(window.innerWidth, window.innerHeight);

    if(!options.animated) {
      render()
    }
  });

  function startRendering() {
    if (animationId === null) {
      animate();
    }
  }

  function stopRendering() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  
  if (options.animated) {
    startRendering();
    
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopRendering();
      } else {
        startRendering();
      }
    });
  } else {
    /// Looking down an axis is boring so we pick a slight offset
     camera.position.set(1, 3, 6);
    controls.autoRotate = true;
    controls.enableDamping = false;
    camera.updateProjectionMatrix();
    requestAnimationFrame(render)

    // TODO if it's actuall not animated we could just render a picture 
  }
}
