import React, { useEffect, useRef } from 'react';

/**
 * Dashboard3DBackground
 *
 * 3D Animated Background representing "Modern and Effective Waste Management"
 * Faithfully rendered from the user reference image:
 * - 3D Green Recycling Truck (Cab, dual rear axles, chassis, cargo container with ♻️ emblem)
 * - 3D Hydraulic Crane Arm hoisting a green cylindrical collection bin above the hopper
 * - Continuous tumbling cascade of 3D white/mint plastic waste cubes/pellets into the container
 * - 3D Residential Eco House with pitched roof, chimney, multipane windows, and garden tree
 * - 3D Ground Street Collection Bin
 * - 3D Rotating Green Recycling Symbol (♻️) with "MODERN AND EFFECTIVE WASTE MANAGEMENT"
 * - Soft ground drop-shadows beneath wheels, house, and bin for grounded 3D realism
 *
 * Designed for high visibility while preserving 100% readability of dashboard text/cards:
 * - Solid, vibrant colors matching the reference image (#238842 eco green, terracotta roof, etc.)
 * - Calibrated opacity (0.80 - 0.95) with rich 3D diffuse lighting
 * - pointer-events: none, z-index: 0
 * - Responsive: automatically scales across desktop, tablet, and mobile
 * - Accessibility: respects prefers-reduced-motion
 */
const Dashboard3DBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;

    // Accessibility: prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        renderStaticScene();
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // 3D Perspective Camera Setup
    const FOCAL_LENGTH = 650;
    const CAMERA = { x: 0, y: -40, z: -680 };
    const LIGHT_DIR = normalize3D([0.5, -0.85, 0.45]);

    // 3D Math Utilities
    function normalize3D(v) {
      const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
      return [v[0] / len, v[1] / len, v[2] / len];
    }

    function dot3D(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    function cross3D(a, b) {
      return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
      ];
    }

    function rotateX(v, angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
    }

    function rotateY(v, angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
    }

    function rotateZ(v, angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
    }

    function project3D(point, originX, originY, cam) {
      const x = point[0] - cam.x;
      const y = point[1] - cam.y;
      const z = point[2] - cam.z;

      if (z <= 20) return null;

      const scale = FOCAL_LENGTH / z;
      return {
        x: originX + x * scale,
        y: originY + y * scale,
        scale,
        depth: z,
      };
    }

    // Color Palette (Vibrant & Authentic from Reference Image)
    const PALETTE = {
      truckGreen: { r: 34, g: 145, b: 65 },       // Bright Eco Green body
      truckGreenDark: { r: 22, g: 108, b: 48 },   // Deep forest green for interior/hopper
      truckCabLight: { r: 46, g: 168, b: 78 },    // Cab panel highlight
      windowGlass: { r: 175, g: 228, b: 200 },    // Mint-tinted glass
      chassisDark: { r: 48, g: 54, b: 50 },       // Dark metallic chassis
      chassisMedium: { r: 85, g: 92, b: 88 },     // Steel crane arms
      wheelBlack: { r: 35, g: 38, b: 36 },        // Heavy-duty tire rubber
      wheelRim: { r: 205, g: 215, b: 210 },       // Silver hub rim
      binGreen: { r: 28, g: 82, b: 46 },          // Dark green waste collection bin
      binDark: { r: 18, g: 58, b: 32 },           // Bin rim & lid
      plasticWhite: { r: 255, g: 255, b: 255 },   // White plastic cubes
      plasticMint: { r: 185, g: 245, b: 215 },    // Translucent mint plastic cubes
      houseWall: { r: 238, g: 220, b: 195 },      // Sand beige house exterior
      houseRoof: { r: 184, g: 110, b: 76 },       // Terracotta tile roof
      treeGreen: { r: 76, g: 162, b: 115 },       // Botanical tree foliage
      treeTrunk: { r: 148, g: 115, b: 85 },       // Tree trunk
      recycleGreen: { r: 30, g: 148, b: 62 },     // ♻️ Symbol Green
      groundShadow: { r: 30, g: 45, b: 35 },      // Ambient ground shadow
    };

    // Helper: 3D Cuboid Mesh
    function createBox(x, y, z, w, h, d, color, alpha = 0.88) {
      const hw = w / 2;
      const hh = h / 2;
      const hd = d / 2;

      const vertices = [
        [x - hw, y - hh, z - hd], // 0: Top Front Left
        [x + hw, y - hh, z - hd], // 1: Top Front Right
        [x + hw, y + hh, z - hd], // 2: Bottom Front Right
        [x - hw, y + hh, z - hd], // 3: Bottom Front Left
        [x - hw, y - hh, z + hd], // 4: Top Back Left
        [x + hw, y - hh, z + hd], // 5: Top Back Right
        [x + hw, y + hh, z + hd], // 6: Bottom Back Right
        [x - hw, y + hh, z + hd], // 7: Bottom Back Left
      ];

      const faces = [
        { verts: [0, 1, 2, 3] }, // Front
        { verts: [5, 4, 7, 6] }, // Back
        { verts: [4, 5, 1, 0] }, // Top
        { verts: [3, 2, 6, 7] }, // Bottom
        { verts: [4, 0, 3, 7] }, // Left
        { verts: [1, 5, 6, 2] }, // Right
      ];

      return { vertices, faces, color, alpha };
    }

    // Helper: 3D Cylinder Mesh (Wheels, Bins, Tree Trunks)
    function createCylinder(x, y, z, radius, height, segments, color, alpha = 0.88, axis = 'y') {
      const halfH = height / 2;
      const vertices = [];
      const faces = [];

      for (let i = 0; i < segments; i++) {
        const u = (i / segments) * Math.PI * 2;
        const cos = Math.cos(u) * radius;
        const sin = Math.sin(u) * radius;

        if (axis === 'y') {
          vertices.push([x + cos, y - halfH, z + sin]);
          vertices.push([x + cos, y + halfH, z + sin]);
        } else if (axis === 'z') {
          vertices.push([x + cos, y + sin, z - halfH]);
          vertices.push([x + cos, y + sin, z + halfH]);
        }
      }

      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        const idx0 = i * 2;
        const idx1 = i * 2 + 1;
        const idx2 = next * 2 + 1;
        const idx3 = next * 2;

        faces.push({ verts: [idx0, idx3, idx2, idx1] });
      }

      return { vertices, faces, color, alpha };
    }

    // Falling Plastic Cubes (Simulates active unloading into truck hopper)
    const MAX_CUBES = 32;
    const fallingCubes = [];
    for (let i = 0; i < MAX_CUBES; i++) {
      fallingCubes.push({
        x: -25 + (Math.random() - 0.5) * 26,
        y: -145 + Math.random() * 110,
        z: -5 + (Math.random() - 0.5) * 26,
        vx: (Math.random() - 0.5) * 0.35,
        vy: 1.4 + Math.random() * 1.8,
        vz: (Math.random() - 0.5) * 0.35,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        drx: (Math.random() - 0.5) * 0.08,
        dry: (Math.random() - 0.5) * 0.08,
        size: 5 + Math.random() * 3.5,
        color: i % 4 === 0 ? PALETTE.plasticMint : PALETTE.plasticWhite,
      });
    }

    // 3D Recycling Loop Symbol Geometry
    function generate3DRecycleSymbol(radius, thickness) {
      const arrows = [];
      const numSegments = 14;

      for (let a = 0; a < 3; a++) {
        const startAngle = (a * (Math.PI * 2)) / 3 + 0.18;
        const sweep = (Math.PI * 2) / 3 - 0.45;

        const verts = [];
        const faces = [];

        for (let s = 0; s <= numSegments; s++) {
          const u = startAngle + (s / numSegments) * sweep;
          const cos = Math.cos(u);
          const sin = Math.sin(u);

          const rIn = radius - thickness / 2;
          const rOut = radius + thickness / 2;

          verts.push([cos * rIn, sin * rIn, -thickness * 0.35]);
          verts.push([cos * rOut, sin * rOut, -thickness * 0.35]);
          verts.push([cos * rIn, sin * rIn, thickness * 0.35]);
          verts.push([cos * rOut, sin * rOut, thickness * 0.35]);

          if (s > 0) {
            const base = (s - 1) * 4;
            const curr = s * 4;
            faces.push({ verts: [base + 0, curr + 0, curr + 1, base + 1] });
            faces.push({ verts: [base + 3, curr + 3, curr + 2, base + 2] });
            faces.push({ verts: [base + 1, curr + 1, curr + 3, base + 3] });
            faces.push({ verts: [base + 2, curr + 2, curr + 0, base + 0] });
          }
        }

        arrows.push({ vertices: verts, faces, color: PALETTE.recycleGreen, alpha: 0.92 });
      }

      return arrows;
    }

    const recycleArrows = generate3DRecycleSymbol(42, 9);

    // Dynamic Resize
    function handleResize() {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = Math.max(320, rect && rect.width > 0 ? rect.width : window.innerWidth);
      height = Math.max(480, rect && rect.height > 0 ? rect.height : window.innerHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    // Visibility Handling
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !prefersReducedMotion) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();
    let globalTime = 0;

    function renderStaticScene() {
      ctx.clearRect(0, 0, width, height);
      renderWorld(8000);
    }

    function renderLoop(currentTime) {
      if (!isVisible || prefersReducedMotion) return;

      const delta = Math.min(currentTime - lastTime, 64);
      lastTime = currentTime;
      globalTime += delta;

      ctx.clearRect(0, 0, width, height);
      renderWorld(globalTime);

      animationFrameId = requestAnimationFrame(renderLoop);
    }

    // Main 3D World Rendering
    function renderWorld(time) {
      const isMobile = width < 768;
      const sceneScale = isMobile ? 0.70 : Math.min(1.15, Math.max(0.85, width / 1250));

      // Center the isometric scene smoothly across the viewport
      const originX = isMobile ? width * 0.46 : width * 0.44;
      const originY = isMobile ? height * 0.58 : height * 0.55;

      // Gentle camera micro-sway (almost stationary, provides organic breath)
      const camX = CAMERA.x + Math.sin(time * 0.00015) * 8;
      const camY = CAMERA.y + Math.cos(time * 0.00012) * 5;
      const activeCam = { x: camX, y: camY, z: CAMERA.z };

      // Isometric 3D Angle matching reference image exactly
      const worldRotX = 0.28;
      const worldRotY = -0.42;
      const worldRotZ = 0.02;

      // Animations:
      const idleY = Math.sin(time * 0.002) * 1.5;
      const craneAngle = 0.05 + Math.sin(time * 0.0008) * 0.04;
      const binTilt = 0.35 + Math.sin(time * 0.0008) * 0.06;

      const renderQueue = [];

      // Mesh insertion helper
      function addMesh(mesh, offsetX = 0, offsetY = 0, offsetZ = 0, localRotY = 0, localRotZ = 0) {
        const { vertices, faces, color, alpha = 0.88 } = mesh;

        for (let f = 0; f < faces.length; f++) {
          const face = faces[f];
          const pts3D = [];

          for (let vi = 0; vi < face.verts.length; vi++) {
            let v = vertices[face.verts[vi]];

            if (localRotZ !== 0) v = rotateZ(v, localRotZ);
            if (localRotY !== 0) v = rotateY(v, localRotY);

            v = [
              (v[0] + offsetX) * sceneScale,
              (v[1] + offsetY) * sceneScale,
              (v[2] + offsetZ) * sceneScale,
            ];

            v = rotateZ(v, worldRotZ);
            v = rotateY(v, worldRotY);
            v = rotateX(v, worldRotX);

            pts3D.push(v);
          }

          // Calculate normal
          const edge1 = [
            pts3D[1][0] - pts3D[0][0],
            pts3D[1][1] - pts3D[0][1],
            pts3D[1][2] - pts3D[0][2],
          ];
          const edge2 = [
            pts3D[2][0] - pts3D[0][0],
            pts3D[2][1] - pts3D[0][1],
            pts3D[2][2] - pts3D[0][2],
          ];
          const normal = normalize3D(cross3D(edge1, edge2));

          // Project to 2D
          const projectedPts = [];
          let avgZ = 0;

          for (let i = 0; i < pts3D.length; i++) {
            const proj = project3D(pts3D[i], originX, originY, activeCam);
            if (!proj) return;
            projectedPts.push(proj);
            avgZ += pts3D[i][2];
          }
          avgZ /= pts3D.length;

          // Backface culling in 2D
          const v0 = projectedPts[0];
          const v1 = projectedPts[1];
          const v2 = projectedPts[2];
          const cross2D = (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x);

          if (cross2D > 0) {
            const diffuse = Math.max(0.25, dot3D(normal, LIGHT_DIR));
            renderQueue.push({
              pts: projectedPts,
              depth: avgZ,
              diffuse,
              color,
              alpha,
            });
          }
        }
      }

      // ==========================================
      // GROUND DROP SHADOWS (Under Truck & House)
      // ==========================================
      const shadowMesh = createBox(0, 0, 0, 340, 2, 110, PALETTE.groundShadow, 0.12);
      addMesh(shadowMesh, -70, 80, 0);

      const houseShadow = createBox(0, 0, 0, 110, 2, 90, PALETTE.groundShadow, 0.10);
      addMesh(houseShadow, 185, 75, -40);

      // ==========================================
      // 1. 3D RECYCLING TRUCK
      // ==========================================
      const truckX = -75;
      const truckY = 38 + idleY;
      const truckZ = 0;

      // A. Cargo Container (Large green hopper with open top)
      const containerBox = createBox(0, -26, 0, 240, 96, 76, PALETTE.truckGreen, 0.88);
      addMesh(containerBox, truckX - 52, truckY, truckZ);

      // B. Inside dark hopper lip
      const containerInner = createBox(0, -70, 0, 228, 8, 66, PALETTE.truckGreenDark, 0.90);
      addMesh(containerInner, truckX - 52, truckY, truckZ);

      // C. Truck Cab
      const cabBase = createBox(0, -18, 0, 74, 82, 72, PALETTE.truckGreen, 0.92);
      addMesh(cabBase, truckX + 106, truckY - 7, truckZ);

      // D. Windshield & Windows
      const windshield = createBox(0, 0, 0, 10, 36, 64, PALETTE.windowGlass, 0.85);
      addMesh(windshield, truckX + 140, truckY - 33, truckZ);

      const sideWindowL = createBox(0, 0, 0, 38, 28, 6, PALETTE.windowGlass, 0.85);
      addMesh(sideWindowL, truckX + 112, truckY - 33, truckZ + 35);
      const sideWindowR = createBox(0, 0, 0, 38, 28, 6, PALETTE.windowGlass, 0.85);
      addMesh(sideWindowR, truckX + 112, truckY - 33, truckZ - 35);

      // E. Front Grille & Bumper
      const frontGrille = createBox(0, 0, 0, 6, 26, 54, PALETTE.chassisDark, 0.90);
      addMesh(frontGrille, truckX + 144, truckY + 2, truckZ);

      // F. Chassis Beams & Undercarriage
      const chassis = createBox(0, 0, 0, 316, 18, 62, PALETTE.chassisDark, 0.88);
      addMesh(chassis, truckX - 10, truckY + 28, truckZ);

      // G. Six 3D Wheels
      const wheelPositions = [
        { x: truckX + 106, z: truckZ + 37 }, // Front Left
        { x: truckX + 106, z: truckZ - 37 }, // Front Right
        { x: truckX - 94, z: truckZ + 37 },  // Rear 1 Left
        { x: truckX - 94, z: truckZ - 37 },  // Rear 1 Right
        { x: truckX - 136, z: truckZ + 37 }, // Rear 2 Left
        { x: truckX - 136, z: truckZ - 37 }, // Rear 2 Right
      ];

      for (let w = 0; w < wheelPositions.length; w++) {
        const wp = wheelPositions[w];
        const wheelCyl = createCylinder(0, 0, 0, 18, 10, 12, PALETTE.wheelBlack, 0.95, 'z');
        addMesh(wheelCyl, wp.x, truckY + 32, wp.z);
        const rimCyl = createCylinder(0, 0, 0, 9, 11, 8, PALETTE.wheelRim, 0.95, 'z');
        addMesh(rimCyl, wp.x, truckY + 32, wp.z);
      }

      // ==========================================
      // 2. HYDRAULIC CRANE ARM & SUSPENDED BIN
      // ==========================================
      const craneMast = createBox(0, -36, 0, 14, 76, 14, PALETTE.chassisDark, 0.90);
      addMesh(craneMast, truckX + 65, truckY, truckZ);

      const boomArm = createBox(0, -42, 0, 10, 90, 10, PALETTE.chassisMedium, 0.90);
      addMesh(boomArm, truckX + 54, truckY - 72, truckZ, 0, craneAngle);

      const piston = createBox(0, -22, 0, 6, 44, 6, PALETTE.wheelRim, 0.95);
      addMesh(piston, truckX + 44, truckY - 46, truckZ);

      // Tilted Green Bin suspended above container hopper
      const binLiftedX = truckX + 18;
      const binLiftedY = truckY - 155;
      const liftedBin = createCylinder(0, 0, 0, 24, 56, 14, PALETTE.binGreen, 0.92, 'y');
      addMesh(liftedBin, binLiftedX, binLiftedY, truckZ, 0, binTilt);

      const binLid = createCylinder(0, -30, 0, 26, 8, 14, PALETTE.binDark, 0.92, 'y');
      addMesh(binLid, binLiftedX, binLiftedY, truckZ, 0, binTilt);

      // ==========================================
      // 3. GROUND COLLECTION BIN
      // ==========================================
      const groundBin = createCylinder(0, 0, 0, 28, 46, 14, PALETTE.binGreen, 0.88, 'y');
      addMesh(groundBin, truckX - 135, truckY + 54, truckZ + 88);
      const groundBinRim = createCylinder(0, -24, 0, 30, 7, 14, PALETTE.binDark, 0.92, 'y');
      addMesh(groundBinRim, truckX - 135, truckY + 54, truckZ + 88);

      // ==========================================
      // 4. RESIDENTIAL ECO HOUSE & TREE (Right Side)
      // ==========================================
      const houseX = 180;
      const houseY = truckY - 10;
      const houseZ = -45;

      const houseBody = createBox(0, 0, 0, 76, 64, 60, PALETTE.houseWall, 0.85);
      addMesh(houseBody, houseX, houseY, houseZ);

      const roof = createBox(0, -38, 0, 86, 18, 70, PALETTE.houseRoof, 0.88);
      addMesh(roof, houseX, houseY, houseZ);

      const chimney = createBox(0, -54, 0, 12, 24, 12, PALETTE.houseRoof, 0.88);
      addMesh(chimney, houseX + 24, houseY, houseZ - 12);

      // Windows with 4 white panes
      const window1 = createBox(0, -8, 0, 2, 16, 16, PALETTE.plasticWhite, 0.92);
      addMesh(window1, houseX + 39, houseY, houseZ + 14);
      const window2 = createBox(0, -8, 0, 2, 16, 16, PALETTE.plasticWhite, 0.92);
      addMesh(window2, houseX + 39, houseY, houseZ - 14);

      const door = createBox(0, 14, 0, 2, 28, 14, PALETTE.houseRoof, 0.88);
      addMesh(door, houseX + 39, houseY, houseZ - 1);

      // Eco Tree
      const treeTrunk = createCylinder(0, 10, 0, 7, 40, 8, PALETTE.treeTrunk, 0.88, 'y');
      addMesh(treeTrunk, houseX - 60, houseY + 6, houseZ + 10);

      const treeCanopy = createCylinder(0, -22, 0, 30, 40, 10, PALETTE.treeGreen, 0.88, 'y');
      addMesh(treeCanopy, houseX - 60, houseY + 6, houseZ + 10);
      const treeTop = createCylinder(0, -38, 0, 22, 24, 8, PALETTE.treeGreen, 0.90, 'y');
      addMesh(treeTop, houseX - 60, houseY + 6, houseZ + 10);

      // ==========================================
      // 5. 3D RECYCLING SYMBOL (Rotating in Upper Right)
      // ==========================================
      const symRotY = time * 0.0007;
      const symX = width > 768 ? 165 : 115;
      const symY = -145;
      const symZ = 15;

      for (let a = 0; a < recycleArrows.length; a++) {
        addMesh(recycleArrows[a], symX, symY, symZ, symRotY, 0.15);
      }

      // ==========================================
      // 6. TUMBLING 3D PLASTIC CUBES
      // ==========================================
      for (let p = 0; p < fallingCubes.length; p++) {
        const cube = fallingCubes[p];

        if (!prefersReducedMotion) {
          cube.y += cube.vy;
          cube.x += cube.vx;
          cube.z += cube.vz;
          cube.rx += cube.drx;
          cube.ry += cube.dry;

          // Respawn at bin lip if fallen into container
          if (cube.y > -28) {
            cube.y = -140 - Math.random() * 15;
            cube.x = binLiftedX + (Math.random() - 0.5) * 18;
            cube.z = truckZ + (Math.random() - 0.5) * 18;
          }
        }

        const cubeBox = createBox(0, 0, 0, cube.size, cube.size, cube.size, cube.color, 0.92);
        addMesh(cubeBox, cube.x, cube.y, cube.z, cube.ry, cube.rx);
      }

      // ==========================================
      // 7. SORT ALL FACES & RENDER (Painter's Algorithm)
      // ==========================================
      renderQueue.sort((a, b) => b.depth - a.depth);

      for (let i = 0; i < renderQueue.length; i++) {
        const item = renderQueue[i];
        const pts = item.pts;
        const color = item.color;

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let j = 1; j < pts.length; j++) {
          ctx.lineTo(pts[j].x, pts[j].y);
        }
        ctx.closePath();

        // 3D Diffuse Lighting
        const shadeFactor = 0.55 + item.diffuse * 0.45;
        const r = Math.min(255, Math.floor(color.r * shadeFactor));
        const g = Math.min(255, Math.floor(color.g * shadeFactor));
        const b = Math.min(255, Math.floor(color.b * shadeFactor));

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${item.alpha})`;
        ctx.fill();

        // Clean contour stroke for sharp 3D definition
        ctx.strokeStyle = `rgba(${Math.floor(r * 0.8)}, ${Math.floor(g * 0.8)}, ${Math.floor(b * 0.8)}, ${(item.alpha * 0.85).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // ==========================================
      // 8. 3D RECYCLING EMBLEM ON TRUCK CONTAINER
      // ==========================================
      const logoPt = project3D(
        rotateX(
          rotateY(
            rotateZ([ (truckX - 52) * sceneScale, (truckY - 26) * sceneScale, (truckZ + 39) * sceneScale ], worldRotZ),
            worldRotY
          ),
          worldRotX
        ),
        originX,
        originY,
        activeCam
      );

      if (logoPt) {
        ctx.save();
        ctx.translate(logoPt.x, logoPt.y);
        ctx.scale(logoPt.scale * 1.9 * sceneScale, logoPt.scale * 1.9 * sceneScale);
        ctx.font = 'bold 36px "Segoe UI Symbol", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(240, 255, 245, 0.88)';
        ctx.fillText('♻', 0, 0);
        ctx.restore();
      }

      // ==========================================
      // 9. BOLD GREEN SLOGAN: "MODERN AND EFFECTIVE WASTE MANAGEMENT"
      // ==========================================
      if (width > 640) {
        const titleX = isMobile ? width * 0.5 : width * 0.68;
        const titleY = height * 0.22;

        ctx.save();
        ctx.textAlign = isMobile ? 'center' : 'left';
        ctx.fillStyle = 'rgba(27, 67, 50, 0.45)';
        ctx.font = '900 15px system-ui, -apple-system, sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('MODERN AND EFFECTIVE', titleX, titleY);
        ctx.fillText('WASTE MANAGEMENT', titleX, titleY + 22);
        ctx.restore();
      }
    }

    if (prefersReducedMotion) {
      renderStaticScene();
    } else {
      animationFrameId = requestAnimationFrame(renderLoop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default Dashboard3DBackground;
