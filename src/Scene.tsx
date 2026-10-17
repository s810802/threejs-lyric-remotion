import {useMemo} from "react";
import {Canvas} from "@react-three/fiber";
import {ThreeCanvas} from "@remotion/three";
import * as THREE from "three";

const seeded = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Dust = ({frame, reduced}: {frame: number; reduced: boolean}) => {
  const {positions, colors} = useMemo(() => {
    const count = 900;
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (seeded(i + 1) - 0.5) * 19;
      p[i * 3 + 1] = (seeded(i + 17) - 0.5) * 10.5;
      p[i * 3 + 2] = -1 - seeded(i + 71) * 8;
      const warm = seeded(i + 101);
      c[i * 3] = 1;
      c[i * 3 + 1] = 0.48 + warm * 0.36;
      c[i * 3 + 2] = 0.12 + warm * 0.2;
    }
    return {positions: p, colors: c};
  }, []);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);
  return (
    <points geometry={geometry} rotation={[0, 0, reduced ? 0 : Math.sin(frame / 240) * 0.035]}>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.82} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};

const Fog = ({frame, reduced}: {frame: number; reduced: boolean}) => (
  <mesh position={[0, 0, -10]}>
    <planeGeometry args={[42, 24]} />
    <shaderMaterial
      transparent
      depthWrite={false}
      uniforms={{uTime: {value: reduced ? 0 : frame / 30}}}
      vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
      fragmentShader={`
        varying vec2 vUv; uniform float uTime;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
        void main(){vec2 uv=vUv; float n=noise(uv*4.2+vec2(uTime*.012,-uTime*.007)); float haze=smoothstep(.28,.92,n)*.25; float glow=exp(-length((uv-vec2(.5,.48))*vec2(1.1,1.5))*3.5)*.16; vec3 gold=vec3(.72,.39,.12); float alpha=clamp(haze+glow,0.0,.34); gl_FragColor=vec4(gold,alpha);}`}
    />
  </mesh>
);

export const Scene3D = ({frame, reduced = false}: {frame: number; reduced?: boolean}) => (
  <>
    <ambientLight intensity={0.7} color="#ffd58a" />
    <Fog frame={frame} reduced={reduced} />
    <Dust frame={frame} reduced={reduced} />
    <group position={[0, 0, -2]}>
      {Array.from({length: 9}, (_, i) => (
        <mesh key={i} position={[Math.sin(i * 7.3) * 8.3, Math.cos(i * 2.9) * 4.5, -i * 0.35]}>
          <sphereGeometry args={[0.018 + (i % 3) * 0.009, 8, 8]} />
          <meshBasicMaterial color="#ffc15a" transparent opacity={0.28 + 0.2 * Math.sin((reduced ? 0 : frame) / 20 + i)} />
        </mesh>
      ))}
    </group>
  </>
);

export const BrowserScene = ({frame, reduced}: {frame: number; reduced: boolean}) => (
  <Canvas camera={{position: [0, 0, 10], fov: 52}} dpr={[1, 2]} gl={{antialias: true, alpha: true}}>
    <Scene3D frame={frame} reduced={reduced} />
  </Canvas>
);

export const RenderScene = ({frame, width = 1920, height = 1080}: {frame: number; width?: number; height?: number}) => (
  <ThreeCanvas width={width} height={height} camera={{position: [0, 0, 10], fov: 52}} dpr={1} gl={{antialias: true, alpha: true}}>
    <Scene3D frame={frame} />
  </ThreeCanvas>
);
