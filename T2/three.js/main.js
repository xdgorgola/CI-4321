import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
scene.background = new THREE.Color(0.05, 0.05, 0.09);

const aspect = window.innerWidth / window.innerHeight;
// Setting up the renderer and adding it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Defining the tri vertices
const triVerts = [
    { pos: [-0.5, -0.5,  0], norm: [0, 0, 1], uv: [0, 0], color: [0, 1, 0, 1] },
    { pos: [ 0.5, -0.5,  0], norm: [0, 0, 1], uv: [0, 1], color: [0, 0, 1, 1] },
    { pos: [0,  0.87,  0], norm: [0, 0, 1], uv: [1, 0], color: [1, 0, 0, 1] }
];

const positions = [];
const normals = [];
const uvs = [];
const colors = [];
for (const vertex of triVerts) {
    positions.push(...vertex.pos);
    normals.push(...vertex.norm);
    uvs.push(...vertex.uv);
    colors.push(...vertex.color);
}

// Creating tri geometry by passing its attributes
const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(positions), 3)
);

geometry.setAttribute(
    'normal',
    new THREE.BufferAttribute(new Float32Array(normals), 3)
);

geometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(new Float32Array(uvs), 2)
);


geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 4)
)

// Setting up material, creating the mesh to display and adding it to the scene
const material = new THREE.MeshBasicMaterial({vertexColors: true});
const tri = new THREE.Mesh(geometry, material);
scene.add(tri);

camera.position.z = 5;
renderer.setAnimationLoop(animate);

// Main loop call
function animate() {
    renderer.render(scene, camera);
}