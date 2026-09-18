import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ACCENT = '#d39b4a'
const TERRAIN = '#171a19'
const GRID = '#7c817b'

function terrainHeight(x: number, z: number) {
  const ridgeA = 2.05 * Math.exp(-0.12 * Math.pow(z + 1.8 - Math.sin(x * 0.38) * 1.7, 2))
  const ridgeB = 1.45 * Math.exp(-0.18 * Math.pow(z - 2.2 + Math.cos(x * 0.52) * 1.35, 2))
  const ridgeC = 0.95 * Math.exp(-0.24 * Math.pow(x + 3.8 - Math.sin(z * 0.56) * 1.15, 2))
  const broadMass = 0.72 * Math.exp(-0.035 * ((x + 1.5) ** 2 + (z + 0.8) ** 2))
  const folds = 0.24 * Math.sin(x * 0.78 + z * 0.24) + 0.18 * Math.cos(z * 0.92 - x * 0.18)
  const valley = 0.72 * Math.exp(-0.17 * Math.pow(z + 0.15 + Math.sin(x * 0.28) * 0.6, 2))
  return ridgeA + ridgeB + ridgeC + broadMass + folds - valley - 0.68
}

function useTerrainGeometry() {
  return useMemo(() => {
    const geometry = new THREE.PlaneGeometry(18, 14, 96, 72)
    geometry.rotateX(-Math.PI / 2)
    const positions = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i)
      const z = positions.getZ(i)
      positions.setY(i, terrainHeight(x, z))
    }
    positions.needsUpdate = true
    geometry.computeVertexNormals()
    return geometry
  }, [])
}

function useTerrainGridGeometry() {
  return useMemo(() => {
    const points: number[] = []
    const addStrip = (axis: 'x' | 'z', fixed: number) => {
      const steps = 76
      for (let i = 0; i < steps; i += 1) {
        const a = -1 + (i / steps) * 2
        const b = -1 + ((i + 1) / steps) * 2
        const x1 = axis === 'x' ? a * 9 : fixed
        const z1 = axis === 'x' ? fixed : a * 7
        const x2 = axis === 'x' ? b * 9 : fixed
        const z2 = axis === 'x' ? fixed : b * 7
        points.push(x1, terrainHeight(x1, z1) + 0.035, z1, x2, terrainHeight(x2, z2) + 0.035, z2)
      }
    }
    for (let z = -6; z <= 6; z += 1.2) addStrip('x', z)
    for (let x = -8; x <= 8; x += 1.6) addStrip('z', x)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return geometry
  }, [])
}

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const start = useMemo(() => new THREE.Vector3(7.65, 6.2, 10.2), [])
  const end = useMemo(() => new THREE.Vector3(6.4, 5.1, 8.7), [])
  const focusStart = useMemo(() => new THREE.Vector3(-0.7, 0.25, -0.6), [])
  const focusEnd = useMemo(() => new THREE.Vector3(0.15, 0.18, -1.55), [])
  const focus = useRef(new THREE.Vector3())

  useFrame(({ camera, clock, pointer }) => {
    if (reducedMotion) {
      camera.position.copy(end)
      camera.lookAt(focusEnd)
      return
    }

    const t = Math.min(clock.elapsedTime / 2.6, 1)
    const eased = 1 - Math.pow(1 - t, 3)
    camera.position.lerpVectors(start, end, eased)
    focus.current.lerpVectors(focusStart, focusEnd, eased)

    const drift = Math.sin(clock.elapsedTime * 0.12) * 0.07
    camera.position.x += pointer.x * 0.12 + drift
    camera.position.y += pointer.y * 0.07
    focus.current.x += pointer.x * 0.08
    focus.current.y += pointer.y * 0.035
    camera.lookAt(focus.current)
  })

  return null
}

function Beacon({ onHover }: { onHover: (hovered: boolean) => void }) {
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const x = 1.15
  const z = -0.55
  const y = terrainHeight(x, z) + 0.11

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const animateRing = (mesh: THREE.Mesh | null, phase: number) => {
      if (!mesh) return
      const cycle = (t * 0.45 + phase) % 1
      const scale = 0.55 + cycle * 1.8
      mesh.scale.setScalar(scale)
      const material = mesh.material as THREE.MeshBasicMaterial
      material.opacity = Math.max(0, 0.42 * (1 - cycle))
    }
    animateRing(ringA.current, 0)
    animateRing(ringB.current, 0.48)
  })

  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.42, 8]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.72} />
      </mesh>
      <mesh
        position={[0, 1.46, 0]}
        onPointerEnter={(event) => { event.stopPropagation(); onHover(true) }}
        onPointerLeave={() => onHover(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={ACCENT} />
      </mesh>
      <mesh ref={ringA} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[0.21, 0.225, 48]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={ringB} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.027, 0]}>
        <ringGeometry args={[0.21, 0.225, 48]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

function ShelterInstallation() {
  const x = 1.65
  const z = -0.1
  const y = terrainHeight(x, z) + 0.13
  const solarPositions = new Float32Array([
    x + 1.15, y + 1.0, z + 1.55,
    x + 0.15, y + 0.25, z + 0.15,
  ])

  return (
    <group>
      <group position={[x, y, z]} rotation={[0, -0.2, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.62, 0.36, 0.44]} />
          <meshStandardMaterial color="#252927" roughness={0.9} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.43, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.45, 0.08, 0.45]} />
          <meshStandardMaterial color="#343934" roughness={0.82} metalness={0.12} />
        </mesh>
        <mesh position={[0.18, 0.23, 0.225]}>
          <planeGeometry args={[0.17, 0.12]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.72} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.24, 0.42, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.5, 6]} />
          <meshBasicMaterial color="#676c67" />
        </mesh>
      </group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[solarPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={ACCENT} transparent opacity={0.35} />
      </lineSegments>
    </group>
  )
}

function TerrainWorld({ reducedMotion, onBeaconHover }: { reducedMotion: boolean; onBeaconHover: (hovered: boolean) => void }) {
  const terrainGeometry = useTerrainGeometry()
  const gridGeometry = useTerrainGridGeometry()

  return (
    <>
      <fog attach="fog" args={['#090a0b', 8, 23]} />
      <ambientLight intensity={0.72} color="#d9d7d0" />
      <directionalLight position={[4, 8, 5]} intensity={1.2} color="#d7b879" />
      <directionalLight position={[-7, 3, -5]} intensity={0.45} color="#777d78" />
      <mesh geometry={terrainGeometry} receiveShadow>
        <meshStandardMaterial color={TERRAIN} roughness={0.96} metalness={0.04} />
      </mesh>
      <mesh geometry={terrainGeometry} scale={[1.001, 1.001, 1.001]}>
        <meshBasicMaterial color="#777c77" wireframe transparent opacity={0.075} depthWrite={false} />
      </mesh>
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial color={GRID} transparent opacity={0.12} depthWrite={false} />
      </lineSegments>
      <gridHelper args={[24, 24, '#343835', '#202321']} position={[0, -0.62, 0]} />
      <Beacon onHover={onBeaconHover} />
      <ShelterInstallation />
      <CameraRig reducedMotion={reducedMotion} />
    </>
  )
}

export function TerrainScene({ reducedMotion, onBeaconHover, onReady }: { reducedMotion: boolean; onBeaconHover: (hovered: boolean) => void; onReady: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [7.65, 6.2, 10.2], fov: 43, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x090a0b, 0)
        onReady()
      }}
    >
      <TerrainWorld reducedMotion={reducedMotion} onBeaconHover={onBeaconHover} />
    </Canvas>
  )
}
