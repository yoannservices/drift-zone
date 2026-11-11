
/** Caméra de poursuite en perspective : retard, anticipation, hauteur selon la vitesse, secousses. */
class CameraRig {
  constructor(camera, cfg = VIEW.camera) {
    this.camera = camera;
    this.cfg = cfg;
    this.shakeT = 0;
    this.shakeI = 0;
    this.mode = 0; // C : 0 dessus, 1 poursuite, 2 capot (≈ 10 px par mètre)
    addEventListener('keydown', (e) => { if (e.code === 'KeyC' && !e.repeat) this.mode = (this.mode + 1) % 3; });
  }

  snap(car) {
    this.px = car.x;
    this.py = car.y;
    this.h = this.cfg.heightMin;
    this.ang = car.angle;
    this.apply();
  }

  update(car, dt) {
    const c = this.cfg;
    const k = 1 - Math.exp(-c.follow * dt);
    this.px += (car.x + car.vx * c.lookAhead - this.px) * k;
    this.py += (car.y + car.vy * c.lookAhead - this.py) * k;
    const target = c.heightMin + (c.heightMax - c.heightMin) * Math.min(car.speed / c.zoomSpeed, 1);
    this.h += (target - this.h) * (1 - Math.exp(-c.zoomLerp * dt));
    this.shakeT = Math.max(0, this.shakeT - dt);
    // poursuite : l'angle suit la direction de la voiture avec du retard (garde le drift lisible)
    let da = car.angle - this.ang; da = Math.atan2(Math.sin(da), Math.cos(da));
    this.ang += da * (1 - Math.exp(-4 * dt));
    if (this.mode) return this.applyNear(car);
    this.apply();
  }

  apply() {
    const c = this.cfg;
    const s = this.shakeT > 0 ? (this.shakeT / c.shakeDuration) * this.shakeI * c.shakeIntensity : 0;
    const ox = (Math.random() - 0.5) * s, oy = (Math.random() - 0.5) * s;
    this.setNear(10);
    this.camera.position.set(this.px + ox, this.h + oy, this.py + this.h * this.cfg.back);
    this.camera.lookAt(this.px + ox, 0, this.py);
  }

  applyNear(car) {
    const cam = this.camera, hood = this.mode === 2, a = hood ? car.angle : this.ang;
    const fx = Math.cos(a), fz = Math.sin(a), back = hood ? -6 : 150, h = hood ? 13 : 62;
    cam.position.set(car.x - fx * back, h, car.y - fz * back);
    cam.lookAt(car.x + fx * 120, hood ? 9 : 14, car.y + fz * 120);
    this.setNear(hood ? 1 : 10);
  }

  // plan proche réduit seulement en vue capot (sinon les marques au sol scintillent)
  setNear(n) { if (this.camera.near !== n) { this.camera.near = n; this.camera.updateProjectionMatrix(); } }

  /** intensity 0..1+ ; sur impact. */
  shake(intensity = 1) {
    this.shakeT = this.cfg.shakeDuration;
    this.shakeI = intensity;
  }
}
