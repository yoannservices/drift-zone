/** Voiture : Ferrari 458 Italia 2015 (Sketchfab, Tyler_Dave, CC-BY 4.0, voir assets/models/CREDITS.md), chargée par assets/glb.js. Avant = +x local. */
class CarMesh {
  constructor(car) {
    const { length: L } = car.cfg;
    this.group = new THREE.Group();
    this.body = new THREE.Group(); // pivote autour de l'axe avant pour pencher en virage
    this.group.add(this.body);
    import(new URL('../../assets/glb.js', location.href).href).then(async (m) => {
      const g = m.fitGLB(await m.loadGLB(new URL('../../assets/models/ferrari-458.glb', location.href).href), L, Math.PI / 2); // avant du modèle (+Z) tourné vers +x
      g.traverse((o) => { if (o.isMesh && o.material.name === 'Material.001') o.material.color.set(VIEW.colors.red); }); // Material.001 : carrosserie
      g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      this.body.add(g);
    }).catch((e) => console.warn('Ferrari non chargée', e));
  }

  update(car) {
    this.group.position.set(car.x, 0, car.y);
    this.group.rotation.y = -car.angle;
    this.body.rotation.x = THREE.MathUtils.clamp(car.lateralSpeed * 0.0003, -0.12, 0.12);
  }
}
