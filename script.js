// ===== GLOBAL VARIABLES =====
let scene, camera, renderer, controls;
let currentScene = 0;
const totalScenes = 6; // Added name reveal scene
let flowers = [];
let cake, candles = [], candlesBlown = 0;
let giftBox, giftLid;
let favourCards = [];
let heart;
let particles = [];
let raycaster, mouse;
let starField;
let nameLetters = [];
let nameParticles;

// Scene states
let isTransitioning = false;
let currentBgColor = new THREE.Color(0x1a1a2e); // Deep dark blue default



// ===== INITIALIZATION =====
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // Initial position - zoom out if mobile
    if (window.innerWidth < 768) {
        camera.position.set(0, 2, 12);
    } else {
        camera.position.set(0, 2, 8);
    }

    // Renderer
    const canvas = document.getElementById('canvas3d');
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Controls
    controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 1.5;

    // Raycaster for interactions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Lights
    setupLights();

    // Create all scenes
    createNameScene(); // New personalized name reveal
    createFlowerScene();
    createCakeScene();
    createGiftScene();
    createFavourScene();
    createHeartScene();
    createStarField();

    // Hide all except name initially
    hideAllScenes();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('touchstart', onCanvasClick, { passive: false });
    canvas.addEventListener('mousemove', onMouseMove);

    // UI Events
    document.getElementById('startBtn').addEventListener('click', startExperience);
    document.getElementById('continueBtn').addEventListener('click', () => transitionToScene(5));

    // Music
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let musicPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicPlaying = false;
        } else {
            bgMusic.play();
            musicToggle.classList.add('playing');
            musicPlaying = true;
        }
    });

    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 1000);

    // Start animation loop
    animate();
}

// ===== LIGHTING =====
function setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xffa502, 0x764ba2, 0.6);
    scene.add(hemiLight);

    // Main directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);
}

// ===== SCENE 0: NAME REVEAL =====
// function createNameScene() {
//     const nameGroup = new THREE.Group();
//     nameGroup.name = 'nameScene';

//     // Load font and create 3D text - individual letters
//     const loader = new THREE.FontLoader();
//     loader.load('https://threejs.org/examples/fonts/gentilis_regular.typeface.json', function (font) {
//         const letters = 'SHIVANI'.split('');
//         let xOffset = 0;
//         const letterSpacing = 1; // Minimal spacing, no gaps

//         // Calculate total width for centering
//         const totalWidth = letters.length * letterSpacing;
//         const startX = -totalWidth / 2;

//         letters.forEach((letter, index) => {
//             const textGeometry = new THREE.TextGeometry(letter, {
//                 font: font,
//                 size: 1.2,
//                 height: 0.3,
//                 curveSegments: 12,
//                 bevelEnabled: true,
//                 bevelThickness: 0.05,
//                 bevelSize: 0.04,
//                 bevelSegments: 5
//             });

//             // All letters in beautiful pink
//             const textMaterial = new THREE.MeshPhongMaterial({
//                 color: 0xff6b9d,
//                 emissive: 0xff6b9d,
//                 emissiveIntensity: 0.5,
//                 shininess: 100,
//                 specular: 0xffffff
//             });

//             const letterMesh = new THREE.Mesh(textGeometry, textMaterial);
//             letterMesh.position.x = startX + (index * letterSpacing);
//             letterMesh.position.y = 3.5; // Raised to be above flowers
//             letterMesh.castShadow = true;

//             // Start invisible for animation
//             letterMesh.scale.set(0, 0, 0);
//             letterMesh.userData.letterIndex = index;

//             nameGroup.add(letterMesh);
//             nameLetters.push(letterMesh);

//             // Add individual spotlight for each letter (pink)
//             const spotlight = new THREE.SpotLight(0xff6b9d, 1.5, 15, Math.PI / 8, 0.5);
//             spotlight.position.set(letterMesh.position.x, 8, 3); // Raised light source
//             spotlight.target = letterMesh;
//             nameGroup.add(spotlight);
//         });
//     });

//     // Create particle system around name
//     const particleCount = 200;
//     const particleGeometry = new THREE.BufferGeometry();
//     const positions = new Float32Array(particleCount * 3);
//     const colors = new Float32Array(particleCount * 3);

//     for (let i = 0; i < particleCount; i++) {
//         const radius = 3 + Math.random() * 2;
//         const theta = Math.random() * Math.PI * 2;
//         const phi = Math.random() * Math.PI;

//         positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
//         positions[i * 3 + 1] = 3.5 + (Math.random() - 0.5) * 3; // Centered around height 3.5
//         positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

//         const color = new THREE.Color();
//         color.setHSL(Math.random() * 0.3 + 0.8, 1, 0.6);
//         colors[i * 3] = color.r;
//         colors[i * 3 + 1] = color.g;
//         colors[i * 3 + 2] = color.b;
//     }

//     particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//     particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

//     const particleMaterial = new THREE.PointsMaterial({
//         size: 0.15,
//         vertexColors: true,
//         transparent: true,
//         opacity: 0.8,
//         blending: THREE.AdditiveBlending
//     });

//     nameParticles = new THREE.Points(particleGeometry, particleMaterial);
//     nameGroup.add(nameParticles);

//     scene.add(nameGroup);
// }

function createNameScene() {
    const nameGroup = new THREE.Group();
    nameGroup.name = 'nameScene';

    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/gentilis_regular.typeface.json', function (font) {

        const letters = "SHIVANI".split("");
        const nameMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6b9d,
            emissive: 0xff6b9d,
            emissiveIntensity: 0.5,
            shininess: 100,
            specular: 0xffffff
        });

        let letterMeshes = [];
        let widths = [];

        // First create all geometries and measure real widths
        letters.forEach(letter => {
            const geo = new THREE.TextGeometry(letter, {
                font: font,
                size: 1.2,
                height: 0.3,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.04,
                bevelSegments: 5
            });

            geo.computeBoundingBox();
            const width = geo.boundingBox.max.x - geo.boundingBox.min.x;
            widths.push(width);

            const mesh = new THREE.Mesh(geo, nameMaterial);
            mesh.castShadow = true;

            // Start invisible for animation
            mesh.scale.set(0, 0, 0);

            letterMeshes.push(mesh);
        });

        // Compute total width
        const totalWidth = widths.reduce((a, b) => a + b, 0);
        const startX = -totalWidth / 2;

        // Position letters with true proportional spacing
        let currentX = startX;
        letterMeshes.forEach((mesh, i) => {
            mesh.position.x = currentX;
            mesh.position.y = 3.5;

            currentX += widths[i] * 1.08; // slight breathing room

            nameGroup.add(mesh);
            nameLetters.push(mesh);

            // Add spotlight for each letter
            const spotlight = new THREE.SpotLight(0xff6b9d, 1.5, 15, Math.PI / 8, 0.5);
            spotlight.position.set(mesh.position.x, 8, 3);
            spotlight.target = mesh;
            nameGroup.add(spotlight);
        });

        // Particle field around name
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const radius = 3 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = 3.5 + (Math.random() - 0.5) * 3;
            positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.3 + 0.8, 1, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        nameParticles = new THREE.Points(particleGeometry, particleMaterial);
        nameGroup.add(nameParticles);
    });

    scene.add(nameGroup);
}


// ===== SCENE 1: BLOOMING FLOWERS =====
function createFlowerScene() {
    const flowerGroup = new THREE.Group();
    flowerGroup.name = 'flowerScene';

    // Create multiple flowers in a garden arrangement
    // Moved away from center to allow text visibility
    const positions = [
        { x: -3.5, z: -2 }, { x: -2.5, z: -4 }, { x: 2.5, z: -3 },
        { x: 4, z: -2 }, { x: -3.5, z: 1 }, { x: -5, z: 0 },
        { x: 3.5, z: 1 }, { x: 5, z: 0 }, { x: -2, z: 3 },
        { x: 2, z: 3.5 }
    ];

    positions.forEach((pos, i) => {
        const flower = createFlower(pos.x, pos.z, i);
        flowers.push(flower);
        flowerGroup.add(flower.group);
    });

    scene.add(flowerGroup);
}

function createFlower(x, z, index) {
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(x, 0, z);

    // Varying height
    const height = 1.5 + Math.random() * 1;

    // Stem
    // Curved stem using quadratic bezier curve for more natural look
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.random() * 0.5 - 0.25, height / 2, Math.random() * 0.5 - 0.25),
        new THREE.Vector3(0, height, 0)
    );

    const stemGeometry = new THREE.TubeGeometry(curve, 5, 0.04, 8, false);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x6ab04c });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    flowerGroup.add(stem);

    // Leaves
    const leafGeometry = new THREE.CircleGeometry(0.3, 3);
    const leafMaterial = new THREE.MeshPhongMaterial({
        color: 0x6ab04c,
        side: THREE.DoubleSide
    });

    const leaf1 = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf1.position.y = height * 0.4;
    leaf1.rotation.x = -Math.PI / 2;
    leaf1.rotation.z = Math.random();
    leaf1.scale.set(1, 2, 1);
    flowerGroup.add(leaf1);

    // Flower Head container
    const headGroup = new THREE.Group();
    headGroup.position.y = height;
    // Random slight rotation for natural look
    headGroup.rotation.z = (Math.random() - 0.5) * 0.3;
    headGroup.rotation.x = (Math.random() - 0.5) * 0.3;
    flowerGroup.add(headGroup);

    // Flower center
    const centerGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const centerMaterial = new THREE.MeshPhongMaterial({
        color: 0xf1c40f,
        emissive: 0xf1c40f,
        emissiveIntensity: 0.2
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.scale.y = 0.6; // Flattened center
    headGroup.add(center);

    // Petals
    const petals = [];
    // Randomize petal count and shape
    const petalCount = 6 + Math.floor(Math.random() * 5);
    const colors = [0xff6b9d, 0xffa502, 0xa29bfe, 0x74b9ff, 0xff6348, 0xff9ff3];
    const petalColor = colors[index % colors.length];

    for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;

        // Petal shape using a flattened sphere or cone
        const petalGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const petalMaterial = new THREE.MeshPhongMaterial({
            color: petalColor,
            emissive: petalColor,
            emissiveIntensity: 0.2,
            shininess: 30,
            flatShading: false
        });

        const petal = new THREE.Mesh(petalGeometry, petalMaterial);

        // Position petal around center
        const distance = 0.35;
        petal.position.set(
            Math.cos(angle) * distance,
            0,
            Math.sin(angle) * distance
        );

        // Orientation
        petal.rotation.y = -angle;
        // Shape deformation to look like a petal
        petal.scale.set(1.5, 0.2, 0.8);

        // Pivot point adjustment (not essentially needed if we animate position/scale right, 
        // but scaling from center outward is easier if pivot is center. 
        // Current setup: distinct meshes).

        petal.scale.set(0.01, 0.01, 0.01); // Start hidden for animation

        petals.push({
            mesh: petal,
            angle,
            targetScale: { x: 1.5, y: 0.2, z: 0.8 }
        });
        headGroup.add(petal);
    }

    // Point light for glow
    const light = new THREE.PointLight(petalColor, 0.5, 2);
    light.position.y = height + 0.5;
    flowerGroup.add(light);

    return { group: flowerGroup, petals, center, light };
}

// ===== SCENE 2: CAKE WITH CANDLES =====
function createCakeScene() {
    const cakeGroup = new THREE.Group();
    cakeGroup.name = 'cakeScene';
    cakeGroup.visible = false;

    // Cake plate
    const plateGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.1, 32);
    const plateMaterial = new THREE.MeshPhongMaterial({ color: 0xdfe6e9 });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.y = 0;
    cakeGroup.add(plate);

    // Cake Group Main
    const mainCakeGroup = new THREE.Group();
    cakeGroup.add(mainCakeGroup);

    // Slice Group (for animation)
    const sliceGroup = new THREE.Group();
    sliceGroup.name = "cakeSlice";
    cakeGroup.add(sliceGroup);

    // Calculate Slice Angle (e.g., 45 degrees = PI/4)
    const sliceAngle = Math.PI / 4;

    // Cake layers
    const layers = [
        { radius: 2, height: 0.8, color: 0xa29bfe, y: 0.45 },
        { radius: 1.5, height: 0.7, color: 0xffa502, y: 1.2 },
        { radius: 1, height: 0.6, color: 0xff6b9d, y: 1.85 }
    ];

    layers.forEach(layer => {
        // Main Body (Rest of the cake)
        const mainGeo = new THREE.CylinderGeometry(layer.radius, layer.radius, layer.height, 32, 1, false, sliceAngle, Math.PI * 2 - sliceAngle);
        const layerMaterial = new THREE.MeshPhongMaterial({ color: layer.color });
        const mainMesh = new THREE.Mesh(mainGeo, layerMaterial);
        mainMesh.position.y = layer.y;
        mainMesh.castShadow = true;
        mainCakeGroup.add(mainMesh);

        // Inner face planes for main body
        const planeGeo = new THREE.PlaneGeometry(layer.radius, layer.height);
        const planeMat = new THREE.MeshPhongMaterial({ color: 0xfff0f5 }); // Creamy inside

        const plane1 = new THREE.Mesh(planeGeo, planeMat);
        plane1.position.set(Math.cos(sliceAngle) * layer.radius / 2, layer.y, Math.sin(sliceAngle) * layer.radius / 2);
        plane1.rotation.y = sliceAngle + Math.PI / 2;
        mainCakeGroup.add(plane1);

        const plane2 = new THREE.Mesh(planeGeo, planeMat);
        plane2.position.set(layer.radius / 2, layer.y, 0);
        plane2.rotation.y = Math.PI / 2;
        mainCakeGroup.add(plane2);

        // Slice Wedge
        const sliceGeo = new THREE.CylinderGeometry(layer.radius, layer.radius, layer.height, 16, 1, false, 0, sliceAngle);
        const sliceMesh = new THREE.Mesh(sliceGeo, layerMaterial);
        sliceMesh.position.y = layer.y;
        sliceMesh.castShadow = true;
        sliceGroup.add(sliceMesh);

        // Slice inner faces
        const sPlane1 = new THREE.Mesh(planeGeo, planeMat);
        sPlane1.position.set(Math.cos(sliceAngle) * layer.radius / 2, layer.y, Math.sin(sliceAngle) * layer.radius / 2);
        sPlane1.rotation.y = sliceAngle + Math.PI / 2;
        sliceGroup.add(sPlane1);

        const sPlane2 = new THREE.Mesh(planeGeo, planeMat);
        sPlane2.position.set(layer.radius / 2, layer.y, 0);
        sPlane2.rotation.y = Math.PI / 2;
        sliceGroup.add(sPlane2);

        // Frosting
        // Simple Torus for main body (approximate, since Torus is full ring)
        // We'll just do it for effect, maybe leave gap for realism or just let it clip
        const frostingGeometry = new THREE.TorusGeometry(layer.radius, 0.08, 16, 32, Math.PI * 2 - sliceAngle);
        const frostingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
        frosting.position.y = layer.y + layer.height / 2;
        frosting.rotation.x = Math.PI / 2;
        frosting.rotation.z = sliceAngle; // Align start
        mainCakeGroup.add(frosting);

        // Slice Frosting
        const sFrostingGeo = new THREE.TorusGeometry(layer.radius, 0.08, 16, 16, sliceAngle);
        const sFrosting = new THREE.Mesh(sFrostingGeo, frostingMaterial);
        sFrosting.position.y = layer.y + layer.height / 2;
        sFrosting.rotation.x = Math.PI / 2;
        sliceGroup.add(sFrosting);
    });

    // Candles
    // We put one candle on the slice, others on main
    const candlePositions = [
        { x: -0.5, z: 0.5, onSlice: false },
        { x: 0.5, z: 0.5, onSlice: false }, // Back
        { x: -0.5, z: -0.5, onSlice: false }, // Back
        { x: 0.8, z: 0.3, onSlice: true }, // Should be on slice area (0 to 45 deg) roughly
        { x: 0, z: 0, onSlice: false } // Top center
    ];

    candlePositions.forEach((pos, i) => {
        // Adjust slice candle position to be physically on the wedge
        let x = pos.x, z = pos.z;
        let targetGroup = mainCakeGroup;

        if (i === 3) { // Force specific candle to slice
            x = 0.5; z = 0.2;
            targetGroup = sliceGroup;
        }

        const candleObj = createCandle(x, 2.2, z);
        candles.push(candleObj);
        targetGroup.add(candleObj.group);
    });

    cake = cakeGroup;
    scene.add(cakeGroup);
}

function createCandle(x, y, z) {
    const candleGroup = new THREE.Group();
    candleGroup.position.set(x, y, z);

    // Candle body
    const bodyGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    candleGroup.add(body);

    // Wick
    const wickGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8);
    const wickMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const wick = new THREE.Mesh(wickGeometry, wickMaterial);
    wick.position.y = 0.375;
    candleGroup.add(wick);

    // Flame (particle system)
    const flameParticles = createFlameParticles();
    flameParticles.position.y = 0.5;
    candleGroup.add(flameParticles);

    // Flame light
    const flameLight = new THREE.PointLight(0xffa502, 2, 2);
    flameLight.position.y = 0.5;
    candleGroup.add(flameLight);

    return {
        group: candleGroup,
        flame: flameParticles,
        light: flameLight,
        lit: true,
        body: body
    };
}

function createFlameParticles() {
    const particleCount = 20;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 0.1;
        positions[i * 3 + 1] = Math.random() * 0.3;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

        const color = new THREE.Color();
        color.setHSL(0.1 + Math.random() * 0.1, 1, 0.5 + Math.random() * 0.3);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geometry, material);
}

// ===== SCENE 3: GIFT BOX =====
function createGiftScene() {
    const giftGroup = new THREE.Group();
    giftGroup.name = 'giftScene';
    giftGroup.visible = false;

    // Gift body
    const bodyGeometry = new THREE.BoxGeometry(2, 2, 2);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b9d,
        emissive: 0xff6b9d,
        emissiveIntensity: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    body.castShadow = true;
    giftGroup.add(body);

    // Gift lid
    const lidGeometry = new THREE.BoxGeometry(2.2, 0.4, 2.2);
    const lidMaterial = new THREE.MeshPhongMaterial({
        color: 0xffa502,
        emissive: 0xffa502,
        emissiveIntensity: 0.2
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 2.2;
    lid.castShadow = true;
    giftGroup.add(lid);

    // Ribbon vertical
    const ribbonVGeometry = new THREE.BoxGeometry(0.3, 2.5, 0.3);
    const ribbonMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    const ribbonV = new THREE.Mesh(ribbonVGeometry, ribbonMaterial);
    ribbonV.position.y = 1.25;
    giftGroup.add(ribbonV);

    // Ribbon horizontal
    const ribbonHGeometry = new THREE.BoxGeometry(2.5, 0.3, 0.3);
    const ribbonH = new THREE.Mesh(ribbonHGeometry, ribbonMaterial);
    ribbonH.position.y = 1.25;
    giftGroup.add(ribbonH);

    // Bow
    const bowGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8);
    const bowMaterial = new THREE.MeshPhongMaterial({
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 0.3
    });
    const bow = new THREE.Mesh(bowGeometry, bowMaterial);
    bow.position.y = 2.5;
    giftGroup.add(bow);

    // Point lights
    const light1 = new THREE.PointLight(0xff6b9d, 1, 5);
    light1.position.set(2, 2, 2);
    giftGroup.add(light1);

    const light2 = new THREE.PointLight(0xffa502, 1, 5);
    light2.position.set(-2, 2, -2);
    giftGroup.add(light2);

    giftBox = body;
    giftLid = lid;
    scene.add(giftGroup);
}

// ===== SCENE 4: FAVOUR CARDS =====
function createFavourScene() {
    const favourGroup = new THREE.Group();
    favourGroup.name = 'favourScene';
    favourGroup.visible = false;

    const cardCount = 5;
    const radius = 4;

    for (let i = 0; i < cardCount; i++) {
        const angle = (i / cardCount) * Math.PI * 2 - Math.PI / 2;

        const cardGeometry = new THREE.PlaneGeometry(1.5, 2);
        const cardMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6b9d,
            emissive: 0xff6b9d,
            emissiveIntensity: 0.3,
            side: THREE.DoubleSide
        });
        const card = new THREE.Mesh(cardGeometry, cardMaterial);

        card.position.set(
            Math.cos(angle) * radius,
            2,
            Math.sin(angle) * radius
        );
        card.rotation.y = -angle + Math.PI / 2;

        favourCards.push({ mesh: card, angle, radius });
        favourGroup.add(card);

        // Card light
        const cardLight = new THREE.PointLight(0xff6b9d, 0.5, 3);
        cardLight.position.copy(card.position);
        favourGroup.add(cardLight);
    }

    scene.add(favourGroup);
}

// ===== SCENE 5: HEART =====
function createHeartScene() {
    const heartGroup = new THREE.Group();
    heartGroup.name = 'heartScene';
    heartGroup.visible = false;

    // Create heart shape
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
    heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
    heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
    heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

    const extrudeSettings = {
        depth: 0.4,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 5
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const heartMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b9d,
        emissive: 0xff6b9d,
        emissiveIntensity: 0.5
    });
    heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.position.y = 2;
    heart.rotation.z = Math.PI;
    heart.scale.set(2, 2, 2);
    heartGroup.add(heart);

    // Heart light
    const heartLight = new THREE.PointLight(0xff6b9d, 2, 10);
    heartLight.position.y = 2;
    heartGroup.add(heartLight);

    scene.add(heartGroup);
}

// ===== SCENE MANAGEMENT =====
function hideAllScenes() {
    const sceneNames = ['nameScene', 'flowerScene', 'cakeScene', 'giftScene', 'favourScene', 'heartScene'];
    sceneNames.forEach(name => {
        const obj = scene.getObjectByName(name);
        if (obj) obj.visible = false;
    });
}

function transitionToScene(sceneIndex) {
    if (isTransitioning) return;
    isTransitioning = true;

    // Hide all text overlays
    document.querySelectorAll('.text-overlay').forEach(el => {
        el.classList.remove('active');
    });

    // Show instructions
    document.getElementById('instructions').classList.add('visible');

    currentScene = sceneIndex;

    // Camera transitions
    switch (sceneIndex) {
        case 0: // Name Reveal
            showNameScene();
            break;
        case 1: // Flowers
            showFlowerScene();
            break;
        case 2: // Cake
            showCakeScene();
            break;
        case 3: // Gift
            showGiftScene();
            break;
        case 4: // Favours
            showFavourScene();
            break;
        case 5: // Heart
            showHeartScene();
            break;
    }

    setTimeout(() => {
        isTransitioning = false;
    }, 2000);
}

function showNameScene() {
    hideAllScenes();
    const nameSceneObj = scene.getObjectByName('nameScene');
    if (nameSceneObj) nameSceneObj.visible = true;
    if (starField) starField.visible = false;

    // Background: Deep purple/pink gradient
    const newColor = new THREE.Color(0x1a0a2e);
    gsap.to(scene.fog.color, {
        r: newColor.r, g: newColor.g, b: newColor.b,
        duration: 2
    });
    renderer.setClearColor(newColor);

    // Animate camera circling the name
    gsap.to(camera.position, {
        x: 0, y: 1, z: 6,
        duration: 2,
        ease: "power2.inOut"
    });

    // Animate name appearing - letter by letter writing effect
    if (nameLetters.length > 0) {
        nameLetters.forEach((letter, i) => {
            // Each letter appears sequentially
            gsap.to(letter.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.8,
                delay: 0.3 + (i * 0.15), // Stagger each letter
                ease: "back.out(2)" // Bouncy writing effect
            });

            // Slight rotation as it appears (like pen writing)
            gsap.fromTo(letter.rotation,
                { z: -0.3 },
                {
                    z: 0,
                    duration: 0.8,
                    delay: 0.3 + (i * 0.15),
                    ease: "power2.out"
                }
            );

            // Gentle float after appearing
            gsap.to(letter.position, {
                y: Math.sin(i) * 0.1,
                duration: 2,
                delay: 1.5 + (i * 0.15),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    }

    // Auto-transition to flowers
    setTimeout(() => transitionToScene(1), 5500); // Slightly longer to enjoy the writing
}

function showFlowerScene() {
    hideAllScenes();
    scene.getObjectByName('flowerScene').visible = true;

    // Show name scene on flower background
    const nameSceneObj = scene.getObjectByName('nameScene');
    if (nameSceneObj) {
        nameSceneObj.visible = true;

        // Animate name writing on flower background
        if (nameLetters.length > 0) {
            nameLetters.forEach((letter, i) => {
                // Reset for animation
                letter.scale.set(0, 0, 0);
                letter.material.opacity = 1;
                letter.material.transparent = false;

                // Each letter appears sequentially (writing effect)
                gsap.to(letter.scale, {
                    x: 1, y: 1, z: 1,
                    duration: 1.5, // Slowed down
                    delay: 1 + (i * 0.4), // Slower stagger
                    ease: "back.out(2)"
                });

                // Slight rotation as it appears (like pen writing)
                gsap.fromTo(letter.rotation,
                    { z: -0.3 },
                    {
                        z: 0,
                        duration: 1.5,
                        delay: 1 + (i * 0.4),
                        ease: "power2.out"
                    }
                );

                // Gentle float after appearing
                gsap.to(letter.position, {
                    y: 3.5 + Math.sin(i) * 0.1, // Float around new height
                    duration: 2,
                    delay: 2 + (i * 0.15),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });
        }
    }

    if (starField) starField.visible = false;

    // Background: Deep Pink/Purple
    gsap.to(scene.background, {
        r: 0.1, g: 0.1, b: 0.2, // Dark
        duration: 2
    });

    // Animate camera
    const targetZ = window.innerWidth < 768 ? 12 : 8; // Further back on mobile
    gsap.to(camera.position, {
        x: 0, y: 3, z: targetZ,
        duration: 2,
        ease: "power2.inOut"
    });

    // Bloom flowers
    flowers.forEach((flower, i) => {
        flower.petals.forEach((petal, j) => {
            gsap.to(petal.mesh.scale, {
                x: petal.targetScale.x,
                y: petal.targetScale.y,
                z: petal.targetScale.z,
                duration: 1.5,
                delay: i * 0.1 + j * 0.05,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });

    setTimeout(() => transitionToScene(2), 9000); // Longer due to slow writing
}

function showCakeScene() {
    hideAllScenes();
    scene.getObjectByName('cakeScene').visible = true;
    if (starField) starField.visible = false;

    // Background: Dark Warm
    // We can simulate background color change by clearing color on renderer if we didn't set scene.background
    // But since we are using scene.fog, we should probably update fog color too
    const newColor = new THREE.Color(0x2d1b2e);
    gsap.to(scene.fog.color, {
        r: newColor.r, g: newColor.g, b: newColor.b,
        duration: 2
    });
    renderer.setClearColor(newColor); // Immediate, or we tween a proxy object

    gsap.to(camera.position, {
        x: 0, y: 3, z: 6,
        duration: 2,
        ease: "power2.inOut"
    });

    document.getElementById('cakeText').classList.add('active');
}

function showGiftScene() {
    hideAllScenes();
    scene.getObjectByName('giftScene').visible = true;
    if (starField) starField.visible = true;

    // Background: Deep Space
    const newColor = new THREE.Color(0x0a0a1a);
    gsap.to(scene.fog.color, {
        r: newColor.r, g: newColor.g, b: newColor.b,
        duration: 2
    });
    renderer.setClearColor(newColor);

    // Reset gift box to allow opening
    if (giftBox) {
        giftBox.userData.canOpen = true;
    }

    gsap.to(camera.position, {
        x: 0, y: 2, z: 5,
        duration: 2,
        ease: "power2.inOut"
    });

    document.getElementById('giftText').classList.add('active');
}

function showFavourScene() {
    hideAllScenes();
    scene.getObjectByName('favourScene').visible = true;
    if (starField) starField.visible = true;

    // Background: Midnight Blue
    const newColor = new THREE.Color(0x130f40);
    gsap.to(scene.fog.color, {
        r: newColor.r, g: newColor.g, b: newColor.b,
        duration: 2
    });
    renderer.setClearColor(newColor);

    gsap.to(camera.position, {
        x: 0, y: 2, z: 0,
        duration: 2,
        ease: "power2.inOut"
    });

    document.getElementById('favoursText').classList.add('active');
}

function showHeartScene() {
    hideAllScenes();
    scene.getObjectByName('heartScene').visible = true;
    if (starField) starField.visible = true;

    // Background: Warm Love
    const newColor = new THREE.Color(0x2c0b1e);
    gsap.to(scene.fog.color, {
        r: newColor.r, g: newColor.g, b: newColor.b,
        duration: 2
    });
    renderer.setClearColor(newColor);

    gsap.to(camera.position, {
        x: 0, y: 2, z: 6,
        duration: 2,
        ease: "power2.inOut"
    });

    document.getElementById('messageText').classList.add('active');
}

// ===== INTERACTIONS =====
function onCanvasClick(event) {
    let x, y;

    // Handle touch events
    if (event.type === 'touchstart') {
        x = event.changedTouches[0].clientX;
        y = event.changedTouches[0].clientY;
        // Don't prevent default here to allow scrolling if needed, 
        // but for 3D interaction usually we might want to.
        // However, a simple tap shouldn't interfere with scroll too much.
    } else {
        x = event.clientX;
        y = event.clientY;
    }

    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (currentScene === 2) { // Cake scene is now index 2
        // Check candle clicks - check all children of candle groups
        candles.forEach((candle, i) => {
            const intersects = raycaster.intersectObjects(candle.group.children, true);
            if (intersects.length > 0 && candle.lit) {
                blowOutCandle(candle);
            }
        });
    } else if (currentScene === 3 && giftBox) { // Gift scene is now index 3
        // Check gift click
        const giftScene = scene.getObjectByName('giftScene');
        if (giftScene) {
            const intersects = raycaster.intersectObjects(giftScene.children, true);
            if (intersects.length > 0 && giftBox.userData.canOpen !== false) {
                openGift();
            }
        }
    }
}

function blowOutCandle(candle) {
    candle.lit = false;
    candle.flame.visible = false;
    candle.light.intensity = 0;
    candlesBlown++;

    // Smoke effect
    createSmokeParticles(candle.group.position);

    if (candlesBlown === candles.length) {
        createConfetti();
        createHeartBurst(); // Add heart burst effect

        setTimeout(() => {
            transitionToScene(3); // Gift scene
        }, 5500); // Give plenty of time to enjoy the slow hearts
    }
}

function createHeartBurst() {
    const heartCount = 30;
    const hearts = [];

    for (let i = 0; i < heartCount; i++) {
        // Create heart shape
        const heartShape = new THREE.Shape();
        const scale = 0.15 + Math.random() * 0.1;

        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
        heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
        heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
        heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

        const heartGeometry = new THREE.ShapeGeometry(heartShape);
        const heartMaterial = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0xff6b9d : 0xff1744,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });

        const heart = new THREE.Mesh(heartGeometry, heartMaterial);
        heart.position.set(
            (Math.random() - 0.5) * 4,
            -2, // Start from bottom
            (Math.random() - 0.5) * 2 + 3 // Closer to camera
        );
        heart.scale.set(scale, scale, scale);
        heart.rotation.z = Math.PI;

        scene.add(heart);
        hearts.push(heart);

        // Animate heart bursting outward and upward - SLOWLY
        const targetX = heart.position.x + (Math.random() - 0.5) * 6; // Reduced spread
        const targetY = 6 + Math.random() * 2; // Fly higher
        const targetZ = heart.position.z + (Math.random() - 0.5) * 6;

        gsap.to(heart.position, {
            x: targetX,
            y: targetY,
            z: targetZ,
            duration: 5 + Math.random() * 2, // 5-7 seconds (much slower)
            ease: "power1.out" // Gentler easing
        });

        // Rotate hearts slowly
        gsap.to(heart.rotation, {
            z: Math.PI * 4 + Math.random() * Math.PI,
            duration: 6,
            ease: "linear"
        });

        // Fade out slowly
        gsap.to(heart.material, {
            opacity: 0,
            duration: 6, // Match the slow rise
            onComplete: () => {
                scene.remove(heart);
            }
        });
    }
}

function createStarField() {
    const starCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const r = 20 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const colorVal = 0.8 + Math.random() * 0.2;
        colors[i * 3] = colorVal;
        colors[i * 3 + 1] = colorVal;
        colors[i * 3 + 2] = 1; // Slight blue tint
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    starField = new THREE.Points(geometry, material);
    starField.name = 'starField';
    starField.visible = false;
    scene.add(starField);
}

function openGift() {
    // Prevent multiple opens
    if (giftBox.userData.canOpen === false) return;
    giftBox.userData.canOpen = false;

    // Animate lid flying off
    gsap.to(giftLid.position, {
        y: 5,
        duration: 1,
        ease: "power2.out"
    });

    gsap.to(giftLid.rotation, {
        x: Math.PI * 2,
        y: Math.PI,
        duration: 1,
        ease: "power2.out"
    });

    createConfetti();

    setTimeout(() => {
        transitionToScene(4); // Favours scene
    }, 2000);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// ===== PARTICLE EFFECTS =====
function createConfetti() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = 3;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

        const color = new THREE.Color();
        color.setHSL(Math.random(), 1, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        velocities.push({
            x: (Math.random() - 0.5) * 0.1,
            y: Math.random() * 0.2,
            z: (Math.random() - 0.5) * 0.1,
            rotationSpeed: Math.random() * 0.1
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 1
    });

    const confettiSystem = new THREE.Points(geometry, material);
    scene.add(confettiSystem);

    particles.push({
        system: confettiSystem,
        velocities: velocities,
        life: 3000,
        createdAt: Date.now()
    });
}

function createSmokeParticles(position) {
    const particleCount = 30;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = position.x + (Math.random() - 0.5) * 0.2;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x888888,
        transparent: true,
        opacity: 0.5
    });

    const smoke = new THREE.Points(geometry, material);
    scene.add(smoke);

    particles.push({
        system: smoke,
        velocities: Array(particleCount).fill({ x: 0, y: 0.05, z: 0 }),
        life: 1000,
        createdAt: Date.now()
    });
}

// ===== ANIMATION LOOP =====
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Rotate cake
    if (cake && cake.visible) {
        cake.rotation.y = time * 0.2;
    }

    // Animate flowers
    flowers.forEach((flower, i) => {
        flower.group.rotation.y = Math.sin(time + i) * 0.1;
        flower.light.intensity = 1 + Math.sin(time * 2 + i) * 0.3;
    });

    // Animate favour cards
    favourCards.forEach((card, i) => {
        card.mesh.position.y = 2 + Math.sin(time + i) * 0.2;
        card.mesh.rotation.y = -card.angle + Math.PI / 2 + Math.sin(time) * 0.1;
    });

    // Animate heart
    if (heart && heart.parent.visible) {
        const scale = 2 + Math.sin(time * 2) * 0.2;
        heart.scale.set(scale, scale, scale);
    }

    // Animate flame particles
    candles.forEach(candle => {
        if (candle.lit && candle.flame.visible) {
            const positions = candle.flame.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += (Math.random() - 0.5) * 0.02;
                positions[i + 1] += Math.random() * 0.02;
                positions[i + 2] += (Math.random() - 0.5) * 0.02;

                if (positions[i + 1] > 0.4) {
                    positions[i + 1] = 0;
                }
            }
            candle.flame.geometry.attributes.position.needsUpdate = true;
            candle.light.intensity = 2 + Math.sin(time * 10) * 0.5;
        }
    });

    // Starfield animation
    if (starField && starField.visible) {
        starField.rotation.y = time * 0.05;
        // Subtle twinkling
        const colors = starField.geometry.attributes.color.array;
        for (let i = 0; i < colors.length; i += 3) {
            // Only update some stars for performance
            if (Math.random() > 0.95) {
                const val = 0.5 + Math.random() * 0.5;
                colors[i] = val;
                colors[i + 1] = val;
            }
        }
        starField.geometry.attributes.color.needsUpdate = true;
    }

    // Name particles animation
    if (nameParticles && nameParticles.parent && nameParticles.parent.visible) {
        nameParticles.rotation.y = time * 0.3;
        nameParticles.rotation.x = Math.sin(time * 0.5) * 0.2;
    }

    // Subtle background shift based on mouse
    // Modify lights slightly to give "responsive" feel without breaking GSAP tweens on fog
    if (scene.children) {
        scene.children.forEach(child => {
            if (child.isDirectionalLight) {
                // Subtle oscillation based on mouse position
                child.position.x = 5 + (mouse.x || 0) * 1;
                child.position.z = 5 + (mouse.y || 0) * 1;
            }
        });
    }

    // Update particles
    particles = particles.filter(particle => {
        const age = Date.now() - particle.createdAt;
        if (age > particle.life) {
            scene.remove(particle.system);
            return false;
        }

        const positions = particle.system.geometry.attributes.position.array;
        particle.velocities.forEach((vel, i) => {
            positions[i * 3] += vel.x;
            positions[i * 3 + 1] -= 0.02; // Gravity
            positions[i * 3 + 2] += vel.z;
        });
        particle.system.geometry.attributes.position.needsUpdate = true;
        particle.system.material.opacity = 1 - (age / particle.life);

        return true;
    });

    controls.update();
    renderer.render(scene, camera);
}

// ===== EVENT HANDLERS =====
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Adjust camera distance for mobile to fit everything in view
    if (window.innerWidth < 768) {
        camera.position.z = 12; // Zoom out more on mobile
    } else {
        // We generally rely on the scene-specific camera transitions, 
        // but this helps if resizing happens during a static moment
    }
}

function startExperience() {
    document.getElementById('welcomeText').classList.remove('active');
    transitionToScene(1); // Go directly to flowers (name writes on flower background)

    // Try to play music
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.play().then(() => {
        document.getElementById('musicToggle').classList.add('playing');
    }).catch(() => {
        console.log('Music autoplay blocked');
    });
    transitionToScene(0);
}

// ===== START =====
window.addEventListener('DOMContentLoaded', init);
