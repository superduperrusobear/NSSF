// Example modernized 3js code – make sure to install/import your CSG library as needed:
import * as THREE from 'three';
import { CSG } from 'three-csg-ts'; // Changed from three-csgmesh to three-csg-ts

// Export the app function instead of auto-running it
export default function app() {
  // Try to find DOM elements, will be created by React
  const header = document.querySelector(".score-header");
  const difSelect = document.querySelector(".difficulty-select");
  const difButtons = difSelect.querySelectorAll("button");
  const tutorialBox = document.querySelector(".tutorial");
  const replayButton = document.querySelector(".replay");
  const gameContainer = document.querySelector(".game-container");

  // If any of the required elements don't exist, wait for them
  if (!header || !difSelect || !tutorialBox || !replayButton || !gameContainer) {
    console.warn("Game elements not found, waiting...");
    // Wait a bit and retry
    setTimeout(app, 100);
    return;
  }

  // Hide difficulty selector - always use BRUTAL mode
  difSelect.style.display = "none";
  
  // Auto-select BRUTAL mode (index 3) after the game initializes
  setTimeout(() => {
    const brutalButton = difButtons[3];
    if (brutalButton) {
      brutalButton.click();
    }
  }, 100);
  
  let scene, camera, renderer, hemiLight, pointLight;
  const touch = { hold: false, x: 0 };

  let difSelectActive = false;
  let scoreCounterActive = false;
  let replayBtnActive = false;

  let game = null;
  const randomInt = (min, max) => Math.round(Math.random() * (max - min)) + min;
  const skyColor = 0x0a0b0f;
  const pointLightZ = -60;
  let cameraY = 45;
  const cameraYMin = 7;
  const renderDistance = 8;
  const roadChunks = [];

  // ───────────────────────────────
  // Game and Object Classes (modern ES6)
  // ───────────────────────────────

    class Game {
    constructor({ difficulty, tutorial }) {
      const d = difficulty;
            this.difficulty = d >= 0 && d <= 3 ? d : 1;
      this.tutorial = tutorial === true;
            this.over = false;
            this.preparingNew = false;
            this.score = 0;
            this.noScoreXZone = 15;
            this.vehicles = [
                new Vehicle({
                    color: 0xff1717,
                    x: 0,
                    z: 0,
                    modelID: 0,
                    speed: 1,
                    acceleration: 0.001 * 2 ** d,
                    name: "Vehicle 0"
                })
            ];
            this.vehicleSpawns = this.vehicles.length;
            this.vehicleLimit = 9;
            this.vehicleIDCtrld = 0;
            this.spark = null;
        }
    }

    class RoadChunk {
        constructor(zSpaces) {
      const chunkSize = 40;
      const lineWidth = 1;
      const lineHeight = 4;
      const dotLines = 3;

            this.chunkSize = chunkSize;
      // Surface
            this.surfaceGeo = new THREE.PlaneGeometry(chunkSize, chunkSize);
      this.surfaceMat = new THREE.MeshLambertMaterial({ color: 0x575757 });
            this.surface = new THREE.Mesh(this.surfaceGeo, this.surfaceMat);
            this.surface.name = "Road Chunk";
            this.surface.rotation.x = -Math.PI / 2;
            this.surface.position.set(0, 0, zSpaces * chunkSize);
            this.surface.receiveShadow = true;
            scene.add(this.surface);

      // Shoulder lines
      const lineGeo = new THREE.PlaneGeometry(lineWidth, chunkSize);
      const lineMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const line = new THREE.Mesh(lineGeo, lineMat);
            line.receiveShadow = true;

      const leftShoulder = line.clone();
            leftShoulder.position.set(-chunkSize * 0.375, 0, 0.01);
            this.surface.add(leftShoulder);

      const rightShoulder = line.clone();
            rightShoulder.position.set(chunkSize * 0.375, 0, 0.01);
            this.surface.add(rightShoulder);

      // Dotted lines
      const dotLineGeo = new THREE.PlaneGeometry(lineWidth, lineHeight);
      const dotLineMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const dotLine = new THREE.Mesh(dotLineGeo, dotLineMat);

            for (let l = 0; l < dotLines; ++l) {
        const y = chunkSize / 2 - (chunkSize / dotLines) * l - lineHeight / 2;

        const leftLine = dotLine.clone();
                leftLine.position.set(-chunkSize * 0.125, y, 0.01);
                this.surface.add(leftLine);

        const rightLine = dotLine.clone();
                rightLine.position.set(chunkSize * 0.125, y, 0.01);
                this.surface.add(rightLine);
            }
        }
    }

  class Vehicle {
    constructor({ color, x, z, modelID, speed, acceleration, name }) {
      this.color = color || randomInt(0x171717, 0xcccccc);
      this.x = x || 0;
      this.z = z || 0;
      this.width = 1;
      this.height = 1;
      this.depth = 1;
      this.speed = speed || 1;
      this.acceleration = acceleration || 0;
      this.model = null;
      this.name = name || "";
      this.maxSpeed = 4;
      this.isSteering = false;
      this.steerAngle = 0;
      this.maxSteerAngle = 30;
      this.steerSpeed = 0.15;
      this.steerDir = "";
      this.xLimit = 20;
      this.crashed = false;
      this.deceleration = 0.01;

      let id = modelID;
      if (id === undefined) id = Math.round(Math.random() * 2);

      // Choose a vehicle model based on modelID
      switch (id) {
        case 1:
          this.width = 5;
          this.height = 5;
          this.depth = 10;
          this.model = new Truck(this.color, this.x, this.z, this.name);
          break;
        case 2:
          this.width = 5;
          this.height = 8;
          this.depth = 18;
          this.model = new TractorTrailer(this.color, this.x, this.z, this.name);
          break;
        default:
          this.width = 5;
          this.height = 4;
          this.depth = 10;
          this.model = new Car(this.color, this.x, this.z, this.name);
          break;
      }
    }
    accelerate() {
      if (this.speed < this.maxSpeed) {
        this.speed += this.acceleration;
        this.speed = +this.speed.toFixed(3);
      }
    }
    decelerate() {
      if (this.speed > 0) {
        this.speed -= this.deceleration;
        this.speed = +this.speed.toFixed(3);
        if (this.speed < 0) this.speed = 0;
      }
    }
    move() {
      const mesh = this.model.mesh;
      // Move forward
      this.z -= this.speed;
      mesh.position.z = this.z;

      // Handle steering
      if (this.isSteering && !this.crashed) {
        if (this.steerDir === "left") {
          this.x -= this.steerSpeed;
          if (this.steerAngle < this.maxSteerAngle) this.steerAngle++;
        } else if (this.steerDir === "right") {
          this.x += this.steerSpeed;
          if (this.steerAngle > -this.maxSteerAngle) this.steerAngle--;
        }
      } else if (!this.crashed) {
        if (this.steerAngle > 0) {
          this.steerAngle--;
          this.x -= this.steerSpeed;
        } else if (this.steerAngle < 0) {
          this.steerAngle++;
          this.x += this.steerSpeed;
        }
      }

      // Auto crash if out of bounds
      if (this.x < -this.xLimit || this.x > this.xLimit) {
        this.crashed = true;
        game.over = true;
      }

      mesh.position.x = this.x;
      mesh.rotation.y = (this.steerAngle * Math.PI) / 180;

      // If not crashed, update front wheel rotations
      if (!this.crashed) {
        const frontLeft = mesh.getObjectByName("FL");
        const frontRight = mesh.getObjectByName("FR");
        if (frontLeft) frontLeft.rotation.y = mesh.rotation.y;
        if (frontRight) frontRight.rotation.y = mesh.rotation.y;
      }
    }
    steer(dir) {
      this.isSteering = true;
      this.steerDir = dir;
    }
    straighten() {
      this.isSteering = false;
      this.steerDir = "";
    }
  }

  class Car {
    constructor(color, x, z, name) {
      this.mass = 3;
      this.mesh = new THREE.Group();
      this.mesh.name = name;
      this.mesh.position.set(x, 2, z);
      scene.add(this.mesh);

      // Build car body using CSG operations
      const carBodyBase = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 10));
      const cutFront = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 3));
      const cutBack = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 2));
      const frontTireHoles = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 5, 16, 1, false)
      );
      const backTireHoles = frontTireHoles.clone();

      cutFront.position.set(0, 1, -3.5);
      cutBack.position.set(0, 1, 4);
      frontTireHoles.position.set(0, -1.5, -3);
      frontTireHoles.rotation.z = (90 * Math.PI) / 180;
      backTireHoles.position.set(0, -1.5, 3);
      backTireHoles.rotation.z = frontTireHoles.rotation.z;

      carBodyBase.updateMatrix();
      cutFront.updateMatrix();
      cutBack.updateMatrix();
      frontTireHoles.updateMatrix();
      backTireHoles.updateMatrix();

      const bspCarBody = CSG.fromMesh(carBodyBase)
        .subtract(CSG.fromMesh(cutFront))
        .subtract(CSG.fromMesh(cutBack))
        .subtract(CSG.fromMesh(frontTireHoles))
        .subtract(CSG.fromMesh(backTireHoles));
      const carBody = CSG.toMesh(bspCarBody, carBodyBase.matrix);
      carBody.material = new THREE.MeshLambertMaterial({ color: color });
      carBody.position.set(0, 0.5, 0);
      carBody.castShadow = true;
      this.mesh.add(carBody);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(1, 1, 0.5, 24, 1, false);
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x171717 });
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.castShadow = true;
      wheel.rotation.z = -0.5 * Math.PI;

      const wheelPos = [
        { x: -2.25, y: -1, z: 3, name: "BL" },
        { x: 2.25, y: -1, z: 3, name: "BR" },
        { x: -2.25, y: -1, z: -3, name: "FL" },
        { x: 2.25, y: -1, z: -3, name: "FR" }
      ];
      wheelPos.forEach(p => {
        const w = wheel.clone();
        w.name = p.name;
        w.position.set(p.x, p.y, p.z);
        this.mesh.add(w);
      });

      // Windows
      const windowMat = new THREE.MeshLambertMaterial({ color: 0x171717 });
      const horzWindow = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 0.8), windowMat);
      const midFrontWindow = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.8), windowMat);
      const midBackWindow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.8), windowMat);
      horzWindow.receiveShadow = true;
      midFrontWindow.receiveShadow = true;
      midBackWindow.receiveShadow = true;

      const leftMFWindow = midFrontWindow.clone();
      leftMFWindow.position.set(-2.51, 1.4, -0.4);
      leftMFWindow.rotation.y = -0.5 * Math.PI;
      this.mesh.add(leftMFWindow);

      const rightMFWindow = midFrontWindow.clone();
      rightMFWindow.position.set(2.51, 1.4, -0.4);
      rightMFWindow.rotation.y = 0.5 * Math.PI;
      this.mesh.add(rightMFWindow);

      const leftMBWindow = midBackWindow.clone();
      leftMBWindow.position.set(-2.51, 1.4, 1.9);
      leftMBWindow.rotation.y = -0.5 * Math.PI;
      this.mesh.add(leftMBWindow);

      const rightMBWindow = midBackWindow.clone();
      rightMBWindow.position.set(2.51, 1.4, 1.9);
      rightMBWindow.rotation.y = 0.5 * Math.PI;
      this.mesh.add(rightMBWindow);

      const frontWindow = horzWindow.clone();
      frontWindow.position.set(0, 1.4, -2.01);
      frontWindow.rotation.y = Math.PI;
      this.mesh.add(frontWindow);

      const backWindow = horzWindow.clone();
      backWindow.position.set(0, 1.4, 3.01);
      this.mesh.add(backWindow);

      // Lights
      const lightGeo = new THREE.PlaneGeometry(1, 0.5);
      const frontLightMat = new THREE.MeshLambertMaterial({ color: 0xf1f1f1 });
      const frontLight = new THREE.Mesh(lightGeo, frontLightMat);
      const backLightMat = new THREE.MeshLambertMaterial({ color: 0xf65555 });
      const backLight = new THREE.Mesh(lightGeo, backLightMat);
      frontLight.rotation.y = Math.PI;

      const frontLeftLight = frontLight.clone();
      frontLeftLight.position.set(-2, 0.25, -5.01);
      this.mesh.add(frontLeftLight);

      const frontRightLight = frontLight.clone();
      frontRightLight.position.set(2, 0.25, -5.01);
      this.mesh.add(frontRightLight);

      const backLeftLight = backLight.clone();
      backLeftLight.position.set(-2, 0.25, 5.01);
      this.mesh.add(backLeftLight);

      const backRightLight = backLight.clone();
      backRightLight.position.set(2, 0.25, 5.01);
      this.mesh.add(backRightLight);
    }
  }

  class Truck {
    constructor(color, x, z, name) {
      this.mass = 4;
      this.mesh = new THREE.Group();
      this.mesh.name = name;
      this.mesh.position.set(x, 2.5, z);
      scene.add(this.mesh);

      const truckBodyBase = new THREE.Mesh(new THREE.BoxGeometry(5, 4, 10));
      const cutFront = new THREE.Mesh(new THREE.BoxGeometry(5, 1.5, 2.5));
      const cutBack = new THREE.Mesh(new THREE.BoxGeometry(5, 1.5, 4.5));
      const frontTireHoles = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 5, 16, 1, false)
      );
      const backTireHoles = frontTireHoles.clone();
      const trunk = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.5, 4));

      cutFront.position.set(0, 1.25, -3.75);
      cutBack.position.set(0, 1.25, 3);
      frontTireHoles.position.set(0, -2, -3);
      frontTireHoles.rotation.z = (90 * Math.PI) / 180;
      backTireHoles.position.set(0, -2, 3);
      backTireHoles.rotation.z = frontTireHoles.rotation.z;
      trunk.position.set(0, 0.1, 2.75);

      truckBodyBase.updateMatrix();
      cutFront.updateMatrix();
      cutBack.updateMatrix();
      frontTireHoles.updateMatrix();
      backTireHoles.updateMatrix();
      trunk.updateMatrix();

      const bspTruck = CSG.fromMesh(truckBodyBase)
        .subtract(CSG.fromMesh(cutFront))
        .subtract(CSG.fromMesh(cutBack))
        .subtract(CSG.fromMesh(frontTireHoles))
        .subtract(CSG.fromMesh(backTireHoles))
        .subtract(CSG.fromMesh(trunk));
      const truckBody = CSG.toMesh(bspTruck, truckBodyBase.matrix);
      truckBody.material = new THREE.MeshLambertMaterial({ color: color });
      truckBody.position.set(0, 0.5, 0);
      truckBody.castShadow = true;
      this.mesh.add(truckBody);

      const wheelGeo = new THREE.CylinderGeometry(1, 1, 0.5, 24, 1, false);
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x171717 });
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.castShadow = true;
      wheel.rotation.z = -0.5 * Math.PI;

      const wheelPos = [
        { x: -2.25, y: -1.5, z: 3, name: "BL" },
        { x: 2.25, y: -1.5, z: 3, name: "BR" },
        { x: -2.25, y: -1.5, z: -3, name: "FL" },
        { x: 2.25, y: -1.5, z: -3, name: "FR" }
      ];
      wheelPos.forEach(p => {
        const w = wheel.clone();
        w.name = p.name;
        w.position.set(p.x, p.y, p.z);
        this.mesh.add(w);
      });

      const lightGeo = new THREE.PlaneGeometry(0.75, 1);
      const frontLightMat = new THREE.MeshLambertMaterial({ color: 0xf1f1f1 });
      const frontLight = new THREE.Mesh(lightGeo, frontLightMat);
      const backLightMat = new THREE.MeshLambertMaterial({ color: 0xf65555 });
      const backLight = new THREE.Mesh(lightGeo, backLightMat);
      frontLight.rotation.y = Math.PI;

      const frontLeftLight = frontLight.clone();
      frontLeftLight.position.set(-2.125, 0.25, -5.01);
      this.mesh.add(frontLeftLight);

      const frontRightLight = frontLight.clone();
      frontRightLight.position.set(2.125, 0.25, -5.01);
      this.mesh.add(frontRightLight);

      const backLeftLight = backLight.clone();
      backLeftLight.position.set(-2.125, 0.25, 5.01);
      this.mesh.add(backLeftLight);

      const backRightLight = backLight.clone();
      backRightLight.position.set(2.125, 0.25, 5.01);
      this.mesh.add(backRightLight);
    }
  }

  class TractorTrailer {
    constructor(color, x, z, name) {
      this.mass = 12;
      this.mesh = new THREE.Group();
      this.mesh.name = name;
      this.mesh.position.set(x, 4, z);
      scene.add(this.mesh);

      const cabPt1 = new THREE.Mesh(
        new THREE.BoxGeometry(5, 4, 5),
        new THREE.MeshLambertMaterial({ color: color })
      );
      cabPt1.position.set(0, 1, -6.5);
      cabPt1.castShadow = true;
      this.mesh.add(cabPt1);

      const cabPt2 = new THREE.Mesh(
        new THREE.BoxGeometry(5, 2, 0.5),
        new THREE.MeshLambertMaterial({ color: color })
      );
      cabPt2.position.set(0, -2, -8.75);
      cabPt2.castShadow = true;
      this.mesh.add(cabPt2);

      const cabPt3 = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 8.25),
        new THREE.MeshLambertMaterial({ color: 0x3f3f3f })
      );
      cabPt3.position.set(0, -2, -4.375);
      cabPt3.castShadow = true;
      this.mesh.add(cabPt3);

      const cabLeftWindow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.5, 2),
        new THREE.MeshLambertMaterial({ color: 0x171717 })
      );
      cabLeftWindow.position.set(-2.51, 1, -7.75);
      cabLeftWindow.rotation.y = -0.5 * Math.PI;
      cabLeftWindow.receiveShadow = true;
      this.mesh.add(cabLeftWindow);

      const cabRightWindow = cabLeftWindow.clone();
      cabRightWindow.position.x = -cabLeftWindow.position.x;
      cabRightWindow.rotation.y = -cabLeftWindow.rotation.y;
      this.mesh.add(cabRightWindow);

      const cabFrontWindow = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 2),
        new THREE.MeshLambertMaterial({ color: 0x171717 })
      );
      cabFrontWindow.position.set(0, 1, -9.01);
      cabFrontWindow.rotation.y = Math.PI;
      cabFrontWindow.receiveShadow = true;
      this.mesh.add(cabFrontWindow);

      const light = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshLambertMaterial({ color: 0xf1f1f1 })
      );
      light.rotation.y = Math.PI;
      const leftLight = light.clone();
      leftLight.position.set(-1.5, -1.5, -9.01);
      this.mesh.add(leftLight);
      const rightLight = light.clone();
      rightLight.position.set(1.5, -1.5, -9.01);
      this.mesh.add(rightLight);

      const cabLeftCylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 0.75, 2.25, 16, 1, false),
        new THREE.MeshLambertMaterial({ color: 0x7f7f7f })
      );
      cabLeftCylinder.position.set(-2.25, -1.875, -3.875);
      cabLeftCylinder.rotation.x = -0.5 * Math.PI;
      cabLeftCylinder.castShadow = true;
      this.mesh.add(cabLeftCylinder);

      const cabRightCylinder = cabLeftCylinder.clone();
      cabRightCylinder.position.x = -cabLeftCylinder.position.x;
      this.mesh.add(cabRightCylinder);

      const trailer = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 12),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );
      trailer.position.set(0, 1.5, 3);
      trailer.castShadow = true;
      this.mesh.add(trailer);

      const trailerBottom = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 2),
        new THREE.MeshLambertMaterial({ color: 0x3f3f3f })
      );
      trailerBottom.position.set(0, -2, 7);
      trailerBottom.castShadow = true;
      this.mesh.add(trailerBottom);

      const wheelGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 24, 1, false);
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x242424 });
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.castShadow = true;
      wheel.rotation.z = -0.5 * Math.PI;

      const wheelPos = [
        { x: -2, y: -2.5, z: 7, name: "BL" },
        { x: 2, y: -2.5, z: 7, name: "BR" },
        { x: -2, y: -2.5, z: -1, name: "ML" },
        { x: 2, y: -2.5, z: -1, name: "MR" },
        { x: -2, y: -2.5, z: -6.75, name: "FL" },
        { x: 2, y: -2.5, z: -6.75, name: "FR" }
      ];
      wheelPos.forEach(p => {
        const w = wheel.clone();
        w.name = p.name;
        w.position.set(p.x, p.y, p.z);
        this.mesh.add(w);
      });
    }
  }

  class Spark {
    constructor(x, y, z, isHorz = false) {
      this.center = new THREE.Group();
      this.center.name = "Spark";
      this.center.position.set(x, y, z);
      scene.add(this.center);
      this.isHorz = isHorz;
      this.particles = [];

      const particleGeo = new THREE.SphereGeometry(1, 16, 16);
      const particleMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const particleMesh = new THREE.Mesh(particleGeo, particleMat);

      for (let m = 0; m < randomInt(6, 8); ++m) {
        const particle = {
          x: 0,
          y: 0,
          z: 0,
          size: 1,
          speed: 0.2,
          decay: 0.04,
          angle: randomInt(0, 359),
          mesh: particleMesh.clone()
        };
        this.particles.push(particle);
        this.center.add(particle.mesh);
      }
    }
    moveParticles() {
      this.particles.forEach(p => {
        if (p.size > 0) {
          p.size -= p.decay;
          if (this.isHorz) {
            p.x += p.speed * Math.sin((p.angle * Math.PI) / 180);
            p.mesh.position.x = p.x;
          } else {
            p.z += p.speed * Math.sin((p.angle * Math.PI) / 180);
            p.mesh.position.z = p.z;
          }
          p.y += p.speed * Math.cos((p.angle * Math.PI) / 180);
          p.mesh.position.y = p.y;
          p.mesh.scale.set(p.size, p.size, p.size);
        }
      });
    }
  }

  // ───────────────────────────────
  // Initialization and Animation
  // ───────────────────────────────

  const init = () => {
        scene = new THREE.Scene();
    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.Fog(skyColor, 10, 200);

    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, cameraY, 60);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add the renderer's canvas to the DOM
    gameContainer.appendChild(renderer.domElement);
    
    // Add hemisphere light (ambient light)
    hemiLight = new THREE.HemisphereLight(0xffffff, skyColor, 0.6); // Increased intensity for better visibility
    hemiLight.position.set(0, 50, 0);
        scene.add(hemiLight);

    // Add directional light (sun)
    pointLight = new THREE.DirectionalLight(0xffffff, 1.0); // Increased intensity
    pointLight.position.set(-10, 50, pointLightZ);
        pointLight.castShadow = true;
    
    // Configure shadow properties for better visibility in dark theme
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 200;
    pointLight.shadow.camera.left = -50;
    pointLight.shadow.camera.right = 50;
    pointLight.shadow.camera.top = 50;
    pointLight.shadow.camera.bottom = -50;
    pointLight.shadow.bias = -0.0005;
    
        scene.add(pointLight);

    // Style renderer
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    // Road chunks
    for (let r = 1; r > -renderDistance; --r) {
            roadChunks.push(new RoadChunk(r));
    }

    // Grass
    const firstChunkSize = roadChunks[0].chunkSize;
    const grassDepth = firstChunkSize * (renderDistance + 1);
    const grassGeo = new THREE.PlaneGeometry(400, grassDepth);
    const grassMat = new THREE.MeshLambertMaterial({ color: 0xbbe868 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
        grass.name = "Grass";
        grass.rotation.x = -Math.PI / 2;
        grass.position.set(0, -0.05, -grassDepth / 2 + firstChunkSize * 1.5);
        grass.receiveShadow = true;
        scene.add(grass);

    // Fog
        scene.fog = new THREE.Fog(skyColor, 0.01, grassDepth - firstChunkSize * 2);

    // Camera
        camera.position.set(0, cameraYMin, 30);
        camera.lookAt(scene.position);

    // Check if replay button exists, if not create it
    let replayBtn = gameContainer.querySelector('.replay');
    if (!replayBtn) {
      replayBtn = document.createElement('div');
      replayBtn.className = 'replay';
      replayBtn.textContent = 'PLAY AGAIN';
      // Make the button invisible by setting opacity to 0 and pointer-events to none
      replayBtn.style.opacity = '0';
      replayBtn.style.pointerEvents = 'none';
      gameContainer.appendChild(replayBtn);
    }
  };

  const checkCollision = (a, b) => {
    if (!a.crashed && !b.crashed && a.name !== b.name) {
      const A_left = a.x - a.width / 2;
      const A_right = a.x + a.width / 2;
      const A_front = a.z - a.depth / 2;
      const A_back = a.z + a.depth / 2;
      const B_left = b.x - b.width / 2;
      const B_right = b.x + b.width / 2;
      const B_front = b.z - b.depth / 2;
      const B_back = b.z + b.depth / 2;

      const touchedX_RL = A_left <= B_right && A_left >= B_left;
      const touchedX_LR = A_right >= B_left && A_right <= B_right;
      const touchedZ_FB = A_front <= B_back && A_front >= B_front;
      const touchedZ_BF = A_back >= B_front && A_back <= B_back;

      if ((touchedX_RL || touchedX_LR) && (touchedZ_FB || touchedZ_BF)) {
        const newMomentum = (a.model.mass * a.speed + b.model.mass * b.speed) / (a.model.mass + b.model.mass);
        a.speed = newMomentum;
        b.speed = newMomentum;

        let sx = 0, sz = 0;
        if (A_left <= B_right) sx = (A_left + B_right) / 2;
        else if (A_right >= B_left) sx = (A_right + B_left) / 2;
        if (A_front <= B_back) sz = (A_front + B_back) / 2;
        else if (A_back >= B_front) sz = (A_back + B_front) / 2;

        if (a.name === "Vehicle 0") {
          a.crashed = true;
          game.over = true;
          game.spark = new Spark(sx, a.height / 2, sz, A_front - B_back < 1);
        }
      }
    }
  };

  const toggleDifBtnStates = () => {
    difButtons.forEach(b => (b.disabled = !b.disabled));
  };

  const toggleDifMenu = () => {
    difSelectActive = !difSelectActive;
    const activeClass = "menu-active";
    const inactiveClass = "menu-inactive";

    if (difSelectActive) {
      difSelect.classList.remove(inactiveClass);
      void difSelect.offsetWidth;
      difSelect.classList.add(activeClass);
      setTimeout(toggleDifBtnStates, 1500);
    } else {
      difSelect.classList.remove(activeClass);
      void difSelect.offsetWidth;
      difSelect.classList.add(inactiveClass);
      toggleDifBtnStates();
    }
  };

  const toggleScoreCounter = () => {
    scoreCounterActive = !scoreCounterActive;
    const activeClass = "score-active";
    if (scoreCounterActive) header.classList.add(activeClass);
    else header.classList.remove(activeClass);
  };

  const toggleReplayBtn = () => {
    replayBtnActive = !replayBtnActive;
    replayButton.disabled = !replayBtnActive;
    const activeClass = "replay-active";
    if (replayBtnActive) replayButton.classList.add(activeClass);
    else replayButton.classList.remove(activeClass);
  };

  const showTutorial = () => {
    if (game.tutorial) tutorialBox.classList.add("tutorial-active");
  };

  const hideTutorial = () => {
    if (game.tutorial) {
      game.tutorial = false;
      tutorialBox.classList.remove("tutorial-active");
    }
  };

  const startGame = difficulty => {
    if (game !== null && game.over) {
      if (game.spark !== null) {
        const sparkObj = scene.getObjectByName(game.spark.center.name);
        scene.remove(sparkObj);
      }
      game.vehicles.forEach(v => {
        const vehicleObj = scene.getObjectByName(v.name);
        scene.remove(vehicleObj);
      });
    }

    if (game === null || game.over) {
      game = new Game({ difficulty, tutorial: game === null });
      header.innerHTML = game.score;
      toggleScoreCounter();
      showTutorial();
    }
  };

  const update = () => {
    // Intro sequence: adjust camera height
    if (cameraY > cameraYMin) {
      cameraY -= 0.5;
      if (cameraY <= cameraYMin) {
        cameraY = cameraYMin;
        toggleDifMenu();
      }
    }

    if (game !== null && cameraY === cameraYMin) {
      const firstChunkSize = roadChunks[0].chunkSize;
      const vehicleCtrld = game.vehicles[game.vehicleIDCtrld];
      if (vehicleCtrld.z <= -firstChunkSize) {
        const vehiclesBehind = [];
        game.vehicles.forEach((e, i) => {
          e.z += firstChunkSize;
          if (e.z - e.depth / 2 > vehicleCtrld.z + firstChunkSize / 2) {
            vehiclesBehind.push({ index: i, name: e.name });
          }
        });
        vehiclesBehind.sort((a, b) => b.index - a.index);
        vehiclesBehind.forEach(v => {
          const obj = scene.getObjectByName(v.name);
          scene.remove(obj);
          game.vehicles.splice(v.index, 1);
          if (Math.abs(vehicleCtrld.x) < game.noScoreXZone) {
            game.score++;
            header.innerHTML = game.score;
          }
        });

        if (game.vehicles.length < game.vehicleLimit && !game.tutorial) {
          let spawnTries = 3;
          while (spawnTries--) {
            if (Math.random() < 0.05 + game.difficulty * 0.025) {
              game.vehicles.push(
                new Vehicle({
                  x: (-1 + spawnTries) * 10,
                  z: -renderDistance * firstChunkSize - spawnTries * 15,
                  name: "Vehicle " + game.vehicleSpawns
                })
              );
              game.vehicleSpawns++;
            }
          }
        }
      }

      const vehiclesAhead = [];
      game.vehicles.forEach((e, i) => {
        e.move();
        game.vehicles.forEach(v => checkCollision(e, v));
        if (!game.tutorial) {
          if (!e.crashed) e.accelerate();
          else {
            e.decelerate();
            if (e.steerAngle > 0) e.steerAngle += e.speed * e.steerSpeed;
            else if (e.steerAngle < 0) e.steerAngle -= e.speed * e.steerSpeed;
          }
        }
        if (e.z < (-renderDistance - 1.5) * firstChunkSize) {
          vehiclesAhead.push({ index: i, name: e.name });
        }
      });
      vehiclesAhead.sort((a, b) => b.index - a.index);
      vehiclesAhead.forEach(v => {
        const obj = scene.getObjectByName(v.name);
        scene.remove(obj);
        game.vehicles.splice(v.index, 1);
      });

      if (game.spark !== null) {
        game.spark.moveParticles();
        game.spark.center.position.z = vehicleCtrld.z - (game.spark.isHorz ? vehicleCtrld.depth / 2 : 0);
      }

      if (vehicleCtrld.speed <= 0 && game.over && !game.preparingNew && !replayBtnActive) {
        toggleReplayBtn();
      }

      pointLight.position.z = vehicleCtrld.z + pointLightZ;
      camera.position.set(0, cameraY, vehicleCtrld.z + 30);
    } else {
      pointLight.position.z = pointLightZ;
      camera.position.set(0, cameraY, 30);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(update);
  };

  const adjustWindow = () => {
    if (!gameContainer || !renderer || !camera) return;
    
    // Update camera aspect ratio based on container size
    camera.aspect = gameContainer.clientWidth / gameContainer.clientHeight;
    camera.updateProjectionMatrix();
    
    // Resize renderer to match container
    renderer.setSize(gameContainer.clientWidth, gameContainer.clientHeight);
  };

  const steerVehicle = e => {
    if (game !== null && !game.over && game.vehicles.length) {
      const playerVehicle = game.vehicles[game.vehicleIDCtrld];
      if (
        (e.keyCode && (e.keyCode === 37 || e.keyCode === 65)) ||
        (touch.hold && e.pageX < touch.x)
      ) {
        playerVehicle.steer("left");
        hideTutorial();
      } else if (
        (e.keyCode && (e.keyCode === 39 || e.keyCode === 68)) ||
        (touch.hold && e.pageX > touch.x)
      ) {
        playerVehicle.steer("right");
        hideTutorial();
      }
    }
  };

  const straightenVehicle = () => {
    if (game !== null && !game.over && game.vehicles.length) {
      game.vehicles[game.vehicleIDCtrld].straighten();
    }
    touch.hold = false;
  };

  const getTouchHold = e => {
    touch.hold = true;
    touch.x = e.pageX;
  };

  // Initialize and start the game loop
    init();
    update();

  // Use window resize events to keep the game responsive
    window.addEventListener("resize", adjustWindow);

  // Use pointer/mouse events for steering
  const downEvent = "ontouchstart" in document.documentElement ? "touchstart" : "mousedown";
  const moveEvent = "ontouchmove" in document.documentElement ? "touchmove" : "mousemove";
  const upEvent = "ontouchend" in document.documentElement ? "touchend" : "mouseup";

    document.addEventListener("keydown", steerVehicle);
    document.addEventListener("keyup", straightenVehicle);
    document.addEventListener(downEvent, getTouchHold);
    document.addEventListener(moveEvent, steerVehicle);
    document.addEventListener(upEvent, straightenVehicle);

  // Difficulty buttons
  difButtons.forEach(b => {
        b.addEventListener("click", function () {
            toggleDifMenu();
            setTimeout(() => {
        startGame(this.getAttribute("data-difficulty"));
            }, 1600);
        });
  });

  // Replay button
    replayButton.addEventListener("click", function () {
        game.preparingNew = true;
        toggleScoreCounter();
        toggleReplayBtn();
        setTimeout(toggleDifMenu, 250);
    });
}

// Don't auto-run on DOMContentLoaded - React will call this function instead
// window.addEventListener("DOMContentLoaded", app);
